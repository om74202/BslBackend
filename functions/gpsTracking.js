// services/devicePoller.js
const axios = require("axios");
const prisma = require("../lib/prismaClient.js");
const pLimit = require("p-limit");


/**
 * =========================
 * CONFIG + LOGGING CONTROLS
 * =========================
 */
const LOG = {
  enabled: true,
  level: process.env.TRUCK_POLLER_LOG_LEVEL || "info", // "debug" | "info" | "warn" | "error"
  // log per-truck lines only when something changes (zone/status/trip/db write)
  logOnlyOnChange: true,
  // once every N polls print a compact summary
  summaryEveryPolls: Number(process.env.TRUCK_POLLER_SUMMARY_EVERY || 1),
};

function nowISO() {
  return new Date().toISOString();
}

function logAt(level, ...args) {
  if (!LOG.enabled) return;
  const order = { debug: 10, info: 20, warn: 30, error: 40 };
  const cur = order[LOG.level] ?? 20;
  if ((order[level] ?? 20) < cur) return;

  const prefix = `[TRUCK-POLLER ${nowISO()}]`;
  if (level === "error") console.error(prefix, ...args);
  else if (level === "warn") console.warn(prefix, ...args);
  else console.log(prefix, ...args);
}

/**
 * =========================
 * GEOFENCE
 * =========================
 */
const DEFAULT_GEOFENCE = {
  BSL: {
    name: "BSL",
        lat: 28.825677,
    lng: 76.919588,
    radiusM: 160,
  },
  MSIL: {
    name: "MSIL",
    lat: 28.82961333333333,
    lng: 76.92552888888889,
    radiusM: 70,
  },
  // stability: how many consecutive polls in a zone before confirming change
  stableHits: 2,
};

/**
 * Axios client (provider)
 */
const gpsHttp = axios.create({
  baseURL: "https://live1.tpgpstrack.com/api/liveLocation",
  timeout: 8000,
});

/* ------------------ small utils ------------------ */
function toRad(deg) {
  return (deg * Math.PI) / 180;
}

function haversineMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

function safeISO(x) {
  const d = x ? new Date(x) : null;
  return d && !isNaN(d) ? d.toISOString() : null;
}

/**
 * Detect candidate zone (raw)
 */
function detectZone(lat, lng, G) {
  if (lat == null || lng == null) return "UNKNOWN";
  
  const dBsl = haversineMeters(lat, lng, G.BSL.lat, G.BSL.lng);
  if (dBsl <= G.BSL.radiusM) return "BSL";

  const dMsil = haversineMeters(lat, lng, G.MSIL.lat, G.MSIL.lng);
  if (dMsil <= G.MSIL.radiusM) return "MSIL";

  return "OUTSIDE";
}

/**
 * Stability confirmation to avoid flapping:
 * - keep: zone (confirmed), zoneCandidate, zoneCandidateHits
 * - confirm change only when candidateHits >= stableHits
 */
function applyZoneStability(prevData, candidateZone, stableHits) {
  const confirmed = prevData?.zone ?? "UNKNOWN";
  const prevCandidate = prevData?.zoneCandidate ?? null;
  const prevHits = prevData?.zoneCandidateHits ?? 0;



  // candidate == confirmed => reset candidate state
  if (candidateZone === confirmed) {
    return {
      zone: confirmed,
      zoneCandidate: null,
      zoneCandidateHits: 0,
      zoneChanged: false,
    };
  }

  // same candidate => increment hits
  if (candidateZone === prevCandidate) {
    const hits = prevHits + 1;
    if (hits >= stableHits) {
      return {
        zone: candidateZone,
        zoneCandidate: null,
        zoneCandidateHits: 0,
        zoneChanged: true,
      };
    }
    return {
      zone: confirmed,
      zoneCandidate: candidateZone,
      zoneCandidateHits: hits,
      zoneChanged: false,
    };
  }

  // new candidate
  return {
    zone: confirmed,
    zoneCandidate: candidateZone,
    zoneCandidateHits: 1,
    zoneChanged: false,
  };
}

function normalizeProviderDevice(device) {
  if (!device) return null;

  const fixTime =
    device.fixTime || device.deviceTime || device.timestamp || device.serverTime || null;

  return {
    deviceName: device.name ?? null,
    lat: device.latitude != null ? Number(device.latitude) : null,
    lng: device.longitude != null ? Number(device.longitude) : null,
    speed: device.speed ?? 0,
    // address: device.address ?? null,
    valid: !!device.valid,
    currentStatus: device.attributes?.currentStatus ?? null,
    charge:device?.attributes?.charge,
    fixTimeISO: fixTime ? new Date(fixTime).toISOString() : null,
  };
}

async function fetchDeviceByToken(accessToken) {
  // DO NOT log token.
  const res = await gpsHttp.get("/getDevicesInfo", { params: { accessToken } });
  const data = res?.data;
  if (!data?.successful) return null;

  const arr = Array.isArray(data.object) ? data.object : [];
  return arr.length ? arr[0] : null;
}

/**
 * Status derived from zone + previous status (simple + consistent)
 */
function decideTruckStatus(zone, prevStatus) {
  if (zone === "BSL") return "atBSL";
  if (zone === "MSIL") return "atMSIL";

  // OUTSIDE
  if (prevStatus === "atBSL") return "toMSIL";
  if (prevStatus === "atMSIL") return "toBSL";
  if (prevStatus === "toMSIL" || prevStatus === "toBSL") return prevStatus;

  return "Stopped";
}

/**
 * Trip state machine based on zone transitions:
 * - BSL -> OUTSIDE : departBsl (create trip if needed)
 * - OUTSIDE -> MSIL : reachedMsil (on active trip)
 * - MSIL -> OUTSIDE : departMsil (on active trip)
 * - OUTSIDE -> BSL : reachedBsl (complete trip)
 */
function decideTripMutation({ prevZone, newZone, activeTrip, eventTimeISO }) {
  const t = new Date(eventTimeISO);

  if (!prevZone || prevZone === "UNKNOWN") return { op: "NONE" };

  // leaving BSL -> start outbound
  if (prevZone === "BSL" && newZone !== "BSL") {
    if (!activeTrip) return { op: "CREATE", data: { departBsl: t } };
    if (!activeTrip.departBsl) return { op: "UPDATE", id: activeTrip.id, data: { departBsl: t } };
    return { op: "NONE" };
  }

  // arriving MSIL
  if (prevZone !== "MSIL" && newZone === "MSIL") {
    if (activeTrip && !activeTrip.reachedMsil)
      return { op: "UPDATE", id: activeTrip.id, data: { reachedMsil: t } };
    return { op: "NONE" };
  }

  // leaving MSIL -> return trip leg
  if (prevZone === "MSIL" && newZone !== "MSIL") {
    if (activeTrip && !activeTrip.departMsil)
      return { op: "UPDATE", id: activeTrip.id, data: { departMsil: t } };
    return { op: "NONE" };
  }

  // arriving BSL -> complete trip only if return leg started
  if (prevZone !== "BSL" && newZone === "BSL") {
    if (activeTrip && activeTrip.departMsil && !activeTrip.reachedBsl) {
      return { op: "UPDATE", id: activeTrip.id, data: { reachedBsl: t } };
    }
    return { op: "NONE" };
  }

  return { op: "NONE" };
}

/* ------------------ main poller ------------------ */

async function loadTrucksWithTokens() {
  const trucks = await prisma.truck.findMany({
    select: { id: true, name: true, alias: true, status: true, data: true },
  });

  const withTokens = trucks
    .filter((t) => !!t.data?.deviceAccessToken)
    .map((t) => ({
      ...t,
      token: String(t.data.deviceAccessToken),
    }));

  return withTokens;
}

async function loadActiveTripsByTruck(truckIds) {
  if (!truckIds.length) return new Map();

  const activeTrips = await prisma.trip.findMany({
    where: {
      truckId: { in: truckIds },
      reachedBsl: null, // not completed
    },
    select: {
      id: true,
      truckId: true,
      departBsl: true,
      reachedMsil: true,
      departMsil: true,
      reachedBsl: true,
    },
    // you don't have createdAt in your current schema; so orderBy departBsl
    orderBy: [{ departBsl: "desc" }],
  });

  const map = new Map();
  for (const trip of activeTrips) {
    if (!map.has(trip.truckId)) map.set(trip.truckId, trip);
  }
  return map;
}

/**
 * createDevicePoller({ pollIntervalMs, concurrency, geofence, refreshTrucksEveryPolls })
 */
async function createDevicePoller({
  pollIntervalMs = Number(process.env.TRUCK_POLL_INTERVAL_MS || 30_000),
  concurrency = Number(process.env.TRUCK_POLL_CONCURRENCY || 5),
  refreshTrucksEveryPolls = Number(process.env.TRUCK_REFRESH_TRUCKS_EVERY || 10),
  geofence = {},
} = {}) {
  const G = {
    ...DEFAULT_GEOFENCE,
    ...geofence,
    BSL: { ...DEFAULT_GEOFENCE.BSL, ...(geofence.BSL || {}) },
    MSIL: { ...DEFAULT_GEOFENCE.MSIL, ...(geofence.MSIL || {}) },
  };

  logAt("info", "Device poller created with config:", {
    pollIntervalMs,
    concurrency,
    refreshTrucksEveryPolls,
    geofence: {
      BSL: { ...G.BSL, /* keep coords visible */ },
      MSIL: { ...G.MSIL },
      stableHits: G.stableHits,
    },
  });

  const limit = pLimit(concurrency);

  // in-memory cache
  let trucks = await loadTrucksWithTokens();
  if (!trucks.length) throw new Error("No trucks with deviceAccessToken found in truck.data");

  // state in memory (small): dedupe by lastFixTimeISO

  let running = false;
  let stopped = false;
  let timer = null;
  let polls = 0;

  async function pollOnce() {
    polls += 1;
    const startedAt = Date.now();


    // refresh trucks periodically (so new trucks/tokens work without restart)
    if (polls === 1 || polls % refreshTrucksEveryPolls === 0) {
      const prevCount = trucks.length;
      trucks = await loadTrucksWithTokens();
      logAt("info", `Refreshed trucks list: ${prevCount} -> ${trucks.length}`);
    }

    const truckIds = trucks.map((t) => t.id);
    const activeTripByTruck = await loadActiveTripsByTruck(truckIds);

    let ok = 0;
    let skipped = 0;
    let updated = 0;
    let errors = 0;

    await Promise.allSettled(
      trucks.map((truck) =>
        limit(async () => {
          const tag = `[${truck.name || truck.id}]`;

          let raw;
          try {
            raw = await fetchDeviceByToken(truck.token);
          } catch (e) {
            errors += 1;
            logAt("warn", tag, "GPS fetch failed:", e?.message || e);
            return;
          }

          const gps = normalizeProviderDevice(raw);
          if (!gps || !gps.valid || gps.lat == null || gps.lng == null) {
            skipped += 1;
            logAt("debug", tag, "Skipped: invalid gps / coords");
            return;
          }



 // ✅ DO NOT gate on fixTime at all
const candidateZone = detectZone(gps.lat, gps.lng, G);
const stability = applyZoneStability(truck.data, candidateZone, G.stableHits);

const prevZone = truck.data?.zone ?? "UNKNOWN";
const confirmedZone = stability.zone;
const zoneChanged = stability.zoneChanged;

const prevStatus = truck.status;
const nextStatus = decideTruckStatus(confirmedZone, prevStatus);

// event time: you can still store provider time, but it won't gate logic
const eventTimeISO = safeISO(gps.fixTimeISO) || nowISO();

const activeTrip = activeTripByTruck.get(truck.id) || null;
const tripDecision = zoneChanged
  ? decideTripMutation({
      prevZone,
      newZone: confirmedZone,
      activeTrip,
      eventTimeISO,
    })
  : { op: "NONE" };

// ✅ write only if something changed (recommended)
const gpsChanged =
  truck.data?.gps?.lat !== gps.lat ||
  truck.data?.gps?.lon !== gps.lng ||
  truck.data?.gps?.speed !== gps.speed ||
  truck.data?.gps?.currentStatus !== gps.currentStatus ||
  truck.data?.gps?.ignition !== gps.ignition;

const willWrite =
  gpsChanged ||
  prevZone !== confirmedZone ||
  prevStatus !== nextStatus ||
  tripDecision.op !== "NONE";

// log changes (or everything if logOnlyOnChange=false)
const changed =
  zoneChanged ||
  prevStatus !== nextStatus ||
  tripDecision.op !== "NONE";

if (!LOG.logOnlyOnChange || changed) {
  logAt("info", tag, "Update", {
    fixTimeISO: eventTimeISO,
    lat: gps.lat,
    lng: gps.lng,
    candidateZone,
    confirmedZone,
    prevZone,
    zoneChanged,
    prevStatus,
    nextStatus,
    tripOp: tripDecision.op,
    tripId: tripDecision.id || null,
  });
}

if (!willWrite) {
  ok += 1;
  return;
}

const newData = {
  ...(truck.data || {}),
  gps: {
    deviceName: gps.deviceName,
    lat: gps.lat,
    lon: gps.lng,
    speed: gps.speed,
    address: gps.address,
    valid: gps.valid,
    currentStatus: gps.currentStatus,
    charge:gps.charge,
    ignition: gps.ignition,
    fixTimeISO: eventTimeISO,
  },
  zone: confirmedZone,
  zoneCandidate: stability.zoneCandidate,
  zoneCandidateHits: stability.zoneCandidateHits,
  lastPollAt: nowISO(),
};
          try {
            await prisma.$transaction(async (tx) => {
              await tx.truck.update({
                where: { id: truck.id },
                data: { status: nextStatus, data: newData },
              });

              if (tripDecision.op === "CREATE") {
                const created = await tx.trip.create({
                  data: { truckId: truck.id, ...tripDecision.data },
                });
                logAt("info", tag, "Trip created:", created.id, tripDecision.data);
              } else if (tripDecision.op === "UPDATE") {
                await tx.trip.update({
                  where: { id: tripDecision.id },
                  data: tripDecision.data,
                });
                logAt("info", tag, "Trip updated:", tripDecision.id, tripDecision.data);
              }
            });

            updated += 1;
            ok += 1;
            

            // update in-memory
            truck.status = nextStatus;
            truck.data = newData;
          } catch (e) {
            errors += 1;
            logAt("error", tag, "DB update failed:", e?.message || e);
          }
        })
      )
    );

    const ms = Date.now() - startedAt;

    if (LOG.summaryEveryPolls > 0 && polls % LOG.summaryEveryPolls === 0) {
      logAt("info", `Poll #${polls} completed in ${ms}ms`, {
        trucks: trucks.length,
        ok,
        updated,
        skipped,
        errors,
        concurrency,
      });
    }
  }

  async function loop() {
    if (stopped) return;
    if (running) return; // no overlap
    running = true;

    try {
      logAt("debug", "Poll loop tick...");
      await pollOnce();
    } catch (e) {
      logAt("error", "pollOnce crashed:", e?.message || e);
    } finally {
      running = false;
      timer = setTimeout(loop, pollIntervalMs);
    }
  }

  async function start() {
    if (timer) {
      logAt("warn", "Poller already started");
      return;
    }
    stopped = false;
    logAt("info", "Starting poller...");
    loop();
  }

  function stop() {
    stopped = true;
    if (timer) clearTimeout(timer);
    timer = null;
    logAt("info", "Poller stopped");
  }

  function getStateSnapshot() {
    const snapshot = {};
    for (const t of trucks) {
      snapshot[t.id] = {
        name: t.name,
        status: t.status,
        zone: t.data?.zone ?? null,
        fixTimeISO: t.data?.gps?.fixTimeISO ?? null,
        lastPollAt: t.data?.lastPollAt ?? null,
      };
    }
    return snapshot;
  }

  function getHealthStatus() {
    return {
      running: !!timer && !stopped,
      polls,
      monitoredTrucks: trucks.length,
      concurrency,
      pollIntervalMs,
      refreshTrucksEveryPolls,
      log: LOG,
    };
  }

  return { start, stop, getStateSnapshot, getHealthStatus };
}

module.exports = { createDevicePoller };


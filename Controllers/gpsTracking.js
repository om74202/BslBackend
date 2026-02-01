// controllers/truckController.js
const { influxDB } = require("../db/influxDB/influx");
const prismaClient = require("../lib/prismaClient");
const { Point } = require("@influxdata/influxdb-client");
const { DeleteAPI } = require("@influxdata/influxdb-client-apis");
const orgId="7386a755-3aca-433c-a6a0-b178f7c80152"
const queryApi = influxDB.getQueryApi("BSL Kharkhoda");

/* -------------------- helpers -------------------- */



const IST_OFFSET_MIN = 330;

function getIstNow() {
  const now = new Date();
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utcMs + IST_OFFSET_MIN * 60000);
}

function shiftStartTodayISTToUtcISO(shiftStartHM) {
  const m = String(shiftStartHM || "").match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return { error: "Invalid shiftStart (expected HH:MM)" };

  const hh = Number(m[1]);
  const mm = Number(m[2]);
  if (hh < 0 || hh > 23 || mm < 0 || mm > 59) {
    return { error: "Invalid shiftStart (HH 0-23, MM 0-59)" };
  }

  const istNow = getIstNow();
  const y = istNow.getUTCFullYear();
  const mo = istNow.getUTCMonth();
  const d = istNow.getUTCDate();

  // IST local time -> UTC ISO
  const utcMs = Date.UTC(y, mo, d, hh, mm, 0) - IST_OFFSET_MIN * 60000;
  return { startISO: new Date(utcMs).toISOString() };
}

function stripSensitiveTruckData(truck) {
  // never leak deviceAccessToken to frontend
  const cleanData = truck?.data ? { ...truck.data } : {};
  if (cleanData.deviceAccessToken) delete cleanData.deviceAccessToken;

  return {
    ...truck,
    data: cleanData,
  };
}

// Parse YYYY-MM-DD or ISO -> Date range [start, end)
function parseDateRange(fromQ, toQ) {
  // If you pass YYYY-MM-DD, Date() will treat as UTC in Node.
  // For your use-case (IST day), you may want IST conversion.
  // Keeping it simple for now: interpret as ISO date string.
  const from = fromQ ? new Date(fromQ) : null;
  const to = toQ ? new Date(toQ) : null;

  if (from && isNaN(from)) return { error: "Invalid from date" };
  if (to && isNaN(to)) return { error: "Invalid to date" };

  // If you want inclusive end date behavior, convert to next day:
  // Example: to=2026-01-17 means stop at 2026-01-18 00:00:00
  // We'll do that because UI selects dates, not timestamps.
  let start = from || new Date();
  let end = to || new Date();

  // normalize start to 00:00:00
  start = new Date(start);
  start.setHours(0, 0, 0, 0);

  // normalize end to next day 00:00:00 (exclusive)
  end = new Date(end);
  end.setHours(0, 0, 0, 0);
  end = new Date(end.getTime() + 24 * 60 * 60 * 1000);
  return { start, end };
}

/* -------------------- existing controllers -------------------- */
const createTruck = async (req, res) => {
  try {
    const { name, alias, status, data } = req.body;
    console.log(req.body);

    if (!name) {
      return res.status(400).json({ message: "name is required" });
    }

    const newTruck = await prismaClient.truck.create({
      data: {
        name,
        alias,
        status,
        data: data ?? {},
      },
    });

    return res.status(201).json(stripSensitiveTruckData(newTruck));
  } catch (err) {
    if (err?.code === "P2002" && err?.meta?.target?.includes("name")) {
      return res.status(409).json({ message: "Truck name already exists" });
    }
    console.error("createTruck error", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getAllTrucks = async (req, res) => {
  try {
    const skip = Number(req.query.skip ?? 0);
    const take = Number(req.query.take ?? 100);

    const truckIdQ = (req.query.truckId ?? "").toString();
    const psnQ = (req.query.psn ?? "").toString().trim();
    const fromQ = (req.query.from ?? "").toString().trim();
    const toQ = (req.query.to ?? "").toString().trim();
    const typeQ = (req.query.type ?? "All").toString();
    console.log(truckIdQ, psnQ, fromQ, toQ, typeQ);

    const trucks = await prismaClient.truck.findMany({
      skip,
      take,
      orderBy: { createdAt: "desc" },
      include: { trips: true },
    });

    // ⚠️ if you return trucks to frontend, strip token!
    const safeTrucks = trucks.map(stripSensitiveTruckData);

    // your existing psn logic
    // const pns = await getPsn({ psnValue: psnQ });
    // return res.json({ count: safeTrucks.length, trucks: safeTrucks, psn: pns });

    return res.json({ count: safeTrucks.length, trucks: safeTrucks });
  } catch (err) {
    console.error("getAllTrucks error", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getTruckById = async (req, res) => {
  try {
    const { id } = req.params;
    const truck = await prismaClient.truck.findUnique({
      where: { id },
      include: { trips: true },
    });

    if (!truck) return res.status(404).json({ message: "Truck not found" });
    return res.json(stripSensitiveTruckData(truck));
  } catch (err) {
    console.error("getTruckById error", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateTruck = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, alias, status, data } = req.body;

    const existing = await prismaClient.truck.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ message: "Truck not found" });

    const updated = await prismaClient.truck.update({
      where: { id },
      data: {
        ...(name !== undefined ? { name } : {}),
        ...(alias !== undefined ? { alias } : {}),
        ...(status !== undefined ? { status } : {}),
        ...(data !== undefined ? { data } : {}),
      },
    });

    return res.json(stripSensitiveTruckData(updated));
  } catch (err) {
    if (err?.code === "P2002" && err?.meta?.target?.includes("name")) {
      return res.status(409).json({ message: "Truck name already exists" });
    }
    console.error("updateTruck error", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/* -------------------- existing live trucks endpoint -------------------- */
const getLiveTrucks = async (req, res) => {
  try {
    const includeTrips = req.query.includeTrips === "true";

    const trucks = await prismaClient.truck.findMany({
      select: {
        id: true,
        name: true,
        alias: true,
        status: true,
        data: true,
        ...(includeTrips
          ? { trips: { orderBy: { departBsl: "desc" }, take: 5 } }
          : {}),
      },
      orderBy: { updatedAt: "desc" },
    });

    const summary = {
      total: trucks.length,
      atBSL: 0,
      atMSIL: 0,
      inTransit: 0,
      stopped: 0,
      unknown: 0,
    };

    for (const t of trucks) {
      if (t.status === "atBSL") summary.atBSL++;
      else if (t.status === "atMSIL") summary.atMSIL++;
      else if (t.status === "toMSIL" || t.status === "toBSL") summary.inTransit++;
      else if (t.status === "Stopped") summary.stopped++;
      else summary.unknown++;
    }

    const mapped = trucks.map((t) => {
      const safe = stripSensitiveTruckData(t);
      return {
        id: safe.id,
        name: safe.name,
        alias: safe.alias,
        status: safe.status,
        numberPlate: safe.data?.numberPlate ?? null,
        gps: safe.data?.gps ?? null,
        zone: safe.data?.zone ?? null,
        lastPollAt: safe.data?.lastPollAt ?? null,
        trips: safe.trips,
      };
    });

    return res.json({ summary, trucks: mapped });
  } catch (err) {
    console.error("getLiveTrucks error", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/* =========================================================
   NEW CONTROLLERS for ArrivalDetails (2 API calls)
   ========================================================= */

/**
 * API #1: GET /api/gpsTracking/trucks/summary?from=YYYY-MM-DD&to=YYYY-MM-DD&truckId=ALL
 * Returns trucks + tripsCount in date range (no trip list).
 */

/**
 * API #1: GET /api/gpsTracking/trucks/summary?from=YYYY-MM-DD&to=YYYY-MM-DD&truckId=ALL&psn=123
 * Returns trucks + tripsCount in date range (no trip list).
 * If psn is provided: returns only truck(s) whose RFID (truck.name) has that PSN in Influx TODAY (IST day -> now).
 */
const getTrucksSummaryByDate = async (req, res) => {
  try {
    const truckIdQ = (req.query.truckId ?? "ALL").toString();
    const fromQ = (req.query.from ?? "").toString().trim();
    const toQ = (req.query.to ?? "").toString().trim();
    const psnQRaw = (req.query.psn ?? "").toString().trim();

    const { start, end, error } = parseDateRange(fromQ, toQ);
    if (error) return res.status(400).json({ message: error });

    // If psn is provided, query Influx TODAY (IST day start -> now) and restrict trucks by RFID
// If psn is provided, query Influx in the SAME date range (IST day boundaries)
let rfidsForPsn = null;
if (psnQRaw) {
  const psnPrefix = psnQRaw.trim();
  if (!/^\d+$/.test(psnPrefix)) {
    return res.status(400).json({ message: "psn must be digits only for prefix filter" });
  }


  // Build Influx range from query date range (IST day start to IST next-day start)
  // fromISO = IST 00:00 of from-date expressed as UTC ISO
  // toISO   = IST 00:00 of (to-date + 1 day) expressed as UTC ISO (exclusive)
  const fromISO = fromQ ? startOfDateISTISO(fromQ) : startOfDateISTISO(new Date().toISOString());

  let toISO;
  if (toQ) {
    const toStart = new Date(startOfDateISTISO(toQ)); // IST 00:00 of to-date (UTC ISO)
    toISO = new Date(toStart.getTime() + 24 * 60 * 60 * 1000).toISOString(); // next day IST 00:00
  } else {
    // if no "to", search until now
    toISO = new Date().toISOString();
  }

  if (new Date(fromISO).getTime() >= new Date(toISO).getTime()) {
    return res.status(400).json({ message: "Invalid date range (from must be before to)" });
  }

  const flux = `
import "strings"
from(bucket: "${fluxEscape("TODAY")}")
  |> range(start: time(v: "${fluxEscape(fromISO)}"), stop: time(v: "${fluxEscape(toISO)}"))
  |> filter(fn: (r) => r["_measurement"] == "GPS")
  |> filter(fn: (r) => r["_field"] == "psn")
  |> filter(fn: (r) => strings.hasPrefix(v: string(v: r._value), prefix: "${fluxEscape(psnPrefix)}"))
  |> keep(columns: ["RFID"])
  |> group()
  |> distinct(column: "RFID")
`.trim();

  const rows = await influxQueryRows(flux);
  rfidsForPsn = rows.map((r) => (r._value ?? "").toString()).filter(Boolean);
console.log(rows[0])
  // No matches => return empty
  if (rfidsForPsn.length === 0) {
    return res.json({
      trucks: [],
      range: { from: start.toISOString(), to: end.toISOString() },
      meta: { psnPrefix, rfidsMatched: 0, influxRange: { fromISO, toISO } },
    });
  }
}
console.log(rfidsForPsn)

    // Build Prisma where clause
    const where = {};
    if (truckIdQ !== "ALL") where.id = truckIdQ;
    if (Array.isArray(rfidsForPsn)) where.name = { in: rfidsForPsn };

    // 1) load trucks (light)
    const trucks = await prismaClient.truck.findMany({
      select: { id: true, name: true, alias: true, data: true },
      orderBy: { createdAt: "desc" },
      where: Object.keys(where).length ? where : undefined,
    });

    const truckIds = trucks.map((t) => t.id);

    // 2) trips count in requested date range (from/to)
    const grouped = truckIds.length
      ? await prismaClient.trip.groupBy({
          by: ["truckId"],
          where: {
            truckId: { in: truckIds },
            createdAt: { gte: start, lt: end },
          },
          _count: { _all: true },
        })
      : [];

    const countMap = new Map();
    for (const row of grouped) countMap.set(row.truckId, row._count._all);

    const response = trucks.map((t) => {
      const safe = stripSensitiveTruckData(t);
      return {
        id: safe.id,
        name: safe.name,
        alias: safe.alias,
        data: safe.data,
        tripsCount: countMap.get(safe.id) ?? 0,
      };
    });

    return res.json({
      trucks: response,
      range: { from: start.toISOString(), to: end.toISOString() },
      ...(psnQRaw
        ? { meta: { psn: Math.trunc(Number(psnQRaw)), rfidsMatched: rfidsForPsn?.length ?? 0 } }
        : {}),
    });
  } catch (err) {
    console.error("getTrucksSummaryByDate error", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};


function startOfDateISTISO(dateString) {
  // Convert input ISO string to Date object
  const inputDate = new Date(dateString);
  
  // Get UTC time of input date
  const utcMs = inputDate.getTime() + inputDate.getTimezoneOffset() * 60000;
  const istMs = utcMs + 5.5 * 60 * 60000;
  const istDate = new Date(istMs);

  const y = istDate.getUTCFullYear();
  const m = istDate.getUTCMonth();
  const d = istDate.getUTCDate();

  // "00:00 IST" expressed as UTC time:
  const startIstUtc = new Date(Date.UTC(y, m, d, 0, 0, 0) - 5.5 * 60 * 60000);
  return startIstUtc.toISOString();
}
function parseDateRange(fromQ, toQ) {
  const from = fromQ ? new Date(fromQ) : null;
  const to = toQ ? new Date(toQ) : null;

  if (from && isNaN(from)) return { error: "Invalid from date" };
  if (to && isNaN(to)) return { error: "Invalid to date" };

  let start = from || new Date();
  let end = to || new Date();

  start = new Date(start);
  start.setHours(0, 0, 0, 0);

  end = new Date(end);
  end.setHours(0, 0, 0, 0);
  end = new Date(end.getTime() + 24 * 60 * 60 * 1000); // next day 00:00

  return { start, end };
}



/* ---------------- Influx helpers ---------------- */
/* ---------------- Influx helpers ---------------- */

function iso(d) {
  return d instanceof Date ? d.toISOString() : new Date(d).toISOString();
}

function fluxEscape(str) {
  return String(str ?? "").replace(/"/g, '\\"');
}

function minusMs(d, ms) {
  return iso(new Date(new Date(d).getTime() - ms));
}

async function influxQueryRows(flux) {
  const rows = [];
  return new Promise((resolve, reject) => {
    queryApi.queryRows(flux, {
      next(row, tableMeta) {
        rows.push(tableMeta.toObject(row));
      },
      error(err) {
        reject(err);
      },
      complete() {
        resolve(rows);
      },
    });
  });
}

async function getPsnsOneMinuteBeforeAnchor({ bucket = "TODAY", rfid, tripStartISO }) {
if (!rfid) return { anchorTime: null, anchorPsn: null, psns: [] };

  const tripStart = new Date(tripStartISO);
  const tripDateStartISO = startOfDateISTISO(tripStartISO); // Use trip's date instead of today

  // stop should be "just before trip start"
  const stopISO = new Date(tripStart.getTime() - 1).toISOString();
  if(tripDateStartISO >= stopISO){
    return { anchorTime: null, anchorPsn: null, windowStart: null, windowEnd: null, psns: [] };
  }

  console.log("[PSN] anchor search", { bucket, rfid, tripDateStartISO, tripStartISO, stopISO });

  // (1) Anchor: last psn before trip start, but only within TODAY range
  const anchorFlux = `
from(bucket: "${fluxEscape(bucket)}")
  |> range(start: time(v: "${fluxEscape(tripDateStartISO)}"), stop: time(v: "${fluxEscape(stopISO)}"))
  |> filter(fn: (r) => r["_measurement"] == "GPS")
  |> filter(fn: (r) => r["RFID"] == "${fluxEscape(rfid)}")
  |> filter(fn: (r) => r["_field"] == "psn")
  |> sort(columns: ["_time"], desc: true)
  |> limit(n: 1)
  |> keep(columns: ["_time", "_value"])
`.trim();

  const anchorRows = await influxQueryRows(anchorFlux);

  if (!anchorRows.length) {
    return { anchorTime: null, anchorPsn: null, windowStart: null, windowEnd: null, psns: [] };
  }

  const anchorTime = anchorRows[0]._time;  // keep as string (preserves precision)
  const anchorPsn = anchorRows[0]._value;

  // Build window start in JS (ms precision is fine for start)
  const anchorMs = new Date(anchorTime).getTime();
  const windowStartMs = anchorMs - 60 * 1000;

  // Clamp to start of today (so we don't go to yesterday)
  const todayStartMs = new Date(tripDateStartISO).getTime();
  const finalWindowStartISO = new Date(Math.max(windowStartMs, todayStartMs)).toISOString();

  // IMPORTANT: stop is exclusive, so add epsilon so you include points at ~anchorTime
  // (this also fixes the “01:20:47.002Z missing” case)
  const windowStopISO = new Date(anchorMs + 5).toISOString(); // +5ms epsilon

  console.log("[PSN] window computed", {
    rfid,
    anchorTime,
    anchorPsn,
    windowStart: finalWindowStartISO,
    windowEnd: windowStopISO,
    windowMs: new Date(windowStopISO).getTime() - new Date(finalWindowStartISO).getTime(),
  });

  const windowFlux = `
from(bucket: "${fluxEscape(bucket)}")
  |> range(start: time(v: "${fluxEscape(finalWindowStartISO)}"), stop: time(v: "${fluxEscape(windowStopISO)}"))
  |> filter(fn: (r) => r["_measurement"] == "GPS")
  |> filter(fn: (r) => r["RFID"] == "${fluxEscape(rfid)}")
  |> filter(fn: (r) => r["_field"] == "psn")
  |> keep(columns: ["_time", "_value"])
  |> sort(columns: ["_time"], desc: false)
`.trim();

  const windowRows = await influxQueryRows(windowFlux);

  console.log("[PSN] window rows", {
    rfid,
    rows: windowRows.length,
    first: windowRows[0]?._time,
    last: windowRows[windowRows.length - 1]?._time,
  });

  // distinct (preserve order)
  const seen = new Set();
  const psnsDistinct = [];
  for (const r of windowRows) {
    const key = String(r._value);
    if (seen.has(key)) continue;
    seen.add(key);
    psnsDistinct.push({ time: r._time, psn: r._value });
  }

  return {
    anchorTime,
    anchorPsn,
    windowStart: finalWindowStartISO,
    windowEnd: windowStopISO,
    psns: psnsDistinct,
  };
}



/* ---------------- Controller: trips by date + psn window ---------------- */

const getTripsForTruckByDate = async (req, res) => {
  try {
    const { truckId } = req.params;
    const fromQ = (req.query.from ?? "").toString().trim();
    const toQ = (req.query.to ?? "").toString().trim();

    if (!truckId) return res.status(400).json({ message: "truckId required" });

    const { start, end, error } = parseDateRange(fromQ, toQ);
    if (error) return res.status(400).json({ message: error });

    const truck = await prismaClient.truck.findUnique({
      where: { id: truckId },
      select: { id: true, name: true },
    });
    if (!truck) return res.status(404).json({ message: "Truck not found" });

    const trips = await prismaClient.trip.findMany({
      where: {
        truckId,
        OR: [
          { departBsl: { gte: start, lt: end } },
          {
            AND: [{ departBsl: { lt: end } }, { reachedBsl: null }],
          },
        ],
      },
      orderBy: [{ departBsl: "asc" }, { createdAt: "asc" }],
      select: {
        id: true,
        departBsl: true,
        reachedMsil: true,
        departMsil: true,
        reachedBsl: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // NEW: global dedupe across trips (latest trip keeps PSNs, older trips lose duplicates)
    const seenPsns = new Set();

    const enriched = [];
    for (const tr of trips) {
      const tripStartISO = tr.departBsl ? iso(tr.departBsl) : null;

      let psnInfo = {
        anchorTime: null,
        anchorPsn: null,
        windowStart: null,
        windowEnd: null,
        psns: [],
      };

      if (tripStartISO) {
        psnInfo = await getPsnsOneMinuteBeforeAnchor({
          bucket: "TODAY",
          rfid: truck.name,
          tripStartISO,
        });
      }

      // NEW: remove PSNs that already appeared in earlier processed trips
      // (since trips are sorted desc, newer trips are processed first)
      if (Array.isArray(psnInfo?.psns) && psnInfo.psns.length) {
        const filtered = [];
        for (const p of psnInfo.psns) {
          const v = p?.psn;
          if (v == null) continue;

          const key = String(v).trim();
          if (!key) continue;

          if (seenPsns.has(key)) continue; // already used by a newer trip

          filtered.push(p);
          seenPsns.add(key);
        }

        psnInfo = {
          ...psnInfo,
          psns: filtered,
        };

        // Optional: if anchorPsn was removed, you can keep anchor as-is
        // to preserve debugging context. (We keep it unchanged.)
      }

      const status =
        tr.reachedBsl
          ? "COMPLETED"
          : tr.departMsil
          ? "RETURNING_TO_BSL"
          : tr.reachedMsil
          ? "AT_MSIL"
          : tr.departBsl
          ? "TO_MSIL"
          : "UNKNOWN";

      enriched.push({
        ...tr,
        status,
        psnInfo,
      });
    }

    return res.json({
      truckId,
      rfid: truck.name,
      from: start.toISOString(),
      to: end.toISOString(),
      trips: enriched,
    });
  } catch (err) {
    console.error("getTripsForTruckByDate error", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};



const movePsnBetweenRfids = async (req, res) => {
  try {
    const { psn, psnTime, fromRfidId, toRfidId } = req.body ?? {};

    if (!psn || !psnTime || !fromRfidId || !toRfidId) {
      return res.status(400).json({
        message: "psn, psnTime, fromRfidId, toRfidId are required",
      });
    }
    if (String(fromRfidId) === String(toRfidId)) {
      return res.status(400).json({ message: "fromRfidId and toRfidId must be different" });
    }

    // choose bucket (default TODAY)
    const bucket = (req.query.bucket ?? "TODAY").toString();
    const org = "BSL Kharkhoda";

    // Create APIs
    const writeApi = influxDB.getWriteApi(org, bucket, "ns");
    const deleteApi = new DeleteAPI(influxDB);

    // 1) WRITE the psn point to toRfidId at the same timestamp
    // Use line protocol with RFC3339 time -> influx client will handle it if you use Point+Date,
    // but Date will lose ns. So we write a record line with explicit timestamp (ns) best-effort:
    //
    // We'll use Date for precision up to ms; if your psnTime has ns, Influx will still store ms-level here.
    // If you need true ns preservation, tell me your exact _time format and I’ll convert to ns integer.
    const tsDate = new Date(psnTime);
    if (Number.isNaN(tsDate.getTime())) {
      return res.status(400).json({ message: "Invalid psnTime" });
    }

    // Write using Point (ms precision)
    const n = Number(psn);
if (!Number.isFinite(n)) {
  return res.status(400).json({ message: "psn must be a number for this measurement" });
}
    const p = new Point("GPS")
  .tag("RFID", String(toRfidId))
  .intField("psn", Math.trunc(n))
  .timestamp(new Date(psnTime));    

    p.timestamp(tsDate);
    writeApi.writePoint(p);
    await writeApi.flush();

    // 2) DELETE the point(s) from fromRfidId at that timestamp window
    // Influx delete API works on a time range + predicate.
    // We'll delete only a tiny window around psnTime to avoid deleting too much.
    const start = new Date(tsDate.getTime() - 1).toISOString(); // -1ms
    const stop = new Date(tsDate.getTime() + 1).toISOString();  // +1ms (exclusive-ish)

    const predicate = `_measurement="GPS" AND RFID="${String(fromRfidId).replace(/"/g, '\\"')}"`;

    try {
      await deleteApi.postDelete({
        org,
        bucket,
        body: { start, stop, predicate },
      });
    } catch (delErr) {
      // rollback attempt: remove what we just wrote to toRfidId in the same window
      try {
        const rollbackPredicate = `_measurement="GPS" AND RFID="${String(toRfidId).replace(/"/g, '\\"')}"`;
        await deleteApi.postDelete({
          org,
          bucket,
          body: { start, stop, predicate: rollbackPredicate },
        });
      } catch (rbErr) {
        // ignore rollback failure; return original delete error
      }
      throw delErr;
    }

    return res.json({
      ok: true,
      moved: {
        psn: String(psn),
        psnTime: tsDate.toISOString(),
        fromRfidId: String(fromRfidId),
        toRfidId: String(toRfidId),
        bucket,
      },
    });
  } catch (err) {
    console.error("movePsnBetweenRfids error", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};


const getPsnCardsNotDepartedAfterPsn = async (req, res) => {
  const {shift}=req.query
  const shiftIndex=shift.charCodeAt(0)-'A'.charCodeAt(0)
  try {
    const shifts=await prismaClient.shiftTimings.findMany({
      where:{
        organizationId:orgId
      }
    })
    const shiftStart=shifts[shiftIndex]?.start

    const endISO = new Date().toISOString(); // now
    const { startISO, error } = shiftStartTodayISTToUtcISO(shiftStart);
    console.log(startISO,endISO)

    // ---------------------------
    // 1) Influx: PSNs for today
    // ---------------------------
const flux = `
from(bucket: "${fluxEscape("TODAY")}")
  |> range(start: time(v: "${fluxEscape(startISO)}"), stop: time(v: "${fluxEscape(endISO)}"))
  |> filter(fn: (r) => r["_measurement"] == "GPS")
  |> filter(fn: (r) => r["_field"] == "psn")
  |> keep(columns: ["_time", "_value", "RFID"])
  |> group(columns: ["RFID"])
  |> sort(columns: ["_time"], desc: false)
  |> unique(column: "_value")
`.trim();


    const rows = await influxQueryRows(flux);

    // RFID -> { psnsInit: [{time, psn}], lastPsnTime, lastPsn }
    const psnByRfid = new Map();
    console.log(rows.length)
    for (const r of rows) {
      // console.log(r)
      const rfid = (r.RFID ?? "").toString();
      if (!rfid) continue;

      const time = r._time;
      const psn = r._value;

      if (!psnByRfid.has(rfid)) psnByRfid.set(rfid, { psnsInit: [] });
      psnByRfid.get(rfid).psnsInit.push({ time, psn });
    }

    // compute lastPsnTime/lastPsn per rfid
    for (const [rfid, obj] of psnByRfid.entries()) {
      const last = obj.psnsInit[obj.psnsInit.length - 1]; // latest due to asc sort
      obj.lastPsnTime = last?.time ?? null;
      obj.lastPsn = last?.psn ?? null;
    }

    const rfidsWithPsn = Array.from(psnByRfid.keys());

    // ---------------------------
    // 2) Load all trucks
    // ---------------------------
    const allTrucks = await prismaClient.truck.findMany({
      select: { id: true, name: true, alias: true, status: true, data: true },
      orderBy: { updatedAt: "desc" },
    });

    const truckIds = allTrucks.map((t) => t.id);

    // ---------------------------
    // 3) Latest trip per truck
    // ---------------------------
    const latestTrips = truckIds.length
      ? await prismaClient.trip.findMany({
          where: { truckId: { in: truckIds } },
          orderBy: { createdAt: "desc" },
          distinct: ["truckId"],
          select: {
            truckId: true,
            departBsl: true,
            reachedMsil: true,
            reachedBsl: true,
            createdAt: true,
          },
        })
      : [];

    const latestTripByTruckId = new Map(latestTrips.map((tr) => [tr.truckId, tr]));

    // ---------------------------
    // 4) Apply ONLY your requested logic and build cards
    // ---------------------------
    const cards = [];

    for (const t of allTrucks) {
      const latestTrip = latestTripByTruckId.get(t.id);
      if (!latestTrip) continue; // if no trips, skip (as per rules)

      const safe = stripSensitiveTruckData(t);

      const hasPsnToday = psnByRfid.has(safe.name);

      if (hasPsnToday) {
        // Rule #1: PSN exists => latestTrip.reachedMsil should be null
        // if (latestTrip.reachedBsl != null) continue;

        // const psnInfo = psnByRfid.get(safe.name);

        // const card = {
        //   id: safe.id,
        //   name: safe.name,
        //   alias: safe.alias ?? null,
        //   status: safe.status ?? null,
        //   numberPlate: safe.data?.numberPlate ?? null,
        //   zone: safe.data?.zone ?? null,
        //   lastPollAt: safe.data?.lastPollAt ?? null,
        // };

        // cards.push({
        //   card,
        //   psnsInit: psnInfo?.psnsInit ?? [],
        //   lastPsn: psnInfo?.lastPsn ?? null,
        //   lastPsnTime: psnInfo?.lastPsnTime ?? null,
        // });

               const psnInfo = psnByRfid.get(safe.name);
	        // Filter PSNs: only those after latestTrip.reachedBsl
  const reachedBslTime = latestTrip?.reachedBsl ? new Date(latestTrip.reachedBsl) : null;

  const filteredPsns = (psnInfo?.psnsInit ?? []).filter((p) => {
    if (!reachedBslTime) return true; // allow by default if reachedBsl not defined
    const psnTime = p?.time ? new Date(p.time) : null;
    if (!psnTime || Number.isNaN(psnTime.getTime())) return false; // drop invalid times
    return psnTime > reachedBslTime;
  });

  // Compute last PSN AFTER filtering
  const lastFiltered = filteredPsns.length ? filteredPsns[filteredPsns.length - 1] : null;

  const card = {
    id: safe.id,
    name: safe.name,
    alias: safe.alias ?? null,
    status: safe.status ?? null,
    numberPlate: safe.data?.numberPlate ?? null,
    zone: safe.data?.zone ?? null,
    lastPollAt: safe.data?.lastPollAt ?? null,
  };

  cards.push({
    card,
    psnsInit: filteredPsns.slice(-8),
    lastPsn: lastFiltered?.psn ?? null,
    lastPsnTime: lastFiltered?.time ?? null,
  });

      } else {
        // Rule #2: PSN doesn't exist => latestTrip.departBsl should NOT be null
        if (latestTrip.departBsl == null) continue;

        const card = {
          id: safe.id,
          name: safe.name,
          alias: safe.alias ?? null,
          status: safe.status ?? null,
          numberPlate: safe.data?.numberPlate ?? null,
          zone: safe.data?.zone ?? null,
          lastPollAt: safe.data?.lastPollAt ?? null,
        };

        cards.push({
          card,
          psnsInit: [],
          lastPsn: null,
          lastPsnTime: null,
        });
      }
    }

    return res.json({
      range: { start: startISO, end: endISO, tz: "IST" },
      count: cards.length,
      cards,
      meta: {
        rfidsWithPsn: rfidsWithPsn.length,
        trucksTotal: allTrucks.length,
      },
    });
  } catch (err) {
    console.error("getPsnCardsNotDepartedAfterPsn error", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createTruck,
  updateTruck,
  getAllTrucks,
  getTruckById,
	getPsnCardsNotDepartedAfterPsn,
  movePsnBetweenRfids,

  // existing
  getLiveTrucks,

  // NEW for ArrivalDetails
  getTrucksSummaryByDate,
  getTripsForTruckByDate,
};

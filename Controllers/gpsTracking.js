// controllers/truckController.js
const { influxDB } = require("../db/influxDB/influx");
const prismaClient = require("../lib/prismaClient");

const queryApi = influxDB.getQueryApi("BSL Kharkhoda");

/* -------------------- helpers -------------------- */
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
const getTrucksSummaryByDate = async (req, res) => {
  try {
    const truckIdQ = (req.query.truckId ?? "ALL").toString();
    const fromQ = (req.query.from ?? "").toString().trim();
    const toQ = (req.query.to ?? "").toString().trim();

    const { start, end, error } = parseDateRange(fromQ, toQ);
    if (error) return res.status(400).json({ message: error });

    // 1) load trucks (light)
    const trucks = await prismaClient.truck.findMany({
      select: { id: true, name: true, alias: true, data: true },
      orderBy: { createdAt: "desc" },
      where: truckIdQ !== "ALL" ? { id: truckIdQ } : undefined,
    });

    const truckIds = trucks.map((t) => t.id);
    const grouped = await prismaClient.trip.groupBy({
      by: ["truckId"],
      where: {
        truckId: { in: truckIds },
        createdAt: { gte: start, lt: end },
      },
      _count: { _all: true },
    });

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

    return res.json({ trucks: response, range: { from: start.toISOString(), to: end.toISOString() } });
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

    // get truck name for RFID mapping
    const truck = await prismaClient.truck.findUnique({
      where: { id: truckId },
      select: { id: true, name: true },
    });
    if (!truck) return res.status(404).json({ message: "Truck not found" });

    // ✅ include completed + incomplete trips that overlap the window
    const trips = await prismaClient.trip.findMany({
      where: {
        truckId,
        OR: [
          // any trip event time inside window
          { departBsl: { gte: start, lt: end } },

          // ongoing: started before end, not yet reachedBsl
          {
            AND: [
              { departBsl: { lt: end } },
              { reachedBsl: null },
            ],
          },
        ],
      },
      orderBy: [
        { departBsl: "desc" },
        { createdAt: "desc" },
      ],
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

    // attach psn window info per trip
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

      // ✅ only try PSN if we have departBsl
      if (tripStartISO) {
        psnInfo = await getPsnsOneMinuteBeforeAnchor({
          bucket: "TODAY",
          rfid: truck.name, // RFID == truck.name (A6_480501)
          tripStartISO,
        });
      }

      // ✅ status derived from available timestamps (helps frontend)
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



module.exports = {
  createTruck,
  updateTruck,
  getAllTrucks,
  getTruckById,

  // existing
  getLiveTrucks,

  // NEW for ArrivalDetails
  getTrucksSummaryByDate,
  getTripsForTruckByDate,
};


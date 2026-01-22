const express = require('express');
const { influxDB } = require('../db/influxDB/influx');
const prismaClient =require('../lib/prismaClient.js');


const { QueryApi, InfluxDB } = require('@influxdata/influxdb-client');
const {format,parseISO} = require('date-fns')
const influxRouter = express.Router();
const queryApi = influxDB.getQueryApi("BSL Kharkhoda");

const fs = require("fs/promises");
const { jsPDF } = require("jspdf");
const autoTableImport = require("jspdf-autotable");
const autoTable =
  autoTableImport?.default ||
  autoTableImport?.autoTable ||
  autoTableImport;

const { PDFDocument } = require("pdf-lib");
const crypto = require("crypto");
const { sendPerformanceReportPdfMail } = require('../functions/userFunctions.js');




function getShiftTiming(shift, selectedDate = null) {
  // Convert to IST once
  const toIST = (date) => {
    const istStr = date.toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
    const istDate = new Date(istStr);
    if (isNaN(istDate.getTime())) {
      throw new Error("Invalid date passed for IST conversion");
    }
    return istDate;
  };

  const baseDateIST = selectedDate ? toIST(new Date(selectedDate)) : toIST(new Date());

  const year = baseDateIST.getFullYear();
  const month = baseDateIST.getMonth();
  const day = baseDateIST.getDate();

  // Build date in IST, return its UTC ISO
  const getTime = (hour, minute = 0, dayOffset = 0) => {
    const istDate = new Date(year, month, day + dayOffset, hour, minute);
    return istDate.toISOString(); // Let JS auto-convert to UTC
  };

  const shiftTimes = {
    A: {
      start: getTime(6, 0),        // 6:00 AM IST
      end: getTime(14, 30)         // 2:30 PM IST
    },
    B: {
      start: getTime(14, 30),      // 2:30 PM IST
      end: getTime(23, 0)          // 11:00 PM IST
    },
    C: {
      start: getTime(23, 0),       // 11:00 PM IST
      end: getTime(6, 0, 1)        // next day 6:00 AM IST
    },
	r:{
		start:getTime(6,0),
		end:getTime(6,0,1)
	}	  
  };
  const result = shiftTimes[shift];
  if (!result) throw new Error("Invalid shift. Must be 'A', 'B', or 'C'");
  return {
    startTime: result.start,
    endTime: result.end
  };
}

// influxDprBasic.js


const toISTDate = (utcIsoOrDate) => {
  const d = utcIsoOrDate instanceof Date ? utcIsoOrDate : new Date(utcIsoOrDate);
  return new Date(d.getTime() + IST_OFFSET_MIN * 60 * 1000);
};



// NOTE: istMs is "UTC ms + 5:30". Use UTC getters to avoid server timezone issues.

const toIstMsFromUtcDate = (d) => new Date(d).getTime() + IST_OFFSET_MS;


const fmtHHmm = (d) => `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;

/**
 * Build IST time slots between start and end.
 * Default: hourly slots.
 * Special case (ONLY when shift !== "r"): split 14:00-15:00 into 14:00-14:30 and 14:30-15:00
 */
const IST_OFFSET_MIN = 330;
const IST_OFFSET_MS = IST_OFFSET_MIN * 60 * 1000;

const pad2 = (n) => String(n).padStart(2, "0");

// Format an "IST wall-clock" time from an IST-shifted timestamp using UTC getters
const fmtHHmmFromIstMs = (istMs) => {
  const d = new Date(istMs);
  return `${pad2(d.getUTCHours())}:${pad2(d.getUTCMinutes())}`;
};

// Convert UTC ISO -> IST-shifted ms (not a "Date in IST", just a shifted timeline)
const toIstMsFromUtcIso = (utcIso) => new Date(utcIso).getTime() + IST_OFFSET_MS;


function buildISTSlots(startUtcIso, endUtcIso, shift) {
  const startIstMs = toIstMsFromUtcIso(startUtcIso);
  const endIstMs = toIstMsFromUtcIso(endUtcIso);

  const slots = [];
  let cursorIstMs = startIstMs;

  const splitTeaBreak = shift !== "r";

  while (cursorIstMs < endIstMs) {
    const d = new Date(cursorIstMs);
    const h = d.getUTCHours();
    const m = d.getUTCMinutes();

    let stepMs;
    if (splitTeaBreak && h === 14 && (m === 0 || m === 30)) {
      stepMs = 30 * 60 * 1000;
    } else {
      stepMs = 60 * 60 * 1000;
    }

    let nextIstMs = cursorIstMs + stepMs;
    if (nextIstMs > endIstMs) nextIstMs = endIstMs;

    slots.push({
      startIstMs: cursorIstMs,
      endIstMs: nextIstMs,

      // UTC iso for your resolveTargetJphAt (slot start)
      slotStartUtc: new Date(cursorIstMs - IST_OFFSET_MS).toISOString(),

      // what you show in UI
      key: `${fmtHHmmFromIstMs(cursorIstMs)}-${fmtHHmmFromIstMs(nextIstMs)}`,
    });

    cursorIstMs = nextIstMs;
  }

  return slots;
}




/**
 * Sum positive deltas to handle counter resets safely.
 * points: [{t:number(ms), v:number}, ...] sorted by t ascending
 */
// function sumPositiveDeltas(points) {
//   if (!points || points.length < 2) return 0;

//   let sum = 0;
//   for (let i = 1; i < points.length; i++) {
//     const dv = points[i].v - points[i - 1].v;
//     if (Number.isFinite(dv) && dv > 0) sum += dv;
//   }
//   return sum;
// }

/**
 * Main function:
 * - shift, date, line as input
 * - queries Influx (UTC timestamps)
 * - converts to IST timeslots and returns DPR-like rows for Model/Reject/Rework
 *
 * REQUIRED deps passed in:
 * - queryApi (Influx queryApi)
 * - getShiftTiming(shift, selectedDate) -> { startTime, endTime } in ISO (UTC)
 */





// controller/downtimeReport.js (updated version)
// Assumes you already have: prismaClient, queryApi, parseReportDate, normalizeShift, getShiftTiming



// ONLY split tea break for non-"r"
// function buildISTSlots(startUtcIso, endUtcIso, shift) {
//   const startIST = toISTDate(startUtcIso);
//   const endIST = toISTDate(endUtcIso);

//   const slots = [];
//   let cursor = new Date(startIST);

//   const splitTeaBreak = shift !== "r";

//   while (cursor < endIST) {
//     const h = cursor.getHours();
//     const m = cursor.getMinutes();

//     let next;
//     if (splitTeaBreak && h === 14 && (m === 0 || m === 30)) {
//       next = new Date(cursor.getTime() + 30 * 60 * 1000);
//     } else {
//       next = new Date(cursor.getTime() + 60 * 60 * 1000);
//     }

//     if (next > endIST) next = new Date(endIST);

//     slots.push({
//       start: new Date(cursor),
//       end: new Date(next),
//       key: `${fmtHHmm(cursor)}-${fmtHHmm(next)}`,
//     });

//     cursor = next;
//   }

//   return slots;
// }

function sumPositiveDeltas(points) {
  if (!points || points.length < 2) return 0;
  let sum = 0;
  for (let i = 1; i < points.length; i++) {
    const dv = points[i].v - points[i - 1].v;
    if (Number.isFinite(dv) && dv > 0) sum += dv;
  }
  return sum;
}

/**
 * You MUST map your DB lineId -> Influx LINE tag ("Front_Line", "RB", "RC" etc.)
 * Adjust this to your schema.
 */



async function fetchDprModelRejectRework({
  shift,
  date,        // can be Date or ISO string
  line,        // influx LINE tag, eg "Front_Line"
  queryApi,
  variantFields = ["Verient"],
  rejectField = "reject",
  reworkField = "rework",
}) {
  const selectedDate = date ? new Date(date) : new Date();
  const { startTime, endTime } = getShiftTiming(shift, selectedDate);

  if (!startTime || !endTime) throw new Error("Start time or end time is undefined.");

  let bucket = `SHIFT_${shift}`;
  if (shift === "r") bucket = "TODAY";

  const wantedFields = [...variantFields, rejectField, reworkField];
  const fieldConditions = wantedFields.map((f) => `r._field == "${f}"`).join(" or ");

  const fluxQuery = `
from(bucket: "${bucket}")
  |> range(start: time(v: "${startTime}"), stop: time(v: "${endTime}"))
  |> filter(fn: (r) => r["_measurement"] == "Performance" or r["_measurement"] == "QUALITY")
  |> filter(fn: (r) => r["LINE"] == "${line}")
  |> filter(fn: (r) => ${fieldConditions})
  |> aggregateWindow(every: 30s, fn: last, createEmpty: false)
  |> sort(columns: ["_time"], desc: false)
`;

  const raw = [];
  await new Promise((resolve, reject) => {
    queryApi.queryRows(fluxQuery, {
      next(row, tableMeta) {
        try {
          raw.push(tableMeta.toObject(row));
        } catch (e) {
          console.warn("Row parsing error:", e);
        }
      },
      error(err) {
        reject(err);
      },
      complete() {
        resolve();
      },
    });
  });

  // ✅ use the same fixed buildISTSlots (returns startIstMs/endIstMs/key/slotStartUtc)
  const slots = buildISTSlots(startTime, endTime, shift);

  const findSlotIdx = (istMs) => {
    for (let i = 0; i < slots.length; i++) {
      const s = slots[i];
      if (istMs >= s.startIstMs && istMs < s.endIstMs) return i;
    }
    return -1;
  };

  const slotAgg = slots.map((s) => ({
    timeSlot: s.key,      // MUST match fetchHourlySetProductionFromInflux rows
    modelSet: new Set(),
    rejectPoints: [],
    reworkPoints: [],
  }));

  for (const r of raw) {
    const utcIso = r._time;
    if (!utcIso) continue;
	  

    const field = r._field;
    const value = r._value;

    // Convert query time -> IST ms (timezone-safe)
    const istMs = new Date(utcIso).getTime() + IST_OFFSET_MS;
    const idx = findSlotIdx(istMs);
    if (idx < 0) continue;

    if (variantFields.includes(field)) {
      const str = String(value ?? "").trim();
      if (str) slotAgg[idx].modelSet.add(str);
      continue;
    }

    const num = Number(value);
    if (!Number.isFinite(num)) continue;
    if (field === rejectField) slotAgg[idx].rejectPoints.push({ t: istMs, v: num });
    if (field === reworkField) slotAgg[idx].reworkPoints.push({ t: istMs, v: num });
  }

	let prevReworkCum=0;
	let prevRejectCum=0;
  const rows = slotAgg.map((s) => {
    s.rejectPoints.sort((a, b) => a.t - b.t);
    s.reworkPoints.sort((a, b) => a.t - b.t);
	  const rejectCum =
    s.rejectPoints[s.rejectPoints.length - 1]?.v ?? prevRejectCum;

  const reworkCum =
    s.reworkPoints[s.reworkPoints.length - 1]?.v ?? prevReworkCum;

  // hourly deltas
  const rejectHour = Math.max(0, rejectCum - prevRejectCum);
  const reworkHour = Math.max(0, reworkCum - prevReworkCum);

  // update previous
  prevRejectCum = rejectCum;
  prevReworkCum = reworkCum;

    return {
      timeSlot: s.timeSlot,
      model: Array.from(s.modelSet).join(", "),
      reject: { hour: rejectHour, cum: rejectCum },
      rework: { hour: reworkHour, cum: reworkCum },
    };
  });

  return rows;
}

async function getInfluxLineTagFromLineId(lineId) {
  // Example: if you have a Line table with some "influxTag" or "code"
  const line = await prismaClient.line.findUnique({
    where: { lineId: lineId },
    select: {  lineName: true },
  });
  if(line.lineName==="Front Line"){
    return "Front_Line"
  }else if(line.lineName==="Rear Back"){
    return "RB"
  }else if(line.lineName==="Rear Cushion"){
    return "RC"
  }else{
	  return null;
  }

  throw new Error("Unable to resolve Influx LINE tag from lineId");
}

const resolveTargetJphAt = (historyAsc, slotStartUtc, fallback = 100) => {
  if (!Array.isArray(historyAsc) || !historyAsc.length) return fallback;
	
  const t = new Date(slotStartUtc).getTime();
  let ans = null;

  // historyAsc is sorted asc
  for (const h of historyAsc) {
    const ht = new Date(h.updatedAt).getTime();
    if (ht <= t) ans = h.updatedValue;
    else break;
  }

  const n = Number(ans);
  return (Number.isFinite(n) && n!==0) ? n : fallback;
};

async function fetchHourlySetProductionFromInflux({ shift, dateObj, lineId }) {
  const { startTime, endTime } = getShiftTiming(shift, dateObj);
  if (!startTime || !endTime) throw new Error("Start time or end time is undefined.");

  let bucket = `SHIFT_${shift}`;
  if (shift === "r") bucket = "TODAY";

  const influxLine = await getInfluxLineTagFromLineId(lineId);

  // Fetch both: prefer total_production_set; fallback to Total_Prod_Today if needed
  const wantedFields = ["total_production_set"];
  const fieldConditions = wantedFields.map((f) => `r._field == "${f}"`).join(" or ");

  const fluxQuery = `
from(bucket: "${bucket}")
  |> range(start: time(v: "${startTime}"), stop: time(v: "${endTime}"))
  |> filter(fn: (r) => r["_measurement"] == "Performance")
  |> filter(fn: (r) => r["LINE"] == "${influxLine}")
  |> filter(fn: (r) => ${fieldConditions})
  |> aggregateWindow(every: 30s, fn: last, createEmpty: false)
  |> sort(columns: ["_time"], desc: false)
`;

  const raw = [];
  await new Promise((resolve, reject) => {
    queryApi.queryRows(fluxQuery, {
      next(row, tableMeta) {
        try {
          raw.push(tableMeta.toObject(row));
        } catch (e) {
          console.warn("Row parsing error:", e);
        }
      },
      error(err) {
        reject(err);
      },
      complete() {
        resolve();
      },
    });
  });

  // ---------------- TargetJPH history ----------------
  const priorJph = await prismaClient.targetJPHUpdateHistory.findFirst({
    where: {
      lineId: lineId,
      updatedAt: { lt: new Date(startTime) },
    },
    orderBy: { updatedAt: "desc" },
  });

  const jphWithin = await prismaClient.targetJPHUpdateHistory.findMany({
    where: {
      lineId: lineId,
      updatedAt: {
        gte: new Date(startTime),
        lte: new Date(endTime),
      },
    },
    orderBy: { updatedAt: "asc" },
  });

  const jphHistoryAsc = [
    ...(priorJph ? [priorJph] : []),
    ...(Array.isArray(jphWithin) ? jphWithin : []),
  ].sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt));

  // ---------------- slots ----------------
const slots = buildISTSlots(startTime, endTime, shift);

const findSlotIdx = (istMs) => {
  for (let i = 0; i < slots.length; i++) {
    const s = slots[i];
    if (istMs >= s.startIstMs && istMs < s.endIstMs) return i;
  }
  return -1;
};





  // Prefer total_production_set. If not present at all, use Total_Prod_Today.
  const hasTPS = raw.some((r) => r._field === "total_production_set");
  const prodField = hasTPS ? "total_production_set" : "Total_Prod_Today";

  // IMPORTANT: keep slot start/end in UTC too for resolveTargetJphAt
  // slots[] are IST Date objects, so convert them back to UTC by subtracting offset
  const toUtcIsoFromIstDate = (istDate) =>
    new Date(istDate.getTime() - IST_OFFSET_MIN * 60 * 1000).toISOString();

const slotAgg = slots.map((s) => ({
  timeSlot: s.key,
  slotStartUtc: s.slotStartUtc, // ✅ already UTC ISO
  points: [],
}));

const UnplannedDowntimes = await prismaClient.plannedShutdown.findMany({
  where: {
    lines: { some: { lineId: lineId } },
    type: "UnplannedDowntime",
    createdAt: {
      gte: new Date(startTime),
      lte: new Date(endTime),
    },
  },
});


// Build downtime entries per slot (split if overlap across slots)
const downtimeBySlotIdx = Array.from({ length: slots.length }, () => []);

for (const dt of UnplannedDowntimes) {
  if (!dt?.startTime || !dt?.endTime) continue;

  const dtStartIstMs = toIstMsFromUtcDate(dt.startTime);
  const dtEndIstMs = toIstMsFromUtcDate(dt.endTime);

  // skip invalid
  if (!(dtEndIstMs > dtStartIstMs)) continue;

  for (let i = 0; i < slots.length; i++) {
    const slot = slots[i];

    const overlapStart = Math.max(dtStartIstMs, slot.startIstMs);
    const overlapEnd = Math.min(dtEndIstMs, slot.endIstMs);

    if (overlapEnd <= overlapStart) continue;

    const durationMin = Math.round((overlapEnd - overlapStart) / 60000);

    downtimeBySlotIdx[i].push({
      id: dt.id,                         // ✅ same id
      reason: dt.reason || "",
      lossCode:dt.reason.slice(0,3) || "",           // ✅ same reason
      description: dt.description || "",

      startTime: fmtHHmmFromIstMs(overlapStart), // "07:00"
      endTime: fmtHHmmFromIstMs(overlapEnd),     // "08:00"
      duration: durationMin,

      // internal for sorting only
      _startIstMs: overlapStart,
    });
  }
}

// Sort each slot downtime entries by start time (IST)
for (const arr of downtimeBySlotIdx) {
  arr.sort((a, b) => a._startIstMs - b._startIstMs);
  // remove internal sort field
  for (const e of arr) delete e._startIstMs;
}


  for (const r of raw) {
    if (r._field !== prodField) continue;

    const utcIso = r._time;
    if (!utcIso) continue;

    const v = Number(r._value);
    if (!Number.isFinite(v)) continue;

    const istMs = new Date(utcIso).getTime() + IST_OFFSET_MS;


    const idx = findSlotIdx(istMs);
    if (idx < 0) continue;

    slotAgg[idx].points.push({ t: istMs, v });
  }


// Build lookup ONCE (not a second traversal of rows; just indexing the mrwRows)


let cumulative = 0;
let targetCum = 0;

let rows = slotAgg.map((s, idx) => {
  s.points.sort((a, b) => a.t - b.t);
  const hourSetProduction = sumPositiveDeltas(s.points);
  cumulative += hourSetProduction;

  const targetJPH = resolveTargetJphAt(jphHistoryAsc, s.slotStartUtc, 100);
  targetCum += Number(targetJPH) || 0;



  return {
    sno: idx + 1,
    timeSlot: s.timeSlot,

    setProduction: { hour: hourSetProduction, cum: cumulative },

    targetJPH,
    targetJPHCumm: targetCum,

    actualJPH: hourSetProduction,
    actualJPHCumm: cumulative,

    // ✅ downtime entries already computed
    downtimeEntries: downtimeBySlotIdx[idx] || [],

    // ✅ model/reject/rework columns added


    meta: { fieldUsed: prodField },
  };
});




  return rows;
}

const parseReportDate = (v) => {
  // Accepts:
  // - Date
  // - "YYYY-MM-DD"
  // - ISO string
  if (!v) return null;

  if (v instanceof Date) return Number.isNaN(v.getTime()) ? null : v;

  const s = String(v).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    // force stable date in UTC midnight
    const d = new Date(`${s}T00:00:00.000Z`);
    return Number.isNaN(d.getTime()) ? null : d;
  }

  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
};

const reportInclude = {
  line: { select: { lineId: true, lineName: true } },
  user: { select: { id: true, name: true, email: true } },
  plannedShutdowns: true,
};
const normalizeSlotKey = (s) =>
  String(s || "")
    .replace(/\s+/g, "")     // remove spaces
    .replace(/–/g, "-")      // en dash -> hyphen if any
    .toUpperCase();          // optional: case-safe










  
async function populateDowntimeEntriesForSubmittedRows({
  rows,
  shiftVal,
  reportDate,
  lineId,
}) {
  if (!Array.isArray(rows) || !rows.length) return rows;

  const { startTime, endTime } = getShiftTiming(shiftVal, reportDate);
  if (!startTime || !endTime) return rows;

  const slots = buildISTSlots(startTime, endTime, shiftVal);
  const slotByKey = Object.create(null);
  for (const s of slots) slotByKey[normalizeSlotKey(s.key)] = s;

  // collect ids used in sheet rows
  const ids = [];
  for (const r of rows) {
    const entries = Array.isArray(r?.downtimeEntries) ? r.downtimeEntries : [];
    for (const e of entries) {
      if (e?.id) ids.push(e.id);
    }
  }

  const uniqueIds = [...new Set(ids)];
  if (!uniqueIds.length) return rows;

  // Fetch full records by ids
  // ✅ assuming these ids belong to plannedShutdown table in your setup
  // If your ids are from another table, replace this model accordingly.
  const records = await prismaClient.plannedShutdown.findMany({
    where: { id: { in: uniqueIds } },
  });

  const byId = Object.create(null);
  for (const r of records) byId[r.id] = r;

  // helper: clip record to slot and return expanded entry
  const clipToSlot = (rec, slot) => {
    if (!rec?.startTime || !rec?.endTime) return null;

    const recStartIstMs = toIstMsFromUtcDate(rec.startTime);
    const recEndIstMs = toIstMsFromUtcDate(rec.endTime);
    if (!(recEndIstMs > recStartIstMs)) return null;

    const overlapStart = Math.max(recStartIstMs, slot.startIstMs);
    const overlapEnd = Math.min(recEndIstMs, slot.endIstMs);
    if (overlapEnd <= overlapStart) return null;

    const durationMin = Math.round((overlapEnd - overlapStart) / 60000);

    return {
      id: rec.id,
      startTime: fmtHHmmFromIstMs(overlapStart),
      endTime: fmtHHmmFromIstMs(overlapEnd),
      duration: durationMin,

      lossCode: rec.reason.slice(0,3) || "",

      reason: rec.reason || "",
      description: rec.description || "",
      _startIstMs: overlapStart, // for sorting only
    };
  };

  // expand per row
  const newRows = rows.map((row) => {
    const slot = slotByKey[normalizeSlotKey(row?.timeSlot)];
    if (!slot) return row;

    const entries = Array.isArray(row?.downtimeEntries) ? row.downtimeEntries : [];

    const expanded = [];
    for (const e of entries) {
      const rec = byId[e?.id];
      if (!rec) continue;

      const clipped = clipToSlot(rec, slot);
      if (clipped) expanded.push(clipped);
    }

    // sort by IST start
    expanded.sort((a, b) => (a._startIstMs || 0) - (b._startIstMs || 0));
    for (const x of expanded) delete x._startIstMs;

    return { ...row, downtimeEntries: expanded };
  });

  return newRows;
}

const getDowntimeReportByLineDateShiftCumulative = async (req, res) => {
  try {
    const { lineId, date, shift } = req.query;

    if (!lineId || !date || !shift) {
      return res.status(400).json({
        success: false,
        message: "lineId, date (YYYY-MM-DD) and shift are required in query",
      });
    }

    const reportDate = parseReportDate(String(date));
    const shiftVal = String(shift);

    if (!reportDate) {
      return res.status(400).json({ success: false, message: "Invalid date format" });
    }

    const doc = await prismaClient.downtimeReport.findUnique({
      where: {
        lineId_reportDate_shift: {
          lineId,
          reportDate,
          shift: shiftVal,
        },
      },
      include: reportInclude,
    });

    const influxLine = await getInfluxLineTagFromLineId(lineId);

    const isSubmitted = Boolean(doc?.isSubmitted);

    // base rows
    let baseRows = isSubmitted
      ? (Array.isArray(doc?.rows) ? doc.rows : [])
      : await fetchHourlySetProductionFromInflux({
          shift: shiftVal,
          dateObj: reportDate,
          lineId,
        });

    // ✅ populate downtimeEntries ONLY for submitted sheets
    if (isSubmitted) {
      baseRows = await populateDowntimeEntriesForSubmittedRows({
        rows: baseRows,
        shiftVal,
        reportDate,
        lineId,
      });
    }

    // MRW merge (as you already had)
    const mrwRows = await fetchDprModelRejectRework({
      shift: shiftVal,
      date: reportDate,
      line: influxLine,
      queryApi,
      variantFields: ["Verient"],
      rejectField: "reject",
      reworkField: "rework",
    });

    const mrwBySlot = Object.create(null);
    for (const r of mrwRows || []) {
      mrwBySlot[normalizeSlotKey(r.timeSlot)] = r;
    }

    const mergedRows = (baseRows || []).map((row) => {
      const key = normalizeSlotKey(row?.timeSlot);
      const mrw = mrwBySlot[key];

      const rejectHour = mrw?.reject?.hour ?? 0;
      const rejectCum = mrw?.reject?.cum ?? 0;
      const reworkHour = mrw?.rework?.hour ?? 0;
      const reworkCum = mrw?.rework?.cum ?? 0;

      return {
        ...row,
        model: mrw?.model || row?.model || "",
        reject: mrw?.reject || row?.reject || { hour: 0, cum: 0 },
        rework: mrw?.rework || row?.rework || { hour: 0, cum: 0 },
        rejectHour,
        rejectCummulative: rejectCum,
        reworkHour,
        reworkCummulative: reworkCum,
      };
    });

    if (isSubmitted) {
      return res.status(200).json({
        success: true,
        data: {
          ...doc,
          rows: mergedRows,
        },
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        isSubmitted: false,
        lineId,
        reportDate,
        shift: shiftVal,
        rows: mergedRows,
      },
    });
  } catch (err) {
    console.error("getDowntimeReportByLineDateShiftCumulative error:", err);
    return res.status(500).json({
      success: false,
      message: err?.message || "Failed to fetch report",
    });
  }
};








const  fetchPerformanceReportData=async({ lineId, date, shift })=> {
  if (!lineId || !date || !shift) {
    throw new Error("lineId, date (YYYY-MM-DD) and shift are required");
  }

  const reportDate = parseReportDate(String(date));
  const shiftVal = String(shift);

  if (!reportDate) {
    throw new Error("Invalid date format");
  }

  const doc = await prismaClient.downtimeReport.findUnique({
    where: {
      lineId_reportDate_shift: {
        lineId,
        reportDate,
        shift: shiftVal,
      },
    },
    include: reportInclude,
  });

  const influxLine = await getInfluxLineTagFromLineId(lineId);
  if(!influxLine){
    return
  }
  const isSubmitted = Boolean(doc?.isSubmitted);

  let baseRows = isSubmitted
    ? (Array.isArray(doc?.rows) ? doc.rows : [])
    : await fetchHourlySetProductionFromInflux({
        shift: shiftVal,
        dateObj: reportDate,
        lineId,
      });

  if (isSubmitted) {
    baseRows = await populateDowntimeEntriesForSubmittedRows({
      rows: baseRows,
      shiftVal,
      reportDate,
      lineId,
    });
  }

  const mrwRows = await fetchDprModelRejectRework({
    shift: shiftVal,
    date: reportDate,
    line: influxLine,
    queryApi,
    variantFields: ["Verient"],
    rejectField: "reject",
    reworkField: "rework",
  });

  const mrwBySlot = Object.create(null);
  for (const r of mrwRows || []) {
    mrwBySlot[normalizeSlotKey(r.timeSlot)] = r;
  }

  const mergedRows = (baseRows || []).map((row) => {
    const key = normalizeSlotKey(row?.timeSlot);
    const mrw = mrwBySlot[key];

    const rejectCum = mrw?.reject?.cum ?? 0;
    const reworkCum = mrw?.rework?.cum ?? 0;

    return {
      ...row,
      model: mrw?.model || row?.model || "",
      reject: mrw?.reject || row?.reject || { hour: 0, cum: 0 },
      rework: mrw?.rework || row?.rework || { hour: 0, cum: 0 },
      rejectHour: mrw?.reject?.hour ?? 0,
      rejectCummulative: rejectCum,
      reworkHour: mrw?.rework?.hour ?? 0,
      reworkCummulative: reworkCum,
    };
  });

  const line = await prismaClient.line.findUnique({
    where: { lineId },
    select: { lineName: true },
  });

  return {
    isSubmitted,
    lineId,
    reportDate, // Date object
    shift: shiftVal,
    lineName: line?.lineName || lineId,
    rows: mergedRows,
  };
}


// Same as your frontend drawSQPHeader, but safer fonts for Node
function drawSQPHeader(doc, { lineName, shiftLabel, dateLabel }) {
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("PRODUCTION LINE PERFORMANCE MONITORING (S-Q-P)", pageWidth / 2, 14, {
    align: "center",
  });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  const left = 14;
  const topY = 20;
  const rowH = 7;
  const gap = 4;

  const colW = (pageWidth - left * 2 - gap * 2) / 3;
  const boxH = rowH;

  const labelPad = 2.5;
  const boxInnerPad = 2;
  const minBoxW = 18;

  const drawLabeledBox = (x, y, label, value = "") => {
    const textY = y + 4.8;
    doc.text(label, x, textY);

    const labelW = doc.getTextWidth(label);
    const boxX = x + labelW + labelPad;

    let boxW = x + colW - boxX;
    if (boxW < minBoxW) boxW = minBoxW;

    doc.rect(boxX, y + 1, boxW, boxH);

    if (value) {
      const maxW = boxW - boxInnerPad * 2;
      const safeValue = doc.splitTextToSize(String(value), maxW)[0];
      doc.text(safeValue, boxX + boxInnerPad, textY);
    }
  };

  const x1 = left;
  const x2 = left + colW + gap;
  const x3 = left + (colW + gap) * 2;

  drawLabeledBox(x1, topY, "Date :", dateLabel);
  drawLabeledBox(x2, topY, "Shift :", shiftLabel);
  drawLabeledBox(x3, topY, "Line :", lineName);

  const y2 = topY + rowH + 4;
  drawLabeledBox(x1, y2, "Line Supervisor :", "");
  drawLabeledBox(x2, y2, "No. of Man Power :", "");
  drawLabeledBox(x3, y2, "Control Time in Secs :", "");

  return y2 + rowH + 6;
}

// Same as your frontend normalizePerformanceRows
function normalizePerformanceRows(rows = []) {
  let prodCum = 0;
  let targetCum = 0;

  const toMin = (hhmm) => {
    const s = String(hhmm || "").trim();
    if (!s) return null;
    const [h, m] = s.split(":").map(Number);
    if (!Number.isFinite(h) || !Number.isFinite(m)) return null;
    return h * 60 + m;
  };

  const parseSlotMinutes = (timeSlot) => {
    const raw = String(timeSlot || "").trim();
    const cleaned = raw.replace(/\s+/g, "");
    const parts = cleaned.split("-");
    if (parts.length !== 2) return null;

    const s = toMin(parts[0]);
    const e = toMin(parts[1]);
    if (s == null || e == null) return null;

    let dur = e - s;
    if (dur < 0) dur += 24 * 60;
    return dur;
  };

  return rows.map((r) => {
    const hour = {};
    const cum = {};

    const hourlyProd = r.setProduction?.hour ?? r.actualJPH ?? 0;
    const hourlyTarget = r.targetJPH ?? 0;

    prodCum += hourlyProd;
    targetCum += hourlyTarget;

    hour.Production = hourlyProd;
    cum.Production = r.setProduction?.cum ?? prodCum;

    hour.Target = hourlyTarget;
    cum.Target = r.targetJPHCumm ?? targetCum;

    hour.Reject = r.reject?.hour ?? r.rejectHour ?? 0;
    cum.Reject = r.reject?.cum ?? r.rejectCummulative ?? 0;

    hour.Rework = r.rework?.hour ?? r.reworkHour ?? 0;
    cum.Rework = r.rework?.cum ?? r.reworkCummulative ?? 0;

    const dts = Array.isArray(r.downtimeEntries) ? r.downtimeEntries : [];
    const downtimeMinutes = dts.reduce((sum, dt) => {
      const d = Number(dt?.duration);
      return sum + (Number.isFinite(d) ? d : 0);
    }, 0);

    const slotMinutes = parseSlotMinutes(r.timeSlot);

    const lossTime =
      slotMinutes == null
        ? ""
        : Math.max(0, downtimeMinutes);

    hour.lossTime = lossTime;

    let filteredModel = "";
    if (typeof r.model === "string" && hourlyProd > 0) {
      filteredModel = r.model
        .split(",")
        .map((m) => m.trim())
        .filter(Boolean)
        .slice(0, hourlyProd)
        .join(", ");
    }

    return {
      timeSlot: r.timeSlot,
      hour,
      cum,
      downtimes: dts.map((dt) => ({
        start: dt?.startTime ?? "",
        end: dt?.endTime ?? "",
        lossCode: dt?.lossCode ?? "",
        lossReason: dt?.reason ?? "",
        duration: Number.isFinite(Number(dt?.duration)) ? Number(dt?.duration) : "",
      })),
      downtimeMinutes,
      slotMinutes,
      model: filteredModel,
    };
  });
}

async function mergeTemplatePageAfterEachLineNode({
  jsPdfDoc,
  templateBytes,
  templatePageIndex = 1,
  insertAfterPages = [],
}) {
  const tplPdf = await PDFDocument.load(templateBytes);

  const genBytes = jsPdfDoc.output("arraybuffer");
  const outPdf = await PDFDocument.load(genBytes);

  if (tplPdf.getPageCount() <= templatePageIndex) {
    throw new Error("Template PDF does not have that many pages.");
  }

  const sorted = [...insertAfterPages].sort((a, b) => b - a);

  for (const afterPageNum of sorted) {
    const [copied] = await outPdf.copyPages(tplPdf, [templatePageIndex]);
    outPdf.insertPage(afterPageNum, copied);
  }

  const merged = await outPdf.save();
  return Buffer.from(merged);
}

/**
 * Build the same PDF your frontend makes, but on the backend.
 * Returns a Buffer you can: res.send(buffer) OR attach in Nodemailer later.
 */
async function buildPerformanceReportPdfBuffer({
  lineIds = [],
  date,              // "YYYY-MM-DD" (recommended) or ISO
  shift,             // "A" | "B" | "C" | "r"
  shiftLabel,        // what you want printed in header (e.g. "Shift A")
  templatePdfPath,   // filesystem path to your template PDF
  templatePageIndex = 1,
}) {
  if (!Array.isArray(lineIds) || lineIds.length === 0) {
    throw new Error("lineIds must be a non-empty array");
  }

  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  let isFirstPage = true;
  const insertAfterPages = [];

  for (const lineId of lineIds) {
    const report = await fetchPerformanceReportData({ lineId, date, shift });
    if(!report){
      continue
    }
    const normalizedRows = normalizePerformanceRows(report?.rows || []);

    if (!isFirstPage) doc.addPage();
    isFirstPage = false;

    const headerStartY = drawSQPHeader(doc, {
      lineName: report.lineName,
      shiftLabel: shiftLabel || String(shift),
      dateLabel: String(date),
    });

    const head = [
      [
        { content: "Time Slot", rowSpan: 2 },
        { content: "Production", colSpan: 2 },
        { content: "Model", rowSpan: 2 },
        { content: "Scheduled", colSpan: 2 },
        { content: "Reject", colSpan: 2 },
        { content: "Rework", colSpan: 2 },
        { content: "Downtime", colSpan: 2 },
        { content: "Loss Time", rowSpan: 2 },
        { content: "Loss", colSpan: 2 },
      ],
      [
        { content: "Hour" },
        { content: "Cum" },
        { content: "Hour" },
        { content: "Cum" },
        { content: "Hour" },
        { content: "Cum" },
        { content: "Hour" },
        { content: "Cum" },
        { content: "Start" },
        { content: "End" },
        { content: "Code" },
        { content: "Reason" },
      ],
    ];

    const body = normalizedRows.flatMap((r) => {
      const dts = (r.downtimes && r.downtimes.length) ? r.downtimes : [null];

      return dts.map((dt, idx) => [
        idx === 0 ? r.timeSlot : "",

        idx === 0 ? r.hour.Production : "",
        idx === 0 ? r.cum.Production : "",

        idx === 0 ? r.model : "",

        idx === 0 ? r.hour.Target : "",
        idx === 0 ? r.cum.Target : "",

        idx === 0 ? r.hour.Reject : "",
        idx === 0 ? r.cum.Reject : "",

        idx === 0 ? r.hour.Rework : "",
        idx === 0 ? r.cum.Rework : "",

        dt?.start ?? "",
        dt?.end ?? "",

        idx === 0 ? r.hour.lossTime : "",

        dt?.lossCode ?? "",
        dt?.lossReason ?? "",
      ]);
    });

    autoTable(doc, {
      startY: headerStartY,
      head,
      body,
      theme: "grid",
      styles: {
        fontSize: 8,
        halign: "center",
        valign: "middle",
        cellPadding: { top: 1, bottom: 1, left: 0, right: 0 },
        lineWidth: 0.2,
        lineColor: [0, 0, 0],
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        halign: "center",
        lineWidth: 0.2,
      },
      columnStyles: {
        3: { cellWidth: 20 },
      },
    });

    insertAfterPages.push(doc.getNumberOfPages());
  }

  if (doc.getNumberOfPages() === 0) {
    throw new Error("No pages generated (check lineIds/data)");
  }

  const templateBytes = await fs.readFile(templatePdfPath);
  const mergedBuffer = await mergeTemplatePageAfterEachLineNode({
    jsPdfDoc: doc,
    templateBytes,
    templatePageIndex,
    insertAfterPages,
  });

  return mergedBuffer;
}





const safeFilePart = (v) =>
  String(v ?? "")
    .trim()
    .replace(/[^\w.-]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");

const getTodayIstYyyyMmDd = () => {
  // stable IST "YYYY-MM-DD"
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const y = parts.find((p) => p.type === "year")?.value;
  const m = parts.find((p) => p.type === "month")?.value;
  const d = parts.find((p) => p.type === "day")?.value;

  return `${y}-${m}-${d}`;
};

/**
 * Generates today's (IST) performance report PDF for all lines and emails it.
 * Only takes shift as prop.
 *
 * @param {Object} opts
 * @param {"A"|"B"|"C"|"r"} opts.shift
 * @param {string} [opts.outputDir] - where to save the PDF
 * @param {string[]} [opts.recipients] - optional override/additional recipients
 * @param {string} [opts.templatePdfPath] - optional override template path
 * @param {number} [opts.templatePageIndex] - optional template page index
 */
async function sendTodayPerformanceReportPdf({ shift = "A", outputDir, recipients, templatePdfPath, templatePageIndex = 1 }) {
  const date = getTodayIstYyyyMmDd();

  if (!shift) {
    throw new Error("shift is required");
  }


  const tplPath ="/home/Saurabh/BslBackend/BslBackend/PRODUCTION LINE PERFORMANCE MONITORING (S-Q-P) (4).pdf";

  const lines = await prismaClient.line.findMany({ select: { lineId: true } });
  const lineIds = lines.map((l) => l.lineId);

  const pdfBuffer = await buildPerformanceReportPdfBuffer({
    lineIds,
    date,
    shift,
    shiftLabel: `Shift ${shift}`,
    templatePdfPath: tplPath,
    templatePageIndex,
  });


  const baseName = `Performance_Report_${safeFilePart(date)}_Shift_${safeFilePart(shift)}`;
  const uniq = crypto.randomBytes(4).toString("hex");
  const fileName = `${baseName}_${uniq}.pdf`;


  const to =
    (Array.isArray(recipients) && recipients.length > 0
      ? recipients
      : ["ommishra@opsight.ai","arunkumar@opsight.ai"]
    ).filter(Boolean);

  const subject = `Performance Report - ${date} - Shift ${shift}`;
  const html = `
    <div style="font-family: Arial, sans-serif; color:#333;">
      <p>Hi,</p>
      <p>Please find the attached Performance Report PDF below.</p>
      <p><b>Date:</b> ${date}<br/>
         <b>Shift:</b> ${shift}</p>
      <p>Regards</p>
    </div>
  `;

  const mailInfo = await sendPerformanceReportPdfMail({
    to,
    subject,
    html,
    pdfBuffer,
    fileName,
  });

  return {
    date,
    shift,
    fileName,
    bytes: pdfBuffer.length,
    mailedTo: to,
    mailMessageId: mailInfo?.messageId || null,
  };
}


















module.exports = { getDowntimeReportByLineDateShiftCumulative,sendTodayPerformanceReportPdf};


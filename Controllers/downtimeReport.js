const { influxDB } = require("../db/influxDB/influx");
const prismaClient  = require("../lib/prismaClient");
const { getShiftTiming } = require("../Routes/influxRoutes");
const IST_TZ = "Asia/Kolkata";





// ===================== NEW: production-from-counter helpers =====================
const PRODUCTION_FIELD = "total_production_set";
const minusHoursIso = (iso, hours) => {
  const d = new Date(iso);
  d.setHours(d.getHours() - hours);
  return d.toISOString();
};


// returns slots only inside shift window (IST), preserving your 14:00/14:30 split
const buildSlotsForShiftWindow = ({ shiftStartUtc, shiftEndUtc }) => {
  const shiftStartHHMM = toIstHHMM(new Date(shiftStartUtc));
  const shiftEndHHMM = toIstHHMM(new Date(shiftEndUtc));

  const shiftStartMin = toMin(shiftStartHHMM);
  const shiftEndMin = toMin(shiftEndHHMM);
  const shiftCrossesMidnight = shiftEndMin < shiftStartMin;

  const endNorm = shiftCrossesMidnight ? shiftEndMin + 1440 : shiftEndMin;

  const slots = [];
  let guard = 0;

  // cursorRaw stays in 0..1439 (HH:mm minute-of-day)
  let cursorRaw = shiftStartMin;

  while (guard++ < 200) {
    const cursorNorm = normalizeMinForShift(cursorRaw, shiftStartMin, shiftCrossesMidnight);
    if (cursorNorm >= endNorm) break;

    const mod = ((cursorRaw % 1440) + 1440) % 1440;

    // keep your special split at 14:00 and 14:30
    let step = 60;
    if (mod === 14 * 60) step = 30;
    else if (mod === 14 * 60 + 30) step = 30;

    let nextNorm = cursorNorm + step;
    if (nextNorm > endNorm) nextNorm = endNorm;

    const nextRaw = ((nextNorm % 1440) + 1440) % 1440;

    const startHHMM = minToHHMM(mod);
    const endHHMM = minToHHMM(nextRaw);

    slots.push({
      id: `SLOT__${startHHMM}`,
      timeSlot: `${startHHMM} - ${endHHMM}`,
      _startMin: mod,
      _endMin: nextRaw,
      _sortNorm: cursorNorm, // for stable shift-order sorting (midnight safe)
    });

    cursorRaw = nextRaw;
  }

  // sort in shift order (handles midnight crossing safely)
  slots.sort((a, b) => a._sortNorm - b._sortNorm);

  return { slots, shiftStartMin, shiftEndMin, shiftCrossesMidnight };
};

// Query time-series of total_production_set (include small buffer before shift start)
const queryTotalProductionSeries = async ({ bucket, startTime, endTime, influxLineKey }) => {
  const startWithBuffer = minusHoursIso(startTime, 1);
  const fluxQuery = `
from(bucket: "${bucket}")
  |> range(start: time(v: "${startWithBuffer}"), stop: time(v: "${endTime}"))
  |> filter(fn: (r) => r["_measurement"] == "Performance")
  |> filter(fn: (r) => r["LINE"] == "${influxLineKey}")
  |> filter(fn: (r) => r["_field"] == "${PRODUCTION_FIELD}")
  |> keep(columns: ["_time", "_value"])
  |> sort(columns: ["_time"])
`;

  const points = [];

  await new Promise((resolve, reject) => {
    queryApi.queryRows(fluxQuery, {
      next(row, tableMeta) {
        try {
          const o = tableMeta.toObject(row);
          if (o?._time != null) {
            points.push({
              t: new Date(o._time).getTime(),
              v: Number(o._value) || 0,
            });
          }
        } catch (e) {
          console.warn("Row parse error:", e);
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
  

  // already sorted by flux; keep safe:
  points.sort((a, b) => a.t - b.t);
  return points;
};

// last value at or before time (ms)
const valueAtOrBefore = (seriesAsc, tMs) => {
  if (!Array.isArray(seriesAsc) || seriesAsc.length === 0) return 0;
  // quick outs
  if (tMs <= seriesAsc[0].t) return seriesAsc[0].v;
  if (tMs >= seriesAsc[seriesAsc.length - 1].t) return seriesAsc[seriesAsc.length - 1].v;

  // binary search
  let lo = 0, hi = seriesAsc.length - 1, ans = 0;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const mt = seriesAsc[mid].t;
    if (mt <= tMs) {
      ans = seriesAsc[mid].v;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  return ans;
};
// ===================== END NEW HELPERS =====================


const toIstHHMM = (d) => {
  if (!d) return "";
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: IST_TZ,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(d));
};

const toIstYmd = (d = new Date()) => {
  return new Date(d).toLocaleDateString("en-CA", { timeZone: IST_TZ });
};
const restrictedHrpFields = [
  "HRP00:00",
  "HRP01:00",
  "HRP02:00",
  "HRP03:00",
  "HRP04:00",
  "HRP05:00",
  "HRP23:00",
];



const toMin = (hhmm) => {
  const [h, m] = String(hhmm).split(":").map(Number);
  return h * 60 + (m || 0);
};

const normalizeMinForShift = (min, shiftStartMin, shiftCrossesMidnight) => {
  if (!shiftCrossesMidnight) return min;
  // for C-like windows: times after midnight must come AFTER shiftStart (23:00)
  return min < shiftStartMin ? min + 1440 : min;
};



const applyUnplannedDowntimeSpansToRows = ({
  rows,
  unplannedDowntimes,
  shiftStartUtc,
  shiftEndUtc,
}) => {
  const shiftStartHHMM = toIstHHMM(new Date(shiftStartUtc));
  const shiftEndHHMM = toIstHHMM(new Date(shiftEndUtc));
  console.log(unplannedDowntimes,rows)
  const shiftStartMin = toMin(shiftStartHHMM);
  const shiftEndMin = toMin(shiftEndHHMM);
  const shiftCrossesMidnight = shiftEndMin < shiftStartMin;

  let out = Array.isArray(rows) ? [...rows] : [];

  const pad2 = (n) => String(n).padStart(2, "0");

  // ✅ format normalized minutes (can be > 1440) into "HH:MM"
  const normMinToHHMM = (m) => {
    const mm = ((Number(m) % 1440) + 1440) % 1440;
    const h = Math.floor(mm / 60);
    const min = mm % 60;
    return `${pad2(h)}:${pad2(min)}`;
  };

  for (const dt of unplannedDowntimes || []) {
    if (!dt?.startTime || !dt?.endTime) continue;
    const stHHMM = toIstHHMM(dt.startTime);
    const etHHMM = toIstHHMM(dt.endTime);

    let dtStartMin = normalizeMinForShift(
      toMin(stHHMM),
      shiftStartMin,
      shiftCrossesMidnight
    );
    let dtEndMin = normalizeMinForShift(
      toMin(etHHMM),
      shiftStartMin,
      shiftCrossesMidnight
    );

    // if it still looks like it crosses midnight, push end into next day
    if (dtEndMin <= dtStartMin) dtEndMin += 1440;

    // find all NON planned rows that overlap this downtime span
    const overlappedIdx = [];
    for (let i = 0; i < out.length; i++) {
      const r = out[i];
      const rStart = normalizeMinForShift(
        r._startMin,
        shiftStartMin,
        shiftCrossesMidnight
      );
      let rEnd = normalizeMinForShift(
        r._endMin,
        shiftStartMin,
        shiftCrossesMidnight
      );
      if (rEnd <= rStart) rEnd += 1440;

      const overlaps = dtStartMin < rEnd && dtEndMin > rStart;

      if (overlaps) overlappedIdx.push(i);
    }

    // ✅ if it doesn't hit any row, nothing to attach
    if (overlappedIdx.length === 0) continue;
    // ✅ ALWAYS SPLIT: push per-row segment entries (no merge)
    for (const idx of overlappedIdx) {
      const r = out[idx];
      if (!r || r._isPlanned) continue;
      const rStart = normalizeMinForShift(
        r._startMin,
        shiftStartMin,
        shiftCrossesMidnight
      );
      let rEnd = normalizeMinForShift(
        r._endMin,
        shiftStartMin,
        shiftCrossesMidnight
      );
      if (rEnd <= rStart) rEnd += 1440;

      const segStart = Math.max(dtStartMin, rStart);
      const segEnd = Math.min(dtEndMin, rEnd);
      if (segEnd <= segStart) continue;

      const segStartHHMM = normMinToHHMM(segStart);
      const segEndHHMM = normMinToHHMM(segEnd);
      const segDuration = Math.max(0, Math.round(segEnd - segStart));

      r.downtimeEntries = r.downtimeEntries || [];
      r.downtimeEntries.push({
        id: dt.id, // ✅ same id across split pieces
        startTime: segStartHHMM, // "HH:MM"
        endTime: segEndHHMM,
        duration: segDuration,
        lossCode: "",
        lossReason: "",
        subReason: "",
        reason: dt.reason || "",
        description: dt.description || "",
      });
    }
  }


  return out;
};



const hhmmToMin = (hhmm) => {
  if (!hhmm || !hhmm.includes(":")) return null;
  const [h, m] = hhmm.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return h * 60 + m;
};

const minToHHMM = (mins) => {
  const m = ((mins % 1440) + 1440) % 1440;
  const h = String(Math.floor(m / 60)).padStart(2, "0");
  const mm = String(m % 60).padStart(2, "0");
  return `${h}:${mm}`;
};

const parseTimeSlot = (timeSlot) => {
  // "06:00 - 07:00" or "14:00 - 14:30"
  const [a, b] = String(timeSlot || "").split(" - ").map((s) => s.trim());
  const startMin = hhmmToMin(a);
  const endMin = hhmmToMin(b);
  return { startHHMM: a, endHHMM: b, startMin, endMin };
};

const overlap = (aStart, aEnd, bStart, bEnd) => {
  // intervals: [start, end)
  return aStart < bEnd && bStart < aEnd;
};

const mergeIntervals = (intervals) => {
  const arr = (intervals || [])
    .filter((x) => x && x.startMin != null && x.endMin != null && x.endMin > x.startMin)
    .sort((a, b) => a.startMin - b.startMin);

  const out = [];
  for (const it of arr) {
    if (!out.length) out.push({ ...it });
    else {
      const last = out[out.length - 1];
      if (it.startMin <= last.endMin) last.endMin = Math.max(last.endMin, it.endMin);
      else out.push({ ...it });
    }
  }
  return out;
};


// ✅ extract all downtime ids + their reasons from rows
const extractDowntimeUpdates = (rows) => {
  const updates = []; // { id, reason }
  if (!Array.isArray(rows)) return updates;

  for (const row of rows) {
    const entries = Array.isArray(row?.downtimeEntries) ? row.downtimeEntries : [];
    for (const e of entries) {
      if (e?.id) {
        updates.push({
          id: e.id,
          reason: typeof e.reason === "string" ? e.reason : "",
        });
      }
    }
  }
  return updates;
};


const splitRowByPlannedIntervals = (row, plannedIntervals) => {
  // returns an array of row segments (some planned, some normal)
  const segs = [];
  let cursorStart = row._startMin;
  const rowEnd = row._endMin;

  // collect overlaps and clamp to row
  const overlaps = plannedIntervals
    .filter((p) => overlap(row._startMin, row._endMin, p.startMin, p.endMin))
    .map((p) => ({
      startMin: Math.max(row._startMin, p.startMin),
      endMin: Math.min(row._endMin, p.endMin),
    }));

  const merged = mergeIntervals(overlaps);
  if (!merged.length) return [row];

  for (const p of merged) {
    // normal part before planned
    if (cursorStart < p.startMin) {
      segs.push({
        ...row,
        id: `${row.id}__${cursorStart}-${p.startMin}`,
        timeSlot: `${minToHHMM(cursorStart)} - ${minToHHMM(p.startMin)}`,
        _startMin: cursorStart,
        _endMin: p.startMin,
      });
    }

    // planned part
    segs.push({
      id: `PLANNED__${row.id}__${p.startMin}-${p.endMin}`,
      timeSlot: `${minToHHMM(p.startMin)} - ${minToHHMM(p.endMin)}`,
      targetJPH: null,
      actualJPH: null,
      downtimeEntries: [],
      remarks: "PlannedShutdown",
      _startMin: p.startMin,
      _endMin: p.endMin,
      _isPlanned: true,
    });

    cursorStart = p.endMin;
  }

  // trailing normal part
  if (cursorStart < rowEnd) {
    segs.push({
      ...row,
      id: `${row.id}__${cursorStart}-${rowEnd}`,
      timeSlot: `${minToHHMM(cursorStart)} - ${minToHHMM(rowEnd)}`,
      _startMin: cursorStart,
      _endMin: rowEnd,
    });
  }

  return segs;
};

const applyPlannedShutdownsToRows = (rows, plannedIntervals) => {
  if (!plannedIntervals?.length) return rows;

  // ✅ duration helper that works for midnight-crossing ranges too
  const durMins = (startMin, endMin) => {
    let s = Number(startMin);
    let e = Number(endMin);
    if (!Number.isFinite(s) || !Number.isFinite(e)) return 0;
    if (e <= s) e += 1440;
    return e - s;
  };

  const out = [];
  for (const row of rows) {
    const segs = splitRowByPlannedIntervals(row, plannedIntervals);

    // ✅ scale targetJPH for non-planned segments
    const baseDur = durMins(row._startMin, row._endMin) || 1;
    const baseTarget = Number(row?.targetJPH) || 0;

    for (const seg of segs) {
      if (!seg?._isPlanned) {
        const segDur = durMins(seg._startMin, seg._endMin);
        const frac = segDur / baseDur;

        // If target already exists on row, scale it now
        // (and also keep factor for safety/debug)
        seg._targetScale = frac;
        if (baseTarget) {
          seg.targetJPH = Math.round(baseTarget * frac);
        }
      }
    }

    out.push(...segs);
  }

  // merge adjacent planned segments (if split created back-to-back planned)
  const sorted = out.sort((a, b) => a._startMin - b._startMin);
  const merged = [];
  for (const r of sorted) {
    const last = merged[merged.length - 1];
    if (
      last &&
      last._isPlanned &&
      r._isPlanned &&
      last._endMin === r._startMin
    ) {
      last._endMin = r._endMin;
      last.timeSlot = `${minToHHMM(last._startMin)} - ${minToHHMM(last._endMin)}`;
      continue;
    }
    merged.push(r);
  }

  return merged;
};


const findRowIndexForTime = (rows, hhmm) => {
  const t = hhmmToMin(hhmm);
  if (t == null) return -1;
  return rows.findIndex((r) => t >= r._startMin && t < r._endMin);
};


const computeSlotStartUtcFromShiftIstDate = ({
  shiftStartUtc,
  shiftEndUtc,
  rowStartMin,
}) => {
  const startUtc = new Date(shiftStartUtc);
  const endUtc = new Date(shiftEndUtc);

  // shift start in IST (to derive "day anchor")
  const istStart = new Date(
    startUtc.toLocaleString("en-US", { timeZone: IST_TZ })
  );
  const istEnd = new Date(
    endUtc.toLocaleString("en-US", { timeZone: IST_TZ })
  );

  const istStartMin = istStart.getHours() * 60 + istStart.getMinutes();
  const istEndMin = istEnd.getHours() * 60 + istEnd.getMinutes();
  const crossesMidnight = istEndMin < istStartMin;

  // midnight UTC for the IST date of shiftStart
  const y = istStart.getFullYear();
  const m = istStart.getMonth(); // 0-based
  const d = istStart.getDate();

  const istMidnightUtc = new Date(Date.UTC(y, m, d, 0, 0, 0, 0));

  // convert IST minute-of-day -> UTC by subtracting 330
  let utcMs = istMidnightUtc.getTime() + (rowStartMin - 330) * 60000;

  // if shift crosses midnight and rowStartMin is "before" shiftStartMin, it belongs to next day
  if (crossesMidnight && rowStartMin < istStartMin) {
    utcMs += 24 * 60 * 60000;
  }

  return new Date(utcMs);
};

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
  return Number.isFinite(n) ? n : fallback;
};
const hhmmToMinutes = (hhmm) => {
  if (!hhmm || !hhmm.includes(":")) return null;
  const [h, m] = hhmm.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return h * 60 + m;
};





// ---------- helpers ----------
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

const normalizeShift = (shift) => (shift == null ? "" : String(shift).trim());

// Common include
const reportInclude = {
  line: { select: { lineId: true, lineName: true } },
  user: { select: { id: true, name: true, email: true } },
  plannedShutdowns: true,
};

// ---------- GET by line + date + shift (query) ----------
/**
 * GET /api/downtime-report?lineId=...&date=YYYY-MM-DD&shift=Current
 */

const isTodayIst = (dateYmd) => {
  const today = toIstYmd(new Date());
  return String(dateYmd) === String(today);
};

// Fix: your code was comparing the whole object to string.
// This returns the Influx LINE key: Front_Line / RB / RC
const mapLineIdToInfluxLineKey = async (lineId) => {
  const lineRow = await prismaClient.line.findFirst({
    where: { lineId },
    select: { lineName: true },
  });

  const nm = lineRow?.lineName?.trim();

  if (nm === "Front Line") return "Front_Line";
  if (nm === "Rear Back") return "RB";
  // assuming "Rear Cushion"
  return "RC";
};

/**
 * Build LIVE rows from Influx HRP + planned shutdown overlay + unplanned downtimes.
 * This mirrors your getJPHReportRows logic but returns ONLY rows.
 */
const buildLiveRowsForShift = async ({ shift, dateYmd, lineId }) => {
  const selectedDate = new Date(dateYmd);
  if (Number.isNaN(selectedDate.getTime())) {
    throw new Error("Invalid date. Use YYYY-MM-DD");
  }

  const { startTime, endTime } = getShiftTiming(shift, selectedDate);
  if (!startTime || !endTime) {
    throw new Error("Start time or end time is undefined for this shift/date");
  }
  let bucket = `SHIFT_${shift}`;
  if (shift === "r") bucket = "TODAY";

  const influxLineKey = await mapLineIdToInfluxLineKey(lineId);
  const line=await prismaClient.line.findUnique({
    where:{lineId}
  })


  // ✅ Build slots ONLY within shift window
  const { slots } = buildSlotsForShiftWindow({
    shiftStartUtc: startTime,
    shiftEndUtc: endTime,
  });
  

  // ✅ Pull total_production_set series once
  const series = await queryTotalProductionSeries({
    bucket,
    startTime,
    endTime,
    influxLineKey,
  });

  // ✅ Create base rows from slots using delta(counter)
  let rows = slots.map((s) => {
    const slotStartUtc = computeSlotStartUtcFromShiftIstDate({
      shiftStartUtc: startTime,
      shiftEndUtc: endTime,
      rowStartMin: s._startMin,
    });


    const slotEndUtc = computeSlotStartUtcFromShiftIstDate({
      shiftStartUtc: startTime,
      shiftEndUtc: endTime,
      rowStartMin: s._endMin,
    });

    let startVal = valueAtOrBefore(series, new Date(slotStartUtc).getTime());
    let endVal = valueAtOrBefore(series, new Date(slotEndUtc).getTime());
    if(endVal<startVal){
	    startVal=0;
    }
    // If counter resets (end < start), clamp to 0 (safe default)
    const produced = Math.max(0, (Number(endVal) || 0) - (Number(startVal) || 0));
    return {
      id: s.id,
      timeSlot: s.timeSlot,
      targetJPH: line?.targetJPH || 0,
      actualJPH: produced,
      downtimeEntries: [],
      remarks: "",
      _startMin: s._startMin,
      _endMin: s._endMin,
      _sortNorm: s._sortNorm,
    };
  });

  // keep sorting stable for cross-midnight shifts
  rows = rows.sort((a, b) => (a._sortNorm ?? a._startMin) - (b._sortNorm ?? b._startMin));
  // planned shutdowns (overlap-safe)
  const plannedShutdowns = await prismaClient.plannedShutdown.findMany({
    where: {
      lines: { some: { lineId } },
      type: "PlannedShutdown",
      AND: [{ startTime: { lt: new Date(endTime) } }, { endTime: { gt: new Date(startTime) } }],
    },
  });

  const plannedIntervals = mergeIntervals(
    plannedShutdowns
      .map((ps) => {
        const st = toIstHHMM(ps.startTime);
        const et = toIstHHMM(ps.endTime);
        const startMin = hhmmToMin(st);
        const endMin = hhmmToMin(et);
        if (startMin == null || endMin == null) return null;
        return { startMin, endMin };
      })
      .filter(Boolean)
  );

  // unplanned downtimes from DB (latest)
	//
	//
  const priorJph = await prismaClient.targetJPHUpdateHistory.findFirst({
    where: {
      lineId,
      updatedAt: { lt: new Date(startTime) },
    },
    orderBy: { updatedAt: "desc" },
  });

  const jphWithin = await prismaClient.targetJPHUpdateHistory.findMany({
    where: {
      lineId,
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

  //
  // ✅ Fill targetJPH per row using history (fallback = 100)
  // Skip planned rows (keep as-is)
  //
  rows = rows.map((r) => {
    if (r._isPlanned) return r;

    const slotStartUtc = computeSlotStartUtcFromShiftIstDate({
      shiftStartUtc: startTime,
      shiftEndUtc: endTime,
      rowStartMin: r._startMin,
    });
	  const baseTarget = resolveTargetJphAt(jphHistoryAsc, slotStartUtc, 100);

// ✅ half target if this slot is 30 minutes long (uses start + end)
const slotDurationMin = (() => {
  let s = Number(r._startMin);
  let e = Number(r._endMin);
  if (!Number.isFinite(s) || !Number.isFinite(e)) return 0;
  if (e <= s) e += 1440; // midnight-safe
  return e - s;
})();

const isHalfHourSlot = slotDurationMin === 30;
const finalTarget = isHalfHourSlot ? Math.round(baseTarget / 2) : baseTarget;


    return {
      ...r,
      targetJPH:finalTarget ,
    };
  });


	rows = applyPlannedShutdownsToRows(rows, plannedIntervals);
  // ✅ unplanned downtimes (overlap-safe, shift-window safe)
  const unplanned = await prismaClient.plannedShutdown.findMany({
    where: {
      lines: { some: { lineId } },
      type: "UnplannedDowntime",
      AND: [
        { startTime: { lt: new Date(endTime) } },
        { endTime: { gt: new Date(startTime) } },
      ],
    },
    select: {
      id: true,
      startTime: true,
      endTime: true,
      reason: true,
      description: true,
      type: true,
      createdAt: true,
      createdBy: true,
    },
  });

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


  // ✅ APPLY: if downtime spans multiple hour blocks -> merge rows into one
  rows = applyUnplannedDowntimeSpansToRows({
    rows,
    unplannedDowntimes: UnplannedDowntimes,
    shiftStartUtc: startTime,
    shiftEndUtc: endTime,
  });


  // attach to the correct row (by start time)

  // cleanup + sno
 rows = rows
  .sort((a, b) => (a._sortNorm ?? a._startMin) - (b._sortNorm ?? b._startMin))
    .map(({ _start, _startMin, _endMin, _isPlanned, ...rest }, idx) => ({
      ...rest,
      sno: idx + 1,
    }));

  return { rows, meta: { shift, date: dateYmd, line: lineId, bucket, startTime, endTime } };
};

const getDowntimeReportByLineDateShift = async (req, res) => {
  try {
    const { lineId, date, shift } = req.query;

    if (!lineId || !date || !shift) {
      return res.status(400).json({
        success: false,
        message: "lineId, date (YYYY-MM-DD) and shift are required in query",
      });
    }
        const org=await prismaClient.organization.findFirst({
      where:{
        id:"7386a755-3aca-433c-a6a0-b178f7c80152"
      },include:{
        shifts:{
          include:{
            plannedBreaks:true
          }
        }
      }
    })
    const reportDate = parseReportDate(date);
    const shiftVal = normalizeShift(shift);

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

    if (!doc) {
      return res.status(200).json({ success: true, data: null });
    }

    const storedRows = Array.isArray(doc.rows) ? doc.rows : [];

    // ✅ LIVE refresh rules:
    // - if submitted early (isSubmitted true) -> still return latest
    // - if date is today IST -> always return latest
    const needLive =
      Boolean(doc.isSubmitted) || isTodayIst(String(date));

    let mergedRows = storedRows;

    if (needLive) {
      // Build fresh rows from Influx + planned/unplanned
      const { rows: liveRows } = await buildLiveRowsForShift({
        shift: shiftVal,
        dateYmd: String(date),
        lineId,
      });

      // Merge strategy:
      // - Use LIVE structure (latest actualJPH + planned shutdown split)
      // - Preserve stored remarks if present
      // - Combine downtime IDs from stored + live (union)
      const storedByTimeSlot = new Map();
      for (const r of storedRows) {
        storedByTimeSlot.set(r?.timeSlot, r);
      }

mergedRows = liveRows.map((lr) => {
  const sr = storedByTimeSlot.get(lr.timeSlot);

  const liveEntries = Array.isArray(lr.downtimeEntries) ? lr.downtimeEntries : [];
  const liveKeys = new Set(liveEntries.map(e => `${e.id}-${e.startTime}-${e.endTime}`));

  const storedIds = new Set(
    (Array.isArray(sr?.downtimeEntries) ? sr.downtimeEntries : [])
      .map(e => e?.id).filter(Boolean)
  );

  // keep live split segments, and only append missing ids as placeholders
  const extras = [...storedIds]
    .filter(id => !liveEntries.some(e => e.id === id))
    .map(id => ({ id, _fromStored: true }));

  return {
    ...lr,
    remarks: (sr?.remarks ?? lr?.remarks ?? ""),
    targetJPH: lr.targetJPH ?? sr?.targetJPH ?? 0,
    downtimeEntries: [...liveEntries, ...extras],
  };
});

    // ✅ collect downtime ids from merged rows
    const downtimeIds = [];
    for (const r of mergedRows) {
      const entries = Array.isArray(r?.downtimeEntries) ? r.downtimeEntries : [];
      for (const e of entries) {
        const id = e?.id;
        if (id) downtimeIds.push(id);
      }
    }

    const uniqueIds = [...new Set(downtimeIds)];

    // ✅ fetch PlannedShutdown rows for these ids and convert to IST HH:mm
    let shutdownMap = {};
    if (uniqueIds.length > 0) {
      const shutdowns = await prismaClient.plannedShutdown.findMany({
        where: { id: { in: uniqueIds } },
        select: {
          id: true,
          type: true,
          startTime: true,
          endTime: true,
          reason: true,
          description: true,
          createdAt: true,
          createdBy: true,
        },
      });

      shutdownMap = shutdowns.reduce((acc, s) => {
        const st = s?.startTime ? toIstHHMM(s.startTime) : "";
        const et = s?.endTime ? toIstHHMM(s.endTime) : "";

        const dur =
          s?.startTime && s?.endTime
            ? Math.max(0, Math.round((new Date(s.endTime) - new Date(s.startTime)) / 60000))
            : null;

        acc[s.id] = {
          ...s,
          startTime: st,
          endTime: et,
          duration: dur,
        };
        return acc;
      }, {});
    }

    // ✅ expand downtimeEntries: [{id}] -> [{...plannedShutdown}]
const expandedRows = mergedRows.map((r) => {
  const entries = Array.isArray(r?.downtimeEntries) ? r.downtimeEntries : [];
  const expandedEntries = entries.map((e) => {
    if (e.startTime && e.endTime) return e;           // ✅ keep split segment
    return shutdownMap[e.id] || { id: e.id, missing: true };
  }).sort((a, b) => hhmmToMin(a?.startTime) - hhmmToMin(b?.startTime));
  return { ...r, downtimeEntries: expandedEntries };
});

    return res.status(200).json({
      success: true,
      data: {
        ...doc,
	      org,
        rows: expandedRows,
      },
    });
  }} catch (err) {
    console.error("getDowntimeReportByLineDateShift:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err?.message || String(err),
    });
  }
};

// ---------- CREATE ----------
/**
 * POST /api/downtime-report
 * body:
 * {
 *   lineId, shift, reportDate:"YYYY-MM-DD" | ISO,
 *   rows: <json>,
 *   createdBy?: userId,
 *   isSubmitted?: boolean,
 *   plannedShutdownIds?: string[]
 * }
 */

const sanitizeRowsToOnlyDowntimeIds = (rows) => {
  if (!Array.isArray(rows)) return rows;

  return rows.map((r) => {
    const entries = Array.isArray(r?.downtimeEntries) ? r.downtimeEntries : [];
    return {
      id: r?.id,
      sno: r?.sno,
      timeSlot: r?.timeSlot,
      targetJPH: r?.targetJPH,
      actualJPH: r?.actualJPH,
      remarks: r?.remarks ?? "",
      // ✅ store ONLY downtime ids
      downtimeEntries: entries
        .filter((e) => !!e?.id)
        .map((e) => ({ id: e.id })),
    };
  });
};

const createDowntimeReport = async (req, res) => {
  try {
    const {
      lineId,
      shift,
      reportDate,
      rows,
      createdBy = null,
      isSubmitted = false,
      plannedShutdownIds = [],
    } = req.body || {};


    if (!lineId || !shift || !reportDate) {
      return res.status(400).json({
        success: false,
        message: "lineId, shift, reportDate are required",
      });
    }

    const dateVal = parseReportDate(reportDate);
    const shiftVal = normalizeShift(shift);

    if (!dateVal) {
      return res.status(400).json({ success: false, message: "Invalid reportDate" });
    }

    // Optional: block duplicates early (gives cleaner 409 than Prisma error)
    const exists = await prismaClient.downtimeReport.findUnique({
      where: {
        lineId_reportDate_shift: { lineId, reportDate: dateVal, shift: shiftVal },
      },
      select: { id: true },
    });

    if (exists) {
      return res.status(409).json({
        success: false,
        message: "Downtime report already exists for this line/date/shift",
        existingId: exists.id,
      });
    }

    const submitted = Boolean(isSubmitted);

    // ✅ If submitted: update PlannedShutdown reasons (by downtimeEntry.id)
    if (isSubmitted) {
      const updates = extractDowntimeUpdates(rows);

      // Update only when we have a non-empty reason (optional choice)
      // If you want to always write even empty reason, remove the filter.
      const filtered = updates.filter((u) => u.id);

      // Do updates in transaction to keep consistency
      if (filtered.length) {
        await prismaClient.$transaction(
          filtered.map((u) =>
            prismaClient.plannedShutdown.update({
              where: { id: u.id },
              data: { reason: u.reason || "" },
            })
          )
        );
      }
    }

    // ✅ If submitted: store minimized rows (only downtime ids)
    const rowsToStore = submitted ? sanitizeRowsToOnlyDowntimeIds(rows) : (rows ?? {});

    const doc = await prismaClient.downtimeReport.create({
      data: {
        lineId,
        shift: shiftVal,
        reportDate: dateVal,
        isSubmitted: submitted,
        rows: rowsToStore,

        ...(createdBy ? { createdBy } : {}),

        ...(Array.isArray(plannedShutdownIds) && plannedShutdownIds.length > 0
          ? { plannedShutdowns: { connect: plannedShutdownIds.map((id) => ({ id })) } }
          : {}),
      },
      include: reportInclude,
    });

    return res.status(201).json({ success: true, data: doc });
  } catch (err) {
    console.error("createDowntimeReport:", err);

    // Unique constraint violation
    if (err?.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "Downtime report already exists for this line/date/shift",
      });
    }

    // PlannedShutdown update error when id not found
    if (err?.code === "P2025") {
      return res.status(400).json({
        success: false,
        message:
          "One or more downtimeEntry.id were not found in PlannedShutdown (cannot update reason).",
        error: err?.message || String(err),
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err?.message || String(err),
    });
  }
};

// ---------- UPDATE (by id) ----------
/**
 * PUT /api/downtime-report/:id
 * body can update:
 * { rows, isSubmitted, plannedShutdownIds }
 * (you can also allow lineId/shift/reportDate but it may conflict with @@unique)
 */

const updateDowntimeReportById = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows, isSubmitted, plannedShutdownIds } = req.body || {};

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "id param is required" });
    }

    const submittedFlagProvided = isSubmitted !== undefined;
    const submitted = submittedFlagProvided ? Boolean(isSubmitted) : undefined;

    // ✅ If the request is submitting, we require rows to update reasons & sanitize
    // (If you want to allow submit without rows, you can fetch existing rows from DB here.)
    if (submitted === true && rows === undefined) {
      return res.status(400).json({
        success: false,
        message: "rows are required when isSubmitted=true (to update downtime reasons)",
      });
    }

    // ✅ If submitting: update PlannedShutdown reasons (by downtimeEntry.id)
    if (submitted === true) {
      const updates = extractDowntimeUpdates(rows);
      const filtered = updates.filter((u) => u.id);

      if (filtered.length) {
        await prismaClient.$transaction(
          filtered.map((u) =>
            prismaClient.plannedShutdown.update({
              where: { id: u.id },
              data: { reason: u.reason || "No reason yet" },
            })
          )
        );
      }
    }

    // Build update data
    const data = {};

    // ✅ rows update:
    // - if submitting -> sanitize before storing
    // - else -> store as-is (draft)
    if (rows !== undefined) {
      data.rows = submitted === true ? sanitizeRowsToOnlyDowntimeIds(rows) : rows;
    }

    if (submittedFlagProvided) data.isSubmitted = Boolean(isSubmitted);

    // If plannedShutdownIds provided, replace the relation set
    if (Array.isArray(plannedShutdownIds)) {
      data.plannedShutdowns = {
        set: plannedShutdownIds.map((pid) => ({ id: pid })),
      };
    }

    const doc = await prismaClient.downtimeReport.update({
      where: { id },
      data,
      include: reportInclude,
    });

    return res.status(200).json({ success: true, data: doc });
  } catch (err) {
    console.error("updateDowntimeReportById:", err);

    if (err?.code === "P2025") {
      // could be downtimeReport not found OR plannedShutdown id not found during update
      return res.status(404).json({
        success: false,
        message:
          "Downtime report not found OR one of the downtimeEntry ids was not found in PlannedShutdown",
        error: err?.message || String(err),
      });
    }

    if (err?.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "Update would violate unique (lineId + reportDate + shift)",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err?.message || String(err),
    });
  }
};

// ---------- UPDATE (by line + date + shift) ----------
/**
 * PUT /api/downtime-report/by-key?lineId=...&date=YYYY-MM-DD&shift=...
 * body can update:
 * { rows, isSubmitted, plannedShutdownIds }
 */
const updateDowntimeReportByLineDateShift = async (req, res) => {
  try {
    const { lineId, date, shift } = req.query;
    const { rows, isSubmitted, plannedShutdownIds } = req.body || {};

    if (!lineId || !date || !shift) {
      return res.status(400).json({
        success: false,
        message: "lineId, date (YYYY-MM-DD) and shift are required in query",
      });
    }

    const reportDate = parseReportDate(date);
    const shiftVal = normalizeShift(shift);

    if (!reportDate) {
      return res.status(400).json({ success: false, message: "Invalid date format" });
    }

    const data = {};
    if (rows !== undefined) data.rows = rows;
    if (isSubmitted !== undefined) data.isSubmitted = Boolean(isSubmitted);

    if (Array.isArray(plannedShutdownIds)) {
      data.plannedShutdowns = { set: plannedShutdownIds.map((id) => ({ id })) };
    }

    const doc = await prismaClient.downtimeReport.update({
      where: {
        lineId_reportDate_shift: { lineId, reportDate, shift: shiftVal },
      },
      data,
      include: reportInclude,
    });

    return res.status(200).json({ success: true, data: doc });
  } catch (err) {
    console.error("updateDowntimeReportByLineDateShift:", err);

    if (err?.code === "P2025") {
      return res.status(404).json({ success: false, message: "Downtime report not found" });
    }

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err?.message || String(err),
    });
  }
};

const queryApi = influxDB.getQueryApi("BSL Kharkhoda");



const padHHMM = (hhmm) => {
  const [h, m] = String(hhmm).split(":");
  return `${String(h).padStart(2, "0")}:${String(m ?? "00").padStart(2, "0")}`;
};

// helper: add minutes to "HH:mm" and wrap 24h
const addMinutes = (hhmm, minsToAdd) => {
  const [h, m] = hhmm.split(":").map(Number);
  const total = h * 60 + m + minsToAdd;
  const wrapped = ((total % (24 * 60)) + (24 * 60)) % (24 * 60);
  const hh = Math.floor(wrapped / 60);
  const mm = wrapped % 60;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
};

// "HRP14:30" -> { start:"14:30", end:"15:00", timeSlot:"14:30 - 15:00" }
const hrpFieldToSlot = (field) => {
  // field looks like "HRP06:00" / "HRP14:30"
  const raw = String(field).replace("HRP", ""); // "14:30"
  const start = padHHMM(raw);

  // special split
  let end;
  if (start === "14:00") end = "14:30";
  else if (start === "14:30") end = "15:00";
  else end = addMinutes(start, 60);

  return {
    start,
    end,
    timeSlot: `${start} - ${end}`,
  };
};

// sorting similar to your night-handling:
// treat 00:00-05:59 as "after 23:00"
const sortKeyForStart = (startHHMM) => {
  const [h, m] = startHHMM.split(":").map(Number);
  const isNight = h >= 23 || h < 6;
  const adjH = h < 6 ? h + 24 : h; // 00-05 -> 24-29
  return (isNight ? 0 : 1) * 100000 + adjH * 60 + m; 
  // this makes night come first if your shift crosses midnight.
  // If you want normal day order always, tell me and I’ll simplify.
};

const getJPHReportRows = async (req, res) => {
  try {
    const { shift, date, line } = req.params;

    if (!shift || !date || !line) {
      return res.status(400).json({
        success: false,
        message: "shift, date, and line are required",
      });
    }

	          const org=await prismaClient.organization.findFirst({
      where:{
        id:"7386a755-3aca-433c-a6a0-b178f7c80152"
      },include:{
        shifts:{
          include:{
            plannedBreaks:true
          }
        }
      }
    })

    const selectedDate = new Date(date); // best if YYYY-MM-DD
    if (Number.isNaN(selectedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date. Use YYYY-MM-DD",
      });
    }

    const { startTime, endTime } = getShiftTiming(shift, selectedDate);
    if (!startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: "Start time or end time is undefined for this shift/date",
      });
    }

    let bucket = `SHIFT_${shift}`;
    if (shift === "r") bucket = "TODAY";
    let lineName=await prismaClient.line.findFirst({
      where: {
        lineId: line,
      },
    });
    if(lineName?.lineName==="Front Line"){
      lineName="Front_Line";
    }else if(lineName?.lineName==="Rear Back"){
      lineName="RB";
    }else{
      lineName="RC"
    }

        // ✅ Build slots ONLY within shift window
    const { slots } = buildSlotsForShiftWindow({
      shiftStartUtc: startTime,
      shiftEndUtc: endTime,
    });

    // ✅ Pull total_production_set series once
    const series = await queryTotalProductionSeries({
      bucket,
      startTime,
      endTime,
      influxLineKey: lineName, // (you already mapped Front_Line/RB/RC into lineName)
    });

    // ✅ Create base rows from slots using delta(counter)
    let rows = slots.map((s) => {
      const slotStartUtc = computeSlotStartUtcFromShiftIstDate({
        shiftStartUtc: startTime,
        shiftEndUtc: endTime,
        rowStartMin: s._startMin,
      });

      const slotEndUtc = computeSlotStartUtcFromShiftIstDate({
        shiftStartUtc: startTime,
        shiftEndUtc: endTime,
        rowStartMin: s._endMin,
      });

      const startVal = valueAtOrBefore(series, new Date(slotStartUtc).getTime());
      const endVal = valueAtOrBefore(series, new Date(slotEndUtc).getTime());

      const produced = Math.max(0, (Number(endVal) || 0) - (Number(startVal) || 0));

      return {
        id: s.id,
        timeSlot: s.timeSlot,
        targetJPH: 0,
        actualJPH: produced,
        downtimeEntries: [],
        remarks: "",
        _startMin: s._startMin,
        _endMin: s._endMin,
        _sortNorm: s._sortNorm,
      };
    });

    rows = rows.sort((a, b) => (a._sortNorm ?? a._startMin) - (b._sortNorm ?? b._startMin));


// ---------- fetch data ----------
const UnplannedDowntimes = await prismaClient.plannedShutdown.findMany({
  where: {
    lines: { some: { lineId: line } },
    type: "UnplannedDowntime",
    createdAt: {
      gte: new Date(startTime),
      lte: new Date(endTime),
    },
  },
});
//
// ✅ JPH history: fetch one record before startTime + all within range
//
const priorJph = await prismaClient.targetJPHUpdateHistory.findFirst({
  where: {
    lineId: line,
    updatedAt: { lt: new Date(startTime) },
  },
  orderBy: { updatedAt: "desc" },
});

const jphWithin = await prismaClient.targetJPHUpdateHistory.findMany({
  where: {
    lineId: line,
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
//
// ✅ planned shutdowns: overlap-safe query
//
const plannedShutdowns = await prismaClient.plannedShutdown.findMany({
  where: {
    lines: { some: { lineId: line } },
    type: "PlannedShutdown",
    // overlap with [startTime, endTime]
    AND: [
      { startTime: { lt: new Date(endTime) } },
      { endTime: { gt: new Date(startTime) } },
    ],
  },
});

//
// ✅ convert plannedShutdowns into IST minute intervals
//
const plannedIntervals = mergeIntervals(
  plannedShutdowns
    .map((ps) => {
      const st = toIstHHMM(ps.startTime);
      const et = toIstHHMM(ps.endTime);
      const startMin = hhmmToMin(st);
      const endMin = hhmmToMin(et);
      if (startMin == null || endMin == null) return null;
      return { startMin, endMin };
    })
    .filter(Boolean)
);

//
// ✅ APPLY planned shutdown: split/delete overlapping and insert PlannedShutdown rows
//

//
// ✅ Fill targetJPH per row using history (reverse-search fallback = 100)
// Skip planned rows (keep blank)
//
//
rows = rows.map((r) => {
  if (r._isPlanned) return r;

  const slotStartUtc = computeSlotStartUtcFromShiftIstDate({
    shiftStartUtc: startTime,
    shiftEndUtc: endTime,
    rowStartMin: r._startMin,
  });
const baseTarget = resolveTargetJphAt(jphHistoryAsc, slotStartUtc, 100);

// ✅ half target if this slot is 30 minutes long (uses start + end)
const slotDurationMin = (() => {
  let s = Number(r._startMin);
  let e = Number(r._endMin);
  if (!Number.isFinite(s) || !Number.isFinite(e)) return 0;
  if (e <= s) e += 1440; // midnight-safe
  return e - s;
})();

const isHalfHourSlot = slotDurationMin === 30;
const finalTarget = isHalfHourSlot ? Math.round(baseTarget / 2) : baseTarget;

  return {
    ...r,
    targetJPH:finalTarget,
  };
});

rows = applyPlannedShutdownsToRows(rows, plannedIntervals);
rows = applyUnplannedDowntimeSpansToRows({
  rows,
  unplannedDowntimes: UnplannedDowntimes,
  shiftStartUtc: startTime,
  shiftEndUtc: endTime,
});


//
// ✅ Now push UnplannedDowntime entries into correct rows
//
for (const dt of UnplannedDowntimes) {
	if (rows.some(r => (r.downtimeEntries || []).some(e => e?.id === dt.id))) {
    continue;
  }
  const stHHMM = toIstHHMM(dt.startTime);
  const etHHMM = toIstHHMM(dt.endTime);

  const rowIndex = findRowIndexForTime(rows, stHHMM);
  if (rowIndex === -1) continue;

  const duration =
    dt.startTime && dt.endTime
      ? Math.max(0, Math.round((new Date(dt.endTime) - new Date(dt.startTime)) / 60000))
      : null;

  rows[rowIndex].downtimeEntries = rows[rowIndex].downtimeEntries || [];
  rows[rowIndex].downtimeEntries.push({
    id: dt.id,
    startTime: stHHMM,
    endTime: etHHMM,
    duration,
    lossCode: "",
    reason: "",
    subReason: "",
    reason: dt.reason || "",
    description: dt.description || "",
  });
}

//
// ✅ Final cleanup: sort + sno, remove internal fields
//
rows = rows
  .sort((a, b) => (a._sortNorm ?? a._startMin) - (b._sortNorm ?? b._startMin))
  .map((r, idx) => {
    const sortedEntries = Array.isArray(r?.downtimeEntries)
      ? [...r.downtimeEntries].sort(
          (a, b) => hhmmToMin(a?.startTime) - hhmmToMin(b?.startTime)
        )
      : [];

    const { _start, _startMin, _endMin, _isPlanned, ...rest } = r || {};
    return {
      ...rest,
      downtimeEntries: sortedEntries,
      sno: idx + 1,
    };
  });
      

//       for (const dt of UnplannedDowntimes) {
//   const stHHMM = toIstHHMM(dt.startTime);
//   const etHHMM = toIstHHMM(dt.endTime);

//   const rowIndex = findRowIndexForTime(rows, stHHMM);
//   if (rowIndex === -1) continue; // outside HRP slots

//   const duration =
//     dt.startTime && dt.endTime
//       ? Math.max(0, Math.round((new Date(dt.endTime) - new Date(dt.startTime)) / 60000))
//       : null;

//   rows[rowIndex].downtimeEntries = rows[rowIndex].downtimeEntries || [];
//   rows[rowIndex].downtimeEntries.push({
//     id: dt.id,
//     startTime: stHHMM,         // ✅ IST HH:mm
//     endTime: etHHMM,           // ✅ IST HH:mm
//     duration,                  // minutes
//     lossCode: "",              // as you wanted
//     lossReason: "",
//     subReason: "",
//     reason: dt.reason || "",   // optional (remove if you don't want)
//     description: dt.description || "", // optional
//   });
// }


    return res.json({
      success: true,
      meta: { shift, date, line, bucket, startTime, endTime ,org},
      rows,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch HRP JPH rows",
      error: e?.message || String(e),
    });
  }
};

module.exports = {
  getDowntimeReportByLineDateShift,
  createDowntimeReport,
  updateDowntimeReportById,
  getJPHReportRows,
  updateDowntimeReportByLineDateShift,
};



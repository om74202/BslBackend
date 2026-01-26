// controllers/productionLossReasons.controller.js
// Assumes you have: const prisma = require("../prismaClient") (or prismaClient)

const { getShiftTiming } = require("../functions/shiftTimings");
const prismaClient = require("../lib/prismaClient");
// ✅ Create
const normalizeShift = (shift) => (shift == null ? "" : String(shift).trim());

const createProductionLossReason = async (req, res) => {
  try {
    const { lossCode, lossReason, lossSubReason } = req.body || {};

    if (!lossCode || !lossReason) {
      return res.status(400).json({
        success: false,
        message: "lossCode and lossReason are required",
      });
    }

    const subReasons = Array.isArray(lossSubReason) ? lossSubReason : [];

    const doc = await prismaClient.productionLossReasons.create({
      data: {
        lossCode: String(lossCode).trim(),
        lossReason: String(lossReason).trim(),
        lossSubReason: subReasons.map((s) => String(s).trim()).filter(Boolean),
      },
    });

    return res.status(201).json({ success: true, data: doc });
  } catch (err) {
    console.error("createProductionLossReason:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err?.message || String(err),
    });
  }
};

// ✅ Update (by id)
const updateProductionLossReason = async (req, res) => {
  try {
    const { id } = req.params;
    const { lossCode, lossReason, lossSubReason } = req.body || {};

    if (!id) {
      return res.status(400).json({ success: false, message: "id is required" });
    }

    const existing = await prismaClient.productionLossReasons.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    const data = {};
    if (lossCode !== undefined) data.lossCode = String(lossCode).trim();
    if (lossReason !== undefined) data.lossReason = String(lossReason).trim();
    if (lossSubReason !== undefined) {
      data.lossSubReason = Array.isArray(lossSubReason)
        ? lossSubReason.map((s) => String(s).trim()).filter(Boolean)
        : [];
    }

    const updated = await prismaClient.productionLossReasons.update({
      where: { id },
      data,
    });

    return res.status(200).json({ success: true, data: updated });
  } catch (err) {
    console.error("updateProductionLossReason:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err?.message || String(err),
    });
  }
};

// ✅ Get All (optional search / sort)
const getAllProductionLossReasons = async (req, res) => {
  try {
    const { q } = req.query; // optional search string

    const where = q
      ? {
          OR: [
            { lossCode: { contains: String(q), mode: "insensitive" } },
            { lossReason: { contains: String(q), mode: "insensitive" } },
          ],
        }
      : {};

    const list = await prismaClient.productionLossReasons.findMany({
      where,
      orderBy: [{ lossCode: "asc" }, { lossReason: "asc" }],
    });

    return res.status(200).json({
      success: true,
      count: list.length,
      data: list,
    });
  } catch (err) {
    console.error("getAllProductionLossReasons:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err?.message || String(err),
    });
  }
};

// ✅ Delete (by id)
const deleteProductionLossReason = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ success: false, message: "id is required" });
    }

    const existing = await prismaClient.productionLossReasons.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    await prismaClient.productionLossReasons.delete({ where: { id } });

    return res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    console.error("deleteProductionLossReason:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err?.message || String(err),
    });
  }
};
const parseYMD = (ymd) => {
  if (!ymd) return null;
  const d = new Date(`${ymd}T00:00:00.000Z`);
  return Number.isNaN(d.getTime()) ? null : d;
};
const fmtMin = (mins) => `${mins} min`;


const getLossReasonCounts = async (req, res) => {
  try {
    const { lineName, shift, date } = req.query;
    console.log(lineName, shift, date);

    if (!lineName || !shift || !date) {
      return res.status(400).json({
        success: false,
        message: "lineName, shift, date(YYYY-MM-DD) are required",
      });
    }

    const line = await prismaClient.line.findFirst({ where: { lineName } });
    const lineId = line?.lineId;

    if (!lineId) {
      return res.status(404).json({
        success: false,
        message: `Line not found for lineName="${lineName}"`,
      });
    }

    // date should be YYYY-MM-DD
    const selectedDate = parseYMD(date);
    if (!selectedDate) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format. Expected YYYY-MM-DD",
      });
    }

    const shiftVal = normalizeShift ? normalizeShift(shift) : shift;

    const { startTime, endTime } = getShiftTiming(shiftVal, selectedDate);
    if (!startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: "Invalid shift. Unable to compute startTime/endTime",
      });
    }

    // ---------------------------
    // 1) Fetch the downtime report for remarks (optional)
    // ---------------------------
    let remarkByDowntimeId = {}; // { [downtimeId]: "remark text" }
    try {
      // If you already have parseReportDate in your project, use it instead of parseYMD
      const reportDate = selectedDate;

      const report = await prismaClient.downtimeReport.findUnique({
		        where: {
				    lineId_reportDate_shift: {
      lineId,
      reportDate: new Date(reportDate), // must be Date object
      shift: shiftVal,
    },
        },
        select: { id: true, rows: true },
      });
	    console.log(report)

      const rows = Array.isArray(report?.rows) ? report.rows : [];

      // Build downtimeId -> row.remarks mapping
      const map = {};
      for (const r of rows) {
        const remark = (r?.remarks ?? "").trim();
        const entries = Array.isArray(r?.downtimeEntries) ? r.downtimeEntries : [];

        for (const e of entries) {
          // entries may be: {id:"..."} OR "..." OR full object
          const id =
            typeof e === "string"
              ? e
              : (e?.id ? String(e.id) : "");

          if (!id) continue;

          // Prefer non-empty remark; keep first non-empty if multiple
          if (remark) {
            if (!map[id]) map[id] = remark;
          } else {
            // keep empty only if nothing exists yet
            if (map[id] === undefined) map[id] = "";
          }
        }
      }
      remarkByDowntimeId = map;
    } catch (e) {
      // If report not found or any error, we just keep remarks empty
      console.log("Remark mapping skipped:", e?.message || e);
    }

    // ---------------------------
    // 2) Fetch UnplannedDowntime rows for this shift time window
    // ---------------------------
    const downtimes = await prismaClient.plannedShutdown.findMany({
      where: {
        type: "UnplannedDowntime",
        lines: { some: { lineId } },
        createdAt: {
          gte: new Date(startTime),
          lte: new Date(endTime),
        },
      },
      select: {
        id: true,
        reason: true,
        description: true,
        startTime: true,
        endTime: true,
        createdAt: true,
      },
      orderBy: { createdAt: "asc" },
    });

    // helpers
    const fmtMin = (m) => `${m} min`;

    // ---------------------------
    // 3) Group by reason
    // ---------------------------
    const grouped = new Map(); // reason -> {reason,count,occurrences[]}

    const addToBucket = (key, occ) => {
      if (!grouped.has(key)) grouped.set(key, { reason: key, count: 0, occurrences: [] });
      const bucket = grouped.get(key);
      bucket.count += 1;
      if (occ) bucket.occurrences.push(occ);
    };

    for (const dt of downtimes) {
      const reasonRaw = (dt.reason || "").trim();
      const reasonKey = reasonRaw ? reasonRaw : "Others";

      // duration
      let durationMins = null;
      if (dt.startTime && dt.endTime) {
        const ms = new Date(dt.endTime) - new Date(dt.startTime);
        if (!Number.isNaN(ms)) durationMins = Math.max(0, Math.round(ms / 60000));
      }
      if (durationMins == null && dt.description) {
        const m = String(dt.description).match(/duration\s*=\s*(\d+)\s*min/i);
        if (m?.[1]) durationMins = Number(m[1]);
      }

      // ✅ remark from downtime report row (if exists)
      const remark = remarkByDowntimeId?.[dt.id] ?? "";

      addToBucket(reasonKey, {
        duration: durationMins != null ? fmtMin(durationMins) : "NA",
        remark,
      });
    }

    // ---------------------------
    // 4) Convert to array + sort
    // ---------------------------
    const arr = Array.from(grouped.values()).sort((a, b) => {
      if (a.reason === "Others") return 1;
      if (b.reason === "Others") return -1;
      return b.count - a.count;
    });

    return res.status(200).json({
      success: true,
      data: arr,
      meta: {
        lineId,
        lineName,
        shift: shiftVal,
        date,
        startTime,
        endTime,
        totalDowntimes: downtimes.length,
      },
    });
  } catch (err) {
    console.error("getLossReasonCounts:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err?.message || String(err),
    });
  }
};



const parseDateOrRangeUnderscore = (raw) => {
  const str = String(raw || "").trim();
  const parts = str.split("_").map((x) => x.trim()).filter(Boolean);

  if (parts.length === 1) {
    const one = parts[0];
    return { startYmd: one, endYmd: one };
  }

  if (parts.length >= 2) {
    let a = parts[0];
    let b = parts[1];
    if (!a || !b) return { startYmd: null, endYmd: null };
    if (a > b) [a, b] = [b, a];
    return { startYmd: a, endYmd: b };
  }

  return { startYmd: null, endYmd: null };
};
const computeCumPercent = (countsArr) => {
  const sorted = [...countsArr].sort((a, b) => b.count - a.count);
  const total = sorted.reduce((s, x) => s + x.count, 0) || 1;

  let cum = 0;
  return sorted.map((x) => {
    cum += x.count;
    return {
      reason: x.reason,
      count: x.count,
      cumPercent: (cum / total) * 100,
    };
  });
};

const SHIFT_WINDOWS = {
  A: { start: "06:00", end: "14:30" },
  B: { start: "14:30", end: "23:00" },
  C: { start: "23:00", end: "06:00" }, // crosses midnight
};
const buildWindowsUtc = ({ startYmd, endYmd, shiftKey }) => {
  const days = eachYmdInclusive(startYmd, endYmd);
  const windows = [];
  console.log(shiftKey)
  for (const ymd of days) {
    if (shiftKey === "r") {
      // full IST day
      const st = istDateTimeToUtcDate(ymd, "00:00");
      const en = istDateTimeToUtcDate(addDaysYmd(ymd, 1), "00:00");
      windows.push({ startUtc: st, endUtc: en });
      continue;
    }

    const w = SHIFT_WINDOWS[shiftKey] || SHIFT_WINDOWS.A;
    const startUtc = istDateTimeToUtcDate(ymd, w.start);

    const endYmdForShift = shiftKey === "C" ? addDaysYmd(ymd, 1) : ymd;
    const endUtc = istDateTimeToUtcDate(endYmdForShift, w.end);

    windows.push({ startUtc, endUtc });
  }

  return windows;
};




const IST_OFFSET = "+05:30";
const pad2 = (n) => String(n).padStart(2, "0");
const eachYmdInclusive = (startYmd, endYmd) => {
  const out = [];
  const [sy, sm, sd] = startYmd.split("-").map(Number);
  const [ey, em, ed] = endYmd.split("-").map(Number);

  let cur = new Date(Date.UTC(sy, sm - 1, sd, 0, 0, 0));
  const end = new Date(Date.UTC(ey, em - 1, ed, 0, 0, 0));

  while (cur.getTime() <= end.getTime()) {
    out.push(
      `${cur.getUTCFullYear()}-${pad2(cur.getUTCMonth() + 1)}-${pad2(cur.getUTCDate())}`
    );
    cur.setUTCDate(cur.getUTCDate() + 1);
  }
  return out;
};

const addDaysYmd = (ymd, days) => {
  const [y, m, d] = ymd.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d, 0, 0, 0));
  dt.setUTCDate(dt.getUTCDate() + days);
  return `${dt.getUTCFullYear()}-${pad2(dt.getUTCMonth() + 1)}-${pad2(dt.getUTCDate())}`;
};

const istDateTimeToUtcDate = (ymd, hhmm) => {
  const [hh, mm] = String(hhmm).split(":").map(Number);
  return new Date(`${ymd}T${pad2(hh)}:${pad2(mm)}:00${IST_OFFSET}`);
};
const getLossParetoSingleLine = async (req, res) => {
  try {
    const { lineName, shift, date } = req.query;

    if (!lineName || !shift || !date) {
      return res.status(400).json({
        success: false,
        message: "lineName, shift, date (YYYY-MM-DD or YYYY-MM-DD_YYYY-MM-DD) are required",
      });
    }

    const line = await prismaClient.line.findFirst({
      where: { lineName: String(lineName).trim() },
      select: { lineId: true, lineName: true },
    });

    if (!line?.lineId) {
      return res.status(404).json({
        success: false,
        message: `Line not found for lineName="${lineName}"`,
      });
    }

    const { startYmd, endYmd } = parseDateOrRangeUnderscore(date);
    if (!startYmd || !endYmd) {
      return res.status(400).json({
        success: false,
        message: "Invalid date. Use YYYY-MM-DD or YYYY-MM-DD_YYYY-MM-DD",
      });
    }

    const windows = buildWindowsUtc({ startYmd, endYmd, shiftKey: shift });

    const seenIds = new Set();

    // ✅ instead of count => total duration (minutes) by reason
    const reasonDuration = new Map();

    for (const w of windows) {
      const rows = await prismaClient.plannedShutdown.findMany({
        where: {
          type: "UnplannedDowntime",
          lines: { some: { lineId: line.lineId } },
          AND: [
            { startTime: { lt: w.endUtc } },
            { endTime: { gt: w.startUtc } },
          ],
        },
        // ✅ need startTime/endTime to compute duration
        select: { id: true, reason: true, startTime: true, endTime: true },
        orderBy: { startTime: "asc" },
      });

      for (const dt of rows) {
        if (!dt?.id) continue;

        // keep meta same: unique downtime ids encountered
        seenIds.add(dt.id);

        const reasonRaw = (dt.reason || "").trim();
        const reasonKey = reasonRaw || "Others";

        // ✅ compute overlap duration INSIDE this window
        const st = dt.startTime ? new Date(dt.startTime) : null;
        const et = dt.endTime ? new Date(dt.endTime) : null;
        if (!st || !et || Number.isNaN(st.getTime()) || Number.isNaN(et.getTime())) continue;

        const overlapMs = Math.min(et.getTime(), w.endUtc.getTime()) - Math.max(st.getTime(), w.startUtc.getTime());
        const overlapMins = Math.max(0, Math.round(overlapMs / 60000));

        if (overlapMins <= 0) continue;

        reasonDuration.set(
          reasonKey,
          (reasonDuration.get(reasonKey) || 0) + overlapMins
        );
      }
    }

    // ✅ build array sorted by total duration desc
    // computeCumPercent likely expects "count" => we keep it for the function,
    // then rename "count" to "durationMinutes" in final output (so you don't see "count").
    const durationArrForPareto = Array.from(reasonDuration.entries())
      .map(([reason, durationMinutes]) => ({
        reason,
        count: durationMinutes, // temporary for computeCumPercent
      }))
      .sort((a, b) => (b.count || 0) - (a.count || 0));

    const paretoTemp = computeCumPercent(durationArrForPareto);

    // ✅ rename fields so response doesn't include "count"
    const pareto = (paretoTemp || []).map((x) => {
      const { count, cumCount, ...rest } = x || {};
      return {
        ...rest,
        durationMinutes: count ?? 0,
        ...(cumCount !== undefined ? { cumDurationMinutes: cumCount } : {}),
      };
    });

    return res.status(200).json({
      success: true,
      data: pareto, // ✅ now duration-based pareto
      meta: {
        lineId: line.lineId,
        lineName: line.lineName,
        shift: shift,
        date,
        startYmd,
        endYmd,
        totalDowntimes: seenIds.size,
//        windows: windows.map((w) => ({
  //        startUtc: w.startUtc.toISOString(),
    //      endUtc: w.endUtc.toISOString(),
      //  })),
      },
    });
  } catch (err) {
    console.error("getLossParetoSingleLine:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err?.message || String(err),
    });
  }
};


module.exports = {
  createProductionLossReason,
  updateProductionLossReason,
  getLossReasonCounts,
	  getLossParetoSingleLine,
  getAllProductionLossReasons,
  deleteProductionLossReason,
};


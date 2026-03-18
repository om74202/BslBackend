// controllers/plannedShutdown.controller.js
// Assumes:
// - You have prismaClient exported somewhere
// - req.user.id (or req.user._id) contains logged-in user id (String)
// - Postgres + Prisma

// import prismaClient from "../prisma/prismaClient.js"; // <-- adjust your path
// or: const { prismaClient } = require("../prismaClient");

const prismaClient = require("../lib/prismaClient");
const { getMqttClient, publishMessage } = require("../functions/mqtt");
const { getShiftTiming } = require("../functions/shiftTimings");

// controllers/plannedShutdown.controller.js
// Assumes:
// - prismaClient is available/imported
// - req.user.id (or req.user._id) is logged-in user id (String)
// - Schema has: type, startTime, endTime (NO isFullDay)
// - "Holiday" means whole days OFF from startTime to endTime (inclusive days concept is handled in your business logic)
// - "PlannedShutdown" can be partial across same day or multiple days

const getUserId = (req) => req.user?.id || req.user?._id;

const parseDate = (v) => {
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
};

const validatePayload = ({ type, startTime, endTime }) => {
  if (!type || !["Holiday", "PlannedShutdown","UnplannedDowntime"].includes(type)) {
    return { ok: false, message: "type must be Holiday or PlannedShutdown" };
  }
  if (!startTime || !endTime) {
    return { ok: false, message: "startTime and endTime are required" };
  }


  // if (startTime.getTime() >= endTime.getTime()) {
  //   return { ok: false, message: "startTime must be earlier than endTime" };
  // }

  return { ok: true };
};

/**
 * POST /planned-shutdowns
 * Body:
 * {
 *   "type": "Holiday" | "PlannedShutdown",
 *   "startTime": "2025-12-19T00:00:00.000Z",
 *   "endTime": "2025-12-21T23:59:59.000Z",
 *   "stopEmail": true/false (optional; stored in history row)
 * }
 */
// Add these helpers somewhere near the top (or inline them)
const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0); // local server timezone
  return d;
};

const formatWithOffset = (date) => {
  const pad = (val) => String(val).padStart(2, "0");
  const offsetMinutes = -date.getTimezoneOffset();
  const sign = offsetMinutes >= 0 ? "+" : "-";
  const absOffset = Math.abs(offsetMinutes);
  const offsetHours = pad(Math.floor(absOffset / 60));
  const offsetMins = pad(absOffset % 60);

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}${sign}${offsetHours}:${offsetMins}`;
};
const formatDurationRange = (start, end) => {
  if (!start || !end) return null;

  const startDate = new Date(start);
  const endDate = new Date(end);

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return null;
  }

  return `${formatWithOffset(startDate)}-${formatWithOffset(endDate)}`;
};
 
const publishPlannedShutdownCreation = ({ start, end, lineNames, action = "creation", prevStart, prevEnd, prevLineNames }) => {
  try {
    const client = getMqttClient();

    if (!client?.connected) {
      console.warn("[MQTT] not connected; skipped publish to break");
      return;
    }

    const safeLines = (list) => (Array.isArray(list) ? list : []);
    const hasStartAndEnd = (s, e) => s != null && e != null;
    const payload =
      action === "update"
        ? (() => {
            if (!hasStartAndEnd(prevStart, prevEnd) || !hasStartAndEnd(start, end)) return null;
            return {
              action,
              prev: { startTime: prevStart, endTime: prevEnd, lines: safeLines(prevLineNames ?? lineNames) },
              updated: { startTime: start, endTime: end, lines: safeLines(lineNames) },
            };
          })()
        : action === "delete"
        ? (() => {
            const startTime = prevStart ?? start;
            const endTime = prevEnd ?? end;
            if (!hasStartAndEnd(startTime, endTime)) return null;
            return {
              action,
              prev: { startTime, endTime, lines: safeLines(prevLineNames ?? lineNames) },
            };
          })()
        : (() => {
            if (!hasStartAndEnd(start, end)) return null;
            return { startTime: start, endTime: end, lines: safeLines(lineNames), action };
          })();

    if (!payload) {
      console.warn("[MQTT] skipped publish to break; invalid duration");
      return;
    }

    client.publish("break", JSON.stringify(payload), { qos: 1, retain: false }, (err) => {
      if (err) {
        console.error("[MQTT] publish error (break):", err?.message || err);
      } else {
        console.log("[MQTT] published break");
      }
    });
  } catch (err) {
    console.error("publishPlannedShutdownCreation failed:", err?.message || err);
  }
};


const createPlannedShutdown = async (req, res) => {
  try {

    const { type, startTime, endTime,name,description,lineIds, stopEmail,userId } = req.body || {};
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const start = parseDate(startTime)
    const end = parseDate(endTime)

    if (!start || !end) {
      return res.status(400).json({ success: false, message: "Invalid startTime or endTime" });
    }
    

    const check = validatePayload({ type, startTime: start, endTime: end });
    if (!check.ok) return res.status(400).json({ success: false, message: check.message });
    // ✅ Block creating past entries (startTime before today)
    const today = startOfToday();
    if (start.getTime() < today.getTime()) {
      return res.status(400).json({
        success: false,
        message: "Cannot create planned shutdown/holiday in the past",
      });
    }

        const shouldConnectLines = type !== "Holiday";

    if (shouldConnectLines && (!Array.isArray(lineIds) || lineIds.length === 0)) {
      return res.status(400).json({
        success: false,
        message: "lineIds is required when type is not Holiday",
      });
    }

    const doc = await prismaClient.plannedShutdown.create({
      data: {
        type,
        startTime: start,
        name,
        description,
        endTime: end,
        createdBy: userId,
                // ✅ Conditionally connect lines
        ...(shouldConnectLines
          ? {
              lines: {
                connect: lineIds.map((lineId) => ({ lineId })),
              },
            }
          : {
              lines: { connect: [] }, // or omit `lines` entirely
            }),
        updateHistory: {
          create: {
            userId,
            updatedValue:{}
          },
        },
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        updateHistory: {
          orderBy: { updatedAt: "desc" },
          include: { user: { select: { id: true, name: true, email: true } } },
        },
      },
    });

    if (type === "PlannedShutdown") {
      const lines = await prismaClient.line.findMany({
        where: { lineId: { in: lineIds || [] } },
        select: { lineName: true },
      });

      publishPlannedShutdownCreation({
        start,
        end,
        lineNames: lines.map((line) => line.lineName),
      });
    }

    return res.status(201).json({ success: true, data: doc });
  } catch (err) {
    console.error("createPlannedShutdown:", err);
    return res.status(500).json({ success: false, message: "Server error", error: err?.message || String(err) });
  }
};



// =======================
// DELETE (block past)
// =======================
const deletePlannedShutdown = async (req, res) => {
  try {

    const { id } = req.params;

    // ✅ also fetch startTime for the rule
    const existing = await prismaClient.plannedShutdown.findUnique({
      where: { id },
      select: { id: true, type: true, startTime: true, endTime: true, lines: { select: { lineName: true } } },
    });

    if (!existing) {
      return res.status(404).json({ success: false, message: "PlannedShutdown not found" });
    }

    // ✅ Block deleting past entries (startTime before today)
    const today = startOfToday();
    if (existing.startTime && new Date(existing.startTime).getTime() < today.getTime()) {
      return res.status(403).json({
        success: false,
        message: "Cannot delete planned shutdown/holiday that starts in the past",
      });
    }

    // Delete history first (unless you use onDelete: Cascade)
    await prismaClient.plannedShutdownUpdateHistory.deleteMany({
      where: { plannedShutdownId: id },
    });

    await prismaClient.plannedShutdown.delete({ where: { id } });

    if (existing.type === "PlannedShutdown") {
      const lineNames = Array.isArray(existing.lines) ? existing.lines.map((line) => line.lineName) : [];
      publishPlannedShutdownCreation({
        action: "delete",
        prevStart: existing.startTime,
        prevEnd: existing.endTime,
        prevLineNames: lineNames,
      });
    }

    return res.status(200).json({ success: true, message: "PlannedShutdown deleted" });
  } catch (err) {
    console.error("deletePlannedShutdown:", err);
    return res.status(500).json({ success: false, message: "Server error", error: err?.message || String(err) });
  }
};


/**
 * PATCH /planned-shutdowns/:id
 * Body can include:
 * { type?, startTime?, endTime?, stopEmail? }
 *
 * Always appends an updateHistory row.
 */
const updatePlannedShutdown = async (req, res) => {
  try {

    const { id } = req.params;
    const { type, startTime, endTime,name,description, stopEmail,userId } = req.body || {};
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });


    const existing = await prismaClient.plannedShutdown.findUnique({
      where: { id },
      select: { id: true, type: true,name:true,description:true, startTime: true, endTime: true, lines: { select: { lineName: true } } },
    });

    if (!existing) {
      return res.status(404).json({ success: false, message: "PlannedShutdown not found" });
    }

    const nextType = type ?? existing.type;
    if (nextType && !["Holiday", "PlannedShutdown"].includes(nextType)) {
      return res.status(400).json({ success: false, message: "type must be Holiday or PlannedShutdown" });
    }

    const nextStart = startTime !== undefined ? parseDate(startTime) : existing.startTime;
    const nextEnd = endTime !== undefined ? parseDate(endTime) : existing.endTime;

    if (!nextStart || !nextEnd) {
      return res.status(400).json({ success: false, message: "Invalid startTime or endTime" });
    }

    const check = validatePayload({ type: nextType, startTime: nextStart, endTime: nextEnd });
    if (!check.ok) return res.status(400).json({ success: false, message: check.message });

    const lineNames = Array.isArray(existing.lines) ? existing.lines.map((line) => line.lineName) : [];

    const updated = await prismaClient.$transaction(async (tx) => {
      const doc = await tx.plannedShutdown.update({
        where: { id },
        data: {
          type: nextType,
          startTime: nextStart,
          name:name || existing.name,
          description:description || existing.description,
          endTime: nextEnd,
          updateHistory: {
            create: {
              userId,
              updatedValue:{},
            },
          },
        },
        include: {
          user: { select: { id: true, name: true, email: true } }, // adjust
          updateHistory: {
            orderBy: { updatedAt: "desc" },
            include: { user: { select: { id: true, name: true, email: true } } },
          },
        },
      });

      return doc;
    });

    if (existing.type === "PlannedShutdown" || nextType === "PlannedShutdown") {
      publishPlannedShutdownCreation({
        action: "update",
        start: updated.startTime,
        end: updated.endTime,
        lineNames,
        prevStart: existing.startTime,
        prevEnd: existing.endTime,
        prevLineNames: lineNames,
      });
    }

    return res.status(200).json({ success: true, data: updated });
  } catch (err) {
    console.error("updatePlannedShutdown:", err);
    return res.status(500).json({ success: false, message: "Server error", error: err?.message || String(err) });
  }
};


const computeShiftWindow = (shift, selectedDate) => {
  const normalizedShift = String(shift || "").trim().toUpperCase();
  const baseDate = selectedDate ? new Date(selectedDate) : new Date();

  if (Number.isNaN(baseDate.getTime())) {
    throw new Error("Invalid date for shift window");
  }

  const toIST = (date) => new Date(date.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  const baseIST = toIST(baseDate);
  const year = baseIST.getFullYear();
  const month = baseIST.getMonth();
  const day = baseIST.getDate();

  const build = (hour, minute = 0, dayOffset = 0) => new Date(year, month, day + dayOffset, hour, minute);

  const shiftWindows = {
    A: { startTime: build(6, 0), endTime: build(14, 30) },
    B: { startTime: build(14, 30), endTime: build(23, 0) },
    C: { startTime: build(23, 0), endTime: build(6, 0, 1) },
    R: { startTime: build(6, 0), endTime: build(6, 0, 1) },
  };

  const window = shiftWindows[normalizedShift];
  if (!window) {
    throw new Error("Invalid shift. Use A, B, C, or R");
  }

  return window;
};

const getTotalPlannedShutdownMinutes = async (req, res) => {
  try {
    const { shift, date, lineId, line } = req.query;
    const normalizedShift = String(shift || "").trim().toUpperCase();

    if (!normalizedShift) {
      return res.status(400).json({ success: false, message: "shift is required" });
    }
    if (!["A", "B", "C", "R"].includes(normalizedShift)) {
      return res.status(400).json({ success: false, message: "shift must be one of A, B, C, or R" });
    }

    const lineRef = String(lineId || line || "").trim();
    if (!lineRef) {
      return res.status(400).json({ success: false, message: "lineId or line is required" });
    }

    const targetDate = date ? new Date(date) : new Date();
    if (Number.isNaN(targetDate.getTime())) {
      return res.status(400).json({ success: false, message: "Invalid date" });
    }

    const lineRow = await prismaClient.line.findFirst({
      where: {
        OR: [{ lineId: lineRef }, { lineName: lineRef }],
      },
      select: { lineId: true, lineName: true },
    });

    if (!lineRow) {
      return res.status(404).json({ success: false, message: "Line not found" });
    }

    const { startTime: shiftStart, endTime: shiftEnd } = computeShiftWindow(normalizedShift, targetDate);
    const shiftStartMs = shiftStart.getTime();
    const shiftEndMs = shiftEnd.getTime();

    const plannedShutdowns = await prismaClient.plannedShutdown.findMany({
      where: {
        type: "PlannedShutdown",
        lines: { some: { lineId: lineRow.lineId } },
        startTime: { lt: shiftEnd },
        endTime: { gt: shiftStart },
      },
      select: { startTime: true, endTime: true },
    });

    let totalMinutes = 0;
    for (const ps of plannedShutdowns) {
      const psStart = ps.startTime instanceof Date ? ps.startTime.getTime() : new Date(ps.startTime).getTime();
      const psEnd = ps.endTime instanceof Date ? ps.endTime.getTime() : new Date(ps.endTime).getTime();
      const overlapStart = Math.max(shiftStartMs, psStart);
      const overlapEnd = Math.min(shiftEndMs, psEnd);
      if (overlapEnd > overlapStart) {
        totalMinutes += (overlapEnd - overlapStart) / 60000;
      }
    }

    return res.status(200).json({
      success: true,
      data: {
        totalMinutes: Math.round(totalMinutes * 100) / 100,
        shift: normalizedShift,
        shiftStart: shiftStart.toISOString(),
        shiftEnd: shiftEnd.toISOString(),
        lineId: lineRow.lineId,
        lineName: lineRow.lineName,
        entriesCount: plannedShutdowns.length,
      },
    });
  } catch (err) {
    console.error("getTotalPlannedShutdownMinutes:", err);
    return res.status(500).json({ success: false, message: "Server error", error: err?.message || String(err) });
  }
};





// GET /api/planned-shutdown/history?month=2025-12
const getPlannedShutdownUpdateHistory = async (req, res) => {
  try {
    const { month } = req.query;

    // ✅ Determine month range (YYYY-MM). Default = current month
    let startDate;
    let endDate;

    if (month && typeof month === "string") {
      const [yearStr, monthStr] = month.split("-");
      const year = Number(yearStr);
      const m = Number(monthStr); // 1-12

      if (!year || !m || m < 1 || m > 12) {
        return res.status(400).json({
          success: false,
          message: "Invalid month format. Use YYYY-MM (e.g. 2025-12)",
        });
      }

      startDate = new Date(year, m - 1, 1);
      endDate = new Date(year, m, 1); // next month start
    } else {
      const now = new Date();
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    }

    // ✅ Fetch update history ONLY for plannedShutdowns where type === "PlannedShutdown"
    const history = await prismaClient.plannedShutdownUpdateHistory.findMany({
      where: {
        updatedAt: {
          gte: startDate,
          lt: endDate,
        },
        plannedShutdown: {
          type: "PlannedShutdown", // ✅ only this type
        },
      },
      orderBy: {
        updatedAt: "asc", // ✅ ascending
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        plannedShutdown: {
          select: {
            id: true,
            type: true,
            name: true,
            startTime: true,
            endTime: true,
            createdAt: true,
            lines: {
              select: { lineId: true, lineName: true },
            },
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      month: month ?? "current",
      count: history.length,
      data: history,
    });
  } catch (err) {
    console.error("getPlannedShutdownUpdateHistory:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err?.message || String(err),
    });
  }
};


/**
 * GET /planned-shutdowns
 * Optional query params:
 *  - type=Holiday|PlannedShutdown
 */
const getAllPlannedShutdowns = async (req, res) => {
  try {
    const { type } = req.query || {};

    const where = {};
    if (type) {
      if (!["Holiday", "PlannedShutdown","UnplannedDowntime"].includes(type)) {
        return res.status(400).json({ success: false, message: "type must be Holiday or PlannedShutdown or UnplannedDowntime" });
      }
      where.type = type;
    }

    const docs = await prismaClient.plannedShutdown.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, name: true, email: true } }, // adjust
        lines:{select:{lineId:true,lineName:true}},
      },
    });

    return res.status(200).json({ success: true, data: docs });
  } catch (err) {
    console.error("getAllPlannedShutdowns:", err);
    return res.status(500).json({ success: false, message: "Server error", error: err?.message || String(err) });
  }
};



/**
 * GET /planned-shutdowns/:id
 */
const getPlannedShutdownById = async (req, res) => {
  try {
    const { id } = req.params;

    const doc = await prismaClient.plannedShutdown.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true } }, // adjust
        updateHistory: {
          orderBy: { updatedAt: "desc" },
          include: { user: { select: { id: true, name: true, email: true } } },
        },
      },
    });

    if (!doc) {
      return res.status(404).json({ success: false, message: "PlannedShutdown not found" });
    }

    return res.status(200).json({ success: true, data: doc });
  } catch (err) {
    console.error("getPlannedShutdownById:", err);
    return res.status(500).json({ success: false, message: "Server error", error: err?.message || String(err) });
  }
};



/**
 * Save latestDowntime into PlannedShutdown as UnplannedDowntime.
 * - Upserts by: same line + same startTime (same second window)
 * - No updateHistory writes
 */

const lineMap={RB:"Rear Back",RC:"Rear Cushion",Front_Line:"Front Line"}
// helpers/saveLatestDowntime.js

const toDate = (v) => {
  if (!v) return null;
  if (v instanceof Date) return v;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
};

/**
 * Build: { RB: lineId, RC: lineId, Front_Line: lineId } from prisma Line table.
 * If organizationId is provided, it filters by org to avoid mismatches.
 */
async function getLineKeyToLineId({  lineMap}) {
  const lineNames = Array.from(new Set(Object.values(lineMap)));

  const where =  { lineName: { in: lineNames } };

  const lines = await prismaClient.line.findMany({
    where,
    select: { lineId: true, lineName: true ,targetJPH:true},
  });

  // reverse map: "Rear Back" -> "RB"
  const nameToKey = {};
  for (const [k, name] of Object.entries(lineMap)) nameToKey[name] = k;

  const keyToId = {};
  for (const l of lines) {
    const key = nameToKey[l.lineName];
    if (key) keyToId[key] = { lineId: l.lineId , targetJPH:l.targetJPH };
  }

  return keyToId; // { RB: "...uuid", ... }
}

/**
 * Save latestDowntime into PlannedShutdown as UnplannedDowntime.
 * Upsert by: same line + same startTime (1s window).
 * Does NOT write updateHistory.
 */
async function saveLatestDowntime({
  latestDowntime, // { RB:{startTime,endTime,duration}, ... }
}) {
  const reason="No reason alloted"
  if (!latestDowntime || typeof latestDowntime !== "object") {
    return { ok: false, message: "latestDowntime must be an object" };
  }
  const lineKeyToLineId = await getLineKeyToLineId({
    prismaClient,
    lineMap,
  });

  const results = [];
  

  for (const [lineKey, dt] of Object.entries(latestDowntime)) {
    const lineId = lineKeyToLineId[lineKey].lineId;
    const targetJPH=lineKeyToLineId[lineKey].targetJPH;
    const cycleTime=targetJPH? (60/targetJPH) : null
    if(dt.duration<2+cycleTime){
      console.log(`Skipping lineKey="${lineKey}" lineId="${lineId}" targetJPH="${cycleTime}" dt=`, dt);
      continue;
    }
    console.log(`Processing lineKey="${lineKey}" lineId="${lineId}" targetJPH="${cycleTime+2}" dt=`, dt);
    if (!lineId) {
      results.push({
        lineKey,
        ok: false,
        message: `Line not found in DB for "${lineKey}" (${lineMap?.[lineKey]})`,
      });
      continue;
    }

    const start = toDate(dt?.startTime);
    const end = toDate(dt?.endTime);

    if (!start || !end) {
      results.push({ lineKey, ok: false, message: "Invalid startTime/endTime" });
      continue;
    }

    // same-start match (handles ms differences)
    const startPlus1s = new Date(start.getTime() + 1000);

    const existing = await prismaClient.plannedShutdown.findFirst({
      where: {
        type: "UnplannedDowntime",
        startTime: { gte: start, lt: startPlus1s },
        lines: { some: { lineId } },
      },
      orderBy: { createdAt: "desc" },
      select: { id: true },
    });

    if (existing) {
      const updated = await prismaClient.plannedShutdown.update({
        where: { id: existing.id },
        data: {
          endTime: end,
          description:
            dt?.duration != null ? `duration=${dt.duration}min` : undefined,
        },
        include: { lines: true },
      });

      results.push({ lineKey, ok: true, action: "updated", data: updated });
      continue;
    }

    // name is @unique, so make it unique + deterministic
    const uniqueName = `UnplannedDowntime-${lineId}-${start.toISOString()}`;

    const created = await prismaClient.plannedShutdown.create({
      data: {
        name: uniqueName,
        type: "UnplannedDowntime",
        startTime: start,
        endTime: end,
        reason,
        description:
          dt?.duration != null ? `duration=${dt.duration}min` : undefined,
        lines: { connect: [{ lineId }] },
      },
      include: { lines: true },
    });

    results.push({ lineKey, ok: true, action: "created", data: created });
  }
  return { ok: true, results };
}


const parseYMD = (ymd) => {
  if (!ymd) return null;

  const m = String(ymd).trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return null;

  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);

  if (![y, mo, d].every(Number.isFinite)) return null;

  // build as UTC midnight
  const dt = new Date(Date.UTC(y, mo - 1, d, 0, 0, 0, 0));

  // validate (catches 2025-02-30 etc.)
  if (
    dt.getUTCFullYear() !== y ||
    dt.getUTCMonth() !== mo - 1 ||
    dt.getUTCDate() !== d
  ) {
    return null;
  }

  return dt;
};
const clampInterval = (aStart, aEnd, rangeStart, rangeEnd) => {
  const s = Math.max(new Date(aStart).getTime(), rangeStart.getTime());
  const e = Math.min(new Date(aEnd).getTime(), rangeEnd.getTime());
  return s < e ? [s, e] : null;
};

const mergeIntervals = (intervals) => {
  if (!intervals.length) return [];

  intervals.sort((a, b) => a[0] - b[0]);
  const merged = [intervals[0]];

  for (let i = 1; i < intervals.length; i++) {
    const [curStart, curEnd] = intervals[i];
    const last = merged[merged.length - 1];

    if (curStart <= last[1]) {
      last[1] = Math.max(last[1], curEnd);
    } else {
      merged.push([curStart, curEnd]);
    }
  }

  return merged;
};

const sumMinutes = (intervals) =>
  intervals.reduce((sum, [s, e]) => sum + Math.round((e - s) / 60000), 0);

// GET /api/downtime/pie?lineId=...&date=YYYY-MM-DD&shift=A
// (or shift=B/C/r)

const getPlannedVsUnplannedMinutes = async (req, res) => {
  try {
    const { lineName, date, shift } = req.query;

    if (!lineName || !date || !shift) {
      return res.status(400).json({
        success: false,
        message: "lineName, date(YYYY-MM-DD), shift are required",
      });
    }

    const line = await prismaClient.line.findFirst({
      where: { lineName },
      select: { lineId: true, lineName: true },
    });

    if (!line) {
      return res.status(404).json({
        success: false,
        message: "Line not found",
      });
    }

    const selectedDate = parseYMD(date);
    if (!selectedDate) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format. Expected YYYY-MM-DD",
      });
    }

    const { startTime, endTime } = getShiftTiming(shift, selectedDate);

    if (!startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: "Invalid shift/date. Unable to compute startTime/endTime",
      });
    }

    const shiftStart = new Date(startTime);
    const shiftEnd = new Date(endTime);

    const rows = await prismaClient.plannedShutdown.findMany({
      where: {
        lines: { some: { lineId: line.lineId } },
        type: { in: ["PlannedShutdown", "UnplannedDowntime"] },
        AND: [{ startTime: { lt: shiftEnd } }, { endTime: { gt: shiftStart } }],
      },
    });

    const clampInterval = (aStart, aEnd, rangeStart, rangeEnd) => {
      const s = Math.max(new Date(aStart).getTime(), rangeStart.getTime());
      const e = Math.min(new Date(aEnd).getTime(), rangeEnd.getTime());
      return s < e ? [s, e] : null;
    };

    const mergeIntervals = (intervals) => {
      if (!intervals.length) return [];

      intervals.sort((a, b) => a[0] - b[0]);
      const merged = [intervals[0].slice()];

      for (let i = 1; i < intervals.length; i++) {
        const [s, e] = intervals[i];
        const last = merged[merged.length - 1];

        if (s <= last[1]) {
          last[1] = Math.max(last[1], e);
        } else {
          merged.push([s, e]);
        }
      }

      return merged;
    };

    const sumMinutes = (intervals) =>
      intervals.reduce((sum, [s, e]) => sum + Math.round((e - s) / 60000), 0);

    const startOfUtcDay = (d) =>
      new Date(
        Date.UTC(
          d.getUTCFullYear(),
          d.getUTCMonth(),
          d.getUTCDate(),
          0,
          0,
          0,
          0,
        ),
      );

    const endOfUtcDay = (d) =>
      new Date(
        Date.UTC(
          d.getUTCFullYear(),
          d.getUTCMonth(),
          d.getUTCDate(),
          23,
          59,
          59,
          999,
        ),
      );

    const addUtcDays = (d, days) =>
      new Date(
        Date.UTC(
          d.getUTCFullYear(),
          d.getUTCMonth(),
          d.getUTCDate() + days,
          d.getUTCHours(),
          d.getUTCMinutes(),
          d.getUTCSeconds(),
          d.getUTCMilliseconds(),
        ),
      );

    const sameUtcDate = (a, b) =>
      a.getUTCFullYear() === b.getUTCFullYear() &&
      a.getUTCMonth() === b.getUTCMonth() &&
      a.getUTCDate() === b.getUTCDate();

    const buildDateWithUtcTime = (baseDate, sourceTime) =>
      new Date(
        Date.UTC(
          baseDate.getUTCFullYear(),
          baseDate.getUTCMonth(),
          baseDate.getUTCDate(),
          sourceTime.getUTCHours(),
          sourceTime.getUTCMinutes(),
          sourceTime.getUTCSeconds(),
          sourceTime.getUTCMilliseconds(),
        ),
      );

    const splitPlannedShutdownDaily = (rowStart, rowEnd) => {
      const start = new Date(rowStart);
      const end = new Date(rowEnd);

      if (!(start < end)) return [];

      // same day => normal interval
      if (sameUtcDate(start, end)) {
        return [[start.getTime(), end.getTime()]];
      }

      const result = [];
      let cursorDay = startOfUtcDay(start);
      const lastDay = startOfUtcDay(end);

      while (cursorDay <= lastDay) {
        let intervalStart;
        let intervalEnd;

        if (sameUtcDate(cursorDay, start)) {
          intervalStart = start;
        } else {
          intervalStart = buildDateWithUtcTime(cursorDay, start);
        }

        if (sameUtcDate(cursorDay, end)) {
          intervalEnd = end;
        } else {
          intervalEnd = buildDateWithUtcTime(cursorDay, end);
        }

        // overnight daily window case
        if (intervalEnd <= intervalStart) {
          intervalEnd = addUtcDays(intervalEnd, 1);
        }

        result.push([intervalStart.getTime(), intervalEnd.getTime()]);
        cursorDay = addUtcDays(cursorDay, 1);
      }

      return result;
    };

    const plannedIntervals = [];
    const unplannedIntervals = [];

    for (const r of rows) {
      if (r.type === "PlannedShutdown") {
        const splitIntervals = splitPlannedShutdownDaily(
          r.startTime,
          r.endTime,
        );

        for (const [s, e] of splitIntervals) {
          const clamped = clampInterval(
            new Date(s),
            new Date(e),
            shiftStart,
            shiftEnd,
          );
          if (clamped) plannedIntervals.push(clamped);
        }
      }

      if (r.type === "UnplannedDowntime") {
        const clamped = clampInterval(
          r.startTime,
          r.endTime,
          shiftStart,
          shiftEnd,
        );
        if (clamped) unplannedIntervals.push(clamped);
      }
    }

    const mergedPlanned = mergeIntervals(plannedIntervals);
    const mergedUnplanned = mergeIntervals(unplannedIntervals);

    const plannedMinutes = sumMinutes(mergedPlanned);
    const unplannedMinutes = sumMinutes(mergedUnplanned);

    return res.status(200).json({
      success: true,
      meta: {
        lineId: line.lineId,
        shift,
        date,
        startTime,
        endTime,
        plannedMinutes,
        unplannedMinutes,
      },
      data: [
        { name: "Planned Shutdown", value: plannedMinutes },
        { name: "Unplanned Downtime", value: unplannedMinutes },
      ],
    });
  } catch (err) {
    console.error("getPlannedVsUnplannedMinutes:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err?.message || String(err),
    });
  }
};








module.exports = {
  createPlannedShutdown,
  saveLatestDowntime,
  getLineKeyToLineId ,
  deletePlannedShutdown,
  updatePlannedShutdown,
  getAllPlannedShutdowns,
  getPlannedVsUnplannedMinutes,
  getPlannedShutdownUpdateHistory,
  getPlannedShutdownById,
  getTotalPlannedShutdownMinutes,
};


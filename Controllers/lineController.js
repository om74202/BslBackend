// controllers/line.controller.js
// make sure you have prisma imported/initialized somewhere
// const { PrismaClient } = require("@prisma/client");
// const prisma = new PrismaClient();
const { getShiftTiming } = require("../Routes/influxRoutes");

const prismaClient = require("../lib/prismaClient");

const { publishJphSet } = require("../functions/mqtt");

const updateTargetJPH = async (req, res) => {
  try {
     // adjust if your user id key differs
    const { lineId, targetJPH,user } = req.body || {};
    const userId = req.user?.id || req.user?._id || user?.user?.id || user?.id;
    console.log("userId",userId)

    

    if (!lineId || typeof lineId !== "string") {
      return res.status(404).json({
        success: false,
        message: "lineId is required",
      });
    }

    if (targetJPH === undefined || targetJPH === null || Number.isNaN(Number(targetJPH))) {
      return res.status(400).json({
        success: false,
        message: "targetJPH must be provided as a number",
      });
    }

    const nextJPH = Number(targetJPH);

    const existing = await prismaClient.line.findUnique({
      where: { lineId },
      select: {
        lineId: true,
        lineName: true,
        targetJPH: true,
        organizationId: true,
      },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Line not found",
      });
    }

    if (Number(existing.targetJPH) === nextJPH) {
      return res.status(200).json({
        success: true,
        message: "TargetJPH already up to date",
        data: existing,
      });
    }

    const updated = await prismaClient.$transaction(async (tx) => {
      const updatedLine = await tx.line.update({
        where: { lineId },
        data: { targetJPH: nextJPH },
        select: {
          lineId: true,
          lineName: true,
          targetJPH: true,
          organizationId: true,
        },
      });

      await tx.targetJPHUpdateHistory.create({
        data: {
          userId,
          lineId,
          updatedValue:nextJPH
        },
      });

      return updatedLine;
    });

    publishJphSet([{ line: updated.lineName, jph: nextJPH*2 }]);
	  

    return res.status(200).json({
      success: true,
      message: "TargetJPH updated for line",
      data: updated,
    });
  } catch (err) {
    console.error("bulkUpdateTargetJPH:", err);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err?.message || String(err),
    });
  }
};

const getTargetJPHUpdateHistory = async (req, res) => {
  try {
    const { month } = req.query;

    if (month === "All") {
      const history = await prismaClient.targetJPHUpdateHistory.findMany({
        orderBy: {
          updatedAt: "asc",
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
          line: {
            select: {
              lineId: true,
              lineName: true,
            },
          },
        },
      });

      return res.status(200).json({
        month,
        count: history.length,
        data: history,
      });
    }

    // 1️⃣ Determine month range
    let startDate;
    let endDate;

    if (month && typeof month === "string") {
      // Expected format: YYYY-MM
      const [year, monthIndex] = month.split("-").map(Number);

      if (!year || !monthIndex) {
        return res.status(400).json({
          message: "Invalid month format. Use YYYY-MM",
        });
      }

      startDate = new Date(year, monthIndex - 1, 1);
      endDate = new Date(year, monthIndex, 1); // start of next month
    } else {
      // Default → current month
      const now = new Date();
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    }

    // 2️⃣ Fetch history
    const history = await prismaClient.targetJPHUpdateHistory.findMany({
      where: {
        updatedAt: {
          gte: startDate,
          lt: endDate,
        },
      },
      orderBy: {
        updatedAt: "asc",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        line: {
          select: {
            lineId: true,
            lineName: true,
          },
        },
      },
    });

    return res.status(200).json({
      month: month || "current",
      count: history.length,
      data: history,
    });
  } catch (error) {
    console.error("Error fetching JPH update history:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// fallback if you don't want to import parseReportDate
const parseYMD = (ymd) => {
  if (!ymd) return null;
  const [y, m, d] = String(ymd).split("-").map(Number);
  if ([y, m, d].some((n) => Number.isNaN(n))) return null;
  // "local" midnight is risky; better keep consistent with your app
  // If your reportDate is stored at 00:00:00Z, do this:
  return new Date(Date.UTC(y, m - 1, d, 0, 0, 0, 0));
};

const getJphHistoryForShift = async (req, res) => {
  try {
    const { lineId, lineName, date, shift } = req.query;

    if ((!lineId && !lineName) || !date || !shift) {
      return res.status(400).json({
        success: false,
        message: "lineId (or lineName), date (YYYY-MM-DD), shift are required",
      });
    }

    const selectedDate = parseYMD(date);
    if (!selectedDate || Number.isNaN(selectedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format. Expected YYYY-MM-DD",
      });
    }


    // resolve lineId if lineName provided
    let resolvedLineId ="";


    const lineRow = await prismaClient.line.findFirst({
	    where: { lineName:lineName},
      select: { lineId: true, lineName: true, targetJPH: true },
    });
	  resolvedLineId=lineRow.lineId

    if (!lineRow) {
      return res.status(404).json({ success: false, message: "Line not found" });
    }

    // compute shift start/end (UTC ISO strings or Dates — depends on your helper)
    const { startTime, endTime } = getShiftTiming(shift, selectedDate);
    if (!startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: "Unable to compute startTime/endTime for shift/date",
      });
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    // ✅ get one value "active at shift start" (latest before start)
    const prior = await prismaClient.targetJPHUpdateHistory.findFirst({
      where: {
        lineId: resolvedLineId,
        updatedAt: { lt: start },
      },
      orderBy: { updatedAt: "desc" },
      select: { updatedAt: true, updatedValue: true },
    });

    // ✅ all updates within shift
    const within = await prismaClient.targetJPHUpdateHistory.findMany({
      where: {
        lineId: resolvedLineId,
        updatedAt: { gte: start, lte: end },
      },
      orderBy: { updatedAt: "asc" },
      select: { updatedAt: true, updatedValue: true, userId: true },
    });

    // base JPH if nothing exists before: use Line.targetJPH or 100 fallback
    const defaultJph = Number.isFinite(lineRow.targetJPH) ? lineRow.targetJPH : 100;

    // ✅ return timeline points: time + value
    // include a "start marker" so frontend can draw step chart correctly
    const timeline = [];

    const initialValue =
      prior?.updatedValue != null ? prior.updatedValue : defaultJph;

    timeline.push({
      time: start.toISOString(),
      value: Number(initialValue) || 0,
      source: prior ? "history_before_shift" : "default",
    });

    for (const h of within) {
      timeline.push({
        time: new Date(h.updatedAt).toISOString(),
        value: Number(h.updatedValue) || 0,
        source: "history_in_shift",
        userId: h.userId,
      });
    }

    // optional: include end marker for charts
    timeline.push({
      time: end.toISOString(),
      value: timeline.length ? timeline[timeline.length - 1].value : defaultJph,
      source: "shift_end_marker",
    });

    return res.status(200).json({
      success: true,
      meta: {
        lineId: lineRow.lineId,
        lineName: lineRow.lineName,
        shift: shift,
        date,
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        defaultJph,
      },
      data: timeline, // [{time,value}]
    });
  } catch (err) {
    console.error("getJphHistoryForShift:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err?.message || String(err),
    });
  }
};



module.exports = {
  updateTargetJPH,
  getTargetJPHUpdateHistory,
	  getJphHistoryForShift,

};


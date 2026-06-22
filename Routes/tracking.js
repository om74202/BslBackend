const express = require("express");
const prismaClient = require("../lib/prismaClient");
const { authenticate } = require("../middlewares/userMiddlewares");
const activityTracker = express.Router();

activityTracker.use(authenticate);

activityTracker.post("/", async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId)
      return res.status(401).json({ ok: false, message: "Invalid token" });

    const { eventName, route, pageName, elementId, elementText, metadata } =
      req.body || {};
    if (!eventName)
      return res.status(400).json({ ok: false, message: "eventName required" });

    const ip =
      (req.headers["x-forwarded-for"]?.toString().split(",")[0] || "").trim() ||
      req.socket.remoteAddress ||
      null;

    const ua = req.headers["user-agent"] || null;

    await prismaClient.tracking_events.create({
      data: {
        user_id: String(userId),
        event_name: String(eventName),
        route: route || null,
        page_name: pageName || null,
        element_id: elementId || null,
        element_text: elementText || null,
        metadata: metadata ?? null,
        ip: ip ? String(ip) : null,
        user_agent: ua,
      },
    });

    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: e?.message });
    console.log(e);
  }
});

activityTracker.get("/export-event-summary", async (req, res) => {
  try {
    const requesterId = req.user?.id;
    if (!requesterId) {
      return res.status(401).json({ ok: false, message: "Invalid token" });
    }

    const { from, to, organizationId } = req.query;

    const userWhere = {};
    if (organizationId) {
      userWhere.organizationId = String(organizationId);
    }

    const users = await prismaClient.user.findMany({
      where: userWhere,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        organizationId: true,
        status: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    const userIds = users.map((u) => u.id);

    if (userIds.length === 0) {
      return res.status(404).json({ ok: false, message: "No users found" });
    }

    const trackingWhere = {
      user_id: { in: userIds },
    };

    if (from || to) {
      trackingWhere.ts = {};
      if (from) trackingWhere.ts.gte = new Date(from);
      if (to) trackingWhere.ts.lte = new Date(to);
    }

    const events = await prismaClient.tracking_events.findMany({
      where: trackingWhere,
      select: {
        user_id: true,
        event_name: true,
        page_name: true,
        ts: true,
      },
      orderBy: [{ user_id: "asc" }, { ts: "asc" }],
    });

    const ACTIVE_GAP_MS = 5 * 60 * 1000;
    const SESSION_BREAK_MS = 10 * 60 * 1000;

    const pageSummaryMap = new Map();

    const ensurePageRow = (pageName) => {
      const key = pageName ?? null;

      if (!pageSummaryMap.has(key)) {
        pageSummaryMap.set(key, {
          pageName: key,
          totalPageOpenedTimeMs: 0,
          totalPageOpenedTimeMinutes: 0,
          totalPageOpenedTimeHHMMSS: "00:00:00",
          pageViewCount: 0,
          uniqueUsersCount: 0,
          usersSet: new Set(),
        });
      }

      return pageSummaryMap.get(key);
    };

    const formatMsToHHMMSS = (ms) => {
      const totalSeconds = Math.floor(ms / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      const pad = (n) => String(n).padStart(2, "0");
      return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    };

    for (const event of events) {
      if (event.event_name !== "page_view") continue;
      if (!event.page_name) continue;

      const row = ensurePageRow(event.page_name);
      row.pageViewCount += 1;
      row.usersSet.add(event.user_id);
    }

    const eventsByUser = new Map();

    for (const event of events) {
      if (!eventsByUser.has(event.user_id)) {
        eventsByUser.set(event.user_id, []);
      }
      eventsByUser.get(event.user_id).push(event);
    }

    for (const [, userEvents] of eventsByUser.entries()) {
      let activePage = null;
      let previousTs = null;

      for (const event of userEvents) {
        const currentTs = event.ts ? new Date(event.ts).getTime() : NaN;

        if (activePage && previousTs != null && !Number.isNaN(currentTs)) {
          const gapMs = currentTs - previousTs;

          if (gapMs > 0 && gapMs <= ACTIVE_GAP_MS) {
            const row = ensurePageRow(activePage);
            row.totalPageOpenedTimeMs += gapMs;
          }

          if (gapMs > SESSION_BREAK_MS) {
            activePage = null;
          }
        }

        if (event.event_name === "page_view") {
          activePage = event.page_name ?? null;
        }

        if (!Number.isNaN(currentTs)) {
          previousTs = currentTs;
        }
      }
    }

    const summary = Array.from(pageSummaryMap.values())
      .map((row) => {
        row.uniqueUsersCount = row.usersSet.size;
        row.totalPageOpenedTimeMinutes = Number(
          (row.totalPageOpenedTimeMs / (1000 * 60)).toFixed(2),
        );
        row.totalPageOpenedTimeHHMMSS = formatMsToHHMMSS(
          row.totalPageOpenedTimeMs,
        );
        delete row.usersSet;
        return row;
      })
      .sort((a, b) => b.totalPageOpenedTimeMs - a.totalPageOpenedTimeMs);

    const grandTotalPageOpenedTimeMs = summary.reduce(
      (sum, item) => sum + item.totalPageOpenedTimeMs,
      0,
    );

    const grandTotalPageOpenedTimeMinutes = Number(
      (grandTotalPageOpenedTimeMs / (1000 * 60)).toFixed(2),
    );

    return res.status(200).json({
      ok: true,
      summary,
      grandTotalPageOpenedTimeMs,
      grandTotalPageOpenedTimeMinutes,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ ok: false, error: e?.message });
  }
});

module.exports = activityTracker;

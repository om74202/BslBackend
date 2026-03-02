const express = require("express");
const jwt = require("jsonwebtoken");
const prismaClient = require("../lib/prismaClient");

const activityTracker = express.Router();




function getUserIdFromReq(req) {
  const auth = (req.headers.authorization || "").trim();

  // accept both: "Bearer <token>" OR "<token>"
  const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : auth;
  if (!token) return null;

  const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);

  return payload.userId || payload.id || payload.sub || null;
}

activityTracker.post("/", async (req, res) => {
  try {
    const userId = getUserIdFromReq(req);
    if (!userId) return res.status(401).json({ ok: false, message: "Invalid token" });

    const { eventName, route, pageName, elementId, elementText, metadata } = req.body || {};
    if (!eventName) return res.status(400).json({ ok: false, message: "eventName required" });

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
    console.log(e)
  }
});

module.exports = activityTracker
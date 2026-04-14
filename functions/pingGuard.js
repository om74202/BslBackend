// functions/pingGuard.js
const prismaClient = require("../lib/prismaClient");
const { subscribeToTopic } = require("./mqtt");

const IST_TZ = "Asia/Kolkata";
const requiredLineNames = ["Rear Back", "Rear Cushion", "Front Line"];

// ✅ daily block windows (IST)
const DAILY_BLOCK_WINDOWS_IST = [
  { start: "08:00", end: "08:10", name: "Tea Break 1" },
  { start: "11:10", end: "11:40", name: "Lunch Break" },
	{ start: "13:00", end: "13:10", name: "Tea Break 2" },
  { start: "17:00", end: "17:10", name: "Tea Break 3" },
  { start: "20:00", end: "20:30", name: "Dinner Break" },
	{ start: "22:00", end: "22:10", name: "Tea Break 4" },
];

/** "now" in IST clock */
const getIstNow = (d = new Date()) =>
  new Date(d.toLocaleString("en-US", { timeZone: IST_TZ }));

/** IST date string "YYYY-MM-DD" */
const toIstYMD = (d) =>
  new Date(d).toLocaleDateString("en-CA", { timeZone: IST_TZ });

/** Sunday check in IST */
// const isSundayIst = (now = new Date()) => getIstNow(now).getDay() === 0;

// ✅ "HH:mm" -> minutes since 00:00
const hhmmToMin = (hhmm) => {
  const m = String(hhmm || "").match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return null;
  const h = Number(m[1]);
  const mm = Number(m[2]);
  if (!Number.isFinite(h) || !Number.isFinite(mm)) return null;
  return h * 60 + mm;
};

// ✅ check if IST now is in any daily block window
const isInDailyBlockWindowIST = (now = new Date()) => {
  const ist = getIstNow(now);
  const curMin = ist.getHours() * 60 + ist.getMinutes();

  for (const w of DAILY_BLOCK_WINDOWS_IST) {
    const s = hhmmToMin(w.start);
    const e = hhmmToMin(w.end);
    if (s == null || e == null) continue;

    // inclusive start, exclusive end
    if (curMin >= s && curMin < e) return true;
  }
  return false;
};

/**
 * Expand holiday start/end into list of IST dates inclusive.
 * Example: 2025-12-26..2025-12-27 -> ["2025-12-26","2025-12-27"]
 */
const expandHolidayToDatesIST = (startTime, endTime) => {
  if (!startTime || !endTime) return [];

  const startYMD = toIstYMD(startTime);
  const endYMD = toIstYMD(endTime);

  // Build IST midnight Date objects using +05:30 offset
  let cur = new Date(`${startYMD}T00:00:00+05:30`);
  const end = new Date(`${endYMD}T00:00:00+05:30`);

  const out = [];
  while (cur.getTime() <= end.getTime()) {
    out.push(toIstYMD(cur));
    cur = new Date(cur.getTime() + 24 * 60 * 60 * 1000);
  }
  return out;
};

/**
 * Fetch rules from DB:
 * - holidayDates: ["YYYY-MM-DD", ...] in IST
 * - plannedShutdownRanges: time windows (ms) where ping must NOT run
 * - dailyBlockWindowsIST: the fixed daily time windows (IST)
 */
const calculateNotPingTime = async () => {
  // 1) Holidays -> IST dates array
  const holidays = await prismaClient.plannedShutdown.findMany({
    where: { type: "Holiday" },
    select: { id: true, name: true, startTime: true, endTime: true },
  });
	console.log(holidays)

  const holidayDatesSet = new Set();
  for (const h of holidays) {
    const dates = expandHolidayToDatesIST(h.startTime, h.endTime);
    dates.forEach((d) => holidayDatesSet.add(d));
  }

  // 2) PlannedShutdown for ALL 3 lines -> time ranges
  const plannedShutdownAllLines = await prismaClient.plannedShutdown.findMany({
    where: {
      type: "PlannedShutdown",
      AND: [
        { lines: { some: { lineName: "Rear Back" } } },
        { lines: { some: { lineName: "Rear Cushion" } } },
        { lines: { some: { lineName: "Front Line" } } },
        // ensure no other lines besides these three
        { lines: { every: { lineName: { in: requiredLineNames } } } },
      ],
    },
    select: { id: true, name: true, startTime: true, endTime: true, type: true },
  });
	console.log(plannedShutdownAllLines)

  const plannedShutdownRanges = plannedShutdownAllLines
    .filter((ps) => ps.startTime && ps.endTime)
    .map((ps) => ({
      id: ps.id,
      name: ps.name,
      type: ps.type,
      startMs: new Date(ps.startTime).getTime(),
      endMs: new Date(ps.endTime).getTime(),
      startIso: new Date(ps.startTime).toISOString(),
      endIso: new Date(ps.endTime).toISOString(),
    }));

  return {
    holidayDates: Array.from(holidayDatesSet).sort(),
    plannedShutdownRanges,
    dailyBlockWindowsIST: DAILY_BLOCK_WINDOWS_IST, // ✅ for debugging
  };
};

/**
 * ----------------------------
 * ✅ CACHED RULES + REFRESH
 * ----------------------------
 */
let cachedRules = null;
let lastRefreshAt = null;
let refreshInFlight = null;

const refreshRules = async (reason = "manual") => {
  if (refreshInFlight) return refreshInFlight;

  refreshInFlight = (async () => {
    try {
      const next = await calculateNotPingTime();
      cachedRules = next;
      lastRefreshAt = new Date();
      console.log(
        `[PingGuard] refreshed rules (${reason}) ${next} @ ${lastRefreshAt.toISOString()}`
      );
      return cachedRules;
    } catch (e) {
      console.error("[PingGuard] refreshRules failed:", e?.message || e);
      return cachedRules;
    } finally {
      refreshInFlight = null;
    }
  })();

  return refreshInFlight;
};

const getRulesSnapshot = () => ({ rules: cachedRules, lastRefreshAt });

/**
 * Check if ping is allowed at a given time using computed rules.
 * ✅ If rules param not passed, uses cachedRules.
 */
const isPingAllowedNow = (rulesArg, now = new Date()) => {
  const rules = rulesArg || cachedRules;
  if (!rules) return true;

  // Sunday IST
  // if (isSundayIst(now)) return false;

  // Holiday date IST
  const todayIst = toIstYMD(now);
  if (Array.isArray(rules.holidayDates) && rules.holidayDates.includes(todayIst)) {
    return false;
  }

  // ✅ Daily fixed blocks (IST)
  if (isInDailyBlockWindowIST(now)) return false;

  // PlannedShutdown ranges (UTC ms compare)
  const t = now.getTime();
  const ranges = Array.isArray(rules.plannedShutdownRanges)
    ? rules.plannedShutdownRanges
    : [];

  for (const r of ranges) {
    if (t >= r.startMs && t <= r.endMs) return false;
  }

  return true;
};

/**
 * ----------------------------
 * ✅ MQTT SUBSCRIBE (topic: update)
 * ----------------------------
 * Call this ONCE at server start.
 */
let subscriberStarted = false;
let debounceTimer = null;

const initPingGuardSubscriber = async ({
  topic = "update",
  qos = 1,
  debounceMs = 300,
} = {}) => {
  if (subscriberStarted) return;
  subscriberStarted = true;

  // initial load (so cachedRules exists even before first mqtt message)
  await refreshRules("startup");

  await subscribeToTopic(
    topic,
    async (payload, meta) => {
      // payload may be JSON (preferred) or string depending on publisher
      const email =
        (payload && typeof payload === "object" && typeof payload.email === "string" && payload.email) ||
        (typeof payload === "string" ? payload : null);

      const who = email ? `by ${email}` : "by unknown";

      // debounce refresh storms
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        refreshRules(`mqtt:${topic} ${who}`);
      }, debounceMs);
    },
    { qos, json: true }
  );

  console.log(`[PingGuard] subscriber started for topic "${topic}"`);
};

module.exports = {
  calculateNotPingTime,
  isPingAllowedNow,

  // ✅ new exports
  initPingGuardSubscriber,
  refreshRules,
  getRulesSnapshot,
};


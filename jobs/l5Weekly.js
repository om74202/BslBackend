/**
 * L5 Weekly Rollup (Reads from L4)
 */

require("dotenv").config({ path: "./db/.env" });
require("dotenv").config({ path: "./.env.influx" });

const { influxDB } = require("../db/influxDB/influx");
const prismaClient = require("../lib/prismaClient");
const { Point } = require("@influxdata/influxdb-client");

const ORG_NAME = "BSL Kharkhoda";
const queryApi = influxDB.getQueryApi(ORG_NAME);

const L4_BUCKET = "L4";
const L5_BUCKET = "L5";
const IST_OFFSET_MS = 330 * 60 * 1000;

const DRY_RUN = process.env.DRY_RUN === "1";

const pad2 = (n) => String(n).padStart(2, "0");
function istYmd(d = new Date()) {
  const shifted = new Date(d.getTime() + IST_OFFSET_MS);
  return `${shifted.getUTCFullYear()}-${pad2(shifted.getUTCMonth() + 1)}-${pad2(shifted.getUTCDate())}`;
}
function istMidnightUtcIso(ymd) {
  const [y, m, d] = ymd.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d, 0, 0, 0) - IST_OFFSET_MS).toISOString();
}
function istDayEndUtcIso(ymd) {
  const [y, m, d] = ymd.split("-").map(Number);
  return new Date(
    Date.UTC(y, m - 1, d + 1, 0, 0, 0) - IST_OFFSET_MS,
  ).toISOString();
}
function addDaysYmd(ymd, delta) {
  const [y, m, d] = ymd.split("-").map(Number);
  const t = Date.UTC(y, m - 1, d) + delta * 86400000;
  const dd = new Date(t);
  return `${dd.getUTCFullYear()}-${pad2(dd.getUTCMonth() + 1)}-${pad2(dd.getUTCDate())}`;
}

// NEW: Correctly maps Shift C/TODAY timestamps back to the operational date
function getOperationalYmd(timeIso) {
  const t = new Date(timeIso).getTime() - IST_OFFSET_MS;
  const d = new Date(t);
  return `${d.getUTCFullYear()}-${pad2(d.getUTCMonth() + 1)}-${pad2(d.getUTCDate())}`;
}

function runFlux(fluxQuery) {
  return new Promise((resolve, reject) => {
    const rows = [];
    queryApi.queryRows(fluxQuery, {
      next(row, tableMeta) {
        try {
          rows.push(tableMeta.toObject(row));
        } catch (e) {}
      },
      error: reject,
      complete: () => resolve(rows),
    });
  });
}

const writeApi = influxDB.getWriteApi(ORG_NAME, L5_BUCKET, "ms");
let writeCount = 0;

function queuePoint(measurement, tags, timeIso, fields) {
  const point = new Point(measurement).timestamp(new Date(timeIso));
  for (const [k, v] of Object.entries(tags)) point.tag(k, String(v));
  for (const [k, v] of Object.entries(fields)) {
    if (v === null || v === undefined) continue;
    if (typeof v === "boolean") point.booleanField(k, v);
    else if (typeof v === "number") point.floatField(k, v);
    else point.stringField(k, String(v));
  }
  if (!DRY_RUN) writeApi.writePoint(point);
  writeCount++;
}

const SUM_FIELDS = new Set([
  "Total_Prod_Today",
  "Total_Target_Prod",
  "Total_start_produced_today",
  "total_production_set",
  "Today_planned_Prod",
  "Today_palnned_Prod",
  "Today_Production_plan",
  "Total_Production",
  "Total_Count",
  "reject",
  "rework",
  "Pending",
  "Pending_",
]);

function mergeWeeklyFields(docs) {
  if (!docs.length) return {};
  docs.sort((a, b) => new Date(a._time) - new Date(b._time));
  const lastDoc = docs[docs.length - 1];
  const out = {};

  const allKeys = new Set();
  for (const d of docs) {
    for (const k of Object.keys(d)) {
      if (k.startsWith("_") || k === "result" || k === "table" || k === "LINE")
        continue;
      allKeys.add(k);
    }
  }

  for (const k of allKeys) {
    // 1. Handle Reason Max/Min specifically (Take Max of Maxes, Min of Mins)
    if (k.endsWith("_max_value")) {
      let maxVal = -Infinity;
      let maxReason = null;
      const reasonKey = k.replace("_max_value", "_max_reason");
      for (const d of docs) {
        const v = Number(d[k]);
        if (Number.isFinite(v) && v > maxVal) {
          maxVal = v;
          maxReason = d[reasonKey];
        }
      }
      out[k] = maxVal === -Infinity ? null : maxVal;
      if (maxReason) out[reasonKey] = maxReason;
      continue;
    }

    if (k.endsWith("_min_value")) {
      let minVal = Infinity;
      let minReason = null;
      const reasonKey = k.replace("_min_value", "_min_reason");
      for (const d of docs) {
        const v = Number(d[k]);
        if (Number.isFinite(v) && v < minVal) {
          minVal = v;
          minReason = d[reasonKey];
        }
      }
      out[k] = minVal === Infinity ? null : minVal;
      if (minReason) out[reasonKey] = minReason;
      continue;
    }

    if (k.endsWith("_max_reason") || k.endsWith("_min_reason")) continue;

    const isString = typeof lastDoc[k] === "string";

    if (isString) {
      out[k] = lastDoc[k] !== undefined ? lastDoc[k] : null;
    } else if (
      SUM_FIELDS.has(k) ||
      k.endsWith("_count") ||
      k.endsWith("_delta") ||
      k.endsWith("_sec") ||
      k.endsWith("_PASS") ||
      k.endsWith("_FAIL") ||
      k.endsWith("_RUNNING") ||
      k.endsWith("_STOPPED") ||
      k.endsWith("_IDLE") ||
      k.endsWith("_pass") ||
      k.endsWith("_fail") ||
      k.endsWith("_connected") ||
      k.endsWith("_unconnected")
    ) {
      let sum = 0;
      for (const d of docs) {
        const v = Number(d[k]);
        if (Number.isFinite(v)) sum += v;
      }
      out[k] = sum;
    } else {
      // Average for gauges (OEE, Avail, amp, etc.)
      let sum = 0,
        count = 0;
      for (const d of docs) {
        const v = Number(d[k]);
        if (Number.isFinite(v)) {
          sum += v;
          count++;
        }
      }
      out[k] = count > 0 ? sum / count : null;
    }
  }
  return out;
}

async function processWeek(targetYmd) {
  const startYmd = addDaysYmd(targetYmd, -6);
  const startIso = istMidnightUtcIso(startYmd);
  const endIso = istDayEndUtcIso(addDaysYmd(targetYmd, 1));

  // 1. Fetch Holidays from Postgres
  const holidays = await prismaClient.plannedShutdown.findMany({
    where: {
      type: "Holiday",
      startTime: { lt: new Date(endIso) },
      endTime: { gt: new Date(startIso) },
    },
  });

  const holidayDates = new Set();
  for (const h of holidays) {
    if (!h.startTime || !h.endTime) continue;
    let curr = new Date(h.startTime);
    const end = new Date(h.endTime);
    while (curr <= end) {
      holidayDates.add(istYmd(curr));
      curr = new Date(curr.getTime() + 86400000);
    }
  }

  // 2. Fetch L4 Data
  const fluxL4 = `
    from(bucket: "${L4_BUCKET}")
      |> range(start: time(v: "${startIso}"), stop: time(v: "${endIso}"))
      |> filter(fn: (r) => r._field != "drive" and r._field != "station" and r._field != "gun" and r._field != "shift" and r._field != "LINE" and r._field != "type")
      |> pivot(rowKey:["_time"], columnKey:["_field"], valueColumn:"_value")
      |> sort(columns: ["_time"], desc: false)
  `;
  const rowsL4 = await runFlux(fluxL4);

  // 3. Filter out holidays using the corrected operational date
  const filteredL4 = rowsL4.filter((r) => {
    const rDate = getOperationalYmd(r._time);
    return !holidayDates.has(rDate);
  });

  // 4. Group L4 data and merge
  const grouped = new Map();

  for (const r of filteredL4) {
    const tags = {};
    if (r.drive) tags.drive = r.drive;
    if (r.station) tags.station = r.station;
    if (r.gun) tags.gun = r.gun;
    if (r.LINE) tags.LINE = r.LINE;
    tags.shift = r.shift;

    const key = JSON.stringify({ m: r._measurement, ...tags });
    if (!grouped.has(key)) {
      grouped.set(key, { measurement: r._measurement, tags, docs: [] });
    }
    grouped.get(key).docs.push(r);
  }

  let weekDocCount = 0;

  for (const { measurement, tags, docs } of grouped.values()) {
    const merged = mergeWeeklyFields(docs);
    const lastDoc = docs[docs.length - 1];
    const timeIso = lastDoc._time;

    queuePoint(measurement, tags, timeIso, merged);
    weekDocCount++;
  }

  if (!DRY_RUN) await writeApi.flush();
  return weekDocCount;
}

async function main() {
  const startArg = process.argv[2];
  const endArg = process.argv[3];

  if (!startArg) {
    console.error(
      "Usage: node jobs/l5Weekly.js <StartDate YYYY-MM-DD> [EndDate YYYY-MM-DD]",
    );
    process.exit(1);
  }

  const startYmd = startArg;
  const endYmd = endArg || startArg;

  console.log(
    `\n[L5 Weekly] Starting Backfill: ${startYmd} -> ${endYmd} | DryRun: ${DRY_RUN}`,
  );

  const totalStart = Date.now();
  let currentYmd = startYmd;
  let totalDocsWritten = 0;

  while (currentYmd <= endYmd) {
    const dayStart = Date.now();
    let success = false;
    let retries = 3;

    while (retries > 0 && !success) {
      try {
        const written = await processWeek(currentYmd);
        const dayMs = Date.now() - dayStart;
        totalDocsWritten += written;
        success = true;

        console.log(
          `  ✅ ${currentYmd} | Wrote ${written} L5 docs | Took ${(dayMs / 1000).toFixed(2)}s`,
        );

        // Pause for 1 second between days to prevent Influx from timing out
        await new Promise((r) => setTimeout(r, 1000));
      } catch (e) {
        retries--;
        console.error(
          `  ❌ ${currentYmd} | Failed: ${e.message.split("\n")[0]}`,
        );

        if (retries > 0) {
          console.log(
            `  ⏳ Retrying in 5 seconds... (${retries} attempts left)`,
          );
          await new Promise((r) => setTimeout(r, 5000));
        } else {
          console.error(
            `  🛑 ${currentYmd} | Completely failed after 3 attempts. Skipping.`,
          );
        }
      }
    }

    const nextYmd = addDaysYmd(currentYmd, 1);
    const currentMonth = currentYmd.slice(0, 7);
    const nextMonth = nextYmd.slice(0, 7);

    if (currentMonth !== nextMonth && nextYmd <= endYmd) {
      console.log(
        `\n⏸️  [Pause] Finished month ${currentMonth}. Sleeping for 10 seconds...`,
      );
      await new Promise((r) => setTimeout(r, 10000));
      console.log(`▶️  Resuming for month ${nextMonth}...\n`);
    }

    currentYmd = nextYmd;
  }

  if (!DRY_RUN) {
    try {
      await writeApi.close();
      await prismaClient.$disconnect();
    } catch (e) {
      console.error("Error closing connections:", e.message);
    }
  }

  const totalMs = Date.now() - totalStart;

  console.log("\n================= BACKFILL COMPLETE =================");
  console.log(`Total L5 Docs Written : ${totalDocsWritten}`);
  console.log(`Total Time Elapsed    : ${(totalMs / 1000).toFixed(2)} seconds`);
  console.log("=====================================================\n");
}

main().catch(console.error);


/**
 * L7 (Quarterly), L8 (Half-Yearly), L9 (Yearly) Rollup
 * Reads from L6 (Monthly) and creates 3, 6, and 12-month summaries.
 *
 * Usage:
 *   node jobs/l789Rollup.js <TargetDate YYYY-MM-DD>
 */

require("dotenv").config({ path: "./db/.env" });
require("dotenv").config({ path: "./.env.influx" });

const { influxDB } = require("../db/influxDB/influx");
const { Point } = require("@influxdata/influxdb-client");

const ORG_NAME = "BSL Kharkhoda";
const queryApi = influxDB.getQueryApi(ORG_NAME);

const L6_BUCKET = "L6";
const L7_BUCKET = "L7";
const L8_BUCKET = "L8";
const L9_BUCKET = "L9";
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

// Get the start date N months back from the target date
function getMonthsBackYmd(targetYmd, monthsBack) {
  const [y, m, d] = targetYmd.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1 - monthsBack, d));
  return `${date.getUTCFullYear()}-${pad2(date.getUTCMonth() + 1)}-${pad2(date.getUTCDate())}`;
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

// Initialize Write API clients for all 3 buckets
const writeApis = {
  L7: influxDB.getWriteApi(ORG_NAME, L7_BUCKET, "ms"),
  L8: influxDB.getWriteApi(ORG_NAME, L8_BUCKET, "ms"),
  L9: influxDB.getWriteApi(ORG_NAME, L9_BUCKET, "ms"),
};

function queuePoint(bucket, measurement, tags, timeIso, fields) {
  const point = new Point(measurement).timestamp(new Date(timeIso));
  for (const [k, v] of Object.entries(tags)) point.tag(k, String(v));
  for (const [k, v] of Object.entries(fields)) {
    if (v === null || v === undefined) continue;
    if (typeof v === "boolean") point.booleanField(k, v);
    else if (typeof v === "number") point.floatField(k, v);
    else point.stringField(k, String(v));
  }
  if (!DRY_RUN) writeApis[bucket].writePoint(point);
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

function mergeAggregations(docs) {
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
    if (k.endsWith("_max_value")) {
      let maxVal = -Infinity,
        maxReason = null;
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
      let minVal = Infinity,
        minReason = null;
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

async function processBucket(targetBucket, targetYmd, monthsBack) {
  const startYmd = getMonthsBackYmd(targetYmd, monthsBack);
  const startIso = istMidnightUtcIso(startYmd);
  const endIso = istDayEndUtcIso(targetYmd);

  const flux = `
    from(bucket: "${L6_BUCKET}")
      |> range(start: time(v: "${startIso}"), stop: time(v: "${endIso}"))
      |> filter(fn: (r) => r._field != "drive" and r._field != "station" and r._field != "gun" and r._field != "shift" and r._field != "LINE" and r._field != "type" and r._field != "date")
      |> pivot(rowKey:["_time"], columnKey:["_field"], valueColumn:"_value")
      |> sort(columns: ["_time"], desc: false)
  `;

  const rows = await runFlux(flux);

  const grouped = new Map();
  for (const r of rows) {
    const tags = {};
    if (r.drive) tags.drive = r.drive;
    if (r.station) tags.station = r.station;
    if (r.gun) tags.gun = r.gun;
    if (r.LINE) tags.LINE = r.LINE;
    tags.shift = r.shift;

    const key = JSON.stringify({ m: r._measurement, ...tags });
    if (!grouped.has(key))
      grouped.set(key, { measurement: r._measurement, tags, docs: [] });
    grouped.get(key).docs.push(r);
  }

  let docCount = 0;
  for (const { measurement, tags, docs } of grouped.values()) {
    const merged = mergeAggregations(docs);
    // Use the exact timestamp of the latest available L6 doc in the window
    const lastDoc = docs[docs.length - 1];
    const timeIso = lastDoc._time;

    queuePoint(targetBucket, measurement, tags, timeIso, merged);
    docCount++;
  }

  if (!DRY_RUN) await writeApis[targetBucket].flush();
  return docCount;
}

async function main() {
  const targetYmd = process.argv[2];
  if (!targetYmd) {
    console.error("Usage: node jobs/l789Rollup.js <TargetDate YYYY-MM-DD>");
    process.exit(1);
  }

  console.log(
    `\n[L7/L8/L9 Rollup] Target Date: ${targetYmd} | DryRun: ${DRY_RUN}`,
  );

  try {
    // 1. Quarterly (L7) - 3 Months
    const l7Count = await processBucket("L7", targetYmd, 3);
    console.log(`  ✅ L7 (Quarterly) | Wrote ${l7Count} docs`);

    // 2. Half-Yearly (L8) - 6 Months
    const l8Count = await processBucket("L8", targetYmd, 6);
    console.log(`  ✅ L8 (Half-Yearly) | Wrote ${l8Count} docs`);

    // 3. Yearly (L9) - 12 Months
    const l9Count = await processBucket("L9", targetYmd, 12);
    console.log(`  ✅ L9 (Yearly) | Wrote ${l9Count} docs`);
  } catch (e) {
    console.error(`❌ Failed: ${e.message}`);
  }

  if (!DRY_RUN) {
    try {
      await writeApis.L7.close();
      await writeApis.L8.close();
      await writeApis.L9.close();
    } catch (e) {
      console.error("Error closing connections:", e.message);
    }
  }

  console.log("\n================= ROLLUP COMPLETE ==================\n");
}

main().catch(console.error);

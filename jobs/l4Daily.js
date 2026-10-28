/**
 * L4 Daily Snapshot
 * Extracts the LAST value of every field, and counts status occurrences.
 * Writes to bucket L4.
 */

require("dotenv").config({ path: "./db/.env" });
require("dotenv").config({ path: "./.env.influx" });

const { influxDB } = require("../db/influxDB/influx");
const { Point } = require("@influxdata/influxdb-client");

const ORG_NAME = "BSL Kharkhoda";
const queryApi = influxDB.getQueryApi(ORG_NAME);
const L4_BUCKET = "L4";
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
function getShiftEndUtcIso(ymd, shift) {
  const [y, m, d] = ymd.split("-").map(Number);
  if (shift === "SHIFT_A")
    return new Date(
      Date.UTC(y, m - 1, d, 14, 30) - IST_OFFSET_MS,
    ).toISOString();
  if (shift === "SHIFT_B")
    return new Date(Date.UTC(y, m - 1, d, 23, 0) - IST_OFFSET_MS).toISOString();
  if (shift === "SHIFT_C" || shift === "TODAY")
    return new Date(
      Date.UTC(y, m - 1, d + 1, 6, 0) - IST_OFFSET_MS,
    ).toISOString();
  return new Date(Date.UTC(y, m - 1, d)).toISOString();
}
function getShiftKey(timeIso, ymd) {
  const [y, m, d] = ymd.split("-").map(Number);
  const t = new Date(timeIso).getTime();
  const istA = Date.UTC(y, m - 1, d, 6, 0) - IST_OFFSET_MS;
  const istB = Date.UTC(y, m - 1, d, 14, 30) - IST_OFFSET_MS;
  const istC = Date.UTC(y, m - 1, d, 23, 0) - IST_OFFSET_MS;
  const istNextA = Date.UTC(y, m - 1, d + 1, 6, 0) - IST_OFFSET_MS;
  if (t >= istA && t < istB) return "SHIFT_A";
  if (t >= istB && t < istC) return "SHIFT_B";
  if (t >= istC && t < istNextA) return "SHIFT_C";
  return null;
}
function addDaysYmd(ymd, delta) {
  const [y, m, d] = ymd.split("-").map(Number);
  const t = Date.UTC(y, m - 1, d) + delta * 86400000;
  const dd = new Date(t);
  return `${dd.getUTCFullYear()}-${pad2(dd.getUTCMonth() + 1)}-${pad2(dd.getUTCDate())}`;
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

const writeApi = influxDB.getWriteApi(ORG_NAME, L4_BUCKET, "ms");
let writeCount = 0;

// Schema Tracker
const schemaTracker = { read: {}, written: {}, tags: {} };

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

function extractLastValues(
  measurement,
  tagsObj,
  list,
  statusConfig,
  uniqueConfig = {},
  excludeFields = [],
) {
  const out = {};
  if (!list.length) return out;

  const lastRow = list[list.length - 1];
  for (const [k, v] of Object.entries(lastRow)) {
    if (k.startsWith("_") || k === "result" || k === "table" || k === "LINE")
      continue;
    if (excludeFields.includes(k)) continue;
    if (uniqueConfig[k]) continue;
    if (typeof v === "number" || (typeof v === "string" && !statusConfig[k])) {
      out[k] = v;
    }
  }

  for (const [field, config] of Object.entries(statusConfig)) {
    if (config.custom) {
      for (const [label, vals] of Object.entries(config.custom)) {
        const valSet = new Set(vals.map(String));
        let count = 0;
        for (const row of list) {
          if (row[field] && valSet.has(String(row[field]))) count++;
        }
        out[`${field}_${label}`] = count;
      }
    } else {
      const passVals = new Set(config.pass.map(String));
      let passCount = 0,
        failCount = 0;
      for (const row of list) {
        const val = row[field];
        if (val === null || val === undefined) continue;
        if (passVals.has(String(val))) passCount++;
        else failCount++;
      }
      out[`${field}_${config.pass_label || "pass"}`] = passCount;
      out[`${field}_${config.fail_label || "fail"}`] = failCount;
    }
  }

  for (const [field, outKey] of Object.entries(uniqueConfig)) {
    const uniqueVals = new Set();
    for (const row of list) {
      if (row[field] !== null && row[field] !== undefined)
        uniqueVals.add(String(row[field]));
    }
    out[outKey] = uniqueVals.size;
  }

  // Track Schema
  if (!schemaTracker.read[measurement])
    schemaTracker.read[measurement] = new Set();
  if (!schemaTracker.written[measurement])
    schemaTracker.written[measurement] = new Set();
  if (!schemaTracker.tags[measurement])
    schemaTracker.tags[measurement] = new Set();

  for (const t of Object.keys(tagsObj)) schemaTracker.tags[measurement].add(t);
  for (const k of Object.keys(lastRow)) {
    if (k.startsWith("_") || k === "result" || k === "table" || k === "LINE")
      continue;
    schemaTracker.read[measurement].add(k);
  }
  for (const k of Object.keys(out)) {
    schemaTracker.written[measurement].add(k);
  }

  return out;
}

function getMaxMinReasons(snapshotRow, prefix, type) {
  if (!snapshotRow) return {};
  const vals = [];
  for (const [k, v] of Object.entries(snapshotRow)) {
    if (k.startsWith(prefix) && typeof v === "number" && v > 0) {
      vals.push({ reason: k.slice(prefix.length).replace(/_/g, " "), val: v });
    }
  }
  if (!vals.length) return {};

  let maxVal = -1,
    minVal = Infinity;
  for (const v of vals) {
    if (v.val > maxVal) maxVal = v.val;
    if (v.val < minVal) minVal = v.val;
  }

  return {
    [`${type}_max_reason`]: vals
      .filter((v) => v.val === maxVal)
      .map((v) => v.reason)
      .join(", "),
    [`${type}_max_value`]: maxVal,
    [`${type}_min_reason`]: vals
      .filter((v) => v.val === minVal)
      .map((v) => v.reason)
      .join(", "),
    [`${type}_min_value`]: minVal,
  };
}

async function fetchData(measurement, startIso, endIso) {
  const flux = `from(bucket: "TODAY") |> range(start: time(v: "${startIso}"), stop: time(v: "${endIso}")) |> filter(fn: (r) => r._measurement == "${measurement}") |> aggregateWindow(every: 30s, fn: last, createEmpty: false) |> pivot(rowKey:["_time"], columnKey:["_field"], valueColumn:"_value") |> sort(columns:["_time"], desc:false)`;
  return await runFlux(flux);
}

async function fetchDataFromShifts(measurement, startIso, endIso) {
  const all = [];
  for (const s of ["A", "B", "C"]) {
    const flux = `from(bucket: "SHIFT_${s}") |> range(start: time(v: "${startIso}"), stop: time(v: "${endIso}")) |> filter(fn: (r) => r._measurement == "${measurement}") |> aggregateWindow(every: 30s, fn: last, createEmpty: false) |> pivot(rowKey:["_time"], columnKey:["_field"], valueColumn:"_value") |> sort(columns:["_time"], desc:false)`;
    const rows = await runFlux(flux);
    for (const r of rows) all.push({ ...r, _shift: `SHIFT_${s}` });
  }
  all.sort((a, b) => new Date(a._time) - new Date(b._time));
  return all;
}

async function processDay(targetYmd) {
  const startIso = istMidnightUtcIso(targetYmd);
  const endIso = istDayEndUtcIso(targetYmd);
  let dayWriteCount = 0;

  const origQueue = queuePoint;
  const localQueue = (...args) => {
    origQueue(...args);
    dayWriteCount++;
  };

  // 1. DRIVE
  const driveRows = await fetchDataFromShifts("DRIVE", startIso, endIso);
  const driveStatus = {
    status: { pass: ["RUNNING"], pass_label: "RUNNING", fail_label: "STOPPED" },
    amp_status: { pass: ["PASS"], pass_label: "PASS", fail_label: "FAIL" },
  };

  const driveGroups = {};
  for (const r of driveRows) {
    if (r.drive === undefined) continue;
    const key = `${r.drive}||${r._shift}`;
    if (!driveGroups[key]) driveGroups[key] = [];
    driveGroups[key].push(r);
  }
  for (const [key, list] of Object.entries(driveGroups)) {
    const [drive, shift] = key.split("||");
    localQueue(
      "DRIVE",
      { shift, drive },
      getShiftEndUtcIso(targetYmd, shift),
      extractLastValues("DRIVE", { shift, drive }, list, driveStatus),
    );
  }
  const driveGroupsToday = {};
  for (const r of driveRows) {
    if (r.drive === undefined) continue;
    if (!driveGroupsToday[r.drive]) driveGroupsToday[r.drive] = [];
    driveGroupsToday[r.drive].push(r);
  }
  for (const [drive, list] of Object.entries(driveGroupsToday)) {
    localQueue(
      "DRIVE",
      { shift: "TODAY", drive },
      getShiftEndUtcIso(targetYmd, "TODAY"),
      extractLastValues("DRIVE", { shift: "TODAY", drive }, list, driveStatus),
    );
  }

  // 2. TORQUE
  const torqueRows = await fetchDataFromShifts("TORQUE", startIso, endIso);
  const torqueStatus = {
    status: { pass: ["pass"], pass_label: "pass", fail_label: "fail" },
    angle_status: { pass: ["pass"], pass_label: "pass", fail_label: "fail" },
    connection_status: {
      pass: ["connected"],
      pass_label: "connected",
      fail_label: "unconnected",
    },
  };
  const torqueUnique = {
    sequence_no: "sequence_no_count",
    recovered_sequence_no: "recovered_sequence_no_count",
  };

  const torqueGroups = {};
  for (const r of torqueRows) {
    if (!r.station || !r.torque_gun) continue;
    const key = `${r.station}||${r.torque_gun}||${r._shift}`;
    if (!torqueGroups[key]) torqueGroups[key] = [];
    torqueGroups[key].push(r);
  }
  for (const [key, list] of Object.entries(torqueGroups)) {
    const [station, gun, shift] = key.split("||");
    localQueue(
      "TORQUE",
      { shift, station, gun },
      getShiftEndUtcIso(targetYmd, shift),
      extractLastValues(
        "TORQUE",
        { shift, station, gun },
        list,
        torqueStatus,
        torqueUnique,
      ),
    );
  }
  const torqueGroupsToday = {};
  for (const r of torqueRows) {
    if (!r.station || !r.torque_gun) continue;
    const key = `${r.station}||${r.torque_gun}`;
    if (!torqueGroupsToday[key]) torqueGroupsToday[key] = [];
    torqueGroupsToday[key].push(r);
  }
  for (const [key, list] of Object.entries(torqueGroupsToday)) {
    const [station, gun] = key.split("||");
    localQueue(
      "TORQUE",
      { shift: "TODAY", station, gun },
      getShiftEndUtcIso(targetYmd, "TODAY"),
      extractLastValues(
        "TORQUE",
        { shift: "TODAY", station, gun },
        list,
        torqueStatus,
        torqueUnique,
      ),
    );
  }

  // 3. PERFORMANCE
  const perfRows = await fetchData("Performance", startIso, endIso);
  const perfStatus = {
    Run_Mode: {
      custom: {
        Running: ["1", "Auto", "auto", "Running", "running"],
        Idle: ["2", "Idle", "idle"],
        Stopped: ["0", "Off", "off", "Stopped", "stopped"],
      },
    },
  };
  const perfExclude = [
    "BillTktDateTime",
    "Billtkt_changes",
    "BuckleTorque",
    "First_psn",
    "FrameAssyTorqueM10_1",
    "FrameAssyTorqueM10_2",
    "FrameAssyTorqueM6",
    "Last_Cycle_Time",
    "Latest_mfg_psn",
    "Latest_psn",
    "Load@35kg",
    "Load@6kg",
    "MfgDateTime",
    "PSN",
    "PSN_Time",
  ];

  const perfGroups = {};
  for (const r of perfRows) {
    if (!r.LINE) continue;
    const shift = getShiftKey(r._time, targetYmd);
    if (!shift) continue;
    const key = `${r.LINE}||${shift}`;
    if (!perfGroups[key]) perfGroups[key] = [];
    perfGroups[key].push(r);
  }
  for (const [key, list] of Object.entries(perfGroups)) {
    const [line, shift] = key.split("||");
    localQueue(
      "Performance",
      { shift, LINE: line },
      getShiftEndUtcIso(targetYmd, shift),
      extractLastValues(
        "Performance",
        { shift, LINE: line },
        list,
        perfStatus,
        {},
        perfExclude,
      ),
    );
  }
  const perfGroupsToday = {};
  for (const r of perfRows) {
    if (r.LINE) {
      if (!perfGroupsToday[r.LINE]) perfGroupsToday[r.LINE] = [];
      perfGroupsToday[r.LINE].push(r);
    }
  }
  for (const [line, list] of Object.entries(perfGroupsToday)) {
    localQueue(
      "Performance",
      { shift: "TODAY", LINE: line },
      getShiftEndUtcIso(targetYmd, "TODAY"),
      extractLastValues(
        "Performance",
        { shift: "TODAY", LINE: line },
        list,
        perfStatus,
        {},
        perfExclude,
      ),
    );
  }

  // 4. QUALITY
  const qualRows = await fetchData("QUALITY", startIso, endIso);
  const qualParentRows = qualRows.filter((r) =>
    ["Front_Line", "RB", "RC"].includes(r.LINE),
  );
  const qualDismentalRows = qualRows.filter((r) => r.LINE === "dismental");
  const qualReworkRows = qualRows.filter((r) => r.LINE === "rework");
  const prefixMap = { Front_Line: "FL_", RB: "RB_", RC: "RC_" };
  const qualStatus = {};

  const qualGroups = {};
  for (const r of qualParentRows) {
    const shift = getShiftKey(r._time, targetYmd);
    if (!shift) continue;
    const key = `${r.LINE}||${shift}`;
    if (!qualGroups[key]) qualGroups[key] = [];
    qualGroups[key].push(r);
  }
  for (const [key, list] of Object.entries(qualGroups)) {
    const [line, shift] = key.split("||");
    const tags = { shift, LINE: line };
    const fields = extractLastValues("QUALITY", tags, list, qualStatus);
    const lastDismental = qualDismentalRows
      .filter((r) => getShiftKey(r._time, targetYmd) === shift)
      .pop();
    const lastRework = qualReworkRows
      .filter((r) => getShiftKey(r._time, targetYmd) === shift)
      .pop();

    Object.assign(
      fields,
      getMaxMinReasons(lastDismental, prefixMap[line], "rejection"),
    );
    Object.assign(
      fields,
      getMaxMinReasons(lastRework, prefixMap[line], "rework"),
    );

    localQueue("QUALITY", tags, getShiftEndUtcIso(targetYmd, shift), fields);
  }

  const qualGroupsToday = {};
  for (const r of qualParentRows) {
    if (!qualGroupsToday[r.LINE]) qualGroupsToday[r.LINE] = [];
    qualGroupsToday[r.LINE].push(r);
  }
  const lastDismentalToday = qualDismentalRows.pop();
  const lastReworkToday = qualReworkRows.pop();

  for (const [line, list] of Object.entries(qualGroupsToday)) {
    const tags = { shift: "TODAY", LINE: line };
    const fields = extractLastValues("QUALITY", tags, list, qualStatus);
    Object.assign(
      fields,
      getMaxMinReasons(lastDismentalToday, prefixMap[line], "rejection"),
    );
    Object.assign(
      fields,
      getMaxMinReasons(lastReworkToday, prefixMap[line], "rework"),
    );

    localQueue("QUALITY", tags, getShiftEndUtcIso(targetYmd, "TODAY"), fields);
  }

  if (!DRY_RUN) await writeApi.flush();
  return dayWriteCount;
}

async function main() {
  const startArg = process.argv[2];
  const endArg = process.argv[3];

  if (!startArg) {
    console.error(
      "Usage: node jobs/l4Daily.js <StartDate YYYY-MM-DD> [EndDate YYYY-MM-DD]",
    );
    process.exit(1);
  }

  const startYmd = startArg;
  const endYmd = endArg || startArg;

  console.log(
    `\n[L4 Daily] Starting Backfill: ${startYmd} -> ${endYmd} | DryRun: ${DRY_RUN}`,
  );

  const totalStart = Date.now();
  let currentYmd = startYmd;
  let totalDocsWritten = 0;

  while (currentYmd <= endYmd) {
    const dayStart = Date.now();

    try {
      const written = await processDay(currentYmd);
      const dayMs = Date.now() - dayStart;
      totalDocsWritten += written;

      console.log(
        `  ✅ ${currentYmd} | Wrote ${written} docs | Took ${(dayMs / 1000).toFixed(2)}s`,
      );
    } catch (e) {
      console.error(`  ❌ ${currentYmd} | Failed: ${e.message}`);
    }

    const nextYmd = addDaysYmd(currentYmd, 1);
    const currentMonth = currentYmd.slice(0, 7);
    const nextMonth = nextYmd.slice(0, 7);

    // Month Break logic
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
    } catch (e) {
      console.error("Error closing Influx connection:", e.message);
    }
  }

  const totalMs = Date.now() - totalStart;

  console.log("\n================= BACKFILL COMPLETE =================");
  console.log(`Total Docs Written   : ${totalDocsWritten}`);
  console.log(`Total Time Elapsed   : ${(totalMs / 1000).toFixed(2)} seconds`);
  console.log("=====================================================\n");

  // FINAL SCHEMA SUMMARY
  console.log("================ SCHEMA COMPARISON =================");
  const measurements = ["DRIVE", "TORQUE", "Performance", "QUALITY"];
  for (const m of measurements) {
    const read = Array.from(schemaTracker.read[m] || []).sort();
    const written = Array.from(schemaTracker.written[m] || []).sort();
    const tags = Array.from(schemaTracker.tags[m] || []).sort();
    if (read.length === 0 && written.length === 0) continue;

    console.log(`\n[${m}]`);
    console.log(`  Tags    : ${tags.join(", ")}`);
    console.log(`  Read    : ${read.join(", ")}`);
    console.log(`  Written : ${written.join(", ")}`);
  }
  console.log("\n====================================================");
}

main().catch(console.error);

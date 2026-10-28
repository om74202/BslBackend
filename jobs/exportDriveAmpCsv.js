/**
 * Export DRIVE amp data to CSV
 *
 * Usage:
 *   node jobs/exportDriveAmpCsv.js YYYY-MM-DD YYYY-MM-DD
 *
 * Outputs:
 *   ./exports/drive_amp_all.csv      (every single data point)
 *   ./exports/drive_amp_changed.csv  (only rows where the value changed)
 */

require("dotenv").config({ path: "./db/.env" });
require("dotenv").config({ path: "./.env.influx" });

const fs = require("fs");
const path = require("path");
const { influxDB } = require("../db/influxDB/influx");

const ORG_NAME = "BSL Kharkhoda";
const queryApi = influxDB.getQueryApi(ORG_NAME);
const IST_OFFSET_MS = 330 * 60 * 1000;

function getIstRange(startYmd, endYmd) {
  const [sy, sm, sd] = startYmd.split("-").map(Number);
  const startUtc = new Date(
    Date.UTC(sy, sm - 1, sd, 0, 0, 0) - IST_OFFSET_MS,
  ).toISOString();

  const [ey, em, ed] = endYmd.split("-").map(Number);
  const endUtc = new Date(
    Date.UTC(ey, em - 1, ed + 1, 0, 0, 0) - IST_OFFSET_MS,
  ).toISOString();

  return { startUtc, endUtc };
}

function formatIstTime(utcIso) {
  const d = new Date(new Date(utcIso).getTime() + IST_OFFSET_MS);
  const y = d.getUTCFullYear();
  const mo = String(d.getUTCMonth() + 1).padStart(2, "0");
  const da = String(d.getUTCDate()).padStart(2, "0");
  const h = String(d.getUTCHours()).padStart(2, "0");
  const mi = String(d.getUTCMinutes()).padStart(2, "0");
  const s = String(d.getUTCSeconds()).padStart(2, "0");
  return `${y}-${mo}-${da} ${h}:${mi}:${s}`;
}

async function fetchAmpData(bucket, startIso, endIso) {
  const flux = `
    from(bucket: "${bucket}")
      |> range(start: time(v: "${startIso}"), stop: time(v: "${endIso}"))
      |> filter(fn: (r) => r._measurement == "DRIVE")
      |> filter(fn: (r) => r._field == "amp")
      |> sort(columns: ["_time"], desc: false)
  `;

  return new Promise((resolve, reject) => {
    const rows = [];
    queryApi.queryRows(flux, {
      next(row, tableMeta) {
        try {
          const o = tableMeta.toObject(row);
          rows.push({
            time: o._time,
            drive: o.drive,
            shift: bucket.replace("SHIFT_", ""),
            amp: o._value,
          });
        } catch (e) {}
      },
      error: reject,
      complete: () => resolve(rows),
    });
  });
}

async function main() {
  const startYmd = process.argv[2];
  const endYmd = process.argv[3];

  if (!startYmd || !endYmd) {
    console.error(
      "Usage: node jobs/exportDriveAmpCsv.js YYYY-MM-DD YYYY-MM-DD",
    );
    process.exit(1);
  }

  const { startUtc, endUtc } = getIstRange(startYmd, endYmd);
  console.log(`Fetching amp data from ${startYmd} to ${endYmd} IST...`);

  let allRows = [];

  // Fetch from all 3 shift buckets
  for (const shift of ["A", "B", "C"]) {
    console.log(`  Querying SHIFT_${shift}...`);
    const rows = await fetchAmpData(`SHIFT_${shift}`, startUtc, endUtc);
    // FIX: Use a loop instead of spread operator to avoid stack overflow
    for (const r of rows) {
      allRows.push(r);
    }
  }

  // Sort chronologically by drive, then time
  allRows.sort((a, b) => {
    if (a.drive !== b.drive) return a.drive.localeCompare(b.drive);
    return new Date(a.time) - new Date(b.time);
  });

  console.log(`Total data points fetched: ${allRows.length}`);

  // Create exports directory if it doesn't exist
  const exportDir = path.join(__dirname, "../exports");
  if (!fs.existsSync(exportDir)) fs.mkdirSync(exportDir, { recursive: true });

  const fileAll = path.join(exportDir, "drive_amp_all.csv");
  const fileChanged = path.join(exportDir, "drive_amp_changed.csv");

  const writeStreamAll = fs.createWriteStream(fileAll);
  const writeStreamChanged = fs.createWriteStream(fileChanged);

  const header = "timestamp_ist,shift,drive,amp\n";
  writeStreamAll.write(header);
  writeStreamChanged.write(header);

  const lastValueByDrive = {};
  let changedCount = 0;

  for (const row of allRows) {
    const ts = formatIstTime(row.time);
    const csvLine = `${ts},${row.shift},${row.drive},${row.amp}\n`;

    // 1. Write to ALL file
    writeStreamAll.write(csvLine);

    // 2. Check if value changed for the CHANGED file
    const prevVal = lastValueByDrive[row.drive];
    if (prevVal === undefined || prevVal !== row.amp) {
      writeStreamChanged.write(csvLine);
      lastValueByDrive[row.drive] = row.amp;
      changedCount++;
    }
  }

  writeStreamAll.end();
  writeStreamChanged.end();

  console.log(`\n✔ Exports complete!`);
  console.log(`  All data     : ${fileAll} (${allRows.length} rows)`);
  console.log(`  Changed only : ${fileChanged} (${changedCount} rows)`);
}

main().catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});

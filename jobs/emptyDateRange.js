/**
 * Delete data from a specific bucket for a date range.
 * Usage: CONFIRM=1 node jobs/emptyDateRange.js <Bucket> <StartDate> <EndDate>
 */

require("dotenv").config({ path: "./db/.env" });
require("dotenv").config({ path: "./.env.influx" });

const { influxDB } = require("../db/influxDB/influx");
const { DeleteAPI, OrgsAPI } = require("@influxdata/influxdb-client-apis");

const ORG_NAME = "BSL Kharkhoda";
const IST_OFFSET_MS = 330 * 60 * 1000;

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

async function main() {
  if (process.env.CONFIRM !== "1") {
    console.error("❌ Must run with CONFIRM=1");
    process.exit(1);
  }

  const bucket = process.argv[2];
  const startYmd = process.argv[3];
  const endYmd = process.argv[4];

  if (!bucket || !startYmd || !endYmd) {
    console.error(
      "Usage: CONFIRM=1 node jobs/emptyDateRange.js <Bucket> <StartDate> <EndDate>",
    );
    process.exit(1);
  }

  const orgsAPI = new OrgsAPI(influxDB);
  const orgs = await orgsAPI.getOrgs({ org: ORG_NAME });
  const orgID = orgs.orgs[0].id;

  // Expand range by 1 day on each side to ensure L5/L6 timestamps (which belong to previous day) are deleted
  const startIso = istMidnightUtcIso(startYmd);
  const endIso = istDayEndUtcIso(endYmd);

  const deleteAPI = new DeleteAPI(influxDB);

  console.log(`Deleting from ${bucket} between ${startIso} and ${endIso}...`);

  await deleteAPI.postDelete({
    orgID,
    bucket,
    body: { start: startIso, stop: endIso },
  });

  console.log(`✔ Successfully requested deletion from ${bucket}.`);
}

main().catch(console.error);

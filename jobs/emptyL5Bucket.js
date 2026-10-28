/**
 * Empty L1 bucket (Delete all data, keep the bucket)
 *
 * Usage:
 *   CONFIRM=1 node jobs/emptyL1Bucket.js
 */

require("dotenv").config({ path: "./db/.env" });
require("dotenv").config({ path: "./.env.influx" });

const { influxDB } = require("../db/influxDB/influx");
const { DeleteAPI, OrgsAPI } = require("@influxdata/influxdb-client-apis");

const ORG_NAME = "BSL Kharkhoda";
const BUCKET_NAME = process.env.L1_BUCKET || "L5";

async function main() {
  if (process.env.CONFIRM !== "1") {
    console.error("❌ Safety check failed.");
    console.error(
      "To prevent accidental deletion, you must run this with CONFIRM=1",
    );
    console.error(`Example: CONFIRM=1 node jobs/emptyL1Bucket.js`);
    process.exit(1);
  }

  console.log(`[Empty L1] Starting wipe for bucket "${BUCKET_NAME}"...`);

  const orgsAPI = new OrgsAPI(influxDB);
  const orgs = await orgsAPI.getOrgs({ org: ORG_NAME });

  if (!orgs.orgs || !orgs.orgs.length) {
    throw new Error(`Org "${ORG_NAME}" not found — check influx credentials`);
  }
  const orgID = orgs.orgs[0].id;

  const deleteAPI = new DeleteAPI(influxDB);

  // Delete from 1970 to tomorrow (to catch everything, even future timestamped test data)
  const start = new Date(0).toISOString(); // 1970-01-01
  const stop = new Date(Date.now() + 86400000).toISOString(); // Tomorrow

  try {
    await deleteAPI.postDelete({
      orgID,
      bucket: BUCKET_NAME,
      body: {
        start,
        stop,
      },
    });

    console.log(`✔ Successfully requested data deletion for "${BUCKET_NAME}".`);
    console.log(`   Note: InfluxDB processes deletes asynchronously.`);
    console.log(
      `   It may take a few seconds to a minute for the UI to show the bucket as empty.`,
    );
  } catch (e) {
    console.error("❌ Failed to delete data:", e.message || e);
  }
}

main().catch((e) => {
  console.error("[Empty L1] fatal:", e);
  process.exit(1);
});

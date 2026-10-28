require("dotenv").config({ path: "./db/.env" });
require("dotenv").config({ path: "./.env.influx" });
const { influxDB } = require("../db/influxDB/influx");
const { BucketsAPI, OrgsAPI } = require("@influxdata/influxdb-client-apis");

const ORG_NAME = "BSL Kharkhoda";
const BUCKET_NAME = "L9";

async function main() {
  const bucketsAPI = new BucketsAPI(influxDB);
  const orgsAPI = new OrgsAPI(influxDB);

  const existing = await bucketsAPI.getBuckets({ name: BUCKET_NAME });
  if (existing.buckets && existing.buckets.length) {
    console.log(`✔ bucket "${BUCKET_NAME}" already exists`);
    return;
  }

  const orgs = await orgsAPI.getOrgs({ org: ORG_NAME });
  const orgID = orgs.orgs[0].id;

  await bucketsAPI.postBuckets({
    body: {
      orgID,
      name: BUCKET_NAME,
      description: "L4 Daily Snapshot (Last Values & Status Counts)",
      retentionRules: [{ type: "expire", everySeconds: 0 }], // Infinite
    },
  });
  console.log(`✔ created bucket "${BUCKET_NAME}"`);
}
main().catch(console.error);

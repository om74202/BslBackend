/**
 * Fetch Bucket Sizes from InfluxDB (OSS Compatible)
 * Usage: node jobs/getBucketSizes.js
 */

require("dotenv").config({ path: "./db/.env" });
require("dotenv").config({ path: "./.env.influx" });

const { influxDB } = require("../db/influxDB/influx");
const { BucketsAPI } = require("@influxdata/influxdb-client-apis");

const ORG_NAME = "BSL Kharkhoda";
const queryApi = influxDB.getQueryApi(ORG_NAME);
const bucketsAPI = new BucketsAPI(influxDB);

async function getBucketSizes() {
  console.log("Fetching bucket sizes from InfluxDB...\n");

  try {
    // 1. Get all buckets
    const { buckets } = await bucketsAPI.getBuckets({ org: ORG_NAME });

    // 2. Query for storage_shard_disk_size for each bucket
    const results = [];
    let totalBytes = 0;

    for (const bucket of buckets) {
      // Skip internal system buckets
      if (bucket.name.startsWith("_")) continue;

      const fluxQuery = `
        from(bucket: "${bucket.name}")
          |> range(start: -30d)
          |> filter(fn: (r) => r["_measurement"] == "storage_shard_disk_size")
          |> filter(fn: (r) => r["_field"] == "gauge")
          |> last()
      `;

      try {
        const rows = await new Promise((resolve, reject) => {
          const _rows = [];
          queryApi.queryRows(fluxQuery, {
            next(row, tableMeta) {
              const o = tableMeta.toObject(row);
              if (o._value) _rows.push(o._value);
            },
            error: reject,
            complete: () => resolve(_rows),
          });
        });

        // Sum the size of all shards for this bucket
        const bytes = rows.reduce((sum, val) => sum + val, 0);
        totalBytes += bytes;

        results.push({
          name: bucket.name,
          bytes: bytes,
          gb: (bytes / (1024 * 1024 * 1024)).toFixed(4),
          mb: (bytes / (1024 * 1024)).toFixed(2),
        });
      } catch (e) {
        // If the bucket has no shards yet, bytes will be 0
        results.push({ name: bucket.name, bytes: 0, gb: "0.0000", mb: "0.00" });
      }
    }

    // 3. Print results
    results.sort((a, b) => b.bytes - a.bytes);

    console.log(
      "Bucket Name".padEnd(15) +
        " | " +
        "Size (GB)".padStart(10) +
        " | " +
        "Size (MB)".padStart(10),
    );
    console.log("-".repeat(42));
    for (const r of results) {
      console.log(
        r.name.padEnd(15) +
          " | " +
          r.gb.padStart(10) +
          " | " +
          r.mb.padStart(10),
      );
    }
    console.log("-".repeat(42));

    const totalGb = totalBytes / (1024 * 1024 * 1024);
    console.log(`Total Storage Used: ${totalGb.toFixed(4)} GB\n`);
  } catch (err) {
    console.error("Error fetching bucket sizes:", err.message);
    console.log("\n--- FALLBACK METHOD ---");
    console.log(
      "If this fails, you can get the exact size directly from the server's file system:",
    );
    console.log(
      "1. SSH into your InfluxDB server (or the VM running the Docker container).",
    );
    console.log(
      "2. Run: docker exec -it <influxdb_container_name> du -sh /var/lib/influxdb2/engine/data/*",
    );
    console.log(
      "3. Each folder name is a Bucket ID. You can map IDs to names using the InfluxDB UI.",
    );
  }
}

getBucketSizes();

const express = require('express');
const { influxDB } = require('../db/influxDB/influx');
const { QueryApi } = require('@influxdata/influxdb-client');

const influxRouter = express.Router();
const queryApi = influxDB.getQueryApi("opsight.ai");

influxRouter.get('/getTorqueGunData', async (req, res) => {
  const bucket = 'torque_plc';
  const torque_guns = ['torque_gun_1', 'torque_gun_2', 'torque_gun_3'];

  // Build the Flux query to get the latest data for each gun
  const gunFilter = torque_guns.map(gun => `r["torque_gun"] == "${gun}"`).join(' or ');

  const fluxQuery = `
    from(bucket: "torque_plc")
  |> range(start: -24h)
  |> filter(fn: (r) => r["_measurement"] == "torque_measurement")
  |> filter(fn: (r) => 
    r["station"] == "Station 10A" or
    r["station"] == "Station 10B" or
    r["station"] == "Station 10L1" or
    r["station"] == "Station 10R1" or
    r["station"] == "Station 40A" or
    r["station"] == "Station 40E" or
    r["station"] == "Station ST30" or
    r["station"] == "Station ST40" or
    r["station"] == "Station ST40A" or
    r["station"] == "Station ST40B"
  )
  |> filter(fn: (r) => r["_field"] == "angle" or r["_field"] == "connection_status" or r["_field"] == "fail_count" or r["_field"] == "max_limit" or r["_field"] == "min_limit" or r["_field"] == "torque_value" or r["_field"] == "pass_count")
  |> filter(fn: (r) => 
    r["torque_gun"] == "torque_gun_1" or 
    r["torque_gun"] == "torque_gun_2" or 
    r["torque_gun"] == "torque_gun_3"
  )
  |> sort(columns: ["_time"], desc: true)
  |> yield(name: "latest")

  `;

  try {
    const results = [];
    queryApi.queryRows(fluxQuery, {
      next(row, tableMeta) {
        const obj = tableMeta.toObject(row);
        results.push(obj);
      },
      error(error) {
        console.error('Query error:', error);
        res.status(500).json({ error: error.message, message: "Query error" });
      },
      complete() {
        res.json(results);
      }
    });
  } catch (err) {
    console.error('Catch error:', err);
    res.status(500).json({ error: err.message, message: "Unexpected server error" });
  }
});

module.exports = influxRouter;

const express = require('express');
const { influxDB } = require('../db/influxDB/influx');
const { QueryApi } = require('@influxdata/influxdb-client');
const {format} = require('date-fns')

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


influxRouter.get('/torqueGun/data', async (req, res) => {
  try {
    const bucket = 'SHIFT_A';
    const torqueGuns = ['torque_gun_1', 'torque_gun_2', 'torque_gun_3'];
    const stations = [
      'Station 10A', 'Station 10B', 'Station 10L1', 'Station 10R1',
      'Station 40A', 'Station ST30', 'Station ST40A' ,'Station 40E', 'Station ST40B'
    ];
    const fields = [
      'angle', 'angle_count', 'fail_count', 'max_limit','angle_fail_percentage','angle_pass_count','angle_pass_percentage',
      'pass_percentage','fail_percentage',
      'min_limit', 'pass_count', 'torque_count', 'torque_value','connection_status','status','angle_fail_count'
    ];
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
const startTime = `${today}T00:30:00Z`;
const stopTime = `${today}T09:00:00Z`;
console.time("queryTime")

    // Build optimized Flux query
    const fluxQuery = `
      from(bucket: "${bucket}")
        |> range(start: -3h)
        |> filter(fn: (r) => r._measurement == "data")
        |> filter(fn: (r) => ${stations.map(s => `r.station == "${s}"`).join(' or ')})
        |> filter(fn: (r) => ${torqueGuns.map(g => `r.torque_gun == "${g}"`).join(' or ')})
        |> filter(fn: (r) => ${fields.map(f => `r._field == "${f}"`).join(' or ')})
        |> pivot(rowKey:["_time"], columnKey:["_field"], valueColumn:"_value")
        |> sort(columns: ["_time"], desc: true)
    `;
    const results = [];
    // const startTime = Date.now();

    await new Promise((resolve, reject) => {
      queryApi.queryRows(fluxQuery, {
        next(row, tableMeta) {
          try {
            results.push(tableMeta.toObject(row));
          } catch (parseError) {
            console.warn('Row parsing error:', parseError);
          }
        },
        error(error) {
          console.error('Query execution error:', error);
          reject(error);
        },
        complete() {
          console.log(`Query completed in ${Date.now() - startTime}ms`);
          resolve();
        }
      });
    });

    console.timeEnd("queryTime")

console.time("dataSorting")
const transformed = results.reduce((acc, row) => {
  const key = `${row.station}_${row.torque_gun}`;

  if (!acc[key]) {
    acc[key] = {
      station: row.station,
      torque_gun: row.torque_gun,
      data: {
        time: [], // Will store formatted timestamps
        ...fields.reduce((obj, field) => {
          obj[field] = []; // Initialize arrays for each field
          return obj;
        }, {})
      }
    };
  }

  // Convert ISO timestamp to human-readable format
  // const formattedTime = new Date(row._time).toLocaleString();y
  // Alternative: Custom formatting (e.g., "YYYY-MM-DD HH:MM:SS")
  // const formattedTime = new Date(row._time).toISOString().replace('T', ' ').split('.')[0];

  // acc[key].data.time.push(formattedTime);

  // Push { time, value } for each field
  fields.forEach(field => {
    acc[key].data[field].push({
      time: format(new Date(row._time),'HH:mm'), // Use formatted time here
      value: row[field]
    });
  });

  return acc;
}, {});


console.timeEnd("dataSorting")
    res.json({
      success: true,
      data: Object.values(transformed),
      message: "Data fetched successfully"
    });

  } catch (err) {
    console.error('Endpoint error:', err);
    res.status(500).json({
      success: false,
      error: err.message,
      message: "Failed to fetch torque data"
    });
  }
});


module.exports = influxRouter;

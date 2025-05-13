const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 4000 });

const { QueryApi } = require('@influxdata/influxdb-client');
const { influxDB } = require('../db/influxDB/influx');
 // ensure this is set in your .env

const queryApi = influxDB.getQueryApi("opsight.ai");
const start = '-5m';  
const stop = 'now()'

wss.on('connection', (ws) => {
  console.log("Client connected");

  const intervalId = setInterval(async () => {
    const rows = await queryApi.collectRows(`
      from(bucket: "torque_plc")
    |> range(start: ${start}, stop: ${stop})
    |> filter(fn: (r) => r["_measurement"] == "torque_measurement")
  |> filter(fn: (r) => r["station"] == "Station 10A" or r["station"] == "Station 10B" or r["station"] == "Station 10L1" or r["station"] == "Station 10R1" or r["station"] == "Station 40A" or r["station"] == "Station 40E" or r["station"] == "Station ST30" or r["station"] == "Station ST40" or r["station"] == "Station ST40A" or r["station"] == "Station ST40B")
  |> filter(fn: (r) => r["_field"] == "torque_value")
  |> filter(fn: (r) => r["torque_gun"] == "torque_gun_1" or r["torque_gun"] == "torque_gun_2" or r["torque_gun"] == "torque_gun_3")
    |> aggregateWindow(every: 1m, fn: last, createEmpty: false)
    |> yield(name: "last")
    `);
    const payload = {
      data: rows.map(row => ({
        value: row._value,
        station:row.station,
        gun: row.torque_gun
      }))
    };
    console.log(payload.data.length)
    ws.send(JSON.stringify(payload));
  }, 1000);

  ws.on('close', () => clearInterval(intervalId));
});

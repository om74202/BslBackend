require('dotenv').config();
const { InfluxDB } = require('@influxdata/influxdb-client');
const { BucketsAPI } = require('@influxdata/influxdb-client-apis');
const { env } = require('process');


// Set up environment variables or directly replace with your values

const url ="http://20.197.46.212:8086"
const token = "QC92_DI9dW7uKpORhzaEX7xIi3MmAd20hAALxeOs0Gy9_JgozFPqjUTVMXJjHkTyl1m2wzfIbUdR5K4F7N8TVA=="
//8tecUTFpztrGUmSwoFZ_1g-7TTXp_MitnVf9lhna4IxeDWDPFnQV41pyJ-ZCISFk8Ehc89kuWXBGW0xzuMq16A==
// Initialize the InfluxDB client
const influxDB = new InfluxDB({
    url: url, token: token,  
 });

const bucketsAPI = new BucketsAPI(influxDB);
console.log(url , token , "connected")


module.exports={ influxDB, bucketsAPI };

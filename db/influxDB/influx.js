require('dotenv').config();
const { InfluxDB } = require('@influxdata/influxdb-client');
const { BucketsAPI } = require('@influxdata/influxdb-client-apis');
const { env } = require('process');
require("dotenv").config();




// Set up environment variables or directly replace with your values

const url = process.env.INFLUX_URL || "http://20.197.30.129:3005";
const token =process.env.INFLUXDB_TOKEN || "ZrszlOgk6M9zMuoMuM6JF8FWGvhlrBrOZfgv8uHMnMuG2Sp4NUiw6qwtSg217L71McsJ5QCPooXrMJ5Io2rjuw==";
//8tecUTFpztrGUmSwoFZ_1g-7TTXp_MitnVf9lhna4IxeDWDPFnQV41pyJ-ZCISFk8Ehc89kuWXBGW0xzuMq16A==
// Initialize the InfluxDB client
const influxDB = new InfluxDB({
    url: url, token: token,  
 });

const bucketsAPI = new BucketsAPI(influxDB);
console.log(url , token , "connected")


module.exports={ influxDB, bucketsAPI };

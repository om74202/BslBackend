require('dotenv').config();
const { InfluxDB } = require('@influxdata/influxdb-client');
const { BucketsAPI } = require('@influxdata/influxdb-client-apis');
const { env } = require('process');



// Set up environment variables or directly replace with your values

const url ="http://20.198.22.6:8086"
const token = "Y__1DCnm2uTaCeqnTy2Xe6AScyzrM1zSwfrPBiXy9ZjuxEx5DAWfOz4BD-weu0NyQDeR7ig_uBaj2k8B8gKc9A=="
//8tecUTFpztrGUmSwoFZ_1g-7TTXp_MitnVf9lhna4IxeDWDPFnQV41pyJ-ZCISFk8Ehc89kuWXBGW0xzuMq16A==
// Initialize the InfluxDB client
const influxDB = new InfluxDB({
    url: url, token: token,  
 });

const bucketsAPI = new BucketsAPI(influxDB);
console.log(url , token , "connected")


module.exports={ influxDB, bucketsAPI };

require('dotenv').config();
const { InfluxDB } = require('@influxdata/influxdb-client');
const { BucketsAPI } = require('@influxdata/influxdb-client-apis');
const { env } = require('process');



// Set up environment variables or directly replace with your values

const url = process.env.INFLUX_URL || "http://20.40.44.15:8086";
const token = process.env.INFLUXDB_TOKEN || "xZau6g2koGMwLaAz_1qJaXD62GkPFmYL8zE8DO0iMZAm6ns3cR0yuxOIwcllWIW8s_a9E37Ym1LgFmh9v2HJzw==";

// Initialize the InfluxDB client
const influxDB = new InfluxDB({
    url: url, token: token,  
 });

const bucketsAPI = new BucketsAPI(influxDB);
console.log(url , token , "connected")


module.exports={ influxDB, bucketsAPI };
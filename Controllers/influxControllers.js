import { influxDB } from '../db/influxDB/influx';
const express = require('express');

const { QueryApi, InfluxDB } = require('@influxdata/influxdb-client');
const {format,parseISO} = require('date-fns')
const influxRouter = express.Router();
const queryApi = influxDB.getQueryApi("opsight_ai");





export const influxQuery=(query)=>{
    
}

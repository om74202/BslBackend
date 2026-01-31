const express = require('express');
const { influxDB } = require('../db/influxDB/influx');
const prismaClient =require('../lib/prismaClient.js');


const { QueryApi, InfluxDB } = require('@influxdata/influxdb-client');
const {format,parseISO} = require('date-fns')
const influxRouter = express.Router();
const queryApi = influxDB.getQueryApi("BSL Kharkhoda");

const fs = require("fs/promises");
const { jsPDF } = require("jspdf");
const autoTableImport = require("jspdf-autotable");
const autoTable =
  autoTableImport?.default ||
  autoTableImport?.autoTable ||
  autoTableImport;

const { PDFDocument } = require("pdf-lib");
const crypto = require("crypto");
const { sendPerformanceReportPdfMail } = require('../functions/userFunctions.js');
const { extractHPCData, plantFields, torqueFields, getLastValidItem, reasonsMap } = require('../functions/shiftTimings.js');

function getLatestValidTorque(dataArray) {
  // Loop from the end of the array (most recent first)
  for (let i = dataArray.length - 1; i >= 0; i--) {
    const obj = dataArray[i];

    // Check only the required fields
    if (obj.min_limit !== null &&
        obj.fail_count !== null &&
        obj.fail_percentage !== null) {
      return obj; // Return first matching object
    }
  }
  return null; // If no valid object found
}

const getSingleTorqueGun=async (req, res) => {
  try {
    const { shift, date,torquegunName,station } = req.params;
    const selectedDate = date ? new Date(date) : new Date();

    const { startTime, endTime } = getShiftTiming(shift, selectedDate);
    if (!startTime || !endTime) {
      throw new Error("Start time or end time is undefined.");
    }

    const bucket = `SHIFT_${shift}`;
    const measurement = "TORQUE";

    // --- Read query params (support single or comma-separated values) ---
   // const { torquegunName, station: stationQuery } = req.query;

    const torqueNames = torquegunName
      ? (Array.isArray(torquegunName)
          ? torquegunName.flatMap(s => s.split(',').map(x => x.trim()).filter(Boolean))
          : torquegunName.split(',').map(x => x.trim()).filter(Boolean))
      : null;

    const stationNames = station
      ? (Array.isArray(station)
          ? station.flatMap(s => s.split(',').map(x => x.trim()).filter(Boolean))
          : station.split(',').map(x => x.trim()).filter(Boolean))
      : null;

    // --- Default lists (used only if corresponding query param not provided) ---
    const torqueGunsDefault = ['torque_gun_1', 'torque_gun_2', 'torque_gun_3'];
    const stationsDefault = [
      'Station 10A', 'Station 10B', 'Station 10L1','Station 10R1',
      'Station 40A', 'Station ST30', 'Station ST40' ,'Station 40E', 'Station ST40B'
    ];

    // Choose which lists to use for building filters
    const torqueListToUse = torqueNames && torqueNames.length ? torqueNames : torqueGunsDefault;
    const stationListToUse = stationNames && stationNames.length ? stationNames : stationsDefault;

    // Build safe filter expressions
    const stationFilterExpr = stationListToUse
      .map(s => `r.station == "${s.replace(/"/g, '\\"')}"`)
      .join(' or ');

    const torqueFilterExpr = torqueListToUse
      .map(t => `r.torque_gun == "${t.replace(/"/g, '\\"')}"`)
      .join(' or ');

    // Use ISO strings for Flux time() to be safe
    const startIso = (startTime instanceof Date) ? startTime.toISOString() : new Date(startTime).toISOString();
    const endIso = (endTime instanceof Date) ? endTime.toISOString() : new Date(endTime).toISOString();

    // Build Flux query
    const fluxQuery = `
      from(bucket: "${bucket}")
        |> range(start: time(v: "${startIso}"), stop: time(v: "${endIso}"))
        |> filter(fn: (r) => r._measurement == "${measurement}")
        |> filter(fn: (r) => (${stationFilterExpr}))
        |> filter(fn: (r) => (${torqueFilterExpr}))
        |> aggregateWindow(every: 10s, fn: last, createEmpty: false)
        |> pivot(rowKey:["_time"], columnKey:["_field"], valueColumn:"_value")
        |> sort(columns: ["_time"], desc: true)
    `;

    // Execute query
    const results = [];
    const queryStartMs = Date.now();

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
          console.log(`Query completed in ${Date.now() - queryStartMs}ms`);
          resolve();
        }
      });
    });

    // --- existing processing (unchanged) ---
    let connected = 0;
    let disconnected = 0;
    let alertsCount = 0;

    const groupedData = results.reduce((acc, current) => {
      const station = current.station;
      const torqueGun = current.torque_gun;
      const time = current._time;
      const torqueValue = current.torque_value;
      const angle = current.angle;
      const isConnected = current.connection_status === 'connected';

      if (!acc[station]) {
        acc[station] = {
          recoveredSequenceNo: [],
          sequenceNo: [],
          torqueGuns: {},
          connectionStatus: isConnected,
          firstConnectionUpdate: time
        };
      }

      if (current.sequence_no) {
        acc[station].sequenceNo.push({
          Sequence_Number: current.sequence_no,
          time: format(new Date(time), 'HH:mm')
        });
      } else if (current.recovered_sequence_no) {
        acc[station].recoveredSequenceNo.push({
          Sequence_Number: current.recovered_sequence_no,
          time: format(new Date(time), 'HH:mm')
        });
      }

      if (!acc[station].torqueGuns[torqueGun]) {
        acc[station].torqueGuns[torqueGun] = {
          torqueData: [],
          angleData: [],
          first: {
            connectionStatus: isConnected,
            timeOfStatus: time
          },
          hasValidPassData: false
        };
      }

      const gunData = acc[station].torqueGuns[torqueGun];

      if (!gunData.hasValidPassData) {
        const passDataValid = current.pass_count !== null && current.pass_percentage !== null;
        if (passDataValid) {
          gunData.hasValidPassData = true;
          Object.keys(current).forEach(key => {
            if (!['torque_value', 'angle', 'station', 'torque_gun', '_time'].includes(key)) {
              if (current[key] !== null && !gunData.first.hasOwnProperty(key)) {
                gunData.first[key] = current[key];
              }
            }
          });
          if (!gunData.first.hasOwnProperty('connectionStatus')) {
            gunData.first.connectionStatus = isConnected;
          }
        }
      }

      gunData.torqueData.push({
        time: format(new Date(time), 'HH:mm'),
        value: torqueValue
      });

      gunData.angleData.push({
        time: format(new Date(time), 'HH:mm'),
        value: angle
      });

      return acc;
    }, {});

    Object.keys(groupedData).forEach(station => {
      if (groupedData[station]?.connectionStatus === true) connected++;
      Object.keys(groupedData[station].torqueGuns).forEach(torqueGun => {
        groupedData[station].torqueGuns[torqueGun].torqueData.sort((a, b) =>
          new Date(a.time) - new Date(b.time)
        );
        groupedData[station].torqueGuns[torqueGun].angleData.sort((a, b) =>
          new Date(a.time) - new Date(b.time)
        );
      });
    });

    res.json({
      success: true,
      data: groupedData,
      connected,
      disconnected,
      latestData: getLatestValidTorque(results),
      alerts: alertsCount,
      lastData: results[0],
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
}



const getAllTorqueGuns=async (req, res) => {
  try {
const { shift, date } = req.params;
const selectedDate = date ? new Date(date) : new Date();

const { startTime, endTime } = getShiftTiming(shift, selectedDate);
    if (!startTime || !endTime) {
      throw new Error("Start time or end time is undefined.");
    }

    const bucket=`SHIFT_${shift}`
    const measurement="TORQUE";
    const torqueGuns = ['torque_gun_1', 'torque_gun_2', 'torque_gun_3'];
    const stations = [
      'Station 10A', 'Station 10B', 'Station 10L1','Station 10R1',
      'Station 40A', 'Station ST30', 'Station ST40' ,'Station 40E', 'Station ST40B'
    ];
//console.time("queryTime")

    // Build optimized Flux query
    const fluxQuery = `
      from(bucket: "${bucket}")
       |> range(start: time(v: "${startTime}"), stop: time(v: "${endTime}"))
        |> filter(fn: (r) => r._measurement == "${measurement}")
        |> filter(fn: (r) => ${stations.map(s => `r.station == "${s}"`).join(' or ')})
       |> aggregateWindow(every: 10s, fn: last, createEmpty: false)
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
let connected = 0;
let disconnected = 0;
let alertsCount = 0;

const groupedData = results.reduce((acc, current) => {
    const station = current.station;
    const torqueGun = current.torque_gun;
    const time = current._time;
    const torqueValue = current.torque_value;
    const angle = current.angle;
    const isConnected = current.connection_status === 'connected';

    // Initialize station if not exists
    if (!acc[station]) {
        acc[station] = {
    recoveredSequenceNo:[],
            sequenceNo: [],
            torqueGuns: {
      },
            connectionStatus: isConnected,  // Top-level connection status
            firstConnectionUpdate: time
        };
    }

    if (current.sequence_no) {
    
        acc[station].sequenceNo.push({
            Sequence_Number: current.sequence_no,
            time: format(new Date(time), 'HH:mm')
        });

    }else if(current.recovered_sequence_no){
      acc[station].recoveredSequenceNo.push({
            Sequence_Number: current.recovered_sequence_no,
            time: format(new Date(time), 'HH:mm')
        });

    }

    // Initialize torque gun if not exists
    if (!acc[station].torqueGuns[torqueGun]) {
        acc[station].torqueGuns[torqueGun] = {
            torqueData: [],
            angleData: [],
            first: {
                connectionStatus: isConnected,  // Add connectionStatus to first object
    timeOfStatus:time
            },
            hasValidPassData: false
        };
    }

    const gunData = acc[station].torqueGuns[torqueGun];

    // Only try to store first values if we haven't found valid pass data yet
    if (!gunData.hasValidPassData) {
        const passDataValid = current.pass_count !== null && current.pass_percentage !== null;

        if (passDataValid) {
            // Mark that we've found valid pass data
            gunData.hasValidPassData = true;

            // Store all first values (not just pass data)
            Object.keys(current).forEach(key => {
                if (!['torque_value', 'angle', 'station', 'torque_gun', '_time'].includes(key)) {
                    if (current[key] !== null && !gunData.first.hasOwnProperty(key)) {
                        gunData.first[key] = current[key];
                    }
                }
            });
            
            // Ensure connectionStatus is preserved in first object
            if (!gunData.first.hasOwnProperty('connectionStatus')) {
                gunData.first.connectionStatus = isConnected;
            }
        }
    }

    // Always add torque and angle data points
    gunData.torqueData.push({
        time: format(new Date(time), 'HH:mm'),
        value: torqueValue
    });

    gunData.angleData.push({
        time: format(new Date(time), 'HH:mm'),
        value: angle
    });

    return acc;
}, {});
// Sort all data by time and count connected stations
Object.keys(groupedData).forEach(station => {
    // Update connected station count
  if(groupedData[station]?.connectionStatus===true){
//		console.log("hii from stations",station,groupedData[station])
    connected++;
  }
    // Sort torque gun data
    Object.keys(groupedData[station].torqueGuns).forEach(torqueGun => {
      
        groupedData[station].torqueGuns[torqueGun].torqueData.sort((a, b) =>
            new Date(a.time) - new Date(b.time)
        );
        groupedData[station].torqueGuns[torqueGun].angleData.sort((a, b) =>
            new Date(a.time) - new Date(b.time)
        );
    });
});

// Add connected station count to the final result
const finalData = {
    stations: groupedData,
    connectedStationCount: connected,
  disconnectedStationCount:disconnected,
};
//    console.timeEnd("queryTime")

console.time("dataSorting")




// Convert results into an array of field name and their value
// Assuming you want this for just the first result row:




console.timeEnd("dataSorting")
    res.json({
      success: true,
      data:groupedData,
      connected:connected,
      disconnected:disconnected,
      latestData:getLatestValidTorque(results),
      alerts:alertsCount,
      lastData:results[0],
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
}


const getSingleDrive=async (req, res) => {
  try {
    const { drive, shift, date } = req.params;
    if (!drive) return res.status(400).json({ success: false, message: "drive param required" });

    const selectedDate = date ? new Date(date) : new Date();
    const { startTime, endTime } = getShiftTiming(shift, selectedDate);

    if (!startTime || !endTime) {
      return res.status(400).json({ success: false, message: "Invalid shift timing" });
    }

    const bucket = `SHIFT_${shift}`;
    const measurement = 'DRIVE';

    // Build flux query for single drive
    const fluxQuery = `
      from(bucket: "${bucket}")
        |> range(start: time(v: "${startTime}"), stop: time(v: "${endTime}"))
        |> filter(fn: (r) => r._measurement == "${measurement}")
        |> filter(fn: (r) => r.drive == "${drive}")
        |> filter(fn: (r) => r._field == "amp" or r._field == "volt" or r._field == "freq" or r._field == "running_count" or r._field == "stopped_count" or r._field == "status" or r._field == "amp_status")
        |> aggregateWindow(every: 30s, fn: last, createEmpty: false)
        |> pivot(rowKey:["_time"], columnKey:["_field"], valueColumn:"_value")
        |> sort(columns: ["_time"], desc: false)
    `;

    const rows = [];
    const queryStart = Date.now();

    await new Promise((resolve, reject) => {
      queryApi.queryRows(fluxQuery, {
        next(row, tableMeta) {
          try {
            rows.push(tableMeta.toObject(row));
          } catch (parseError) {
            console.warn('Row parse error:', parseError);
          }
        },
        error(err) {
          console.error('Influx query error:', err);
          reject(err);
        },
        complete() {
          console.log(`Single-drive query completed in ${Date.now() - queryStart}ms`);
          resolve();
        }
      });
    });

    // Process rows for single drive
    let alertCount = 0;
    const driveResult = {
      ampData: [],
      voltData: [],
      freqData: [],
      lastNonZero: { amp: null, volt: null, freq: null },
      latestStatus: null,
      latestStatusTime: null,
      // optional fields for ALL-like summary (if drive === 'ALL')
      latestRunningCount: null,
      latestStoppedCount: null,
      latestUpdateTime: null,
      ampStatus: null,
    };

    // Store all status data to find the latest
    const statusData = [];

    // rows are sorted desc by _time; we want to push in chronological or keep desc? 
    // We'll keep the same order as your original (push in iteration order) and set latest values from last encountered.
    for (const r of rows) {
      const displayTime = format(new Date(r._time), 'HH:mm');
      const amp = typeof r.amp === 'number' ? r.amp : (r.amp ? Number(r.amp) : 0);
      const volt = typeof r.volt === 'number' ? r.volt : (r.volt ? Number(r.volt) : 0);
      const freq = typeof r.freq === 'number' ? r.freq : (r.freq ? Number(r.freq) : 0);
      const status = r.status;
      const ampStatus = r.amp_status;
      const runningCount = r.running_count;
      const stoppedCount = r.stopped_count;

      // count alerts (non-PASS amp_status)
      if (ampStatus && ampStatus !== "PASS") alertCount++;

      // Store status data for latest check (for both ALL and individual drives)
      if (status || ampStatus) {
        statusData.push({
          time: r._time, // Keep original timestamp for comparison
          displayTime: displayTime,
          status: status,
          ampStatus: ampStatus,
          runningCount: runningCount,
          stoppedCount: stoppedCount
        });
      }

      // Capture latest summary if drive === 'ALL' (similar to your other route)
      if (drive === 'ALL') {
        if (driveResult.latestUpdateTime === null) {
          driveResult.latestRunningCount = runningCount ?? driveResult.latestRunningCount;
          driveResult.latestStoppedCount = stoppedCount ?? driveResult.latestStoppedCount;
          driveResult.latestUpdateTime = displayTime;
          driveResult.ampStatus = ampStatus ?? driveResult.ampStatus;
        }
        // continue - we don't store time-series for ALL
        continue;
      }

      // For individual drive, collect series and latest status/time
      driveResult.ampData.push({ time: displayTime, value: amp });
      driveResult.voltData = driveResult.voltData || [];
      driveResult.voltData.push({ time: displayTime, value: volt });
      driveResult.freqData = driveResult.freqData || [];
      driveResult.freqData.push({ time: displayTime, value: freq });

      if (amp && amp !== 0) driveResult.lastNonZero.amp = amp;
      if (volt && volt !== 0) driveResult.lastNonZero.volt = volt;
      if (freq && freq !== 0) driveResult.lastNonZero.freq = freq;
    }

    // Find the latest status from statusData
    if (statusData.length > 0) {
      // Sort by time in descending order to get the latest
      statusData.sort((a, b) => new Date(b.time) - new Date(a.time));
      
      // Get the most recent entry with status or ampStatus
      const latestStatusEntry = statusData.find(entry => entry.status || entry.ampStatus) || statusData[0];
      
      // Set the latest values - these should be the most recent
      driveResult.latestStatus = latestStatusEntry.status || driveResult.latestStatus;
      driveResult.latestStatusTime = latestStatusEntry.displayTime;
      driveResult.ampStatus = latestStatusEntry.ampStatus || driveResult.ampStatus;
      
      // For ALL drive, also update running/stopped counts from the latest status entry
      if (drive === 'ALL') {
        driveResult.latestRunningCount = latestStatusEntry.runningCount ?? driveResult.latestRunningCount;
        driveResult.latestStoppedCount = latestStatusEntry.stoppedCount ?? driveResult.latestStoppedCount;
      }
    }

    // If you want chronological order (oldest -> newest), reverse arrays:
    // driveResult.ampData.reverse();
    // driveResult.voltData.reverse();
    // driveResult.freqData.reverse();

    return res.json({
      success: true,
      data: driveResult,
      alerts: alertCount,
      message: `Drive ${drive} data fetched successfully`
    });
  } catch (err) {
    console.error("Single-drive endpoint error:", err);
    return res.status(500).json({
      success: false,
      error: err.message,
      message: "Failed to fetch drive data"
    });
  }
}

const getAllDrivesData=async (req, res) => {
  try {
const { shift, date } = req.params;
const selectedDate = date ? new Date(date) : new Date();

const { startTime, endTime } = getShiftTiming(shift, selectedDate);

    if (!startTime || !endTime) {
      throw new Error("Start time or end time is undefined.");
    }
           console.log(startTime,endTime)

    const bucket = `SHIFT_${shift}`;
    const measurement='DRIVE'
    let drives=[];
    drives = Array.from({ length: 22 }, (_, i) => `Drive_${i + 1}`);
    drives.push('ALL');
   
    

    console.time("queryTime1");

    // Build optimized Flux query
    const fluxQuery = `
      from(bucket: "${bucket}")
      |> range(start: time(v: "${startTime}"), stop: time(v: "${endTime}"))

        |> filter(fn: (r) => r._measurement == "${measurement}")
        |> filter(fn: (r) => ${drives.map(d => `r.drive == "${d}"`).join(' or ')})
        |> aggregateWindow(every: 30s, fn: last, createEmpty: false)
        |> pivot(rowKey:["_time"], columnKey:["_field"], valueColumn:"_value")
        |> sort(columns: ["_time"], desc: true)
    `;

    const results = [];
    const queryStartTime = Date.now();

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
          console.log(`Query completed in ${Date.now() - queryStartTime}ms`);
          resolve();
        }
      });
    });

    console.timeEnd("queryTime1");
    let onlineDrives=0;
    let offlineDrives=0;

// Define alert counter outside the function
let alertCount = 0;  // Global counter for non-PASS drives

const processDriveData = (driveArray) => {
    // Reset alertCount on each run (counts current non-PASS drives)
    alertCount = 0;
    const lastStatusPerDrive = {};  // Tracks latest amp_status per drive

    const result = driveArray.reduce((acc, current) => {
        const displayTime = format(new Date(current._time), 'HH:mm');
        const drive = current.drive;
        const status = current.status;
        const ampStatus = current.amp_status;

        // Always update the latest status for this drive
        lastStatusPerDrive[drive] = ampStatus;

        if (!acc[drive]) {
            if (drive === "ALL") {
                acc[drive] = {
                    latestRunningCount: current.running_count,
                    latestStoppedCount: current.stopped_count,
                    latestStatus: status,
                    latestUpdateTime: displayTime,
      ampStatus:ampStatus,
                };
            } else {
        if(current.amp_status==="FAIL"){
          alertCount++;
        }
                acc[drive] = {
                    ampData: [],
                    voltData: [],
                    freqData: [],
                    lastNonZero: { amp: null, volt: null, freq: null },
                    latestStatus: null,
                    latestStatusTime: null
                };
            }
        }

        if (drive === "ALL") {
            // No processing needed for "ALL" drive
        } else {
            acc[drive].ampData.push({
                time: displayTime,
                value: current.amp
            });

            if (current.amp !== 0) acc[drive].lastNonZero.amp = current.amp;
            if (current.volt !== 0) acc[drive].lastNonZero.volt = current.volt;
            if (current.freq !== 0) acc[drive].lastNonZero.freq = current.freq;

            if (!acc[drive].latestStatus) {
                acc[drive].latestStatus = status;
                acc[drive].latestStatusTime = displayTime;
            }
        }

        return acc;
    }, {});

    // After processing all data, count drives with last status ≠ "PASS"

    return result;  // Original structure untouched
};



    res.json({
      success: true,
      data: processDriveData(results),
      alerts:alertCount,
      
     
      message: "Drive status data fetched successfully"
    });

  } catch (err) {
    console.error('Endpoint error:', err);
    res.status(500).json({
      success: false,
      
      error: err.message,
      message: "Failed to fetch drive status data"
    });
  }
}



const getQualityData=async(req,res)=>{
const {line}=req.params;


const { shift, date } = req.params;
const selectedDate = date ? new Date(date) : new Date();

const { startTime, endTime } = getShiftTiming(shift, selectedDate);

    if (!startTime || !endTime) {
      throw new Error("Start time or end time is undefined.");
    }

let bucket=`SHIFT_${shift}`
	if(shift==="r"){
		bucket="TODAY";
	}

const reasons=reasonsMap[line]
const measurement=`QUALITY`


console.time("queryTime1")

    // Build optimized Flux query
	// const fluxStringArray = `[${queryField.map(f => `"${f}"`).join(", ")}]`;
  const fluxQuery = `
  from(bucket: "${bucket}")
  |> range(start: time(v: "${startTime}"), stop: time(v: "${endTime}"))

    |> filter(fn: (r) => 
      (r["LINE"] == "${line}") or 
      (
        (r["LINE"] == "dismental" or r["LINE"] == "rework") and 
        (${reasons.map(f => `r._field == "${f}"`).join(" or ")})
      )
    )
    |> aggregateWindow(every: 30s, fn: last, createEmpty: false)
    |> pivot(rowKey:["_time"], columnKey:["_field"], valueColumn:"_value")
    |> sort(columns: ["_time"], desc: false)
  `;
  
  const results = [];
    const queryStartTime = Date.now();

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
          console.log(`Query completed in ${Date.now() - queryStartTime}ms`);
          resolve();
        }
      });
    });

    console.timeEnd("queryTime1");
	function humanReadableTime(isoString) {
  const date = parseISO(isoString);
  return format(date, "dd MMM yyyy, hh:mm:ss a");
}
let firstTimePassRated="First_Time_Pass_Rate"
let lastData={}
const processQualityData = (dataArray) => {
  const result = {
      firstTimePassRate: [],
      rjData: {},
      rwData: {},
  };

  dataArray.forEach(item => {
	   if(item.LINE!=="dismental" && item.LINE!=="rework"){
                  lastData=item;
          }

      const time = item._time;
      const displayTime = format(new Date(time), 'HH:mm'); // Using date-fns format
      
      // Process First_Time_Pass_Rate
const passRateValue = item[firstTimePassRated] ?? null; // Using nullish coalescing
    if (passRateValue !== null) {
      result.firstTimePassRate.push({
        time: displayTime,
        value: passRateValue,
        originalTime: time // Adding originalTime for consistency
      });
    }
      // Process rj* metrics
      Object.keys(item).forEach(key => {
          if (key.startsWith('rj')) {
              if (!result.rjData[key]) {
                  result.rjData[key] = [];
              }
              result.rjData[key].push({
                  time: displayTime,
                  value: item[key],
                  originalTime: time
              });
          }
      });

      // Process rw* metrics
      Object.keys(item).forEach(key => {
          if (key.startsWith('rw')) {
              if (!result.rwData[key]) {
                  result.rwData[key] = [];
              }
              result.rwData[key].push({
                  time: displayTime,
                  value: item[key],
                  originalTime: time
              });
          }
      });
  });

  // Sort all arrays by original time (ascending)
  result.firstTimePassRate.sort((a, b) => new Date(a.originalTime) - new Date(b.originalTime));
  
  Object.keys(result.rjData).forEach(key => {
      result.rjData[key].sort((a, b) => new Date(a.originalTime) - new Date(b.originalTime));
  });
  
  Object.keys(result.rwData).forEach(key => {
      result.rwData[key].sort((a, b) => new Date(a.originalTime) - new Date(b.originalTime));
  });

  return result;
};

const processQualityReasons = (dataArray) => {
  const result = {
    dismental: [],
    rework: []
  };

  // Filter and separate data
  dataArray.forEach(item => {
    if (item.LINE === "dismental" || item.LINE === "rework") {
      const entry = {
        OriginalTime: item._time,
        time: new Date(item._time).toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        }),
        metrics: {}
      };

      // Extract only FLR/CLR/RLR fields
      Object.keys(item).forEach(key => {
        if (key.match(/^(FLR|CLR|RLR)/)) {
          entry.metrics[key] = item[key];
        }
      });

      // Push to appropriate array
      item.LINE === "dismental"
        ? result.dismental.push(entry)
        : result.rework.push(entry);
    }
  });

// Helper function to convert time to minutes for comparison
const timeToMinutes = (timeStr) => {
  const [time, period] = timeStr.split(' ');
  let [hours, minutes] = time.split(':').map(Number);

  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;

  return hours * 60 + minutes;
};

// Get shift-specific cutoff in minutes
const shiftCutoffs = {
  SHIFT_B: timeToMinutes("02:35 PM"),
  SHIFT_C: timeToMinutes("11:05 PM")
};

// Modified function to get last valid entry after shift cutoff
const getLastValidEntry = (arr, bucket) => {
  if (!arr.length) return null;

  // Use shift cutoff if bucket is B or C
  const cutoff = shiftCutoffs[bucket] ?? 0;

  // Find the last item whose time is after cutoff
  const lastEntry = [...arr].reverse().find(entry => {
    const entryMinutes = timeToMinutes(entry.time);
    return entryMinutes >= cutoff;
  });

  return lastEntry || null;
};

// Use the modified function with shift bucket
const lastDismental = getLastValidEntry(result.dismental, bucket);
const lastRework = getLastValidEntry(result.rework, bucket);

const lastValues = {
  dismental: lastDismental ? lastDismental.metrics : null,
  dismentalTime: lastDismental ? lastDismental.time : null,
  rework: lastRework ? lastRework.metrics : null,
  reworkTime: lastRework ? lastRework.time : null
};

  return { 
    separatedData: result, 
    lastValues 
  };
};




  res.json({
    success:true,
	  data:processQualityData(results),
    latestData:lastData,
    rawData:processQualityReasons(results).lastValues,
	  
    message:"Quality Data fetched successfully"
  })
}


const getLineData=async(req,res)=>{
  const {line}=req.params
const { shift, date } = req.params;
const selectedDate = date ? new Date(date) : new Date();

const { startTime, endTime } = getShiftTiming(shift, selectedDate);

    if (!startTime || !endTime) {
      throw new Error("Start time or end time is undefined.");
    }
let bucket=`SHIFT_${shift}`
        if(shift==="r"){
                bucket="TODAY";
        }

  const measurement='Performance'


  
  // Usage in your Flux query:
  // const fields = tags
  //   .map(field => `r._field == "${field}"`)
  //   .join(" or ");
console.time("queryTime1")
const fluxQuery = `
from(bucket: "${bucket}")
|> range(start: time(v: "${startTime}"), stop: time(v: "${endTime}"))

  |> filter(fn: (r) => r["_measurement"] == "${measurement}")
  |> filter(fn: (r) => r["LINE"] == "${line}")
  |> aggregateWindow(every: 30s, fn: last, createEmpty: false)
    |> pivot(rowKey:["_time"], columnKey:["_field"], valueColumn:"_value")
    |> sort(columns: ["_time"], desc: false)
`;
    try{
const results = [];
    const queryStartTime = Date.now();

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
          console.log(`Query completed in ${Date.now() - queryStartTime}ms`);
          resolve();
        }
      });
    });

        console.timeEnd("queryTime1");
        function humanReadableTime(isoString) {
      const date = parseISO(isoString);
       return format(date, "hh:mm a");
     }
	    const resultsFinal=results.reduce((acc, item) => {
  acc[item._field] = item._value;
  return acc;
}, {});


let oeekey="OEE";
	    let productivityKey="Productivity";
	    let availabilityKey="Avail";
	    let qualityKey="Quality";
let runmodeKey="Run_Mode";
const reduced = {
  oee: [],
  productivity: [],
  quality: [],
  availability: [],
  runMode:[],
};


results.forEach(item => {
  const time = format(new Date(item._time), 'HH:mm')
  
  if (item[oeekey] !== null) {
    reduced.oee.push({ time, value: item[oeekey] });
  }
  
  if (item[productivityKey] !== null) {
    reduced.productivity.push({ time, value: item[productivityKey] });
  }
  
  if (item[qualityKey] !== null) {
    reduced.quality.push({ time, value: item[qualityKey] });
  }
  
  if (item[availabilityKey] !== null) {
    reduced.availability.push({ time, value: item[availabilityKey] });
  }
  
  if (item[runmodeKey] !== null) {
    reduced.runMode.push({ time, value: item[runmodeKey] });
  }
});



// Assuming your results have a sequence number field (adjust field name as needed)
const sequenceField = 'SequenceNo';
const handsideField = 'Handside';

// Create a map to group data by sequence + handside
const rowsBySequenceAndSide = new Map();

results.forEach(row => {
  const sequenceNum = row[sequenceField];
  const handside = row[handsideField];

  // Generate a unique composite key like "1234-RH"
  const key = `${sequenceNum}-${handside}`;

  // Initialize row object if it doesn't exist
  if (!rowsBySequenceAndSide.has(key)) {
    rowsBySequenceAndSide.set(key, {
      [sequenceField]: sequenceNum,
      [handsideField]: handside,
      _time: format(new Date(row._time), 'dd:HH:mm'),
    });
  }

  const currentRow = rowsBySequenceAndSide.get(key);

  // Add all torque fields to the row
  torqueFields[line].forEach(field => {
    currentRow[field] = field in row ? (row[field] !== null ? row[field] : 0) : 0;
  });
});

// Convert map to array
const tableData = Array.from(rowsBySequenceAndSide.values());

// Optional: Sort by SequenceNo, then HANDSIDE (RH before LH)
tableData.sort((a, b) => {
  if (a[sequenceField] !== b[sequenceField]) {
    return a[sequenceField] - b[sequenceField];
  }
  return a[handsideField].localeCompare(b[handsideField]);
});




res.json({
  success:true,
  data:getLastValidItem(results),
	datalast:results[results.length-1],
  data2:reduced,
  torqueTableData:tableData

})
}catch(e){
  console.log(e)
  res.json({
    error:e,
    message:"Failed to fetch line dashboard data"
  })
}

}


const getPlantData=async(req,res)=>{
const { shift, date } = req.params;
const selectedDate = date ? new Date(date) : new Date();

const { startTime, endTime } = getShiftTiming(shift, selectedDate);

    if (!startTime || !endTime) {
      throw new Error("Start time or end time is undefined.");
    }

let bucket=`SHIFT_${shift}`
        if(shift==="r"){
                bucket="TODAY";
        }

  const measurement='Performance'

let fieldConditions=plantFields.map(f => `r._field == "${f}"`).join(" or ");


console.time("queryTime1")
const fluxQuery = `
from(bucket: "${bucket}")
|> range(start: time(v: "${startTime}"), stop: time(v: "${endTime}"))

  |> filter(fn: (r) => r["_measurement"] == "Performance"  or r["_measurement"] == "QUALITY" )
   |> filter(fn: (r) => r["LINE"] == "Front_Line" or r["LINE"] == "RB" or r["LINE"] == "RC")
  |> filter(fn: (r) => ${fieldConditions})
  |> aggregateWindow(every: 30s, fn: last, createEmpty: false)
    |> sort(columns: ["_time"], desc: false)
`;
    try{

const results = [];
    const queryStartTime = Date.now();

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
          console.log(`Query completed in ${Date.now() - queryStartTime}ms`);
          resolve();
        }
      });
    });

        console.timeEnd("queryTime1");
        function humanReadableTime(isoString) {
      const date = parseISO(isoString);
       return format(date, "hh:mm:ss a");
     }
      const resultsFinal=results.reduce((acc, item) => {
  acc[item._field] = item._value;
  return acc;
}, {});

const groupData = {};
const finalData = {
  totalProductionInSets:{},
  oeeLatestValues: {},
  qualityLatestValues: {},
  Performance: {},
  QUALITY: {},
  targetProdLatestValues: {},
  todayProduced: {},
  pphValues:{}
};

const lastKnownValues = {}; // 🆕 Track last known values per field per line

// Process all records
results.forEach(({ _measurement, _field, _value, _time, LINE }) => {
  const date = new Date(_time);
  const hhmm=format(new Date(_time), 'HH:mm')

  if (!groupData[_measurement]) groupData[_measurement] = {};
  if (!groupData[_measurement][_field]) groupData[_measurement][_field] = {};

  if (_measurement === "QUALITY") {
    if (!groupData[_measurement][_field][LINE]) {
      groupData[_measurement][_field][LINE] = [];
    }
    groupData[_measurement][_field][LINE].push({
      time: hhmm,
      value: _value,
      timestamp: date.getTime()
    });

    if (!groupData[_measurement][_field][hhmm]) {
      groupData[_measurement][_field][hhmm] = [];
    }
    groupData[_measurement][_field][hhmm].push({
      time: hhmm,
      value: _value,
      line: LINE
    });

  } else if (_measurement === "Performance") {
    if (_field === "OEE" || _field === "Today_planned_Prod" || _field === "pph") {
      if (!groupData[_measurement][_field][LINE]) {
        groupData[_measurement][_field][LINE] = [];
      }
      groupData[_measurement][_field][LINE].push({
        time: hhmm,
        value: _value,
        timestamp: date.getTime()
      });
    }

    const isAverageField = ["Avail", "OEE", "Productivity", "Quality"].includes(_field);
    if (!groupData[_measurement][_field][hhmm]) {
      groupData[_measurement][_field][hhmm] = {
        lineValues: {},
        isAverageField
      };
    }

    const allowedLines = new Set(['Front_Line', 'RB', 'RC']);
    const lineKey = LINE?.trim();

    if (allowedLines.has(lineKey)) {
      // Track last known value per field and line
      if (!lastKnownValues[_field]) lastKnownValues[_field] = {};
      lastKnownValues[_field][lineKey] = _value;

      // Store per-line value in this time bucket
      groupData[_measurement][_field][hhmm].lineValues[lineKey] = _value;
    }
  }
});

// QUALITY
Object.keys(groupData.QUALITY || {}).forEach(field => {
  finalData.QUALITY[field] = [];
  finalData.qualityLatestValues[field] = {};

  Object.keys(groupData.QUALITY[field]).forEach(key => {
    if (!/^\d{2}:\d{2}$/.test(key)) {
      const lineData = groupData.QUALITY[field][key];
      if (Array.isArray(lineData) && lineData.length > 0) {
        const sorted = [...lineData].sort((a, b) => b.timestamp - a.timestamp);
        finalData.qualityLatestValues[field][key] = {
          lastEntry: {
            time: sorted[0].time,
            value: sorted[0].value
          }
        };
      }
    }

    if (/^\d{2}:\d{2}$/.test(key)) {
      groupData.QUALITY[field][key].forEach(entry => {
        finalData.QUALITY[field].push({
          time: entry.time,
          value: entry.value,
          line: entry.line
        });
      });
    }
  });
});

// Performance
Object.keys(groupData.Performance || {}).forEach(field => {

  if (field === "OEE") {
    finalData.oeeLatestValues = {};
    Object.keys(groupData.Performance[field]).forEach(key => {
      if (!/^\d{2}:\d{2}$/.test(key)) {
        const lineData = groupData.Performance[field][key];
        if (Array.isArray(lineData) && lineData.length > 0) {
          const sorted = [...lineData].sort((a, b) => b.timestamp - a.timestamp);
          finalData.oeeLatestValues[key] = {
            lastEntry: {
              time: sorted[0].time,
              value: sorted[0].value
            }
          };
        }
      }
    });
  }

  if (field === "pph") {
    finalData.pphValues= {};
    Object.keys(groupData.Performance[field]).forEach(key => {
      if (!/^\d{2}:\d{2}$/.test(key)) {
        const lineData = groupData.Performance[field][key];
        if (Array.isArray(lineData) && lineData.length > 0) {
          const sorted = [...lineData].sort((a, b) => b.timestamp - a.timestamp);
          finalData.pphValues[key] = {
            lastEntry: {
              time: sorted[0].time,
              value: sorted[0].value
            }
          };
        }
      }
    });
  }


if (field === "total_production_set") {
  finalData.totalProductionInSets = {}; // match desired output key

  const entries = Object.entries(groupData.Performance[field]);

  entries.sort((a, b) => {
    // Sort by timestamp string (e.g., "16:02") descending
    return b[0].localeCompare(a[0]);
  });

  for (const [time, data] of entries) {
    const lineValues = data.lineValues;

    Object.entries(lineValues).forEach(([line, value]) => {
      // Only set if not already set (i.e., we want the latest value)
      if (!finalData.totalProductionInSets[line]) {
        finalData.totalProductionInSets[line] = {
          lastEntry: {
            time,
            value,
          },
        };
      }
    });
  }
}


//entries.sort((a, b) => {
    // Sort by timestamp string (e.g., "16:02") descending
  //  return b[0].localeCompare(a[0]);
 // });

  if (field === "Today_planned_Prod") {
    finalData.todayProduced = {};
    Object.keys(groupData.Performance[field]).forEach(key => {
      if (!/^\d{2}:\d{2}$/.test(key)) {
        const lineData = groupData.Performance[field][key];
        if (Array.isArray(lineData) && lineData.length > 0) {
          const sorted = [...lineData].sort((a, b) => b.timestamp - a.timestamp);
          finalData.todayProduced[key] = {
            lastEntry: {
              time: sorted[0].time,
              value: sorted[0].value
            }
          };
        }
      }
    });
  }
finalData.Performance[field] = Object.entries(groupData.Performance[field])
    .filter(([key]) => /^\d{2}:\d{2}$/.test(key))
    .map(([time, data]) => {
        // Skip processing for HRP fields - return raw data
        if (field.startsWith('HRP') || field === "total_production_set") {
            return {
                time,
                value: data.lineValues // Return the raw lineValues object
            };
        }

        const expectedLines = ['Front_Line', 'RB', 'RC'];
        let total = 0;
        let count = 0;

        expectedLines.forEach(line => {
            const value = data.lineValues[line] ?? lastKnownValues[field]?.[line];
            if (value !== undefined) {
                total += value;
                count++;
            }
        });

        return {
            time,
            value: data.isAverageField
                ? (count > 0 ? total / count : 0)
                : total
        };
    })
    .sort((a, b) => {
        // Skip sorting for HRP fields
        if (field.startsWith('HRP')) return 0;
        
        const [aHours, aMinutes] = a.time.split(':').map(Number);
        const [bHours, bMinutes] = b.time.split(':').map(Number);
        
        // Check if times are in night period (23:00-05:59)
        const aIsNight = aHours >= 23 || aHours < 6;
        const bIsNight = bHours >= 23 || bHours < 6;
        
        // Both are night hours
        if (aIsNight && bIsNight) {
            // Convert 0-5 to 24-29 for proper ordering (23, 24, 25, 26, 27, 28)
            const aAdj = aHours < 6 ? aHours + 24 : aHours;
            const bAdj = bHours < 6 ? bHours + 24 : bHours;
            return aAdj - bAdj || aMinutes - bMinutes;
        }
        
        // Only 'a' is night time - it should come first
        if (aIsNight) return -1;
        
        // Only 'b' is night time - it should come first
        if (bIsNight) return 1;
        
        // Neither is night time - normal comparison
        return aHours - bHours || aMinutes - bMinutes;
    });

})
let chartData=finalData.Performance;
const data3 = {
  OEE: chartData.OEE,
  Productivity: chartData.Productivity,
  Quality: chartData.Quality,
  Avail: chartData.Avail
};

return res.json({
    success: true,
    data: finalData.pphValues,
    dataprod: finalData.todayProduced,
    data2: finalData.oeeLatestValues,
    data3: data3,
    hpcData: extractHPCData(finalData.Performance, bucket),
    data4: finalData.qualityLatestValues,
    data5: finalData.totalProductionInSets
});
}catch(e){
  console.log(e)
 return  res.json({
    error:e,
    message:"Failed to fetch line dashboard data"
  })
}

}


const getCeoSeatProductionData=async(req,res)=>{
  const {shift}=req.params
  const selectedDate =  new Date();
  console.log(selectedDate,"hii")

  const { startTime, endTime } = getShiftTiming(shift, selectedDate);

      if (!startTime || !endTime) {
        throw new Error("Start time or end time is undefined.");
      }
             console.log(startTime,endTime)

             let bucket=`SHIFT_${shift}`
        if(shift==="r"){
                bucket="TODAY";
        }

        const fluxQuery = `
from(bucket: "${bucket}")
|> range(start: time(v: "${startTime}"), stop: time(v: "${endTime}"))

  |> filter(fn: (r) => r["_measurement"] == "Performance")
  |> filter(fn: (r) => r["LINE"] == "Front_Line" or r["LINE"] == "RB" or r["LINE"] == "RC")
  |> filter(fn: (r) => r["_field"] == "Total_Prod_Today" or r["_field"] == "Total_Target_Prod")
  |> aggregateWindow(every: 30s, fn: last, createEmpty: false)
    |> pivot(rowKey:["_time"], columnKey:["_field"], valueColumn:"_value")
    |> sort(columns: ["_time"], desc: false)
`;
    try{
const results = [];
    const queryStartTime = Date.now();

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
          console.log(`Query completed in ${Date.now() - queryStartTime}ms`);
          resolve();
        }
      });
    });


      const grouped = {};
results.forEach(item => {
  const line = item.LINE;
  if (!grouped[line]) {
    grouped[line] = [];
  }
  grouped[line].push(item);
});

// Step 2: Extract the last entry per line (sorted by time)
const lastValues = {};
Object.keys(grouped).forEach(line => {
  const entries = grouped[line];
  // Sort by time (newest first) and take the first entry
  const sorted = entries.sort((a, b) => new Date(b._time) - new Date(a._time));
  lastValues[line] = sorted[0];
});

       res.json({
      success:true,
      data:lastValues,

      message:"Quality Data fetched successfully"
    })


  }catch(e){
    console.log(e);
    res.status(500).json({
      success:false,
      error:e
    })
}

}

const getRunningSeatData=async(req,res)=>{
  const {shift}=req.params
  const selectedDate =  new Date();
  
  const { startTime, endTime } = getShiftTiming(shift, selectedDate);
  
      if (!startTime || !endTime) {
        throw new Error("Start time or end time is undefined.");
      }
             console.log(startTime,endTime)

             let bucket=`SHIFT_${shift}`
        if(shift==="r"){
                bucket="TODAY";
        }

        const fluxQuery = `
        from(bucket: "${bucket}")
        |> range(start: time(v: "${startTime}"), stop: time(v: "${endTime}"))
        
          |> filter(fn: (r) => r["_measurement"] == "Performance")
  |> filter(fn: (r) => r["LINE"] == "Front_Line" or r["LINE"] == "RB" or r["LINE"] == "RC")
  |> filter(fn: (r) => r["_field"] == "Varient" or r["_field"] == "Verient")
          |> aggregateWindow(every: 30s, fn: last, createEmpty: false)
            |> pivot(rowKey:["_time"], columnKey:["_field"], valueColumn:"_value")
            |> sort(columns: ["_time"], desc: false)
        `;
            try{
        const results = [];
            const queryStartTime = Date.now();
        
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
                  console.log(`Query completed in ${Date.now() - queryStartTime}ms`);
                  resolve();
                }
              });
            });



        function getLastEntryPerLine(dataArray) {
  const lineMap = {};

  for (const entry of dataArray) {
    const line = entry.LINE;
    const currentTime = new Date(entry._time);

    if (!lineMap[line] || new Date(lineMap[line]._time) < currentTime) {
      lineMap[line] = entry;
    }
  }

  return lineMap;
}


            res.json({
      success:true,
      data:getLastEntryPerLine(results),
        data2:results[0],

      message:"Quality Data fetched successfully"
    })

        
          }catch(e){
            console.log(e);
            res.status(500).json({
              success:false,
              error:e
            })
        }

}

const getCeoTorqueData=async(req,res)=>{
  const {date,shift,station,torqueGun}=req.params
  const selectedDate = date ? new Date(date) : new Date();
  
  const { startTime, endTime } = getShiftTiming(shift, selectedDate);
  
      if (!startTime || !endTime) {
        throw new Error("Start time or end time is undefined.");
      }
             console.log(startTime,endTime)

             let bucket=`SHIFT_${shift}`

        const fluxQuery = `
        from(bucket: "${bucket}")
        |> range(start: time(v: "${startTime}"), stop: time(v: "${endTime}"))
        
        |> filter(fn: (r) => r["_measurement"] == "TORQUE")
        |> filter(fn: (r) => r["station"] == "${station}")
        |> filter(fn: (r) => r["torque_gun"] == "${torqueGun}")
        |> filter(fn: (r) => r["_field"] == "angle" or r["_field"] == "torque_value" or r["_field"] == "connection_status" or r["_field"] == "status" or r["_field"] == "min_limit" or r["_field"] == "max_limit")
          |> aggregateWindow(every: 30s, fn: last, createEmpty: false)
            |> pivot(rowKey:["_time"], columnKey:["_field"], valueColumn:"_value")
            |> sort(columns: ["_time"], desc: false)
        `;
            try{
        const results = [];
            const queryStartTime = Date.now();
        
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
                  console.log(`Query completed in ${Date.now() - queryStartTime}ms`);
                  resolve();
                }
              });
            });

        const torqueData = results.map(item => ({
  time: format(new Date(item._time), 'HH:mm'),
  value: item.torque_value
}));

// Extract angle values
const angleData = results.map(item => ({
  time: format(new Date(item._time), 'HH:mm'),
  value: item.angle
}));

            res.json({
      success:true,
      data:torqueData,
        data2:angleData,
        latest:results[results.length-1]

     , message:"Quality Data fetched successfully"
    })

        
          }catch(e){
            console.log(e);
            res.status(500).json({
              success:false,
              error:e
            })
        }

}


const getCeoQualityData=async(req,res)=>{
  const {date,shift,line}=req.params
  const selectedDate = date ? new Date(date) : new Date();

  const { startTime, endTime } = getShiftTiming(shift, selectedDate);

      if (!startTime || !endTime) {
        throw new Error("Start time or end time is undefined.");
      }
             console.log(startTime,endTime)

             let bucket=`SHIFT_${shift}`

        const fluxQuery = `
        from(bucket: "${bucket}")
        |> range(start: time(v: "${startTime}"), stop: time(v: "${endTime}"))

        |> filter(fn: (r) => r["_measurement"] == "QUALITY")
  |> filter(fn: (r) => r["LINE"] == "${line}")
  |> filter(fn: (r) => r["_field"] == "Total_Production" or r["_field"] == "reject" or r["_field"] == "rework")
     |> aggregateWindow(every: 30s, fn: last, createEmpty: false)
            |> pivot(rowKey:["_time"], columnKey:["_field"], valueColumn:"_value")
            |> sort(columns: ["_time"], desc: false)
        `;
            try{
        const results = [];
            const queryStartTime = Date.now();

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
                  console.log(`Query completed in ${Date.now() - queryStartTime}ms`);
                  resolve();
                }
              });
            });


function getHourlyProductionDelta(dataArray) {
  // 1. Sort by time ascending (earliest first)
  const sorted = [...dataArray].sort((a, b) => new Date(a._time) - new Date(b._time));

  // 2. Group all entries by time bucket
  const grouped = sorted.reduce((acc, item) => {
    const date = new Date(item._time);
    const hour = date.getHours();
    const minutes = date.getMinutes();

    let timeKey = "";

    if (hour === 13) {
      timeKey = "13-14";
    } else if (hour === 14 && minutes < 30) {
      timeKey = "14-14:30";
    } else if (hour === 14 && minutes >= 30) {
      timeKey = "14:30-15";
    } else {
      timeKey = `${hour}-${hour + 1}`;
    }

    if (!acc[timeKey]) acc[timeKey] = [];
    acc[timeKey].push(item);

    return acc;
  }, {});

  // 3. Compute delta for each group
  const result = Object.entries(grouped).map(([timeKey, items]) => {
    const start = items[0]; // earliest (already sorted)
    const end = items[items.length - 1]; // latest

    let pass= end.Total_Production - start.Total_Production-end.reject-end.rework;
    let rejectValue=end.reject-start.reject;
    let reworkValue=end.rework-start.rework
    if(pass<0){
    pass=0;
    }
    if(rejectValue<0){
      rejectValue=0;
    }
    if(reworkValue<0){
      reworkValue=0;
    }

    return {
      time: timeKey,
      startTime: start._time,
      endTime: end._time,
      pass,
      reject:rejectValue,
      rework:reworkValue,
      startTotal: start.Total_Production,
      endTotal: end.Total_Production
    };
  });

  // 4. Sort result by time for display
  const sortedResult = result.sort((a, b) => {
    const [startA] = a.time.split(/-|:/);
    const [startB] = b.time.split(/-|:/);
    return parseFloat(startA) - parseFloat(startB);
  });

  return sortedResult;
}


            res.json({
      success:true,
      data:getHourlyProductionDelta(results),

      message:"Quality Data fetched successfully"
    })


          }catch(e){
            console.log(e);
            res.status(500).json({
              success:false,
              error:e
            })
        }

}


const getCeoData=async(req,res)=>{
  const {line,field,date}=req.params
  const selectedDate = date ? new Date(date) : new Date();
  
  const { startTime, endTime } = getShiftTiming("r", selectedDate);
  
      if (!startTime || !endTime) {
        throw new Error("Start time or end time is undefined.");
      }
             console.log(startTime,endTime)

         
          
  
    const measurement='Performance'

    const fluxQuery = `
from(bucket: "TODAY")
|> range(start: time(v: "${startTime}"), stop: time(v: "${endTime}"))

  |> filter(fn: (r) => r["_measurement"] == "Performance")
  |> filter(fn: (r) => r["LINE"] == "${line}")
  |> filter(fn: (r) => r["_field"] == "${field}")
  |> aggregateWindow(every: 30s, fn: last, createEmpty: false)
    |> pivot(rowKey:["_time"], columnKey:["_field"], valueColumn:"_value")
    |> sort(columns: ["_time"], desc: false)
`;
    try{
const results = [];
    const queryStartTime = Date.now();

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
          console.log(`Query completed in ${Date.now() - queryStartTime}ms`);
          resolve();
        }
      });
    });

  function transformData(dataArray, valueKey = "OEE") {
    return dataArray.map(item => ({
        time: format(new Date(item._time), 'HH:mm'),
        value: item[valueKey]  // Dynamic key based on input
    }));
}

    res.json({
      success:true,
      data:transformData(results,field),
      
      message:"Quality Data fetched successfully"
    })
  

  }catch(e){
   console.log(e);
      res.status(500).json({
        success:false,
        error:e
      })
  }
  
  
}



const getPlantReportDateRange=async (req, res) => {
  try {
    const { shift } = req.params;
    const dateParam = req.params.date; // optional

    // ---------- helpers ----------
    const parseYMD = (s) => {
      if (!s) return null;
      const m = String(s).trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
      if (!m) return null;
      const d = new Date(`${m[1]}-${m[2]}-${m[3]}T00:00:00.000Z`);
      return Number.isNaN(d.getTime()) ? null : d;
    };

    // supports: "YYYY-MM-DD" OR "YYYY-MM-DD_YYYY-MM-DD" OR "YYYY-MM-DD to YYYY-MM-DD"
    const parseDateOrRange = (raw) => {
      const str = String(raw || "").trim();
      const matches = str.match(/\d{4}-\d{2}-\d{2}/g) || [];
      if (matches.length === 0) return { start: null, end: null };
      if (matches.length === 1) {
        const one = parseYMD(matches[0]);
        return { start: one, end: one };
      }
      let a = parseYMD(matches[0]);
      let b = parseYMD(matches[1]);
      if (!a || !b) return { start: null, end: null };
      if (a.getTime() > b.getTime()) [a, b] = [b, a];
      return { start: a, end: b };
    };

    const toYMD = (d) => {
      const y = d.getUTCFullYear();
      const m = String(d.getUTCMonth() + 1).padStart(2, "0");
      const dd = String(d.getUTCDate()).padStart(2, "0");
      return `${y}-${m}-${dd}`;
    };

    const addDaysUTC = (d, n) => {
      const x = new Date(d.getTime());
      x.setUTCDate(x.getUTCDate() + n);
      return x;
    };

    const enumerateDaysInclusiveUTC = (start, end) => {
      const days = [];
      let cur = new Date(start.getTime());
      while (cur.getTime() <= end.getTime()) {
        days.push(new Date(cur.getTime()));
        cur = addDaysUTC(cur, 1);
      }
      return days;
    };

    // ---------- date / range ----------
    let startDate, endDate;

    if (!dateParam) {
      // default today (UTC date)
      const today = new Date();
      const one = parseYMD(toYMD(today));
      startDate = one;
      endDate = one;
    } else {
      const parsed = parseDateOrRange(dateParam);
      startDate = parsed.start;
      endDate = parsed.end;
    }

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid date. Use YYYY-MM-DD or range like YYYY-MM-DD_YYYY-MM-DD",
      });
    }

    // If shift === "r" (Today), treat as only today (range doesn't make sense)
    if (shift === "r") {
      const today = new Date();
      const one = parseYMD(toYMD(today));
      startDate = one;
      endDate = one;
    }

    const days = enumerateDaysInclusiveUTC(startDate, endDate);
    const dayCount = days.length || 1;

    // bucket logic same
    let bucket = `SHIFT_${shift}`;
    if (shift === "r") bucket = "TODAY";

    const linesFilter = `r["LINE"] == "Front_Line" or r["LINE"] == "RB" or r["LINE"] == "RC"`;

    // We will aggregate:
    const avgFields = ["OEE", "Quality", "pph"]; // average across days (end-of-shift snapshots)
    const sumFields = ["Total_Production", "rework", "reject", "FTPQ"]; // sum across days (end-of-shift snapshots)

    // accumulator per line
    const acc = {
      Front_Line: {
        LINE: "Front_Line",
        _avgSum: { OEE: 0, Quality: 0, pph: 0 },
        _avgCount: { OEE: 0, Quality: 0, pph: 0 },
        Total_Production: 0,
        rework: 0,
        reject: 0,
        FTPQ: 0,
      },
      RB: {
        LINE: "RB",
        _avgSum: { OEE: 0, Quality: 0, pph: 0 },
        _avgCount: { OEE: 0, Quality: 0, pph: 0 },
        Total_Production: 0,
        rework: 0,
        reject: 0,
        FTPQ: 0,
      },
      RC: {
        LINE: "RC",
        _avgSum: { OEE: 0, Quality: 0, pph: 0 },
        _avgCount: { OEE: 0, Quality: 0, pph: 0 },
        Total_Production: 0,
        rework: 0,
        reject: 0,
        FTPQ: 0,
      },
    };

    // ---------- query day-by-day ----------
    const perDayMeta = [];

    for (const day of days) {
      const { startTime, endTime } = getShiftTiming(shift, day);

      if (!startTime || !endTime) {
        return res.status(400).json({
          success: false,
          message: `Start time or end time is undefined for shift ${shift} on ${toYMD(day)}`,
        });
      }

      perDayMeta.push({ ymd: toYMD(day), startTime, endTime });

      // ✅ ONLY end-of-shift snapshot: group by LINE + _field, take last()
      const fluxQuery = `
from(bucket: "${bucket}")
  |> range(start: time(v: "${startTime}"), stop: time(v: "${endTime}"))
  |> filter(fn: (r) => r._measurement == "QUALITY" or r._measurement == "Performance")
  |> filter(fn: (r) => ${linesFilter})
  |> filter(fn: (r) =>
    r._field == "Total_Production" or
    r._field == "rework" or
    r._field == "reject" or
    r._field == "OEE" or
    r._field == "Quality" or
    r._field == "pph" or
    r._field == "FTPQ"
  )
  |> group(columns: ["LINE", "_field"])
  |> last()
  |> keep(columns: ["LINE", "_field", "_value"])
  |> pivot(rowKey: ["LINE"], columnKey: ["_field"], valueColumn: "_value")
  |> keep(columns: ["LINE", "Total_Production", "rework", "reject", "OEE", "Quality", "pph", "FTPQ"])
`;

      const rows = [];

      await new Promise((resolve, reject) => {
        queryApi.queryRows(fluxQuery, {
          next(r, tableMeta) {
            try {
              rows.push(tableMeta.toObject(r));
            } catch (e) {
              console.warn("Row parse error:", e);
            }
          },
          error(err) {
            console.error("Query execution error:", err);
            reject(err);
          },
          complete() {
            resolve();
          },
        });
      });

      // merge into accumulator
      for (const r of rows) {
        const lineKey = r?.LINE;
        if (!lineKey || !acc[lineKey]) continue;

        // AVG fields: sum + count (only if number)
        for (const f of avgFields) {
          const v = Number(r?.[f]);
          if (Number.isFinite(v)) {
            acc[lineKey]._avgSum[f] += v;
            acc[lineKey]._avgCount[f] += 1;
          }
        }

        // SUM fields
        for (const f of sumFields) {
          const v = Number(r?.[f]);
          if (Number.isFinite(v)) {
            acc[lineKey][f] += v;
          }
        }
      }
    }

    // ---------- build final output (same structure) ----------
    const finalRows = Object.keys(acc).map((k) => {
      const line = acc[k];

      const out = {
        LINE: line.LINE,

        // avg (end-of-shift snapshot averages)
        OEE: line._avgCount.OEE ? line._avgSum.OEE / line._avgCount.OEE : 0,
        Quality: line._avgCount.Quality
          ? line._avgSum.Quality / line._avgCount.Quality
          : 0,
        pph: line._avgCount.pph ? line._avgSum.pph / line._avgCount.pph : 0,

        // sums (end-of-shift snapshot totals)
        Total_Production: line.Total_Production || 0,
        rework: line.rework || 0,
        reject: line.reject || 0,
        FTPQ: line.FTPQ || 0,
      };

      return out;
    });

    // same output structure as your other route: { Front_Line: {...}, RB: {...}, RC: {...} }
    const groupByLine = (arr) => {
      const result = {};
      for (const entry of arr) {
        const line = entry.LINE;
        if (!line) continue;
        result[line] = { ...entry };
      }
      return result;
    };

    return res.json({
      success: true,
      meta: {
        shift,
        date: dateParam || "today",
        days: perDayMeta, // optional debug: each shift-window used
        bucket,
      },
      data: groupByLine(finalRows),
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      success: false,
      error: e?.message || String(e),
    });
  }
}


const getPlantReportDate=async(req,res)=>{
  const {date,shift}=req.params
  const selectedDate = date ? new Date(date) : new Date();

  const { startTime, endTime } = getShiftTiming(shift, selectedDate);

      if (!startTime || !endTime) {
        throw new Error("Start time or end time is undefined.");
      }


let bucket=`SHIFT_${shift}`
        if(shift==="r"){
                bucket="TODAY";
        }
	
	const fluxQuery = `
  from(bucket: "${bucket}")
    |> range(start: time(v: "${startTime}"), stop: time(v: "${endTime}"))
    |> filter(fn: (r) => r._measurement == "QUALITY" or r._measurement == "Performance")
    |> filter(fn: (r) => r["LINE"] == "Front_Line" or r["LINE"] == "RB" or r["LINE"] == "RC")
    |> filter(fn: (r) =>
      r._field == "Total_Production" or
      r._field == "rework" or
      r._field == "reject" or
      r._field == "OEE" or
      r._field == "Quality" or
      r._field == "pph" or
      r._field == "FTPQ"
    )
    |> last()
    |> pivot(rowKey: ["_time"], columnKey: ["_field"], valueColumn: "_value")
    |> sort(columns: ["_time"], desc: false)
`;


            try{
        const results = [];
            const queryStartTime = Date.now();

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
                  console.log(`Query completed in ${Date.now() - queryStartTime}ms`);
                  resolve();
                }
              });
            });

		    function groupByLine(data) {
  const result = {};

  data.forEach(entry => {
    const line = entry.LINE;
    if (!result[line]) {
      result[line] = { LINE: line };
    }

    Object.keys(entry).forEach(key => {
      if (!["_start", "_stop", "_time", "_measurement", "result", "table", "LINE"].includes(key)) {
        // Only update if value is not null
        if (entry[key] !== null && entry[key] !== undefined) {
          result[line][key] = entry[key];
        }
      }
    });
  });

  return result;
}


            res.json({
              success:true,
              data:groupByLine(results),
            })

          }catch(e){
            console.log(e);
            res.status(500).json({
              success:false,
              error:e
            })
          }
}

//


function getShiftTiming(shift, selectedDate = null) {
  // Convert to IST once
  const toIST = (date) => {
    const istStr = date.toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
    const istDate = new Date(istStr);
    if (isNaN(istDate.getTime())) {
      throw new Error("Invalid date passed for IST conversion");
    }
    return istDate;
  };

  const baseDateIST = selectedDate ? toIST(new Date(selectedDate)) : toIST(new Date());

  const year = baseDateIST.getFullYear();
  const month = baseDateIST.getMonth();
  const day = baseDateIST.getDate();

  // Build date in IST, return its UTC ISO
  const getTime = (hour, minute = 0, dayOffset = 0) => {
    const istDate = new Date(year, month, day + dayOffset, hour, minute);
    return istDate.toISOString(); // Let JS auto-convert to UTC
  };

  const shiftTimes = {
    A: {
      start: getTime(6, 0),        // 6:00 AM IST
      end: getTime(14, 30)         // 2:30 PM IST
    },
    B: {
      start: getTime(14, 30),      // 2:30 PM IST
      end: getTime(23, 0)          // 11:00 PM IST
    },
    C: {
      start: getTime(23, 0),       // 11:00 PM IST
      end: getTime(6, 0, 1)        // next day 6:00 AM IST
    },
	r:{
		start:getTime(6,0),
		end:getTime(6,0,1)
	}	  
  };
  const result = shiftTimes[shift];
  if (!result) throw new Error("Invalid shift. Must be 'A', 'B', or 'C'");
  return {
    startTime: result.start,
    endTime: result.end
  };
}

// influxDprBasic.js


const toISTDate = (utcIsoOrDate) => {
  const d = utcIsoOrDate instanceof Date ? utcIsoOrDate : new Date(utcIsoOrDate);
  return new Date(d.getTime() + IST_OFFSET_MIN * 60 * 1000);
};



// NOTE: istMs is "UTC ms + 5:30". Use UTC getters to avoid server timezone issues.

const toIstMsFromUtcDate = (d) => new Date(d).getTime() + IST_OFFSET_MS;


const fmtHHmm = (d) => `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;

/**
 * Build IST time slots between start and end.
 * Default: hourly slots.
 * Special case (ONLY when shift !== "r"): split 14:00-15:00 into 14:00-14:30 and 14:30-15:00
 */
const IST_OFFSET_MIN = 330;
const IST_OFFSET_MS = IST_OFFSET_MIN * 60 * 1000;

const pad2 = (n) => String(n).padStart(2, "0");

// Format an "IST wall-clock" time from an IST-shifted timestamp using UTC getters
const fmtHHmmFromIstMs = (istMs) => {
  const d = new Date(istMs);
  return `${pad2(d.getUTCHours())}:${pad2(d.getUTCMinutes())}`;
};

// Convert UTC ISO -> IST-shifted ms (not a "Date in IST", just a shifted timeline)
const toIstMsFromUtcIso = (utcIso) => new Date(utcIso).getTime() + IST_OFFSET_MS;


function buildISTSlots(startUtcIso, endUtcIso, shift) {
  const startIstMs = toIstMsFromUtcIso(startUtcIso);
  const endIstMs = toIstMsFromUtcIso(endUtcIso);

  const slots = [];
  let cursorIstMs = startIstMs;

  const splitTeaBreak = shift !== "r";

  while (cursorIstMs < endIstMs) {
    const d = new Date(cursorIstMs);
    const h = d.getUTCHours();
    const m = d.getUTCMinutes();

    let stepMs;
    if (splitTeaBreak && h === 14 && (m === 0 || m === 30)) {
      stepMs = 30 * 60 * 1000;
    } else {
      stepMs = 60 * 60 * 1000;
    }

    let nextIstMs = cursorIstMs + stepMs;
    if (nextIstMs > endIstMs) nextIstMs = endIstMs;

    slots.push({
      startIstMs: cursorIstMs,
      endIstMs: nextIstMs,

      // UTC iso for your resolveTargetJphAt (slot start)
      slotStartUtc: new Date(cursorIstMs - IST_OFFSET_MS).toISOString(),

      // what you show in UI
      key: `${fmtHHmmFromIstMs(cursorIstMs)}-${fmtHHmmFromIstMs(nextIstMs)}`,
    });

    cursorIstMs = nextIstMs;
  }

  return slots;
}




/**
 * Sum positive deltas to handle counter resets safely.
 * points: [{t:number(ms), v:number}, ...] sorted by t ascending
 */
// function sumPositiveDeltas(points) {
//   if (!points || points.length < 2) return 0;

//   let sum = 0;
//   for (let i = 1; i < points.length; i++) {
//     const dv = points[i].v - points[i - 1].v;
//     if (Number.isFinite(dv) && dv > 0) sum += dv;
//   }
//   return sum;
// }

/**
 * Main function:
 * - shift, date, line as input
 * - queries Influx (UTC timestamps)
 * - converts to IST timeslots and returns DPR-like rows for Model/Reject/Rework
 *
 * REQUIRED deps passed in:
 * - queryApi (Influx queryApi)
 * - getShiftTiming(shift, selectedDate) -> { startTime, endTime } in ISO (UTC)
 */





// controller/downtimeReport.js (updated version)
// Assumes you already have: prismaClient, queryApi, parseReportDate, normalizeShift, getShiftTiming



// ONLY split tea break for non-"r"
// function buildISTSlots(startUtcIso, endUtcIso, shift) {
//   const startIST = toISTDate(startUtcIso);
//   const endIST = toISTDate(endUtcIso);

//   const slots = [];
//   let cursor = new Date(startIST);

//   const splitTeaBreak = shift !== "r";

//   while (cursor < endIST) {
//     const h = cursor.getHours();
//     const m = cursor.getMinutes();

//     let next;
//     if (splitTeaBreak && h === 14 && (m === 0 || m === 30)) {
//       next = new Date(cursor.getTime() + 30 * 60 * 1000);
//     } else {
//       next = new Date(cursor.getTime() + 60 * 60 * 1000);
//     }

//     if (next > endIST) next = new Date(endIST);

//     slots.push({
//       start: new Date(cursor),
//       end: new Date(next),
//       key: `${fmtHHmm(cursor)}-${fmtHHmm(next)}`,
//     });

//     cursor = next;
//   }

//   return slots;
// }

function sumPositiveDeltas(points) {
  if (!points || points.length < 2) return 0;
  let sum = 0;
  for (let i = 1; i < points.length; i++) {
    const dv = points[i].v - points[i - 1].v;
    if (Number.isFinite(dv) && dv > 0) sum += dv;
  }
  return sum;
}

/**
 * You MUST map your DB lineId -> Influx LINE tag ("Front_Line", "RB", "RC" etc.)
 * Adjust this to your schema.
 */



async function fetchDprModelRejectRework({
  shift,
  date,        // can be Date or ISO string
  line,        // influx LINE tag, eg "Front_Line"
  queryApi,
  variantFields = ["Verient"],
  rejectField = "reject",
  reworkField = "rework",
}) {
  const selectedDate = date ? new Date(date) : new Date();
  const { startTime, endTime } = getShiftTiming(shift, selectedDate);

  if (!startTime || !endTime) throw new Error("Start time or end time is undefined.");

  let bucket = `SHIFT_${shift}`;
  if (shift === "r") bucket = "TODAY";

  const wantedFields = [...variantFields, rejectField, reworkField];
  const fieldConditions = wantedFields.map((f) => `r._field == "${f}"`).join(" or ");

  const fluxQuery = `
from(bucket: "${bucket}")
  |> range(start: time(v: "${startTime}"), stop: time(v: "${endTime}"))
  |> filter(fn: (r) => r["_measurement"] == "Performance" or r["_measurement"] == "QUALITY")
  |> filter(fn: (r) => r["LINE"] == "${line}")
  |> filter(fn: (r) => ${fieldConditions})
  |> aggregateWindow(every: 30s, fn: last, createEmpty: false)
  |> sort(columns: ["_time"], desc: false)
`;

  const raw = [];
  await new Promise((resolve, reject) => {
    queryApi.queryRows(fluxQuery, {
      next(row, tableMeta) {
        try {
          raw.push(tableMeta.toObject(row));
        } catch (e) {
          console.warn("Row parsing error:", e);
        }
      },
      error(err) {
        reject(err);
      },
      complete() {
        resolve();
      },
    });
  });

  // ✅ use the same fixed buildISTSlots (returns startIstMs/endIstMs/key/slotStartUtc)
  const slots = buildISTSlots(startTime, endTime, shift);

  const findSlotIdx = (istMs) => {
    for (let i = 0; i < slots.length; i++) {
      const s = slots[i];
      if (istMs >= s.startIstMs && istMs < s.endIstMs) return i;
    }
    return -1;
  };

  const slotAgg = slots.map((s) => ({
    timeSlot: s.key,      // MUST match fetchHourlySetProductionFromInflux rows
    modelSet: new Set(),
    rejectPoints: [],
    reworkPoints: [],
  }));

  for (const r of raw) {
    const utcIso = r._time;
    if (!utcIso) continue;
	  

    const field = r._field;
    const value = r._value;

    // Convert query time -> IST ms (timezone-safe)
    const istMs = new Date(utcIso).getTime() + IST_OFFSET_MS;
    const idx = findSlotIdx(istMs);
    if (idx < 0) continue;

    if (variantFields.includes(field)) {
      const str = String(value ?? "").trim();
      if (str) slotAgg[idx].modelSet.add(str);
      continue;
    }

    const num = Number(value);
    if (!Number.isFinite(num)) continue;
    if (field === rejectField) slotAgg[idx].rejectPoints.push({ t: istMs, v: num });
    if (field === reworkField) slotAgg[idx].reworkPoints.push({ t: istMs, v: num });
  }

	let prevReworkCum=0;
	let prevRejectCum=0;
  const rows = slotAgg.map((s) => {
    s.rejectPoints.sort((a, b) => a.t - b.t);
    s.reworkPoints.sort((a, b) => a.t - b.t);
	  const rejectCum =
    s.rejectPoints[s.rejectPoints.length - 1]?.v ?? prevRejectCum;

  const reworkCum =
    s.reworkPoints[s.reworkPoints.length - 1]?.v ?? prevReworkCum;

  // hourly deltas
  const rejectHour = Math.max(0, rejectCum - prevRejectCum);
  const reworkHour = Math.max(0, reworkCum - prevReworkCum);

  // update previous
  prevRejectCum = rejectCum;
  prevReworkCum = reworkCum;

    return {
      timeSlot: s.timeSlot,
      model: Array.from(s.modelSet).join(", "),
      reject: { hour: rejectHour, cum: rejectCum },
      rework: { hour: reworkHour, cum: reworkCum },
    };
  });

  return rows;
}

async function getInfluxLineTagFromLineId(lineId) {
  // Example: if you have a Line table with some "influxTag" or "code"
  const line = await prismaClient.line.findUnique({
    where: { lineId: lineId },
    select: {  lineName: true },
  });
  if(line.lineName==="Front Line"){
    return "Front_Line"
  }else if(line.lineName==="Rear Back"){
    return "RB"
  }else if(line.lineName==="Rear Cushion"){
    return "RC"
  }else{
	  return null;
  }

  throw new Error("Unable to resolve Influx LINE tag from lineId");
}

const resolveTargetJphAt = (historyAsc, slotStartUtc, fallback = 100) => {
  if (!Array.isArray(historyAsc) || !historyAsc.length) return fallback;
	
  const t = new Date(slotStartUtc).getTime();
  let ans = null;

  // historyAsc is sorted asc
  for (const h of historyAsc) {
    const ht = new Date(h.updatedAt).getTime();
    if (ht <= t) ans = h.updatedValue;
    else break;
  }

  const n = Number(ans);
  return (Number.isFinite(n) && n!==0) ? n : fallback;
};

async function fetchHourlySetProductionFromInflux({ shift, dateObj, lineId }) {
  const { startTime, endTime } = getShiftTiming(shift, dateObj);
  if (!startTime || !endTime) throw new Error("Start time or end time is undefined.");

  let bucket = `SHIFT_${shift}`;
  if (shift === "r") bucket = "TODAY";

  const influxLine = await getInfluxLineTagFromLineId(lineId);

  // Fetch both: prefer total_production_set; fallback to Total_Prod_Today if needed
  const wantedFields = ["total_production_set"];
  const fieldConditions = wantedFields.map((f) => `r._field == "${f}"`).join(" or ");

  const fluxQuery = `
from(bucket: "${bucket}")
  |> range(start: time(v: "${startTime}"), stop: time(v: "${endTime}"))
  |> filter(fn: (r) => r["_measurement"] == "Performance")
  |> filter(fn: (r) => r["LINE"] == "${influxLine}")
  |> filter(fn: (r) => ${fieldConditions})
  |> aggregateWindow(every: 30s, fn: last, createEmpty: false)
  |> sort(columns: ["_time"], desc: false)
`;

  const raw = [];
  await new Promise((resolve, reject) => {
    queryApi.queryRows(fluxQuery, {
      next(row, tableMeta) {
        try {
          raw.push(tableMeta.toObject(row));
        } catch (e) {
          console.warn("Row parsing error:", e);
        }
      },
      error(err) {
        reject(err);
      },
      complete() {
        resolve();
      },
    });
  });

  // ---------------- TargetJPH history ----------------
  const priorJph = await prismaClient.targetJPHUpdateHistory.findFirst({
    where: {
      lineId: lineId,
      updatedAt: { lt: new Date(startTime) },
    },
    orderBy: { updatedAt: "desc" },
  });

  const jphWithin = await prismaClient.targetJPHUpdateHistory.findMany({
    where: {
      lineId: lineId,
      updatedAt: {
        gte: new Date(startTime),
        lte: new Date(endTime),
      },
    },
    orderBy: { updatedAt: "asc" },
  });

  const jphHistoryAsc = [
    ...(priorJph ? [priorJph] : []),
    ...(Array.isArray(jphWithin) ? jphWithin : []),
  ].sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt));

  // ---------------- slots ----------------
const slots = buildISTSlots(startTime, endTime, shift);

const findSlotIdx = (istMs) => {
  for (let i = 0; i < slots.length; i++) {
    const s = slots[i];
    if (istMs >= s.startIstMs && istMs < s.endIstMs) return i;
  }
  return -1;
};





  // Prefer total_production_set. If not present at all, use Total_Prod_Today.
  const hasTPS = raw.some((r) => r._field === "total_production_set");
  const prodField = hasTPS ? "total_production_set" : "Total_Prod_Today";

  // IMPORTANT: keep slot start/end in UTC too for resolveTargetJphAt
  // slots[] are IST Date objects, so convert them back to UTC by subtracting offset
  const toUtcIsoFromIstDate = (istDate) =>
    new Date(istDate.getTime() - IST_OFFSET_MIN * 60 * 1000).toISOString();

const slotAgg = slots.map((s) => ({
  timeSlot: s.key,
  slotStartUtc: s.slotStartUtc, // ✅ already UTC ISO
  points: [],
}));

const UnplannedDowntimes = await prismaClient.plannedShutdown.findMany({
  where: {
    lines: { some: { lineId: lineId } },
    type: "UnplannedDowntime",
    createdAt: {
      gte: new Date(startTime),
      lte: new Date(endTime),
    },
  },
});


// Build downtime entries per slot (split if overlap across slots)
const downtimeBySlotIdx = Array.from({ length: slots.length }, () => []);

for (const dt of UnplannedDowntimes) {
  if (!dt?.startTime || !dt?.endTime) continue;

  const dtStartIstMs = toIstMsFromUtcDate(dt.startTime);
  const dtEndIstMs = toIstMsFromUtcDate(dt.endTime);

  // skip invalid
  if (!(dtEndIstMs > dtStartIstMs)) continue;

  for (let i = 0; i < slots.length; i++) {
    const slot = slots[i];

    const overlapStart = Math.max(dtStartIstMs, slot.startIstMs);
    const overlapEnd = Math.min(dtEndIstMs, slot.endIstMs);

    if (overlapEnd <= overlapStart) continue;

    const durationMin = Math.round((overlapEnd - overlapStart) / 60000);

    downtimeBySlotIdx[i].push({
      id: dt.id,                         // ✅ same id
      reason: dt.reason || "",
      lossCode:dt.reason.slice(0,3) || "",           // ✅ same reason
      description: dt.description || "",

      startTime: fmtHHmmFromIstMs(overlapStart), // "07:00"
      endTime: fmtHHmmFromIstMs(overlapEnd),     // "08:00"
      duration: durationMin,

      // internal for sorting only
      _startIstMs: overlapStart,
    });
  }
}

// Sort each slot downtime entries by start time (IST)
for (const arr of downtimeBySlotIdx) {
  arr.sort((a, b) => a._startIstMs - b._startIstMs);
  // remove internal sort field
  for (const e of arr) delete e._startIstMs;
}


  for (const r of raw) {
    if (r._field !== prodField) continue;

    const utcIso = r._time;
    if (!utcIso) continue;

    const v = Number(r._value);
    if (!Number.isFinite(v)) continue;

    const istMs = new Date(utcIso).getTime() + IST_OFFSET_MS;


    const idx = findSlotIdx(istMs);
    if (idx < 0) continue;

    slotAgg[idx].points.push({ t: istMs, v });
  }


// Build lookup ONCE (not a second traversal of rows; just indexing the mrwRows)


let cumulative = 0;
let targetCum = 0;

let rows = slotAgg.map((s, idx) => {
  s.points.sort((a, b) => a.t - b.t);
  const hourSetProduction = sumPositiveDeltas(s.points);
  cumulative += hourSetProduction;

  const targetJPH = resolveTargetJphAt(jphHistoryAsc, s.slotStartUtc, 100);
  targetCum += Number(targetJPH) || 0;



  return {
    sno: idx + 1,
    timeSlot: s.timeSlot,

    setProduction: { hour: hourSetProduction, cum: cumulative },

    targetJPH,
    targetJPHCumm: targetCum,

    actualJPH: hourSetProduction,
    actualJPHCumm: cumulative,

    // ✅ downtime entries already computed
    downtimeEntries: downtimeBySlotIdx[idx] || [],

    // ✅ model/reject/rework columns added


    meta: { fieldUsed: prodField },
  };
});




  return rows;
}

const parseReportDate = (v) => {
  // Accepts:
  // - Date
  // - "YYYY-MM-DD"
  // - ISO string
  if (!v) return null;

  if (v instanceof Date) return Number.isNaN(v.getTime()) ? null : v;

  const s = String(v).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    // force stable date in UTC midnight
    const d = new Date(`${s}T00:00:00.000Z`);
    return Number.isNaN(d.getTime()) ? null : d;
  }

  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
};

const reportInclude = {
  line: { select: { lineId: true, lineName: true } },
  user: { select: { id: true, name: true, email: true } },
  plannedShutdowns: true,
};
const normalizeSlotKey = (s) =>
  String(s || "")
    .replace(/\s+/g, "")     // remove spaces
    .replace(/–/g, "-")      // en dash -> hyphen if any
    .toUpperCase();          // optional: case-safe










  
async function populateDowntimeEntriesForSubmittedRows({
  rows,
  shiftVal,
  reportDate,
  lineId,
}) {
  if (!Array.isArray(rows) || !rows.length) return rows;

  const { startTime, endTime } = getShiftTiming(shiftVal, reportDate);
  if (!startTime || !endTime) return rows;

  const slots = buildISTSlots(startTime, endTime, shiftVal);
  const slotByKey = Object.create(null);
  for (const s of slots) slotByKey[normalizeSlotKey(s.key)] = s;

  // collect ids used in sheet rows
  const ids = [];
  for (const r of rows) {
    const entries = Array.isArray(r?.downtimeEntries) ? r.downtimeEntries : [];
    for (const e of entries) {
      if (e?.id) ids.push(e.id);
    }
  }

  const uniqueIds = [...new Set(ids)];
  if (!uniqueIds.length) return rows;

  // Fetch full records by ids
  // ✅ assuming these ids belong to plannedShutdown table in your setup
  // If your ids are from another table, replace this model accordingly.
  const records = await prismaClient.plannedShutdown.findMany({
    where: { id: { in: uniqueIds } },
  });

  const byId = Object.create(null);
  for (const r of records) byId[r.id] = r;

  // helper: clip record to slot and return expanded entry
  const clipToSlot = (rec, slot) => {
    if (!rec?.startTime || !rec?.endTime) return null;

    const recStartIstMs = toIstMsFromUtcDate(rec.startTime);
    const recEndIstMs = toIstMsFromUtcDate(rec.endTime);
    if (!(recEndIstMs > recStartIstMs)) return null;

    const overlapStart = Math.max(recStartIstMs, slot.startIstMs);
    const overlapEnd = Math.min(recEndIstMs, slot.endIstMs);
    if (overlapEnd <= overlapStart) return null;

    const durationMin = Math.round((overlapEnd - overlapStart) / 60000);

    return {
      id: rec.id,
      startTime: fmtHHmmFromIstMs(overlapStart),
      endTime: fmtHHmmFromIstMs(overlapEnd),
      duration: durationMin,

      lossCode: rec.reason.slice(0,3) || "",

      reason: rec.reason || "",
      description: rec.description || "",
      _startIstMs: overlapStart, // for sorting only
    };
  };

  // expand per row
  const newRows = rows.map((row) => {
    const slot = slotByKey[normalizeSlotKey(row?.timeSlot)];
    if (!slot) return row;

    const entries = Array.isArray(row?.downtimeEntries) ? row.downtimeEntries : [];

    const expanded = [];
    for (const e of entries) {
      const rec = byId[e?.id];
      if (!rec) continue;

      const clipped = clipToSlot(rec, slot);
      if (clipped) expanded.push(clipped);
    }

    // sort by IST start
    expanded.sort((a, b) => (a._startIstMs || 0) - (b._startIstMs || 0));
    for (const x of expanded) delete x._startIstMs;

    return { ...row, downtimeEntries: expanded };
  });

  return newRows;
}

const getDowntimeReportByLineDateShiftCumulative = async (req, res) => {
  try {
    const { lineId, date, shift } = req.query;

    if (!lineId || !date || !shift) {
      return res.status(400).json({
        success: false,
        message: "lineId, date (YYYY-MM-DD) and shift are required in query",
      });
    }

    const reportDate = parseReportDate(String(date));
    const shiftVal = String(shift);

    if (!reportDate) {
      return res.status(400).json({ success: false, message: "Invalid date format" });
    }

    const doc = await prismaClient.downtimeReport.findUnique({
      where: {
        lineId_reportDate_shift: {
          lineId,
          reportDate,
          shift: shiftVal,
        },
      },
      include: reportInclude,
    });

    const influxLine = await getInfluxLineTagFromLineId(lineId);

    const isSubmitted = Boolean(doc?.isSubmitted);

    // base rows
    let baseRows = isSubmitted
      ? (Array.isArray(doc?.rows) ? doc.rows : [])
      : await fetchHourlySetProductionFromInflux({
          shift: shiftVal,
          dateObj: reportDate,
          lineId,
        });

    // ✅ populate downtimeEntries ONLY for submitted sheets
    if (isSubmitted) {
      baseRows = await populateDowntimeEntriesForSubmittedRows({
        rows: baseRows,
        shiftVal,
        reportDate,
        lineId,
      });
    }

    // MRW merge (as you already had)
    const mrwRows = await fetchDprModelRejectRework({
      shift: shiftVal,
      date: reportDate,
      line: influxLine,
      queryApi,
      variantFields: ["Verient"],
      rejectField: "reject",
      reworkField: "rework",
    });

    const mrwBySlot = Object.create(null);
    for (const r of mrwRows || []) {
      mrwBySlot[normalizeSlotKey(r.timeSlot)] = r;
    }

    const mergedRows = (baseRows || []).map((row) => {
      const key = normalizeSlotKey(row?.timeSlot);
      const mrw = mrwBySlot[key];

      const rejectHour = mrw?.reject?.hour ?? 0;
      const rejectCum = mrw?.reject?.cum ?? 0;
      const reworkHour = mrw?.rework?.hour ?? 0;
      const reworkCum = mrw?.rework?.cum ?? 0;

      return {
        ...row,
        model: mrw?.model || row?.model || "",
        reject: mrw?.reject || row?.reject || { hour: 0, cum: 0 },
        rework: mrw?.rework || row?.rework || { hour: 0, cum: 0 },
        rejectHour,
        rejectCummulative: rejectCum,
        reworkHour,
        reworkCummulative: reworkCum,
      };
    });

    if (isSubmitted) {
      return res.status(200).json({
        success: true,
        data: {
          ...doc,
          rows: mergedRows,
        },
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        isSubmitted: false,
        lineId,
        reportDate,
        shift: shiftVal,
        rows: mergedRows,
      },
    });
  } catch (err) {
    console.error("getDowntimeReportByLineDateShiftCumulative error:", err);
    return res.status(500).json({
      success: false,
      message: err?.message || "Failed to fetch report",
    });
  }
};








const  fetchPerformanceReportData=async({ lineId, date, shift })=> {
  if (!lineId || !date || !shift) {
    throw new Error("lineId, date (YYYY-MM-DD) and shift are required");
  }

  const reportDate = parseReportDate(String(date));
  const shiftVal = String(shift);

  if (!reportDate) {
    throw new Error("Invalid date format");
  }

  const doc = await prismaClient.downtimeReport.findUnique({
    where: {
      lineId_reportDate_shift: {
        lineId,
        reportDate,
        shift: shiftVal,
      },
    },
    include: reportInclude,
  });

  const influxLine = await getInfluxLineTagFromLineId(lineId);
  if(!influxLine){
    return
  }
  const isSubmitted = Boolean(doc?.isSubmitted);

  let baseRows = isSubmitted
    ? (Array.isArray(doc?.rows) ? doc.rows : [])
    : await fetchHourlySetProductionFromInflux({
        shift: shiftVal,
        dateObj: reportDate,
        lineId,
      });

  if (isSubmitted) {
    baseRows = await populateDowntimeEntriesForSubmittedRows({
      rows: baseRows,
      shiftVal,
      reportDate,
      lineId,
    });
  }

  const mrwRows = await fetchDprModelRejectRework({
    shift: shiftVal,
    date: reportDate,
    line: influxLine,
    queryApi,
    variantFields: ["Verient"],
    rejectField: "reject",
    reworkField: "rework",
  });

  const mrwBySlot = Object.create(null);
  for (const r of mrwRows || []) {
    mrwBySlot[normalizeSlotKey(r.timeSlot)] = r;
  }

  const mergedRows = (baseRows || []).map((row) => {
    const key = normalizeSlotKey(row?.timeSlot);
    const mrw = mrwBySlot[key];

    const rejectCum = mrw?.reject?.cum ?? 0;
    const reworkCum = mrw?.rework?.cum ?? 0;

    return {
      ...row,
      model: mrw?.model || row?.model || "",
      reject: mrw?.reject || row?.reject || { hour: 0, cum: 0 },
      rework: mrw?.rework || row?.rework || { hour: 0, cum: 0 },
      rejectHour: mrw?.reject?.hour ?? 0,
      rejectCummulative: rejectCum,
      reworkHour: mrw?.rework?.hour ?? 0,
      reworkCummulative: reworkCum,
    };
  });

  const line = await prismaClient.line.findUnique({
    where: { lineId },
    select: { lineName: true },
  });

  return {
    isSubmitted,
    lineId,
    reportDate, // Date object
    shift: shiftVal,
    lineName: line?.lineName || lineId,
    rows: mergedRows,
  };
}


// Same as your frontend drawSQPHeader, but safer fonts for Node
function drawSQPHeader(doc, { lineName, shiftLabel, dateLabel }) {
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("PRODUCTION LINE PERFORMANCE MONITORING (S-Q-P)", pageWidth / 2, 14, {
    align: "center",
  });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  const left = 14;
  const topY = 20;
  const rowH = 7;
  const gap = 4;

  const colW = (pageWidth - left * 2 - gap * 2) / 3;
  const boxH = rowH;

  const labelPad = 2.5;
  const boxInnerPad = 2;
  const minBoxW = 18;

  const drawLabeledBox = (x, y, label, value = "") => {
    const textY = y + 4.8;
    doc.text(label, x, textY);

    const labelW = doc.getTextWidth(label);
    const boxX = x + labelW + labelPad;

    let boxW = x + colW - boxX;
    if (boxW < minBoxW) boxW = minBoxW;

    doc.rect(boxX, y + 1, boxW, boxH);

    if (value) {
      const maxW = boxW - boxInnerPad * 2;
      const safeValue = doc.splitTextToSize(String(value), maxW)[0];
      doc.text(safeValue, boxX + boxInnerPad, textY);
    }
  };

  const x1 = left;
  const x2 = left + colW + gap;
  const x3 = left + (colW + gap) * 2;

  drawLabeledBox(x1, topY, "Date :", dateLabel);
  drawLabeledBox(x2, topY, "Shift :", shiftLabel);
  drawLabeledBox(x3, topY, "Line :", lineName);

  const y2 = topY + rowH + 4;
  drawLabeledBox(x1, y2, "Line Supervisor :", "");
  drawLabeledBox(x2, y2, "No. of Man Power :", "");
  drawLabeledBox(x3, y2, "Control Time in Secs :", "");

  return y2 + rowH + 6;
}

// Same as your frontend normalizePerformanceRows
function normalizePerformanceRows(rows = []) {
  let prodCum = 0;
  let targetCum = 0;

  const toMin = (hhmm) => {
    const s = String(hhmm || "").trim();
    if (!s) return null;
    const [h, m] = s.split(":").map(Number);
    if (!Number.isFinite(h) || !Number.isFinite(m)) return null;
    return h * 60 + m;
  };

  const parseSlotMinutes = (timeSlot) => {
    const raw = String(timeSlot || "").trim();
    const cleaned = raw.replace(/\s+/g, "");
    const parts = cleaned.split("-");
    if (parts.length !== 2) return null;

    const s = toMin(parts[0]);
    const e = toMin(parts[1]);
    if (s == null || e == null) return null;

    let dur = e - s;
    if (dur < 0) dur += 24 * 60;
    return dur;
  };

  return rows.map((r) => {
    const hour = {};
    const cum = {};

    const hourlyProd = r.setProduction?.hour ?? r.actualJPH ?? 0;
    const hourlyTarget = r.targetJPH ?? 0;

    prodCum += hourlyProd;
    targetCum += hourlyTarget;

    hour.Production = hourlyProd;
    cum.Production = r.setProduction?.cum ?? prodCum;

    hour.Target = hourlyTarget;
    cum.Target = r.targetJPHCumm ?? targetCum;

    hour.Reject = r.reject?.hour ?? r.rejectHour ?? 0;
    cum.Reject = r.reject?.cum ?? r.rejectCummulative ?? 0;

    hour.Rework = r.rework?.hour ?? r.reworkHour ?? 0;
    cum.Rework = r.rework?.cum ?? r.reworkCummulative ?? 0;

    const dts = Array.isArray(r.downtimeEntries) ? r.downtimeEntries : [];
    const downtimeMinutes = dts.reduce((sum, dt) => {
      const d = Number(dt?.duration);
      return sum + (Number.isFinite(d) ? d : 0);
    }, 0);

    const slotMinutes = parseSlotMinutes(r.timeSlot);

    const lossTime =
      slotMinutes == null
        ? ""
        : Math.max(0, downtimeMinutes);

    hour.lossTime = lossTime;

    let filteredModel = "";
    if (typeof r.model === "string" && hourlyProd > 0) {
      filteredModel = r.model
        .split(",")
        .map((m) => m.trim())
        .filter(Boolean)
        .slice(0, hourlyProd)
        .join(", ");
    }

    return {
      timeSlot: r.timeSlot,
      hour,
      cum,
      downtimes: dts.map((dt) => ({
        start: dt?.startTime ?? "",
        end: dt?.endTime ?? "",
        lossCode: dt?.lossCode ?? "",
        lossReason: dt?.reason ?? "",
        duration: Number.isFinite(Number(dt?.duration)) ? Number(dt?.duration) : "",
      })),
      downtimeMinutes,
      slotMinutes,
      model: filteredModel,
    };
  });
}

async function mergeTemplatePageAfterEachLineNode({
  jsPdfDoc,
  templateBytes,
  templatePageIndex = 1,
  insertAfterPages = [],
}) {
  const tplPdf = await PDFDocument.load(templateBytes);

  const genBytes = jsPdfDoc.output("arraybuffer");
  const outPdf = await PDFDocument.load(genBytes);

  if (tplPdf.getPageCount() <= templatePageIndex) {
    throw new Error("Template PDF does not have that many pages.");
  }

  const sorted = [...insertAfterPages].sort((a, b) => b - a);

  for (const afterPageNum of sorted) {
    const [copied] = await outPdf.copyPages(tplPdf, [templatePageIndex]);
    outPdf.insertPage(afterPageNum, copied);
  }

  const merged = await outPdf.save();
  return Buffer.from(merged);
}

/**
 * Build the same PDF your frontend makes, but on the backend.
 * Returns a Buffer you can: res.send(buffer) OR attach in Nodemailer later.
 */
async function buildPerformanceReportPdfBuffer({
  lineIds = [],
  date,              // "YYYY-MM-DD" (recommended) or ISO
  shift,             // "A" | "B" | "C" | "r"
  shiftLabel,        // what you want printed in header (e.g. "Shift A")
  templatePdfPath,   // filesystem path to your template PDF
  templatePageIndex = 1,
}) {
  if (!Array.isArray(lineIds) || lineIds.length === 0) {
    throw new Error("lineIds must be a non-empty array");
  }

  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  let isFirstPage = true;
  const insertAfterPages = [];

  for (const lineId of lineIds) {
    const report = await fetchPerformanceReportData({ lineId, date, shift });
    if(!report){
      continue
    }
    const normalizedRows = normalizePerformanceRows(report?.rows || []);

    if (!isFirstPage) doc.addPage();
    isFirstPage = false;

    const headerStartY = drawSQPHeader(doc, {
      lineName: report.lineName,
      shiftLabel: shiftLabel || String(shift),
      dateLabel: String(date),
    });

    const head = [
      [
        { content: "Time Slot", rowSpan: 2 },
        { content: "Production", colSpan: 2 },
        { content: "Model", rowSpan: 2 },
        { content: "Scheduled", colSpan: 2 },
        { content: "Reject", colSpan: 2 },
        { content: "Rework", colSpan: 2 },
        { content: "Downtime", colSpan: 2 },
        { content: "Loss Time", rowSpan: 2 },
        { content: "Loss", colSpan: 2 },
      ],
      [
        { content: "Hour" },
        { content: "Cum" },
        { content: "Hour" },
        { content: "Cum" },
        { content: "Hour" },
        { content: "Cum" },
        { content: "Hour" },
        { content: "Cum" },
        { content: "Start" },
        { content: "End" },
        { content: "Code" },
        { content: "Reason" },
      ],
    ];

    const body = normalizedRows.flatMap((r) => {
      const dts = (r.downtimes && r.downtimes.length) ? r.downtimes : [null];

      return dts.map((dt, idx) => [
        idx === 0 ? r.timeSlot : "",

        idx === 0 ? r.hour.Production : "",
        idx === 0 ? r.cum.Production : "",

        idx === 0 ? r.model : "",

        idx === 0 ? r.hour.Target : "",
        idx === 0 ? r.cum.Target : "",

        idx === 0 ? r.hour.Reject : "",
        idx === 0 ? r.cum.Reject : "",

        idx === 0 ? r.hour.Rework : "",
        idx === 0 ? r.cum.Rework : "",

        dt?.start ?? "",
        dt?.end ?? "",

        idx === 0 ? r.hour.lossTime : "",

        dt?.lossCode ?? "",
        dt?.lossReason ?? "",
      ]);
    });

    autoTable(doc, {
      startY: headerStartY,
      head,
      body,
      theme: "grid",
      styles: {
        fontSize: 8,
        halign: "center",
        valign: "middle",
        cellPadding: { top: 1, bottom: 1, left: 0, right: 0 },
        lineWidth: 0.2,
        lineColor: [0, 0, 0],
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        halign: "center",
        lineWidth: 0.2,
      },
      columnStyles: {
        3: { cellWidth: 20 },
      },
    });

    insertAfterPages.push(doc.getNumberOfPages());
  }

  if (doc.getNumberOfPages() === 0) {
    throw new Error("No pages generated (check lineIds/data)");
  }

  const templateBytes = await fs.readFile(templatePdfPath);
  const mergedBuffer = await mergeTemplatePageAfterEachLineNode({
    jsPdfDoc: doc,
    templateBytes,
    templatePageIndex,
    insertAfterPages,
  });

  return mergedBuffer;
}





const safeFilePart = (v) =>
  String(v ?? "")
    .trim()
    .replace(/[^\w.-]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");

const getTodayIstYyyyMmDd = () => {
  // stable IST "YYYY-MM-DD"
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const y = parts.find((p) => p.type === "year")?.value;
  const m = parts.find((p) => p.type === "month")?.value;
  const d = parts.find((p) => p.type === "day")?.value;

  return `${y}-${m}-${d}`;
};

/**
 * Generates today's (IST) performance report PDF for all lines and emails it.
 * Only takes shift as prop.
 *
 * @param {Object} opts
 * @param {"A"|"B"|"C"|"r"} opts.shift
 * @param {string} [opts.outputDir] - where to save the PDF
 * @param {string[]} [opts.recipients] - optional override/additional recipients
 * @param {string} [opts.templatePdfPath] - optional override template path
 * @param {number} [opts.templatePageIndex] - optional template page index
 */
async function sendTodayPerformanceReportPdf({ shift = "A", outputDir, recipients, templatePdfPath, templatePageIndex = 1 }) {
  const date = getTodayIstYyyyMmDd();

  if (!shift) {
    throw new Error("shift is required");
  }


  const tplPath ="/home/opsight/BharatSeats/BslBackend/PRODUCTION LINE PERFORMANCE MONITORING (S-Q-P) (4).pdf";

  const lines = await prismaClient.line.findMany({ select: { lineId: true } });
  const lineIds = lines.map((l) => l.lineId);

  const pdfBuffer = await buildPerformanceReportPdfBuffer({
    lineIds,
    date,
    shift,
    shiftLabel: `Shift ${shift}`,
    templatePdfPath: tplPath,
    templatePageIndex,
  });
      console.log("Report check executed");



  const baseName = `Performance_Report_${safeFilePart(date)}_Shift_${safeFilePart(shift)}`;
  const uniq = crypto.randomBytes(4).toString("hex");
  const fileName = `${baseName}_${uniq}.pdf`;


  const to =
    (Array.isArray(recipients) && recipients.length > 0
      ? recipients
      : ["ommishra@opsight.ai","ommishra74202@gmail.com"]
    ).filter(Boolean);

  const subject = `Performance Report - ${date} - Shift ${shift}`;
  const html = `
    <div style="font-family: Arial, sans-serif; color:#333;">
      <p>Hi,</p>
      <p>Please find the attached Performance Report PDF below.</p>
      <p><b>Date:</b> ${date}<br/>
         <b>Shift:</b> ${shift}</p>
      <p>Regards</p>
    </div>
  `;

  const mailInfo = await sendPerformanceReportPdfMail({
    to,
    subject,
    html,
    pdfBuffer,
    fileName,
  });

  return {
    date,
    shift,
    fileName,
    bytes: pdfBuffer.length,
    mailedTo: to,
    mailMessageId: mailInfo?.messageId || null,
  };
}


















module.exports = { getDowntimeReportByLineDateShiftCumulative,sendTodayPerformanceReportPdf,
  getSingleTorqueGun,getAllTorqueGuns,getSingleDrive,getAllDrivesData,getQualityData,getLineData,
  getPlantData,getCeoQualityData,getCeoTorqueData,getRunningSeatData,getCeoSeatProductionData,getCeoData,getPlantReportDate,getPlantReportDateRange};


const express = require('express');
const { influxDB } = require('../db/influxDB/influx');
const { QueryApi } = require('@influxdata/influxdb-client');
const { SendMailToUserAlert , SendMailNUCAlert,SendMailNUCRestored,SendEmailDispatchDelay} = require('../functions/userFunctions');
const { createDowntime2 } = require('../Controllers/downtime');
const { saveLatestDowntime, getLatestDowntimeForLineName} = require('../Controllers/plannedShutdown');
const {format,parseISO} = require('date-fns')
const influxRouter = express.Router();
const { getDowntimeReportByLineDateShiftCumulative } = require('../Controllers/influxControllers.js');
const queryApi = influxDB.getQueryApi("BSL Kharkhoda");

function convertUTCToISTTimeOnly(isoTime) {
  try {
    if (!isoTime) throw new Error("Empty time string");

    const utcDate = new Date(isoTime);
    if (isNaN(utcDate.getTime())) throw new Error("Invalid date");

    // Add 5 hours 30 minutes (IST offset)
    const istDate = new Date(utcDate.getTime() + (5.5 * 60 * 60 * 1000));

    let hours = istDate.getHours();
    const minutes = istDate.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours === 0 ? 12 : hours; // Convert '0' to '12'
    hours = hours.toString().padStart(2, '0');

    return `${hours}:${minutes} ${ampm}`;
  } catch (err) {
    console.error('Time conversion error:', err.message);
    return '';
  }
}
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
console.log(shift,selectedDate)
  const result = shiftTimes[shift];
  if (!result) throw new Error("Invalid shift. Must be 'A', 'B', or 'C'");
	console.log(result)
  return {
    startTime: result.start,
    endTime: result.end
  };
}
influxRouter.get('/SingleTorqueGun/data/:shift/:date/:torquegunName/:station', async (req, res) => {
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
});


influxRouter.get('/torqueGun/data/:shift/:date', async (req, res) => {
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
});




// GET /drive/data/:drive/:shift/:date
influxRouter.get('/SingleDrive/data/:drive/:shift/:date', async (req, res) => {
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
});

influxRouter.get('/drive/data/:shift/:date', async (req, res) => {
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
});



const frw = Array.from({length: 24}, (_, i) => `frw${i}`);
const frj = Array.from({length: 24}, (_, i) => `frj${i}`);
const rrw=Array.from({length: 24}, (_, i) => `rrw${i}`);
const rrj=Array.from({length: 24}, (_, i) => `rrj${i}`);
const crw=Array.from({length: 24}, (_, i) => `crw${i}`);
const crj=Array.from({length: 24}, (_, i) => `crj${i}`);
const ffield = [
  "First_Time_Pass_Rate",
  "Total_Production",
  "reject_count",
	"status_entries",
  "reject_rate",
  "rework_count",
  "rework_rate",
  "total_mfg_records"
];


const rfield=["First_Time_Pass_Rate_bag",
        "status_entries_bag",
        "rework_count_bag",
        "reject_count_bag",
        "rework_rate_bag",
	 "Total_Production",

        "reject_rate_bag"
    ]
const cfield=[
	"First_Time_Pass_Rate_cushion",
        "status_entries_cushion",
        "rework_count_cushion",
	 "Total_Production",

        "reject_count_cushion",
        "rework_rate_cushion",
        "reject_rate_cushion"
]
const reasonsMap = {
  Front_Line: [
    "FLR-1", "FLR-2", "FLR-3", "FLR-4", "FLR-5", "FLR-6", "FLR-7", "FLR-8", "FLR-9", "FLR-10",
    "FLR-11", "FLR-12", "FLR-13", "FLR-14", "FLR-15", "FLR-16", "FLR-17", "FLR-18", "FLR-19", "FLR-20",
    "FLR-21", "FLR-22", "FLR-23", "FLR-24", "FLR-25", "FLR-26", "FLR-27", "FLR-28", "FLR-29", "FLR-30",
    "FLR-31", "FLR-32", "FLR-33", "FLR-34", "FLR-35", "FLR-36", "FLR-37", "FLR-38", "FLR-39", "FLR-40",
    "FLR-41", "FLR-42", "FLR-43", "FLR-44", "FLR-45", "FLR-46", "FLR-47", "FLR-48", "FLR-49", "FLR-50",
    "FLR-51", "FLR-52", "FLR-53", "FLR-54", "FLR-55", "FLR-56", "FLR-57", "FLR-58", "FLR-59", "FLR-60",
    "FLR-61", "FLR-62", "FLR-63", "FLR-64", "FLR-65", "FLR-66", "FLR-67", "FLR-68", "FLR-69", "FLR-70",
    "First_Time_Pass_Rate"
  ],
  RB: [
    "RLR-1", "RLR-2", "RLR-3", "RLR-4", "RLR-5", "RLR-6", "RLR-7", "RLR-8", "RLR-9", "RLR-10",
    "RLR-11", "RLR-12", "RLR-13", "RLR-14", "RLR-15", "RLR-16", "RLR-17", "RLR-18", "First_Time_Pass_Rate_bag"
  ],
  RC: [
    "CLR-1", "CLR-2", "CLR-3", "CLR-4", "CLR-5", "CLR-6", "CLR-7", "CLR-8", "CLR-9", "CLR-10",
    "CLR-11", "CLR-12", "CLR-13", "CLR-14", "First_Time_Pass_Rate_cushion"
  ]
};



influxRouter.get('/Quality/data/:line/:shift/:date',async(req,res)=>{
const {line}=req.params;


const { shift, date } = req.params;
const selectedDate = date ? new Date(date) : new Date();

const { startTime, endTime } = getShiftTiming(shift, selectedDate);

    if (!startTime || !endTime) {
      throw new Error("Start time or end time is undefined.");
    }
           console.log(startTime,endTime)

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
})





const fieldsLineDashboard= [
    "fpc14:30 - 15:00",
    "fpc15:00 - 16:00",
    "fpc16:00 - 17:00",
    "fpc17:00 - 18:00",
    "fpc18:00 - 19:00",
    "fpc19:00 - 20:00",
    "fpc20:00 - 21:00",
    "fpc21:00 - 22:00",
    "fpc22:00 - 22:59",
    "RB4014:30 - 15:00",
    "RB4015:00 - 16:00",
    "RB4016:00 - 17:00",
    "RB4017:00 - 18:00",
    "RB4018:00 - 19:00",
    "RB4019:00 - 20:00",
    "RB4020:00 - 21:00",
    "RB4021:00 - 22:00",
    "RB4022:00 - 22:59",
    "RB6014:30 - 15:00",
    "RB6015:00 - 16:00",
    "RB6016:00 - 17:00",
    "RB6017:00 - 18:00",
    "RB6018:00 - 19:00",
    "RB6019:00 - 20:00",
    "RB6020:00 - 21:00",
    "RB6021:00 - 22:00",
    "RB6022:00 - 22:59",
    "RC4014:30 - 15:00",
    "RC4015:00 - 16:00",
    "RC4016:00 - 17:00",
    "RC4017:00 - 18:00",
    "RC4018:00 - 19:00",
    "RC4019:00 - 20:00",
    "RC4020:00 - 21:00",
    "RC4021:00 - 22:00",
    "RC4022:00 - 22:59",
    "RC6014:30 - 15:00",
    "RC6015:00 - 16:00",
    "RC6016:00 - 17:00",
    "RC6017:00 - 18:00",
    "RC6018:00 - 19:00",
    "RC6019:00 - 20:00",
    "RC6020:00 - 21:00",
    "RC6021:00 - 22:00",
    "RC6022:00 - 22:59",
	        "RB40_pph",
  "RB40_psn_change_count",
  "RB60_pph",
  "RB60_psn_change_count",
  "RB60_latest_mfg_variant",
  "RB40_latest_mfg_variant",
    "latest_mfg_variant",
    "RB60_pph",
    "pph",
    "RC60_pph",
    "RC40_pph",
    "RB40_pph",
    "mfg_time_diff_seconds",
    "Total_Production",
    "psn_change_count",
    "RC60_psn_change_count",
    "RC40_psn_change_count",
    "RB60_psn_change_count",
    "RB40_psn_change_count",
];

const RBFields=[
	"RB4014:30 - 15:00",
    "RB4015:00 - 16:00",
    "RB4016:00 - 17:00",
    "RB4017:00 - 18:00",
    "RB4018:00 - 19:00",
    "RB4019:00 - 20:00",
    "RB4020:00 - 21:00",
    "RB4021:00 - 22:00",
    "RB4022:00 - 22:59",
    "RB6014:30 - 15:00",
    "RB6015:00 - 16:00",
    "RB6016:00 - 17:00",
    "RB6017:00 - 18:00",
    "RB6018:00 - 19:00",
    "RB6019:00 - 20:00",
    "RB6020:00 - 21:00",
    "RB6021:00 - 22:00",
    "RB6022:00 - 22:59",
"RB60_psn_change_count",
    "RB40_psn_change_count",
	"RB60_mfg_time_diff_seconds",
	"Total_Production",
"RB40_mfg_time_diff_seconds",

	           "RB40_pph",
  "RB60_pph",
  "RB60_latest_mfg_variant",
  "RB40_latest_mfg_variant",
	"RB40_total_mfg_records",
        "RB60_total_mfg_records",



]
let preShift=["RB40_psn_change_count","RB60_psn_change_count","RC40_psn_change_count","RC60_psn_change_count","psn_change_count"]

const fpsFields=[
	  "fpc07:00 - 08:00",
  "fpc06:00 - 07:00",
  "fpc08:00 - 09:00",
  "fpc09:00 - 10:00",
  "fpc10:00 - 11:00",
  "fpc11:00 - 12:00",
  "fpc12:00 - 13:00",
  "fpc13:00 - 14:00",
  "fpc14:00 - 14:29",
	"fpc14:30 - 15:00",
    "fpc15:00 - 16:00",
    "fpc16:00 - 17:00",
    "fpc17:00 - 18:00",
    "fpc18:00 - 19:00",
    "fpc19:00 - 20:00",
    "fpc20:00 - 21:00",
    "fpc21:00 - 22:00",
    "fpc22:00 - 22:59",
	"total_mfg_records",
	 "latest_mfg_variant",
    "pph",
    "mfg_time_diff_seconds",
    "Total_Production",
    "psn_change_count",




]

const RCFields=[
	"RB6022:00 - 22:59",
    "RC4014:30 - 15:00",
    "RC4015:00 - 16:00",
    "RC4016:00 - 17:00",
    "RC4017:00 - 18:00",
    "RC4018:00 - 19:00",
    "RC4019:00 - 20:00",
    "RC4020:00 - 21:00",
    "RC4021:00 - 22:00",
    "RC4022:00 - 22:59",
    "RC6014:30 - 15:00",
    "RC6015:00 - 16:00",
    "RC6016:00 - 17:00",
    "RC6017:00 - 18:00",
    "RC6018:00 - 19:00",
    "RC6019:00 - 20:00",
    "RC6020:00 - 21:00",
    "RC6021:00 - 22:00",
    "RC6022:00 - 22:59",
	"RC40_total_mfg_records",
	"RC60_total_mfg_records",
	 "Total_Production",

	"RC60_psn_change_count",
    "RC40_psn_change_count",
	"RC40_mfg_time_diff_seconds",
	"RC60_latest_mfg_variant",
  "RC40_latest_mfg_variant",

	"RC60_mfg_time_diff_seconds",
	"RC60_pph",
    "RC40_pph",
]



const torqueFields={
  Front_Line:[ "Id","SequenceNo",
    "Varient","Handside", 
    
    "PSN", "PSN_Time", "BillTktDateTime",
    "BuckleTorque", "FrameAssyTorqueM10_1",
    "FrameAssyTorqueM10_2", "FrameAssyTorqueM6", "Load@35kg", "Load@6kg",
    
    "MfgDateTime" ],

    RB:[
    "Sn",
    "SequenceNo",
    "Station",
    "PSN",
    "PSN_Time",
    "Status_60",
    "Status_40",
    "BuiltTkt60Date",
    "BuiltTkt40Date",
    "Mfg_Date60",
    "Mfg_Date40",
    "Mfg_FinalBarcode60",
    "Mfg_FinalBarcode40",
    "ELR_Torque_Angle",
    "Frame60",
    "Frame40",
    "Torque1Angle1",
    "Torque2Angle2",
    "Torque3Angle3",
    "Torque4Angle4",
    "Trim60RB",
    "Trim40RB",
    "Final_Status60",
    "Final_Status40"
]

,RC:[
    "Sn",
    "SequenceNo",
    "Station",
    "PSN",
    "PSN_Time",
    "Status_60",
    "Status_40",
    "BuiltTkt60Date",
    "BuiltTkt40Date",
    "Mfg_Date60",
    "Mfg_Date40",
    "Mfg_FinalBarcode60",
    "Mfg_FinalBarcode40",
    "ELR_Torque_Angle",
    "Frame60",
    "Frame40",
    "Torque1Angle1",
    "Torque2Angle2",
    "Torque3Angle3",
    "Torque4Angle4",
    "Trim60RB",
    "Trim40RB",
    "Final_Status60",
    "Final_Status40"
]
}

function getLastValidItem(results) {
  for (let i = results.length - 1; i >= 0; i--) {
    const item = results[i];
    const hasValidData =
      item.Avg_Cycle_Time !== null && item.Avg_Cycle_Time !== undefined &&
      item.pph !== null && item.pph !== undefined &&
      item.Total_Target_Prod !== null && item.Total_Target_Prod !== undefined;

    if (hasValidData) return item;
  }
  return null;
}

influxRouter.get('/line/data/:line/:shift/:date',async(req,res)=>{
  const {line}=req.params
const { shift, date } = req.params;
const selectedDate = date ? new Date(date) : new Date();

const { startTime, endTime } = getShiftTiming(shift, selectedDate);

    if (!startTime || !endTime) {
      throw new Error("Start time or end time is undefined.");
    }
           console.log(startTime,endTime)
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
  res.json({
    error:e,
    message:"Failed to fetch line dashboard data"
  })
}

})



function extractHPCData(dataObj, bucket) {
  const expectedLines = ["Front_Line", "RB", "RC"];

  // We now use total_production_set time series (per line values)
  const seriesRaw = Array.isArray(dataObj?.total_production_set)
    ? dataObj.total_production_set
    : [];

  if (!seriesRaw.length) return [];

  const toMin = (hhmm) => {
    const [h, m] = String(hhmm).split(":").map(Number);
    return h * 60 + (m || 0);
  };

  // Parse points: [{tMin, adjMin, vByLine}]
  const points = seriesRaw
    .filter((p) => p && typeof p.time === "string" && p.value && typeof p.value === "object")
    .map((p) => {
      const tMin = toMin(p.time);
      return { tMin, time: p.time, vByLine: p.value };
    });

  if (!points.length) return [];

  // Detect midnight-crossing window (e.g., has 23xx and 00xx)
  const hasLate = points.some((p) => p.tMin >= 23 * 60);
  const hasEarly = points.some((p) => p.tMin < 6 * 60);
  const crossesMidnight = hasLate && hasEarly;

  const adj = (m) => (crossesMidnight && m < 6 * 60 ? m + 1440 : m);

  const ptsAsc = points
    .map((p) => ({ ...p, adjMin: adj(p.tMin) }))
    .sort((a, b) => a.adjMin - b.adjMin);

  // Build per-line series with carry-forward (handles missing line values)
  const lineSeries = {};
  expectedLines.forEach((ln) => (lineSeries[ln] = []));

  const last = {};
  expectedLines.forEach((ln) => (last[ln] = null));

  for (const p of ptsAsc) {
    expectedLines.forEach((ln) => {
      const v = p.vByLine?.[ln];
      if (v !== undefined && v !== null) last[ln] = Number(v);
      lineSeries[ln].push({
        adjMin: p.adjMin,
        v: Number.isFinite(last[ln]) ? last[ln] : null,
      });
    });
  }
// After building lineSeries...
const firstAdjByLine = {};
expectedLines.forEach((ln) => {
  const first = (lineSeries[ln] || []).find((p) => p.v != null);
  firstAdjByLine[ln] = first ? first.adjMin : null;
});

  // binary search: last value at/before boundary
  const valueAtOrBeforeAdj = (arrAsc, boundaryAdjMin) => {
    if (!arrAsc.length) return null;
    let lo = 0,
      hi = arrAsc.length - 1,
      ans = null;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (arrAsc[mid].adjMin <= boundaryAdjMin) {
        ans = arrAsc[mid].v;
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }
    return ans;
  };

  // Build slot starts from available time range
  const minAdj = ptsAsc[0].adjMin;
  const maxAdj = ptsAsc[ptsAsc.length - 1].adjMin;

  const floorToHour = (m) => Math.floor(m / 60) * 60;
  const ceilToHour = (m) => Math.ceil(m / 60) * 60;

  const startAdj = floorToHour(minAdj);
  const endAdj = ceilToHour(maxAdj);

  // Helper for labels
  const pad2 = (n) => String(n).padStart(2, "0");
  const hhmmFromAdj = (a) => {
    const m = ((a % 1440) + 1440) % 1440;
    const h = Math.floor(m / 60);
    const mm = m % 60;
    return `${pad2(h)}:${pad2(mm)}`;
  };

  const makeStdLabel = (startAdjMin) => {
    const startMin = ((startAdjMin % 1440) + 1440) % 1440;
    const hour = Math.floor(startMin / 60);
    const nextHour = hour === 23 ? 24 : (hour + 1) % 24;
    return `${pad2(hour)}-${pad2(nextHour)}`;
  };

  const slots = [];

  for (let cur = startAdj; cur < endAdj; cur += 60) {
    const curMod = ((cur % 1440) + 1440) % 1440;

    // Special split only when bucket !== TODAY
    if (bucket !== "TODAY" && curMod === 14 * 60) {
      // 14:00-14:30
      slots.push({ startAdj: cur, endAdj: cur + 30, label: "14:00-14:30" });
      // 14:30-15:00
      slots.push({ startAdj: cur + 30, endAdj: cur + 60, label: "14:30-15:00" });
      continue;
    }

    slots.push({ startAdj: cur, endAdj: cur + 60, label: makeStdLabel(cur) });
  }

  // Now compute delta(counter) for each slot per line and return same format
  const out = slots.map((sl) => {
    const latestValues = expectedLines.map((line) => {
      const arr = lineSeries[line] || [];
let startVal = valueAtOrBeforeAdj(arr, sl.startAdj);

// end boundary: try exact first, then fallback to just-before (helps missing exact boundary)
let endVal = valueAtOrBeforeAdj(arr, sl.endAdj);
if (endVal == null) endVal = valueAtOrBeforeAdj(arr, sl.endAdj - 1);

// if no end, we still can't compute
if (endVal == null) return { line, value: 0 };

// ONLY for the first slot that contains the first real point for this line:
const firstAdj = firstAdjByLine[line];
const isFirstSlotForThisLine =
  firstAdj != null && sl.startAdj <= firstAdj && firstAdj < sl.endAdj;

if (isFirstSlotForThisLine) {
  startVal = 0; // baseline only once
} else if (startVal == null) {
  return { line, value: 0 }; // keep your strict behavior for all other slots
}

let produced = (Number(endVal) || 0) - (Number(startVal) || 0);

// keep your old rule for later resets
if (produced < 0) produced = 0;

      return { line, value: produced };
    });

    return { time: sl.label, value: latestValues };
  });

  // Keep your exact night-first sorting behavior
  return out.sort((a, b) => {
    const aStart = parseInt(a.time.split("-")[0]);
    const bStart = parseInt(b.time.split("-")[0]);

    const aIsNight = aStart >= 23 || aStart < 6;
    const bIsNight = bStart >= 23 || bStart < 6;

    if (aIsNight && bIsNight) {
      const aAdj = aStart < 6 ? aStart + 24 : aStart;
      const bAdj = bStart < 6 ? bStart + 24 : bStart;
      return aAdj - bAdj;
    }
    if (aIsNight) return -1;
    if (bIsNight) return 1;
    return aStart - bStart;
  });
}

const plantFields=[
	"rework", "Today_Production_plan","Total_Production","Total_Target_Prod","pph", "reject", "First_Time_Pass_Rate","Today_planned_Prod","total_production_set",

  // New OEE-related fields
  "OEE", "Productivity", "Quality", "Avail", "pph",
 "HRP06:00", "HRP07:00",
  "HRP08:00", "HRP09:00", "HRP10:00", "HRP11:00",
  "HRP12:00", "HRP13:00", "HRP14:00", "HRP14:30",
 "HRP15:00", "HRP16:00", "HRP17:00", "HRP18:00",
  "HRP19:00", "HRP20:00", "HRP21:00", "HRP22:00",
  "HRP23:00",
  "HRP00:00", "HRP01:00", "HRP02:00", "HRP03:00",
  "HRP04:00", "HRP05:00",
  "HRP23:00"


]



influxRouter.get('/Plant/data/:shift/:date',async(req,res)=>{
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

})

influxRouter.get('/ceo/:date/:line/:field',async(req,res)=>{
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
  
  
})




influxRouter.get('/ceo/seatProduction/:shift',async(req,res)=>{
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

})



influxRouter.get('/ceo/runningSeat/:shift',async(req,res)=>{
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

})


influxRouter.get('/ceo/torqueGun/:station/:torqueGun/:date/:shift',async(req,res)=>{
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

})


influxRouter.get('/ceo/qualityReview/:line/:date/:shift',async(req,res)=>{
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

})

influxRouter.get("/plantReportRange/:shift/:date", async (req, res) => {
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
});



influxRouter.get('/plantReport/:shift/:date',async(req,res)=>{
  const {date,shift}=req.params
  const selectedDate = date ? new Date(date) : new Date();

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
})

let isEmailSent=false;
// Get today's 6 AM IST in ISO string (UTC format)
let now = new Date();
let istOffset = 5.5 * 60 * 60 * 1000; // IST offset in ms (UTC+5:30)

// Start of today in IST
let todayIST = new Date(now.getTime() + istOffset);
todayIST.setHours(6, 0, 0, 0); // Set to 6:00 AM IST

// Convert back to UTC ISO string
let lastRealtimeDataTime = new Date(todayIST.getTime() - istOffset).toISOString();

console.log(lastRealtimeDataTime,"on start of the server setting lastRealtimeDataTime");


     function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}


function isnotRealtime(utcTimeStr) {
	console.log("hii from realtime function")

	async function sendMailsSequentially2(emails, floorTime) {
  for (const email of emails) {
    try {
      await SendMailNUCAlert(email, floorTime);
      console.log(` Power off email Sent to ${email}`);
      await sleep(2000); // wait 2 seconds before sending next
    } catch (err) {
      console.error(`Failed to send to ${email}:`, err.message);
    }
  }
}

 // const inputTime = new Date(utcTimeStr);
      const inputTime = new Date(!utcTimeStr?lastRealtimeDataTime:utcTimeStr);

  const currentTime = new Date();

  const diffMs = Math.abs(currentTime - inputTime);
  const diffMinutes = diffMs / 60000;
  console.log(diffMinutes,currentTime,inputTime,utcTimeStr);

//  console.log(`⏱️ Difference: ${diffMinutes.toFixed(2)} minutes`);
	const floorTime=Math.floor(diffMinutes/5)*5;
        console.log(`⏱️  Difference: ${floorTime} minutes`);

	if(floorTime===5 || (floorTime>=20 && floorTime%20===0)){
	 const emails=[
		 "naresh.yadav@bharatseats.net",
		 "ommishra@opsight.ai",
//		 "pulakrijhwani@opsight.ai",
		          "nishant.kundu@bharatseats.net",
                    "mohan.mishra@bharatseats.net",
	//	 "arunkumar@opsight.ai",
      "mukesh.yadav@bharatseats.net",
		 ]
		 isEmailSent=true;
     console.log("Changing the variable to ",isEmailSent)
		sendMailsSequentially2(emails,floorTime)
	}

	

  return diffMinutes > 3;
}


const isBefore5PM_IST = () => {
  const now = new Date(); // IST assumed
  const currentHour = now.getHours();
  const day = now.getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6

  // Format current date as YYYY-MM-DD
  const todayStr = now.toISOString().slice(0, 10);

  // Block list of holidays (YYYY-MM-DD)
  const blockDates = [
    "2025-04-14", // Ambedkar Jayanti
    "2025-06-07", // Eid Ul Adha
    "2025-08-09", // Rakshabandhan
    "2025-08-15", // Independence Day
    "2025-08-16", // Janmashtami
    "2025-09-17", // Vishwakarma Day
    "2025-10-02", // Gandhi Jayanti
    "2025-10-21", // Diwali
	  "2025-10-20", // Diwali
    "2025-10-22", // Diwali
    "2025-10-23", // Govardhan Pooja
	  "2025-11-05", // random 
    "2025-01-26", // Republic Day
    "2025-03-04", // Holi
    "2025-03-05", // Holi
    "2024-10-10",
    "2024-10-20",
    "2024-06-30",
    "2024-11-05",
    "2024-12-27",
    "2024-07-19",
    "2024-11-24"
  ];

  // Working Sundays that should NOT be blocked
  const workingSundays = [
     "2024-10-12",
  "2024-10-19",
  "2024-10-26",
  "2024-11-02",
  "2025-01-04",
  "2025-01-25",
  "2025-03-08"
  ];

  const isBlockedDate = blockDates.includes(todayStr);
	console.log(todayStr,"today's date")
  const isLateNightOrEarlyMorning = currentHour >= 23 || currentHour < 6;

  // Sunday check, but allow working Sundays
  const isSunday = day === 0;
  const isBlockedSunday = isSunday && !workingSundays.includes(todayStr);

  console.log(`🕒 IST Time: ${currentHour}:${now.getMinutes()} (Day: ${day})`);
  console.log(`📅 Blocked Date: ${isBlockedDate}`);
  console.log(`📅 Blocked Sunday: ${isBlockedSunday}`);

  return isLateNightOrEarlyMorning || isBlockedDate || isBlockedSunday;
};

async function getDurations(data) {
  const nameMap = {
    Front_Line: "Front Line",
    RB: "Rear Back",
    RC: "Rear Cushion",
  };

  data.sort((a, b) => new Date(a._time) - new Date(b._time));

  const latestDowntime = {};
  const latestDuration = {};
  const state = {};

  for (const entry of data) {
    const line = entry.LINE;
    const time = new Date(entry._time);
    if (Number.isNaN(time.getTime())) continue;

    if (!state[line]) {
      state[line] = {
        lastTime: time,
        lastValue: entry.Total_Prod_Today,
        duration: 0,
        inDowntime: false,
        downtimeStartTime: null,
      };
      continue;
    }

    const s = state[line];
    const minutes = Math.round((time - s.lastTime) / (1000 * 60));

    if (line in nameMap) {
      if (entry.Total_Prod_Today === s.lastValue) {
        s.duration += minutes;

        if (!s.inDowntime) {
          s.inDowntime = true;
          s.downtimeStartTime = s.lastTime;
        }
      } else {
        if (s.inDowntime) {
          if (s.duration >= 5) {
            latestDowntime[line] = {
              startTime: s.downtimeStartTime,
              endTime: time,
              duration: Math.round(s.duration / 5) * 5,
            };
          }
          s.inDowntime = false;
          s.downtimeStartTime = null;
        }
        s.duration = 0;
      }
      s.lastValue = entry.Total_Prod_Today;

      latestDuration[line] = {
        _time: entry._time,
        duration: Math.round(s.duration / 5) * 5,
      };

      if (s.inDowntime && latestDuration[line].duration >= 5) {
        latestDowntime[line] = {
          startTime: s.downtimeStartTime,
          endTime: time,
          duration: latestDuration[line].duration,
        };
      }
    }

    s.lastTime = time;
  }

  const qualifyingLines = Object.entries(latestDuration).filter(
    ([line, { duration }]) => duration >= 5
  );

  const durationsString = qualifyingLines
    .map(([line, { duration }]) => `${nameMap[line]}: ${duration} minutes`)
    .join(", ");

  const lineNames = qualifyingLines.map(([line]) => nameMap[line]);

  let maxDurationValue = 0;
  let maxDurationLine = null;

  for (const [line, { duration, _time }] of qualifyingLines) {
    if (!Number.isFinite(duration)) continue;
    if (
      duration > maxDurationValue ||
      (duration === maxDurationValue &&
        new Date(_time) >
          new Date(latestDuration[maxDurationLine]?._time || 0))
    ) {
      maxDurationValue = duration;
      maxDurationLine = line;
    }
  }

  // ✅ Save/Update UnplannedDowntime rows in DB
  const res = await saveLatestDowntime({ latestDowntime });
  console.log("latestDowntime (synced):", res.results[0]?.data || {});

  // ✅ Build a map: lineName -> { id, reason, ... }
  // res shape: { ok:true, results:[ {lineKey, ok, action, data:{...plannedShutdown, lines:[...]}} ] }
  const downtimeReasonByLineName = {};

  const results = Array.isArray(res?.results) ? res.results : [];
  for (const r of results) {
    if (!r?.ok) continue;

    const lineKey = r.lineKey; // RB/RC/Front_Line
    const lineName = nameMap[lineKey] || lineKey;

    const ps = r?.data; // plannedShutdown row
    if (!ps?.id) continue;

    downtimeReasonByLineName[lineName] = {
      id: ps.id,
      reason: ps.reason ?? "",
      startTime: ps.startTime ?? null,
      endTime: ps.endTime ?? null,
      description: ps.description ?? "",
    };
  }
  // ✅ optional: also map by lineKey if you prefer
  const downtimeReasonByLineKey = {};
  for (const [lineName, obj] of Object.entries(downtimeReasonByLineName)) {
    const key = Object.keys(nameMap).find((k) => nameMap[k] === lineName);
    if (key) downtimeReasonByLineKey[key] = obj;
  }
  console.log("downtimeReasonByLineName:", downtimeReasonByLineName);

  return {
    durationsString,
    lineNames,
    latestDuration,
    maxDurationValue,
    latestDowntime,

    // ✅ NEW: use this to get reason for a particular line
    // e.g. downtimeReasonByLineName["Rear Back"]?.reason
    downtimeReasonByLineName,

    // ✅ optional
    downtimeReasonByLineKey,
  };
}

function getDurations2(data) {
  const nameMap = {
    Front_Line: "Front Line",
    RB: "Rear Back",
    RC: "Rear Cushion",
  };

  // Sort data by time
  data.sort((a, b) => new Date(a._time) - new Date(b._time));

  const latestDuration = {};
  const state = {};

  for (const entry of data) {
    const line = entry.LINE;
    const time = new Date(entry._time);

    if (!state[line]) {
      state[line] = {
        lastTime: time,
        lastValue: entry._value,
        duration: 0,
      };
      continue;
    }

    const s = state[line];
    const minutes = Math.round((time - s.lastTime) / (1000 * 60));

    if (line in nameMap) {
      if (entry.Total_Prod_Today === s.lastValue) {
        s.duration += minutes;
      } else {
        s.duration = 0;
      }

      s.lastValue = entry.Total_Prod_Today;

      latestDuration[line] = {
        _time: entry._time,
        duration: Math.round(s.duration/5)*5,
      };
    }

    s.lastTime = time;
  }

  // Filter lines with duration >= 5 minutes
  const qualifyingLines = Object.entries(latestDuration)
    .filter(([line, { duration }]) => duration >= 5);

  // Format outputs
  const durationsString = qualifyingLines
    .map(([line, { duration }]) => `${nameMap[line]}: ${duration} minutes`)
    .join(", ");

  const lineNames = qualifyingLines.map(([line]) => nameMap[line]);

  // Find max duration among qualifying lines
  let maxDurationValue = 0;
  let maxDurationLine = null;

  for (const [line, { duration, _time }] of qualifyingLines) {
    if (
      duration > maxDurationValue ||
      (duration === maxDurationValue &&
        new Date(_time) > new Date(latestDuration[maxDurationLine]?.__time || 0))
    ) {
      maxDurationValue = duration;
      maxDurationLine = line;
    }
  }

  return {
    durationsString,
    lineNames,
    maxDurationValue,
  };
}

function formatLineNames(lineNames) {
  const len = lineNames.length;

  if (len === 0) return '';
  if (len === 1) return lineNames[0];
  if (len === 2) return `${lineNames[0]} and ${lineNames[1]}`;

  // For 3 or more items
  const allButLast = lineNames.slice(0, -1).join(', ');
  const last = lineNames[len - 1];
  return `${allButLast}, and ${last}`;
}

function istToUtc(hour, minute) {
  const now = new Date(); // current local time
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth(); // 0-indexed
  const day = now.getUTCDate();

  const utcDate = new Date(Date.UTC(year, month, day, hour, minute));
  return utcDate.toISOString();
}


function getLatestStatus(data) {
  const result = {};

  data.forEach(entry => {
    const line = entry.LINE;
    const field = entry._field;
    const value = entry._value;
    const timeStr = entry._time;
    const time = new Date(timeStr); // parse to Date object

    if (!result[line]) {
      result[line] = {};
    }

    // If no entry yet or current time is newer
    if (
      !result[line][field] || 
      new Date(result[line][field]._time) < time
    ) {
      result[line][field] = {
        value,
        _time: timeStr
      };
    }
  });

  return result;
}

function findLatestOutOfSyncPeriod(directArray, viaReplicationArray) {
  const stripToMinutes = (iso) => {
    const d = new Date(iso);
    d.setSeconds(0, 0);
    return d;
  };

  const toIST = (isoDate) => {
    const istMillis = isoDate.getTime() + (5.5 * 60 * 60 * 1000);
    return new Date(istMillis).toISOString();
  };

  const directTimes = directArray.map(d => stripToMinutes(d._time));
  const viaTimes = viaReplicationArray.map(d => stripToMinutes(d._time));

  const allTimesSet = new Set([...directTimes, ...viaTimes].map(d => d.getTime()));
  const allTimes = Array.from(allTimesSet).sort((a, b) => a - b).map(ms => new Date(ms));

  let lastOutOfSyncStart = null;
  let firstBackInSyncAfterOutage = null;
  let outOfSync = false;

  const isWithin3Minutes = (time1, time2) => {
    return Math.abs(time1.getTime() - time2.getTime()) <= 3 * 60 * 1000;
  };

  for (let time of allTimes) {
    const hasDirect = directTimes.some(d => isWithin3Minutes(d, time));
    const hasVia = viaTimes.some(v => isWithin3Minutes(v, time));

    if (hasDirect && hasVia) {
      if (outOfSync && firstBackInSyncAfterOutage === null) {
        firstBackInSyncAfterOutage = time;
      }
      outOfSync = false;
    } else {
      if (!outOfSync) {
        lastOutOfSyncStart = time;
        firstBackInSyncAfterOutage = null;
      }
      outOfSync = true;
    }
  }

  return {
    outOfSyncStartUTC: lastOutOfSyncStart ? lastOutOfSyncStart.toISOString() : null,
    firstBackInSyncUTC: firstBackInSyncAfterOutage ? firstBackInSyncAfterOutage.toISOString() : null,
    outOfSyncStartIST: lastOutOfSyncStart ? toIST(lastOutOfSyncStart) : null,
    firstBackInSyncIST: firstBackInSyncAfterOutage ? toIST(firstBackInSyncAfterOutage) : null
  };
}



function TagsSyncStatus(obj1, obj2) {
  const lines = Object.keys(obj1);
  const maxTimeDiffMs = 4 * 60 * 1000;
  const inSyncLines = [];

  for (const line of lines) {
    const tag1 = obj1[line];
    const tag2 = obj2[line];

    const tag1Data =
      tag1.communication_status_direct ||
      tag1.communication_status_via_replication;

    const tag2Data =
      tag2.communication_status_direct ||
      tag2.communication_status_via_replication;

    if (!tag1Data || !tag2Data) continue;

    const time1 = new Date(tag1Data._time).getTime();
    const time2 = new Date(tag2Data._time).getTime();
    const timeDiff = Math.abs(time1 - time2);

    if (tag1Data.value === tag2Data.value && timeDiff <= maxTimeDiffMs) {
      inSyncLines.push(line);
	    console.log(time1,time2,timeDiff)
    }
  }
	if(inSyncLines.length===0){
		return true;
	}


  // Return only the lines that are in sync
  return inSyncLines;
}
function getLatestTimeOfTags(data) {
  let latestTime = null;

  Object.values(data).forEach(line => {
    ['communication_status_direct', 'communication_status_via_replication'].forEach(key => {
      const entry = line[key];
      if (entry && entry._time) {
        const currentTime = new Date(entry._time);
        if (!latestTime || currentTime > new Date(latestTime)) {
          latestTime = entry._time;
        }
      }
    });
  });

  return latestTime;
}

  async function sendMailsSequentiallyForRestore(emails) {
  for (const email of emails) {
    try {
      await SendMailNUCRestored(email);
      console.log(` Power on email Sent to ${email}`);
      await sleep(2000); // wait 2 seconds before sending next
    } catch (err) {
      console.error(`Failed to send to ${email}:`, err.message);
    }
  }
}

async function checkLast5MinutesData(data) {
  // Step 1: Sort data in increasing order of time
  const sorted = [...data].sort((a, b) => new Date(a._time) - new Date(b._time));

  // Step 2: Create unique times based only on hours and minutes (ignore seconds)
  const seenMinutes = new Set();
  const minuteTimes = [];

  for (const item of sorted) {
    const date = new Date(item._time);
    const key = `${date.getUTCFullYear()}-${date.getUTCMonth()}-${date.getUTCDate()} ${date.getUTCHours()}:${date.getUTCMinutes()}`;
    if (!seenMinutes.has(key)) {
      seenMinutes.add(key);
      minuteTimes.push(new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes())));
    }
  }

  // Step 3: Check last 5 unique minute timestamps
  const recent5 = minuteTimes.slice(-5);
	console.log(recent5)
  if (recent5.length < 5) {
    console.log("Not enough minute-level timestamps to determine continuity");
    return false;
  }


  // Step 4: Check each pair for 1-minute gap
  for (let i = 1; i < 5; i++) {
    const prev = recent5[i - 1];
    const curr = recent5[i];
    const diffMin = (curr - prev) / (1000 * 60);

    if (diffMin >3) {
      console.log("Power Up Detected");
	     isEmailSent=false;
      console.log("changing the isEmailsent to ",isEmailSent)
	     const emails=[
		     "naresh.yadav@bharatseats.net",
                 "ommishra@opsight.ai",
//		          "pulakrijhwani@opsight.ai",
                // "arunkumar@opsight.ai",
    "nishant.kundu@bharatseats.net",
		     "mohan.mishra@bharatseats.net",
      "mukesh.yadav@bharatseats.net",
                 ]
                sendMailsSequentiallyForRestore(emails)

      return true;
    }
  }

  console.log("Last 5 minutes are continuous");
	return false;
}



const mailConfig = {
    5: {
      level: "Level 1",
      emails: [
	      "ommishra@opsight.ai",
        "mukesh.yadav@bharatseats.net",
      ],
    },
    10: {
      level: "Level 2",
      emails: [
	      "ommishra@opsight.ai",
       // "aniket.singh@bharatseats.net",
        "mukesh.yadav@bharatseats.net",
	      "Yogesh.Bansal@bharatseats.net",
      ],
    },
	20:{
		level:"suman",
		emails:["Suman.Yadav@bharatseats.net","mukesh.yadav@bharatseats.net"]
	},
    35: {
      level: "Level 3",
      emails: [
        "ommishra@opsight.ai",
         "naresh.yadav@bharatseats.net",
         "aniket.singh@bharatseats.net",
         "mukesh.yadav@bharatseats.net",
	     "arunkumar@opsight.ai",
	     "Rajiv.Arora@bharatseats.net",
      ],
    },
  };





function buildDowntimeMessage(durations) {
  let isCeoSend = true;

  const map = durations?.downtimeReasonByLineName || {};
  const latest = durations?.latestDuration || {}; // { RB:{duration}, ... }

  const nameToKey = {
    "Front Line": "Front_Line",
    "Rear Back": "RB",
    "Rear Cushion": "RC",
  };

  const lines = [];
  const badReasons = new Set(["", "No reason alloted"]);

  for (const [lineName, obj] of Object.entries(map)) {
    const key = nameToKey[lineName];
    const dur = latest?.[key]?.duration ?? 0; // already 5-rounded

    if (dur < 5) continue;

    const reasonRaw = (obj?.reason ?? "").trim();
    

    // ✅ if any line (that qualifies) has empty or "No reason alloted" => block CEO send
    if (badReasons.has(reasonRaw)) {
      isCeoSend = false;
    }

    lines.push(`${lineName}: ${dur} min | Reason: ${reasonRaw || "NA"}`);
  }

  if (lines.length === 0) return { message: "", isCeoSend: false };

  return {
    message: `Downtime Alert:\n${lines.join("\n")}`,
    isCeoSend,
  };
}

const checkRunModeAndSendAlerts = async () => {
if(isBefore5PM_IST()){
                console.log(isBefore5PM_IST())
	lastRealtimeDataTime=istToUtc(0,30)
	
	console.log("Not the time to send email and changing lastRealtimeDataTime to ",lastRealtimeDataTime)
                return ;
      }

let startTime=istToUtc(0,30)
const endTime=istToUtc(17,30);	
const QueryForLive = `
  from(bucket: "TODAY")
    |> range(start: time(v: "${startTime}"),stop:time(v:"${endTime}"))
    |> filter(fn: (r) => r["_measurement"] == "Performance")
  |> filter(fn: (r) => r["LINE"] == "RB" or r["LINE"] == "RC" or r["LINE"] == "Front_Line")
  |> filter(fn: (r) => r["_field"] == "communication_status_direct")
    |> aggregateWindow(every: 20s, fn: last, createEmpty: false)
    |> sort(columns: ["_time"], desc: false)
`;

const QueryForLive2 = `
  from(bucket: "TODAY")
    |> range(start: time(v: "${startTime}"),stop:time(v:"${endTime}"))
     |> filter(fn: (r) => r["_measurement"] == "Performance")
  |> filter(fn: (r) => r["LINE"] == "RB" or r["LINE"] == "RC" or r["LINE"] == "Front_Line")
  |> filter(fn: (r) => r["_field"] == "communication_status_via_replication")
    |> aggregateWindow(every: 20s, fn: last, createEmpty: false)
    |> sort(columns: ["_time"], desc: false)
`;
	console.log("start and end time of communication query",startTime,endTime)



const rows=await queryApi.collectRows(QueryForLive2);
const rowsDirect = await queryApi.collectRows(QueryForLive);


console.log(rows[0],rowsDirect[0])
console.log(getLatestStatus(rows),getLatestStatus(rowsDirect))

	const lastTimeDirect=getLatestTimeOfTags(getLatestStatus(rowsDirect))
	const lastTime=getLatestTimeOfTags(getLatestStatus(rows))
	console.log("inside this console",lastTimeDirect)
	if(isnotRealtime(lastTimeDirect)){
		console.log("Email sent for not in realtime Data ")
		return ;
	}else{

	   if(isEmailSent && checkLast5MinutesData(rowsDirect)){
		   console.log("just powered up email sent for power up nuc or restored connection ")
		   return;
	   }
	   
		if(TagsSyncStatus(getLatestStatus(rows),getLatestStatus(rowsDirect))===true){
		   console.log("email for not time sync for all 3 lines ");
		return ;
	   }

	}

	
 startTime=findLatestOutOfSyncPeriod(rows,rowsDirect)?.firstBackInSyncUTC || istToUtc(0,30);


const linesList=TagsSyncStatus(getLatestStatus(rows),getLatestStatus(rowsDirect));
	if(linesList.length<3){
		console.log("Changing time as the data is not reset")
                const now=new Date()
                const hour=now.getHours();
		const minutes=now.getMinutes()
                startTime=istToUtc(hour,minutes);

	}

	console.log("Data is realtime and the replication is in sync for these lines ",linesList,startTime ,endTime)
            lastRealtimeDataTime=lastTimeDirect; 
  console.log("changed the value of lastRealtimeDataTime to ",lastTimeDirect)
	const lineFilter = linesList.map(line => `r["LINE"] == "${line}"`).join(" or ");
	const fluxQuery = `
        from(bucket: "TODAY")
        |> range(start: time(v: "${startTime}"),stop:time(v:"${endTime}"))
        
          |> filter(fn: (r) => r["_measurement"] == "Performance")
	   |> filter(fn: (r) => ${lineFilter})
  |> filter(fn: (r) => r["_field"] == "Total_Prod_Today")
          |> aggregateWindow(every: 1m, fn: last, createEmpty: false)
            |> pivot(rowKey:["_time"], columnKey:["_field"], valueColumn:"_value")
            |> sort(columns: ["_time"], desc: false)
        `;




  try { 
	  const rows2 = await queryApi.collectRows(fluxQuery);
	  	  const durations = await getDurations(rows2);
const info = durations.durationsString;
const maxDuration = durations.maxDurationValue;
const floorTime = Math.floor(maxDuration / 5) * 5;

const message = buildDowntimeMessage(durations);

console.log("floorTime:", floorTime);
console.log("message:\n", message.message);

         const lineName=formatLineNames(durations.lineNames);	


          console.log(lineName,info,"So email will be sent for this floortime ",floorTime,message);


	 
async function sendMailsSequentially(emails, info, lineName) {
  for (const email of emails) {
    try {
	    console.log("sending in process ,for ",email)
	          if((email==="Rajiv.Arora@bharatseats.net" || email==="ommishra@opsight.ai" || email==="arunkumar@opsight.ai" || email==="aniket.singh@bharatseats.net") && !message.isCeoSend){
        console.log("Skipping CEO email as reason not allotted")
        continue;
      }
      await SendMailToUserAlert(email, message?.message, lineName);
      console.log(`✅ Sent to ${email}`);
      await sleep(2000); // wait 2 seconds before sending next
    } catch (err) {
      console.error(`❌ Failed to send to ${email}:`, err.message);
    }
  }
}

async function processMailLogic(floorTime, info, lineName) {

  // Extend support for 35, 55, 75, etc.
	console.log("Process mail logic function , check")
  const isExtendedLevel3 = floorTime > 35 && (floorTime - 30) % 20 === 0;

  const config =
    mailConfig[floorTime] || (isExtendedLevel3 ? mailConfig[35] : null);
   console.log("outside config",floorTime) 
  if (config) {
	  console.log("inside sendMailSequence")
    await sendMailsSequentially(config.emails, info, lineName);
    console.log(`${config.level} mail sent for floorTime:`, floorTime);
  } else {
    console.log("✅ No alert triggered at this duration.");
  }
}

// Call the function
processMailLogic(floorTime, info, lineName);
  } catch (err) {
    console.error("❌ Error in checkRunModeAndSendAlerts:", err);
  }
};

// ✅ Manual route trigger
influxRouter.post("/check-runmode", async (req, res) => {
  await checkRunModeAndSendAlerts();
  res.status(200).json({message:"Triggered check manually."});
});




  const mailConfig2 = {
    12: {
      level: "Level 1",
      emails: [
         "mukesh.yadav@bharatseats.net",
         "ommishra@opsight.ai",
         "mohan.mishra@bharatseats.net",
        "Gaurav.kumar@bharatseats.net",
      ],
    },
    15: {
      level: "Level 2",
      emails: [
         "Suman.Yadav@bharatseats.net",
         "ommishra@opsight.ai",
       //  "arunkumar@opsight.ai"
        ,"mohan.mishra@bharatseats.net",

      ],
    },
    20: {
      level: "Level 3",
      emails: [
         "Rajiv.Arora@bharatseats.net",
      //  "arunkumar@opsight.ai",
        "mohan.mishra@bharatseats.net",

      ],
    },
  };

// --- Flags to track whether we've already sent email ---
let c93Triggered = false;
let c94Triggered = false;
let c95Triggered = false;

const sendBitEmails = async () => {
  try {
    const bitQuery = `
      from(bucket: "TODAY")
        |> range(start: -90s) // last 40 seconds
        |> filter(fn: (r) => r["_measurement"] == "connection")
        |> filter(fn: (r) => r["_field"] == "c93" or r["_field"] == "c94" or r["_field"] == "c95")
        |> last()
    `;

    // Fetch rows
    const rows = [];
    for await (const { values, tableMeta } of queryApi.iterateRows(bitQuery)) {
      rows.push(tableMeta.toObject(values));
    }

    if (rows.length === 0) {
      console.log("No data found in last 30s for c93, c94, c95");
      // reset all flags if no data comes
      c93Triggered = false;
      c94Triggered = false;
      c95Triggered = false;
      return;
    }

    // Build latestValues map
    const latestValues = {};
    rows.forEach((row) => {
      latestValues[row._field] = {
        value: row._value,
        time: row._time,
      };
    });

    console.log("Latest values (last 40s):", latestValues);

    // --------------------
    // Handle c95
    // --------------------
    if (latestValues.c95 && latestValues.c95.value === 1) {
      if (!c95Triggered) {
        c95Triggered = true; // lock it
        const config = mailConfig2[20];
        const msg = `The dispatch wagon has been delayed for more than 20 minutes.`;
        await sendEmails(config, msg);
      }
    } else {
      c95Triggered = false; // reset if 0 or missing
    }

    // --------------------
    // Handle c94
    // --------------------
    if (latestValues.c94 && latestValues.c94.value === 1) {
      if (!c94Triggered) {
        c94Triggered = true;
        const config = mailConfig2[15];
        const msg = `The dispatch wagon has been delayed for more than 15 minutes.`;
        await sendEmails(config, msg);
      }
    } else {
      c94Triggered = false;
    }

    // --------------------
    // Handle c93
    // --------------------
    if (latestValues.c93 && latestValues.c93.value === 1) {
      if (!c93Triggered) {
        c93Triggered = true;
        const config = mailConfig2[12];
        const msg = `The dispatch wagon has been delayed for more than 12 minutes.`;
        await sendEmails(config, msg);
      }
    } else {
      c93Triggered = false;
    }

  } catch (err) {
    console.error("Error in sendBitEmails:", err);
  }
};

// helper function to send all emails for a config
async function sendEmails(config, message) {
  console.log(`Triggering ${config.level} emails`);

  const emailPromises = config.emails.map(async (email) => {
    try {
      await SendEmailDispatchDelay(email, message);
      console.log(`Email sent successfully to ${email} for ${config.level}`);
    } catch (error) {
      console.error(`Failed to send email to ${email}:`, error);
    }
  });

  await Promise.allSettled(emailPromises);
  console.log(`All emails processed for ${config.level}`);
}


influxRouter.get("/performance-report",getDowntimeReportByLineDateShiftCumulative)



  module.exports = {influxRouter,getShiftTiming ,sendBitEmails};
















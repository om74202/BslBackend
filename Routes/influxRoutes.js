const express = require('express');
const { influxDB } = require('../db/influxDB/influx');
const { QueryApi } = require('@influxdata/influxdb-client');
const {format,parseISO} = require('date-fns')
const influxRouter = express.Router();
const queryApi = influxDB.getQueryApi("opsight_ai");





function getShiftTiming(shift, isPrevious = false) {
  const now = new Date();

  // Convert current time to IST
  const nowIST = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  const year = nowIST.getFullYear();
  const month = nowIST.getMonth();
  const date = nowIST.getDate();
  const baseDate = isPrevious ? date - 1 : date;

  // Helper to get IST Date object at specific hour and minute
  const istTime = (hour, minute = 0, dayOffset = 0) => {
    return new Date(Date.UTC(year, month, baseDate + dayOffset, hour - 5, minute - 30)); // convert IST to UTC
  };

  const shiftTimes = {
    A: {
      start: istTime(6, 0),
      end: istTime(14, 30)
    },
    B: {
      start: istTime(14, 30),
      end: istTime(23, 0)
    },
    C: {
      start: istTime(23, 0),
      end: istTime(6, 0, 1) // next day 6:00 AM IST
    }
  };

  const result = shiftTimes[shift];

  if (!result) {
    throw new Error("Invalid shift. Must be 'A', 'B', or 'C'");
  }

  return {
    startTime: result.start.toISOString(),
    endTime: result.end.toISOString()
  };
}


influxRouter.get('/torqueGun/data/:shift/:isPrevious', async (req, res) => {
  try {
	   const { shift, isPrevious } = req.params;
    const isPrev = isPrevious === "true";
	   const { startTime, endTime } = getShiftTiming(shift, isPrev);

    if (!startTime || !endTime) {
      throw new Error("Start time or end time is undefined.");
    }
	   console.log(startTime,endTime,isPrev)


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
       |> aggregateWindow(every: 2s, fn: last, createEmpty: false)
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





let alertsCount;
const groupedData = results.reduce((acc, current) => {
    const station = current.station;
    const torqueGun = current.torque_gun || current.torque_gun;
    const time = current._time;
    const torqueValue = current.torque_value;
    const angle = current.angle;
    const isConnected = current.connection_status === 'connected';
	//	console.log(current.station,current.torque_gun,isConnected)
	if(current.status !== 'pass'){
		alertsCount++;
	}



    // Initialize station if not exists
    if (!acc[station]) {
        acc[station] = {
            torqueGuns: {},
            connectionStatus: isConnected,
            firstConnectionUpdate: time  // Changed from lastConnectionUpdate
        };
    }

    // Only update connection status if it hasn't been set before
    if (!acc[station].hasOwnProperty('connectionStatus')) {
        acc[station].connectionStatus = isConnected;
        acc[station].firstConnectionUpdate = time;
    }

    // Initialize torque gun if not exists
    if (!acc[station].torqueGuns[torqueGun]) {
        acc[station].torqueGuns[torqueGun] = {
            torqueData: [],
            angleData: [],
            first: {}  // Changed from latest to first
        };
        
        // Store first values of all other fields
        Object.keys(current).forEach(key => {
            if (!['torque_value', 'angle', 'station', 'torque_gun', '_time'].includes(key)) {
                acc[station].torqueGuns[torqueGun].first[key] = current[key];
            }
        });
    }

    // Add torque and angle data points
    acc[station].torqueGuns[torqueGun].torqueData.push({
        time: format(new Date(time), 'HH:mm'),
        value: torqueValue
    });

    acc[station].torqueGuns[torqueGun].angleData.push({
        time: format(new Date(time), 'HH:mm'),
        value: angle
    });

    return acc;
}, {});
// Sort all data by time and count connected stations
let connectedStationCount = 0;
	  let disconnectedStationCount=0;
Object.keys(groupedData).forEach(station => {
    // Update connected station count
    if (groupedData[station].connectionStatus) {
        connectedStationCount++;
    }else{
	    disconnectedStationCount++;
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
    connectedStationCount: connectedStationCount,
	disconnectedStationCount:disconnectedStationCount
};
//    console.timeEnd("queryTime")

console.time("dataSorting")




// Convert results into an array of field name and their value
// Assuming you want this for just the first result row:





console.timeEnd("dataSorting")
    res.json({
      success: true,
	    data:groupedData,
	    connected:connectedStationCount,
	    disconnected:disconnectedStationCount,
      latestData:results[0],
	    rawData:results,
	    alerts:alertsCount,
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


influxRouter.get('/drive/data/:shift/:isPrevious', async (req, res) => {
  try {
	           const { shift, isPrevious } = req.params;
    const isPrev = isPrevious === "true";
           const { startTime, endTime } = getShiftTiming(shift, isPrev);

    if (!startTime || !endTime) {
      throw new Error("Start time or end time is undefined.");
    }
           console.log(startTime,endTime,isPrev)

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
                    latestUpdateTime: displayTime
                };
            } else {
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
    Object.values(lastStatusPerDrive).forEach(status => {
        if (status !== "PASS") alertCount++;
    });

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



influxRouter.get('/Quality/data/:line/:shift/:isPrevious',async(req,res)=>{
const {line}=req.params;
	         const { shift, isPrevious } = req.params;
    const isPrev = isPrevious === "true";
           const { startTime, endTime } = getShiftTiming(shift, isPrev);

    if (!startTime || !endTime) {
      throw new Error("Start time or end time is undefined.");
    }
           console.log(startTime,endTime,isPrev)

const bucket=`SHIFT_${shift}`

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
        time: new Date(item._time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
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

  // Get last values (most recent entries)
  const lastValues = {
    dismental: result.dismental.length ? result.dismental.slice(-1)[0].metrics : null,
    rework: result.rework.length ? result.rework.slice(-1)[0].metrics : null
  };

  return { separatedData: result, lastValues };
};






  res.json({
    success:true,
	  data:processQualityData(results),
    latestData:lastData,
    rawData:processQualityReasons(results),
	  
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

    RB:["BuiltTkt40Date","BuiltTkt60Date","C_INNNER_PLASTIC_PART","Dispatch","ELR","ELR_Torque_Angle","Final_Status40","Final_Status60","Frame40","Frame60","Greesing_Status","HR_LOAD_LH1"
      ,"HR_LOAD_RH1","HeadRest_LH","HeadRest_RH","M_ADD_PSN","M_COLOR_CODE","M_ID","M_MODEL","M_MODEL_DESC","M_MSGN_CMNTS1","M_MSGN_CMNTS2",
      "M_MSGN_CMNTS3","M_MSGN_CMNTS4","M_OK_NG","M_PSN","M_TERM_ID","M_VAL1","M_VAL2","M_VAL3","M_VAL4","M_VIN_NO","Mfg_Date40","Mfg_Date60",
      "Mfg_FinalBarcode40","Mfg_FinalBarcode60","Model","PLASTIC_PART","PSN","PSN_Time","Reject","RejectAt","Rework40","Rework60","SequenceNo","Shift","Sn",
      "Station","Status_40","Status_60","Torque1Angle1","Torque2Angle2","Torque3Angle3","Torque4Angle4","Trim40RB","Trim40RC","Trim60RB","Trim60RC","Verient","read_time"]

,RC:["BuiltTkt40Date","BuiltTkt60Date","C_INNNER_PLASTIC_PART","Dispatch","ELR","ELR_Torque_Angle","Final_Status40","Final_Status60","Frame40","Frame60","Greesing_Status","HR_LOAD_LH1"
      ,"HR_LOAD_RH1","HeadRest_LH","HeadRest_RH","M_ADD_PSN","M_COLOR_CODE","M_ID","M_MODEL","M_MODEL_DESC","M_MSGN_CMNTS1","M_MSGN_CMNTS2",
      "M_MSGN_CMNTS3","M_MSGN_CMNTS4","M_OK_NG","M_PSN","M_TERM_ID","M_VAL1","M_VAL2","M_VAL3","M_VAL4","M_VIN_NO","Mfg_Date40","Mfg_Date60",
      "Mfg_FinalBarcode40","Mfg_FinalBarcode60","Model","PLASTIC_PART","PSN","PSN_Time","Reject","RejectAt","Rework40","Rework60","SequenceNo","Shift","Sn",
      "Station","Status_40","Status_60","Torque1Angle1","Torque2Angle2","Torque3Angle3","Torque4Angle4","Trim40RB","Trim40RC","Trim60RB","Trim60RC","Verient","read_time"]
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

influxRouter.get('/line/data/:line/:shift/:isPrevious',async(req,res)=>{
  const {line}=req.params
	         const { shift, isPrevious } = req.params;
    const isPrev = isPrevious === "true";
           const { startTime, endTime } = getShiftTiming(shift, isPrev);

    if (!startTime || !endTime) {
      throw new Error("Start time or end time is undefined.");
    }
           console.log(startTime,endTime,isPrev)

  const bucket = `SHIFT_${shift}`
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
  const time = humanReadableTime(item._time);
  
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
const sequenceField = 'SequenceNo'; // Change this to your actual sequence field name

// Create a map to group data by sequence number
const rowsBySequence = new Map();

results.forEach(row => {
  const sequenceNum = row[sequenceField];
  
  // Initialize row object if it doesn't exist
  if (!rowsBySequence.has(sequenceNum)) {
    rowsBySequence.set(sequenceNum, {
      [sequenceField]: sequenceNum,
      _time: format(new Date(row._time), 'dd:HH:mm')
// Include time if needed
    });
  }
  
  const currentRow = rowsBySequence.get(sequenceNum);
  
  // Add all torque fields to the row
  torqueFields[line].forEach(field => {
    currentRow[field] = field in row ? (row[field] !== null ? row[field] : 0) : 0;
  });
});

// Convert the map to an array of rows
const tableData = Array.from(rowsBySequence.values());

// Sort by sequence number if needed
tableData.sort((a, b) => a[sequenceField] - b[sequenceField]);




res.json({
  success:true,
  data:getLastValidItem(results),
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





function extractHPCData(dataObj) {
  return Object.keys(dataObj)
    .filter((key) => key.startsWith("HRP"))
    .sort((a, b) => {
      const getNumber = (k) => parseFloat(k.slice(3).replace("_", "."));
      return getNumber(a) - getNumber(b);
    })
    .map((key) => {
      const suffix = key.slice(3).replace("_", ".");
      const lastValue = dataObj[key].at(-1); // Get last element
      return {
        time: suffix,
        value: lastValue.value,
      };
    });
}


const plantFields= [
  // Original fields
  "rework", "Total_Production", "reject", "First_Time_Pass_Rate","Total_Target_Prod",
  
  // New OEE-related fields
  "OEE", "Productivity", "Quality", "Avail", "pph",
  
  // Hourly production fields
  "HRP00:00", "HRP01:00", "HRP02:00", "HRP03:00", 
  "HRP04:00", "HRP05:00", "HRP06:00", "HRP07:00",
  "HRP08:00", "HRP09:00", "HRP10:00", "HRP11:00",
  "HRP12:00", "HRP13:00", "HRP14:00", "HRP14:30",
  "HRP15:00", "HRP16:00", "HRP17:00", "HRP18:00",
  "HRP19:00", "HRP20:00", "HRP21:00", "HRP22:00",
  "HRP23:00"
];

influxRouter.get('/Plant/data/:shift/:isPrevious',async(req,res)=>{
	         const { shift, isPrevious } = req.params;
    const isPrev = isPrevious === "true";
           const { startTime, endTime } = getShiftTiming(shift, isPrev);

    if (!startTime || !endTime) {
      throw new Error("Start time or end time is undefined.");
    }


  const bucket = `SHIFT_${shift}`
  const measurement='Performance'

const fieldConditions = plantFields.map(f => `r._field == "${f}"`).join(" or ");
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
  oeeLatestValues: {},
  qualityLatestValues: {},
  Performance: {},
  QUALITY: {},
  targetProdLatestValues: {}
};

// Process all records
results.forEach(({ _measurement, _field, _value, _time, LINE }) => {
  // Format time to hh:mm in IST
  const date = new Date(_time);
  const hhmm = date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Kolkata'
  });

  // Initialize structure
  if (!groupData[_measurement]) groupData[_measurement] = {};
  if (!groupData[_measurement][_field]) groupData[_measurement][_field] = {};

  if (_measurement === "QUALITY") {
    // Track last value per line
    if (!groupData[_measurement][_field][LINE]) {
      groupData[_measurement][_field][LINE] = [];
    }
    groupData[_measurement][_field][LINE].push({
      time: hhmm,
      value: _value,
      timestamp: date.getTime()
    });

    // Store all data points
    if (!groupData[_measurement][_field][hhmm]) {
      groupData[_measurement][_field][hhmm] = [];
    }
    groupData[_measurement][_field][hhmm].push({
      time: hhmm,
      value: _value,
      line: LINE
    });

  } else if (_measurement === "Performance") {
    // Track OEE and Total_Target_Prod by line
    if (_field === "OEE" || _field === "Total_Target_Prod") {
      if (!groupData[_measurement][_field][LINE]) {
        groupData[_measurement][_field][LINE] = [];
      }
      groupData[_measurement][_field][LINE].push({
        time: hhmm,
        value: _value,
        timestamp: date.getTime()
      });
    }

    // Process all fields for time-based data
    const isAverageField = ["Avail", "OEE", "Productivity", "Quality"].includes(_field);
    if (!groupData[_measurement][_field][hhmm]) {
      groupData[_measurement][_field][hhmm] = {
        sum: 0,
        count: 0,
        isAverageField
      };
    }
    groupData[_measurement][_field][hhmm].sum += _value;
    groupData[_measurement][_field][hhmm].count++;
  }
});

// Process QUALITY data
Object.keys(groupData.QUALITY || {}).forEach(field => {
  finalData.QUALITY[field] = [];
  finalData.qualityLatestValues[field] = {};

  Object.keys(groupData.QUALITY[field]).forEach(key => {
    // Process line data for latest values
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
    
    // Process time data for all values
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

// Process Performance data
Object.keys(groupData.Performance || {}).forEach(field => {
  // Handle OEE line data
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

  // Handle Total_Target_Prod line data
  if (field === "Total_Target_Prod") {
    finalData.targetProdLatestValues = {};
    Object.keys(groupData.Performance[field]).forEach(key => {
      if (!/^\d{2}:\d{2}$/.test(key)) {
        const lineData = groupData.Performance[field][key];
        if (Array.isArray(lineData) && lineData.length > 0) {
          const sorted = [...lineData].sort((a, b) => b.timestamp - a.timestamp);
          finalData.targetProdLatestValues[key] = {
            lastEntry: {
              time: sorted[0].time,
              value: sorted[0].value
            }
          };
        }
      }
    });
  }

  // Process time-based Performance data
  finalData.Performance[field] = Object.entries(groupData.Performance[field])
    .filter(([key]) => /^\d{2}:\d{2}$/.test(key))
    .map(([time, data]) => ({
      time,
      value: data.isAverageField ? (data.count > 0 ? data.sum / data.count : 0) : data.sum
    }))
    .sort((a, b) => a.time.localeCompare(b.time));
});
let chartData=finalData.Performance;
const data3 = {
  OEE: chartData.OEE,
  Productivity: chartData.Productivity,
  Quality: chartData.Quality,
  Avail: chartData.Avail
};

res.json({
  success:true,
  data:finalData.targetProdLatestValues,
	data2:finalData.oeeLatestValues,
	data3:data3,
	hpcData:extractHPCData(finalData.Performance),
	data4:finalData.qualityLatestValues,

})
}catch(e){
	console.log(e)
  res.json({
    error:e,
    message:"Failed to fetch line dashboard data"
  })
}

})

module.exports = influxRouter;

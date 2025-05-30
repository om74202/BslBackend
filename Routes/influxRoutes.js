const express = require('express');
const { influxDB } = require('../db/influxDB/influx');
const { QueryApi } = require('@influxdata/influxdb-client');
const {format,parseISO} = require('date-fns')
const influxRouter = express.Router();
const queryApi = influxDB.getQueryApi("opsight_ai");



influxRouter.get('/torqueGun/data', async (req, res) => {
  try {
    const bucket = 'SHIFT_A';
	  const measurement="TORQUE";
    const line=req.params;
    const torqueGuns = ['torque_gun_1', 'torque_gun_2', 'torque_gun_3'];
    const stations = [
      'Station 10A', 'Station 10B', 'Station 10L1', 'Station 10R1_GUN1','Station 10R1_GUN2','Station 10R1_GUN3',
      'Station 40A', 'Station ST30', 'Station ST40_Torque_GUN1','Station ST40_Torque_GUN2' ,'Station 40E', 'Station ST40B'
    ];
    const fields = [
      'angle', 'torque_value'
    ];

    const fields2 = [
      'angle_count', 'fail_count', 'max_limit','angle_pass_count','angle_pass_percentage',
      'pass_percentage',
      'min_limit', 'pass_count', 'torque_count', 'connection_status','status','angle_fail_count'
    ];
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
const startTime = `${today}T00:30:00Z`;
const stopTime = `${today}T09:00:00Z`;
//console.time("queryTime")

    // Build optimized Flux query
    const fluxQuery = `
      from(bucket: "${bucket}")
        |> range(start: -6h)
        |> filter(fn: (r) => r._measurement == "${measurement}")
        |> filter(fn: (r) => ${stations.map(s => `r.station == "${s}"`).join(' or ')})
        |> filter(fn: (r) => ${torqueGuns.map(g => `r.torque_gun == "${g}"`).join(' or ')})
        |> filter(fn: (r) => ${fields.map(f => `r._field == "${f}"`).join(' or ')})
       |> aggregateWindow(every: 5s, fn: last, createEmpty: false)
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

//    console.timeEnd("queryTime")

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

const fluxQuery2 = `
  from(bucket: "${bucket}")
    |> range(start: -6h)
    |> filter(fn: (r) => r._measurement == "${measurement}")
    |> filter(fn: (r) => ${stations.map(s => `r.station == "${s}"`).join(' or ')})
    |> filter(fn: (r) => ${torqueGuns.map(g => `r.torque_gun == "${g}"`).join(' or ')})
    |> filter(fn: (r) => ${fields2.map(f => `r._field == "${f}"`).join(' or ')})
    |> last()
    |> pivot(rowKey:["_time"], columnKey:["_field"], valueColumn:"_value")
    |> sort(columns: ["_time"], desc: true)
`;

const results2 = [];
//let alerts=0;

await new Promise((resolve, reject) => {
  queryApi.queryRows(fluxQuery2, {
    next(row, tableMeta) {
      try {
        const obj = tableMeta.toObject(row);
        results2.push(obj);
      } catch (parseError) {
        console.warn('Row parsing error:', parseError);
      }
    },
    error(error) {
      console.error('Query execution error:', error);
      reject(error);
    },
    complete() {
      console.log('Query completed');
      resolve();
    }
  });
});

// Convert results into an array of field name and their value
// Assuming you want this for just the first result row:




const groupedData = {};
let alerts = 0;

results2.forEach(entry => {
  const { station, torque_gun, ...fields } = entry;

  if (!groupedData[station]) {
    groupedData[station] = {};
  }

  if (!groupedData[station][torque_gun]) {
    groupedData[station][torque_gun] = [];
  }

  groupedData[station][torque_gun].push(fields);

  if (fields.status !== "pass") {
    alerts++;
  }
});



let connectedCount = 0;
let unconnectedCount=0;
const connectedStations = new Set(); // Tracks unique connected stations
const unconnectedStations=new Set();
results2.forEach(obj => {
  if (obj.connection_status === "connected" &&
      !connectedStations.has(obj.station)) {
    connectedStations.add(obj.station);
    connectedCount++;
  }else if(obj.connection_status!=="connected" &&  !unconnectedStations.has(obj.station)){
     unconnectedCount++;
    unconnectedStations.add(obj.station);
}
});

console.timeEnd("dataSorting")
    res.json({
      success: true,
	    alerts:alerts,
connectedCount,
unconnectedCount,
      data: Object.values(transformed),
      latestData:groupedData,
	    rawData:results2,
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


influxRouter.get('/drive-status/data', async (req, res) => {
  try {
    const bucket = 'SHIFT_A';
	  const measurement='DRIVE_DATA_LOGGING'
	  let drives=[];
    drives = Array.from({ length: 22 }, (_, i) => `Drive_${i + 1}`);
	  drives.push('ALL');
    const fields = [
      'amp'
    ];
    
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const startTime = `${today}T00:30:00Z`;
    const stopTime = `${today}T09:00:00Z`;
    
    console.time("queryTime1");

    // Build optimized Flux query
    const fluxQuery = `
      from(bucket: "${bucket}")
        |> range(start: -8h)
        |> filter(fn: (r) => r._measurement == "${measurement}")
        |> filter(fn: (r) => ${drives.map(d => `r.drive == "${d}"`).join(' or ')})
        |> filter(fn: (r) => ${fields.map(f => `r._field == "${f}"`).join(' or ')})
        |> aggregateWindow(every: 5s, fn: last, createEmpty: false)
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

    console.time("dataSorting");
    const transformed = results.reduce((acc, row) => {
      const key = `${row.drive}`;

      if (!acc[key]) {
const driveName = row.drive.replace('_', ' ');
        acc[key] = {
          drive: driveName,
          data: {
            time: [],
            ...fields.reduce((obj, field) => {
              obj[field] = [];
              return obj;
            }, {})
          }
        };
      }

      // Format time as HH:mm
      const formattedTime = new Date(row._time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      // Push data for each field
      fields.forEach(field => {
        acc[key].data[field].push({
          time: formattedTime,
          value: row[field]
        });
      });

      return acc;
    }, {});

    console.timeEnd("dataSorting");

   const fields2 = [
      'amp_fail_count', 'amp_pass_count', 'amp_status', 'freq',
      'running_count','amp', 'status', 'stopped_count', 'volt'
    ];


    // Optimized Flux query to get ONLY the latest values per drive

console.time("querytime2")

    // Optimized Flux query to get ONLY the latest values per drive
	  const driveFilter = drives.map(d => `r.drive == "${d}"`).join(" or ");
	  const fluxQuery2 = `
  from(bucket: "${bucket}")
    |> range(start: -8h)
    |> filter(fn: (r) => r._measurement == "${measurement}")
    |> filter(fn: (r) => ${driveFilter})
    |> filter(fn: (r) =>
      r["_field"] == "amp_status" or
      r["_field"] == "amp_pass_count" or
      r["_field"] == "amp_fail_count" or
      r["_field"] == "freq" or
      r["_field"] == "running_count" or
      r["_field"] == "status" or
      r["_field"] == "stopped_count" or
      r["_field"] == "volt"
    )
    |> last()
    |> pivot(rowKey: ["_time"], columnKey: ["_field"], valueColumn: "_value")
    |> sort(columns: ["_time"], desc: true)
`;
	  const fluxQuery3 = `
  from(bucket: "${bucket}")
    |> range(start: -8h)
    |> filter(fn: (r) => r._measurement == "${measurement}")
    |> filter(fn: (r) => ${driveFilter})
    |> filter(fn: (r) =>
      r["_field"] == "volt" or
      r["_field"] == "freq" or 
      r["_field"] == "amp"
    )
    |> filter(fn: (r) => r._value != 0) // ensure non-zero values only
    |> group(columns: ["_field", "drive"]) // group before last()
    |> last()
    |> pivot(rowKey: ["_time"], columnKey: ["_field"], valueColumn: "_value")
    |> sort(columns: ["_time"], desc: true)
`;
     const results2 = [];
	  const results3=[];

    await new Promise((resolve, reject) => {
      queryApi.queryRows(fluxQuery2, {
        next(row, tableMeta) {
          try {
            const obj = tableMeta.toObject(row);
            // Structure: { drive: "Drive_1", amp_fail_count: 0, status: "running", ... }
            results2.push(obj);
          } catch (parseError) {
            console.warn('Row parsing error:', parseError);
          }
        },
        error(error) {
          console.error('Query error:', error);
          reject(error);
        },
        complete() {
          console.log(`Fetched ${results.length} drive records in ${Date.now() - queryStartTime}ms`);
          resolve();
        }
      });
    });

	  await new Promise((resolve, reject) => {
      queryApi.queryRows(fluxQuery3, {
        next(row, tableMeta) {
          try {
            const obj = tableMeta.toObject(row);
            // Structure: { drive: "Drive_1", amp_fail_count: 0, status: "running", ... }
            results3.push(obj);
          } catch (parseError) {
            console.warn('Row parsing error:', parseError);
          }
        },
        error(error) {
          console.error('Query error:', error);
          reject(error);
        },
        complete() {
          console.log(`Fetched ${results.length} drive records in ${Date.now() - queryStartTime}ms`);
          resolve();
        }
      });
    });

console.timeEnd("querytime2")
    const driveData = {};
	  const driveData2={};
    results2.forEach(record => {
      const driveName = record.drive.replace('_', ' ');;
      if (!driveData[driveName]) {
        driveData[driveName] = { ...record, _time: record._time };
      }
    });
	  results3.forEach(record => {
      const driveName = record.drive.replace('_', ' ');;
      if (!driveData2[driveName]) {
        driveData2[driveName] = { ...record, _time: record._time };
      }
    });


    res.json({
      success: true,
      data: Object.values(transformed),
     latestData:driveData,
	    latestData2:driveData2,
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

const fFields=[...frw,...frj,...ffield,'frw14_00','frw14_30','frj14_00','frj14_30'];
const rFields=[...rrw,...rrj,...rfield,'rrw14_00','rrw14_30','rrj14_00','rrj14_30'];
const cFields=[...crw,...crj,...cfield,'crw14_00','crw14_30','crj14_00','crj14_30'];
influxRouter.get('/Quality/data/:line',async(req,res)=>{
const {line}=req.params;
  const bucket = 'SHIFT_A'
  const measurement='QUALITY1'
    const fields = [
      'data','rework','reject'
    ];
	let queryField=[]
	if(line==="f"){
	queryField=ffield;
	}else if(line==="rb"){
	queryField=rfield
	}else if(line==="rc"){
	queryField=cfield
	}
	
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
const startTime = `${today}T00:30:00Z`;
const stopTime = `${today}T09:00:00Z`;
console.time("queryTime1")

    // Build optimized Flux query
	const fluxStringArray = `[${queryField.map(f => `"${f}"`).join(", ")}]`;
const fluxQuery = `
from(bucket: "${bucket}")
  |> range(start: -8h)
  |> filter(fn: (r) => r["_measurement"] == "${measurement}")
  |> filter(fn: (r) => r["Defects"] == "data")
  |> filter(fn: (r) => ${queryField.map(d => `r._field== "${d}"`).join(' or ')})
  |> group(columns: ["_field", "Defects"])
  |> last()
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
const groupedResults = results.reduce((acc, item) => {
  const defectType = item.Defects;
  if (!acc[defectType]) {
    acc[defectType] = {};
  }

  acc[defectType][item._field] = {
    time: item._time,
    value: item._value
  };

  return acc;
}, {});


	const freasons= [
  "FLR-1", "FLR-2", "FLR-3", "FLR-4", "FLR-5", "FLR-6", "FLR-7", "FLR-8", "FLR-9", "FLR-10",
  "FLR-11", "FLR-12", "FLR-13", "FLR-14", "FLR-15", "FLR-16", "FLR-17", "FLR-18", "FLR-19", "FLR-20",
  "FLR-21", "FLR-22", "FLR-23", "FLR-24", "FLR-25", "FLR-26", "FLR-27", "FLR-28", "FLR-29", "FLR-30",
  "FLR-31", "FLR-32", "FLR-33", "FLR-34", "FLR-35", "FLR-36", "FLR-37", "FLR-38", "FLR-39", "FLR-40",
  "FLR-41", "FLR-42", "FLR-43", "FLR-44", "FLR-45", "FLR-46", "FLR-47", "FLR-48", "FLR-49", "FLR-50",
  "FLR-51", "FLR-52", "FLR-53", "FLR-54", "FLR-55", "FLR-56", "FLR-57", "FLR-58", "FLR-59", "FLR-60",
  "FLR-61", "FLR-62", "FLR-63", "FLR-64", "FLR-65", "FLR-66", "FLR-67", "FLR-68", "FLR-69", "FLR-70",
  "First_Time_Pass_Rate"
];

const rreasons=["RLR-1", "RLR-2", "RLR-3", "RLR-4", "RLR-5", "RLR-6", "RLR-7", "RLR-8", "RLR-9", "RLR-10",
  "RLR-11", "RLR-12", "RLR-13", "RLR-14", "RLR-15", "RLR-16", "RLR-17", "RLR-18",'First_Time_Pass_Rate_bag'
]
const creasons=["CLR-1", "CLR-2", "CLR-3", "CLR-4", "CLR-5", "CLR-6", "CLR-7", "CLR-8", "CLR-9", "CLR-10",
  "CLR-11", "CLR-12", "CLR-13", "CLR-14","First_Time_Pass_Rate_cushion"]
let queryReasons=[]
 
        if(line==="f"){
        queryReasons=freasons;
        }else if(line==="rb"){
        queryReasons=rreasons
        }else if(line==="rc"){
        queryReasons=creasons
        }




	const fields2=['dismental','rework','data']
console.time("queryTime2")

const fluxQuery2 = `from(bucket: "${bucket}")
  |> range(start: -8h)
  |> filter(fn: (r) => r["_measurement"] == "${measurement}")
  |> filter(fn: (r) => ${fields2.map(d => `r.Defects == "${d}"`).join(' or ')})
  |> filter(fn: (r) => ${queryReasons.map(d => `r._field == "${d}"`).join(' or ')})
   |> group(columns: ["Defects"])
   |> aggregateWindow(every: 5s, fn: last, createEmpty: false)
  |> pivot(rowKey:["_time"], columnKey:["_field"], valueColumn:"_value")
  |> sort(columns: ["_time"], desc: true)
`;
const results2=[]
	    await new Promise((resolve, reject) => {
      queryApi.queryRows(fluxQuery2, {
        next(row, tableMeta) {
          try {
            results2.push(tableMeta.toObject(row));
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

console.timeEnd("queryTime2")
const grouped = { dismental: [], rework: [], data: [] };
console.time("processing2")
results2.reduce((acc, item) => {
  const { _time, Defects, ...rest } = item;
  const code = Object.keys(rest).find(key => key.startsWith("FLR-") || key.startsWith("RLR-") || key.startsWith("CLR-") || key.startsWith("First_Time_Pass_Rate"))

  if (Defects === "dismental" || Defects === "rework" || Defects === "data") {
    acc[Defects].push({
      time: humanReadableTime(_time),
      code: code,
      value: rest[code].toFixed(2)
    });
  }

  return acc;
}, grouped);



console.timeEnd("processing2");


  res.json({
    success:true,
    data:groupedResults,
	  rawData:results2,
	  YieldRateData:grouped.data,
	  reworkReasons:grouped.rework,
	  rejectReasons:grouped.dismental,
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



const TorqueTableFieldsF = [
  "Id", "FBSeq_Offline", "FCSeq_Offline", "SequenceNo", "FB_TrimData_Online",
  "FC_TrimData_Online", "Varient", "HeadRest", "Handside", "StationNo",
  "SabResistance", "Resistance_ohm", "Resistance_Mohm", "Gressing_Status",
  "ConnecterStatus", "SabStatus", "PSN", "PSN_Time", "Shift", "BillTktDateTime",
  "BuckleData", "BuckleResult", "BuckleTorque", "FrameAssyTorqueM10_1",
  "FrameAssyTorqueM10_2", "FrameAssyTorqueM6", "Load@35kg", "Load@6kg",
  "Result@35kg", "Result@6kg", "ReclinerResult", "Dispatch", "M_OK_NG",
  "MfgDateTime", "FinalBarcodeData"
];

const TorqueTableFieldsR = ["BuiltTkt40Date","BuiltTkt60Date","C_INNNER_PLASTIC_PART","Dispatch","ELR","ELR_Torque_Angle","Final_Status40","Final_Status60","Frame40","Frame60","Greesing_Status","HR_LOAD_LH1","HR_LOAD_RH1","HeadRest_LH","HeadRest_RH","M_ADD_PSN","M_COLOR_CODE","M_ID","M_MODEL","M_MODEL_DESC","M_MSGN_CMNTS1","M_MSGN_CMNTS2","M_MSGN_CMNTS3","M_MSGN_CMNTS4","M_OK_NG","M_PSN","M_TERM_ID","M_VAL1","M_VAL2","M_VAL3","M_VAL4","M_VIN_NO","Mfg_Date40","Mfg_Date60","Mfg_FinalBarcode40","Mfg_FinalBarcode60","Model","PLASTIC_PART","PSN","PSN_Time","Reject","RejectAt","Rework40","Rework60","SequenceNo","Shift","Sn","Station","Status_40","Status_60","Torque1Angle1","Torque2Angle2","Torque3Angle3","Torque4Angle4","Trim40RB","Trim40RC","Trim60RB","Trim60RC","Verient","read_time"];


influxRouter.get('/lineDashboard/data/:line',async(req,res)=>{
  const bucket = 'SHIFT_A'
  const measurement='QUALITY1'
	const {line} = req.params;
	let fieldsFinal=fpsFields;
	if(!line){
		fieldsFinal=fpsFields
	}else if(line==="RB"){
		fieldsFinal=RBFields
	}else if(line==="RC"){
		fieldsFinal=RCFields
	}
  
  // Usage in your Flux query:
  // const fields = tags
  //   .map(field => `r._field == "${field}"`)
  //   .join(" or ");
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
const startTime = `${today}T00:30:00Z`;
const stopTime = `${today}T09:00:00Z`;
console.time("queryTime1")
const fluxQuery = `
from(bucket: "${bucket}")
  |> range(start: -8h)
  |> filter(fn: (r) => r["_measurement"] == "${measurement}")
  |> filter(fn: (r) => ${fieldsFinal.map(d => `r._field== "${d}"`).join(' or ')})
  |> last()
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


     const fluxQuery2 = `
      from(bucket: "${bucket}")
        |> range(start: -8h)
        |> filter(fn: (r) => r._measurement == "${measurement}")
        |> filter(fn: (r) => r["Defects"] == "data")
       |> filter(fn: (r) => r["_field"] == "quality" or r["_field"] == "availability" or r["_field"] == "productivity" or r["_field"] == "oee")
       |> aggregateWindow(every: 5s, fn: last, createEmpty: false)
        |> pivot(rowKey:["_time"], columnKey:["_field"], valueColumn:"_value")
        |> sort(columns: ["_time"], desc: true)
    `;
	    const fluxQuery3 = `
      from(bucket: "${bucket}")
        |> range(start: -8h)
        |> filter(fn: (r) => r._measurement == "RUNNING_STATE")
	 |> filter(fn: (r) => r["_measurement"] == "RUNNING_STATE")
         |> filter(fn: (r) => r["_field"] == "state")

       |> aggregateWindow(every: 5s, fn: last, createEmpty: false)
        |> pivot(rowKey:["_time"], columnKey:["_field"], valueColumn:"_value")
        |> sort(columns: ["_time"], desc: true)
    `;


    const results2=[]

    await new Promise((resolve, reject) => {
      queryApi.queryRows(fluxQuery2, {
        next(row, tableMeta) {
          try {
            results2.push(tableMeta.toObject(row));
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

    console.timeEnd("queryTime");
const reduced = {
  oee: [],
  productivity: [],
  quality: [],
  availability: []
};


results2.forEach(item => {
  const time = humanReadableTime(item._time);
  reduced.oee.push({ time, value: item.oee });
  reduced.productivity.push({ time, value: item.productivity });
  reduced.quality.push({ time, value: item.quality });
  reduced.availability.push({ time, value: item.availability });
});


const results3=[]

    await new Promise((resolve, reject) => {
      queryApi.queryRows(fluxQuery3, {
        next(row, tableMeta) {
          try {
            results3.push(tableMeta.toObject(row));
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


const states=[];

results3.forEach(item=>{
	states.push({time:humanReadableTime(item._time),value:item.state});
})



   const fluxQuery4 = `
from(bucket: "SHIFT_C")
  |> range(start: -8h)
  |> filter(fn: (r) => r["_measurement"] == "${measurement}")
  |> filter(fn: (r) => ${preShift.map(d => `r._field== "${d}"`).join(' or ')})
  |> last()
`;



const resultsPre = [];
//    const queryStartTime = Date.now();

    await new Promise((resolve, reject) => {
      queryApi.queryRows(fluxQuery4, {
        next(row, tableMeta) {
          try {
            resultsPre.push(tableMeta.toObject(row));
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




res.json({
  success:true,
  data:resultsFinal,
  data2:reduced,
	data3:states,
	preShiftData:resultsPre
})
}catch(e){
  res.json({
    error:e,
    message:"Failed to fetch line dashboard data"
  })
}

})



module.exports = influxRouter;

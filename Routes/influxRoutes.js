const express = require('express');
const { influxDB } = require('../db/influxDB/influx');
const { QueryApi } = require('@influxdata/influxdb-client');
const {format,parseISO} = require('date-fns')
const influxRouter = express.Router();
const queryApi = influxDB.getQueryApi("opsight_ai");



influxRouter.get('/torqueGun/data/:shift', async (req, res) => {
  try {
    const {shift}=req.params
    const bucket=`SHIFT_${shift}`
	  const measurement="TORQUE";
    const torqueGuns = ['torque_gun_1', 'torque_gun_2', 'torque_gun_3'];
    const stations = [
      'Station 10A', 'Station 10B', 'Station 10L1','Station 10R1',
      'Station 40A', 'Station ST30', 'Station ST40' ,'Station 40E', 'Station ST40B'
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


    const groupedData = results.reduce((acc, current) => {
      const station = current.station;
      const torqueGun = current.torque_gun || current.torque_gun; // handles potential typo
      const time = current._time;
      const torqueValue = current.torque_value;
      const angle = current.angle;
  
      if (!acc[station]) {
          acc[station] = {};
      }
      
      if (!acc[station][torqueGun]) {
          acc[station][torqueGun] = {
              torqueData: [],
              angleData: []
          };
      }
      
      // Add torque data point
      acc[station][torqueGun].torqueData.push({
          time: time,
          value: torqueValue
      });
      
      // Add angle data point
      acc[station][torqueGun].angleData.push({
          time: time,
          value: angle
      });
      
      return acc;
  }, {});

  Object.keys(groupedData).forEach(station => {
    Object.keys(groupedData[station]).forEach(torqueGun => {
        groupedData[station][torqueGun].torqueData.sort((a, b) => 
            new Date(a.time) - new Date(b.time)
        );
        groupedData[station][torqueGun].angleData.sort((a, b) => 
            new Date(a.time) - new Date(b.time)
        );
    });
});

//    console.timeEnd("queryTime")

console.time("dataSorting")




// Convert results into an array of field name and their value
// Assuming you want this for just the first result row:





console.timeEnd("dataSorting")
    res.json({
      success: true,
	    data:groupedData,
      latestData:results[0],
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


influxRouter.get('/drive/data/:shift', async (req, res) => {
  try {
    const {shift}=req.params
    const bucket = `SHIFT_${shift}`;
	  const measurement='DRIVE'
	  let drives=[];
    drives = Array.from({ length: 22 }, (_, i) => `Drive_${i + 1}`);
	  drives.push('ALL');
   
    
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

    const processDriveData = (driveArray) => {
      const result = driveArray.reduce((acc, current) => {
          const originalTime = current._time;
          const displayTime = format(new Date(current._time), 'HH:mm');
          const drive = current.drive;
          const status = current.status;
  
          if (!acc[drive]) {
              if (drive === "ALL") {
                  acc[drive] = {
                      latestRunningCount: current.running_count,  // Capture immediately
                      latestStoppedCount: current.stopped_count, // Capture immediately
                      latestStatus: status,                      // Capture immediately
                      latestUpdateTime: displayTime             // Capture immediately
                  };
              } else {
                  acc[drive] = {
                      ampData: [],
                      voltData: [],
                      freqData: [],
                      lastNonZero: { amp: null, volt: null, freq: null },
                      latestStatus: null,
                      latestStatusTime: null,
                      latestStatusOriginalTime: null
                  };
              }
          }
  
          if (drive === "ALL") {
              // Since array is in descending order, first occurrence is latest
              // We already captured it in the initialization, no need to update
          } else {
              // For regular drives...
              acc[drive].ampData.push({ 
                  displayTime, 
                  originalTime,
                  value: current.amp 
              });
  
              if (current.amp !== 0) acc[drive].lastNonZero.amp = current.amp;
              if (current.volt !== 0) acc[drive].lastNonZero.volt = current.volt;
              if (current.freq !== 0) acc[drive].lastNonZero.freq = current.freq;
  
              if (!acc[drive].latestStatus) {
                  acc[drive].latestStatus = status;
                  acc[drive].latestStatusTime = displayTime;
                  acc[drive].latestStatusOriginalTime = originalTime;
              }
          }
  
          return acc;
      }, {});
  
      // Sort all data by original time (ascending) - only for non-"ALL" drives
      Object.keys(result).forEach(drive => {
          if (drive !== "ALL" && result[drive].ampData) {
              result[drive].ampData.sort((a, b) => 
                  new Date(a.originalTime) - new Date(b.originalTime)
              );
          }
      });
  
      return result;
  };





    res.json({
      success: true,
      data: processDriveData(results),
      
     
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



influxRouter.get('/Quality/data/:line/:shift',async(req,res)=>{
const {line,shift}=req.params;
const bucket=`SHIFT_${shift}`

const reasons=reasonsMap[line]
const measurement=`QUALITY`


	
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
const startTime = `${today}T00:30:00Z`;
const stopTime = `${today}T09:00:00Z`;
console.time("queryTime1")

    // Build optimized Flux query
	// const fluxStringArray = `[${queryField.map(f => `"${f}"`).join(", ")}]`;
  const fluxQuery = `
  from(bucket: "${bucket}")
    |> range(start: -8h)
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

const processQualityData = (dataArray) => {
  const result = {
      firstTimePassRate: [],
      rjData: {},
      rwData: {},
  };

  dataArray.forEach(item => {
      const time = item._time;
      const displayTime = format(new Date(time), 'HH:mm'); // Using date-fns format
      
      // Process First_Time_Pass_Rate
      result.firstTimePassRate.push({
          time: displayTime,
          value: item.First_Time_Pass_Rate,
          originalTime: time
      });

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
        time: item._time,
        displayTime: new Date(item._time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
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
    latestData:results[results.length-1],
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
  Front_Line:[ "Id", "FBSeq_Offline", "FCSeq_Offline", "SequenceNo", "FB_TrimData_Online",
    "FC_TrimData_Online", "Varient", "HeadRest", "Handside", "StationNo",
    "SabResistance", "Resistance_ohm", "Resistance_Mohm", "Gressing_Status",
    "ConnecterStatus", "SabStatus", "PSN", "PSN_Time", "Shift", "BillTktDateTime",
    "BuckleData", "BuckleResult", "BuckleTorque", "FrameAssyTorqueM10_1",
    "FrameAssyTorqueM10_2", "FrameAssyTorqueM6", "Load@35kg", "Load@6kg",
    "Result@35kg", "Result@6kg", "ReclinerResult", "Dispatch", "M_OK_NG",
    "MfgDateTime", "FinalBarcodeData"],

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

influxRouter.get('/line/data/:line/:shift',async(req,res)=>{
  const {line,shift}=req.params
  const bucket = `SHIFT_${shift}`
  const measurement='Performance'


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
const stopTime = `${today}T08:30:00Z`;
console.time("queryTime1")
const fluxQuery = `
from(bucket: "${bucket}")
  |> range(start: ${startTime} , stop:${stopTime} )
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
       return format(date, "hh:mm:ss a");
     }
	    const resultsFinal=results.reduce((acc, item) => {
  acc[item._field] = item._value;
  return acc;
}, {});


 
const reduced = {
  oee: [],
  productivity: [],
  quality: [],
  availability: [],
  runMode:[],
};


results.forEach(item => {
  const time = humanReadableTime(item._time);
  reduced.oee.push({ time, value: item.oee });
  reduced.productivity.push({ time, value: item.productivity });
  reduced.quality.push({ time, value: item.quality });
  reduced.availability.push({ time, value: item.availability });
  reduced.runMode.push({time , value:item.run_mode})
});




const timeSeriesData = {};

// Initialize empty arrays
torqueFields[line].forEach(field => {
  timeSeriesData[field] = [];
});

// Fill the arrays with {time, value}
results.forEach(row => {
  const time = row._time;
  torqueFields[line].forEach(field => {
    if (field in row) {
      timeSeriesData[field].push({
        time,
        value: row[field]
      });
    }
  });
});






res.json({
  success:true,
  data:results[results.length-1],
  data2:reduced,
  torqueTableData:timeSeriesData
	
})
}catch(e){
  res.json({
    error:e,
    message:"Failed to fetch line dashboard data"
  })
}

})



module.exports = influxRouter;

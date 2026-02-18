// const express = require('express');
// const { influxDB } = require('../db/influxDB/influx');
// const { QueryApi } = require('@influxdata/influxdb-client');
// const { SendMailToUserAlert , SendMailNUCAlert,SendMailNUCRestored,SendEmailDispatchDelay} = require('../functions/userFunctions');
// const { createDowntime2 } = require('../Controllers/downtime');
// const { saveLatestDowntime, getLatestDowntimeForLineName} = require('../Controllers/plannedShutdown');
// const {format,parseISO} = require('date-fns')
// const influxRouter = express.Router();
// const { getDowntimeReportByLineDateShiftCumulative, getSingleTorqueGun, getAllTorqueGuns, getSingleDrive, getQualityData, getLineData, getPlantData, getCeoQualityData, getCeoTorqueData, getRunningSeatData, getCeoSeatProductionData, getCeoData, getPlantReportDate, getPlantReportDateRange } = require('../Controllers/influxControllers.js');
// const { getAllDrives } = require('../Controllers/drive.js');
// const queryApi = influxDB.getQueryApi("BSL Kharkhoda");

// function getLatestValidTorque(dataArray) {
//   // Loop from the end of the array (most recent first)
//   for (let i = dataArray.length - 1; i >= 0; i--) {
//     const obj = dataArray[i];

//     // Check only the required fields
//     if (obj.min_limit !== null &&
//         obj.fail_count !== null &&
//         obj.fail_percentage !== null) {
//       return obj; // Return first matching object
//     }
//   }
//   return null; // If no valid object found
// }


// function getShiftTiming(shift, selectedDate = null) {
//   // Convert to IST once
//   const toIST = (date) => {
//     const istStr = date.toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
//     const istDate = new Date(istStr);
//     if (isNaN(istDate.getTime())) {
//       throw new Error("Invalid date passed for IST conversion");
//     }
//     return istDate;
//   };

//   const baseDateIST = selectedDate ? toIST(new Date(selectedDate)) : toIST(new Date());

//   const year = baseDateIST.getFullYear();
//   const month = baseDateIST.getMonth();
//   const day = baseDateIST.getDate();

//   // Build date in IST, return its UTC ISO
//   const getTime = (hour, minute = 0, dayOffset = 0) => {
//     const istDate = new Date(year, month, day + dayOffset, hour, minute);
//     return istDate.toISOString(); // Let JS auto-convert to UTC
//   };

//   const shiftTimes = {
//     A: {
//       start: getTime(6, 0),        // 6:00 AM IST
//       end: getTime(14, 30)         // 2:30 PM IST
//     },
//     B: {
//       start: getTime(14, 30),      // 2:30 PM IST
//       end: getTime(23, 0)          // 11:00 PM IST
//     },
//     C: {
//       start: getTime(23, 0),       // 11:00 PM IST
//       end: getTime(6, 0, 1)        // next day 6:00 AM IST
//     },
// 	r:{
// 		start:getTime(6,0),
// 		end:getTime(6,0,1)
// 	}	  
//   };
// console.log(shift,selectedDate)
//   const result = shiftTimes[shift];
//   if (!result) throw new Error("Invalid shift. Must be 'A', 'B', or 'C'");
// 	console.log(result)
//   return {
//     startTime: result.start,
//     endTime: result.end
//   };
// }


// influxRouter.get('/SingleTorqueGun/data/:shift/:date/:torquegunName/:station', getSingleTorqueGun);


// influxRouter.get('/torqueGun/data/:shift/:date', getAllTorqueGuns);




// // GET /drive/data/:drive/:shift/:date
// influxRouter.get('/SingleDrive/data/:drive/:shift/:date',getSingleDrive );

// influxRouter.get('/drive/data/:shift/:date', getAllDrives);




// const reasonsMap = {
//   Front_Line: [
//     "FLR-1", "FLR-2", "FLR-3", "FLR-4", "FLR-5", "FLR-6", "FLR-7", "FLR-8", "FLR-9", "FLR-10",
//     "FLR-11", "FLR-12", "FLR-13", "FLR-14", "FLR-15", "FLR-16", "FLR-17", "FLR-18", "FLR-19", "FLR-20",
//     "FLR-21", "FLR-22", "FLR-23", "FLR-24", "FLR-25", "FLR-26", "FLR-27", "FLR-28", "FLR-29", "FLR-30",
//     "FLR-31", "FLR-32", "FLR-33", "FLR-34", "FLR-35", "FLR-36", "FLR-37", "FLR-38", "FLR-39", "FLR-40",
//     "FLR-41", "FLR-42", "FLR-43", "FLR-44", "FLR-45", "FLR-46", "FLR-47", "FLR-48", "FLR-49", "FLR-50",
//     "FLR-51", "FLR-52", "FLR-53", "FLR-54", "FLR-55", "FLR-56", "FLR-57", "FLR-58", "FLR-59", "FLR-60",
//     "FLR-61", "FLR-62", "FLR-63", "FLR-64", "FLR-65", "FLR-66", "FLR-67", "FLR-68", "FLR-69", "FLR-70",
//     "First_Time_Pass_Rate"
//   ],
//   RB: [
//     "RLR-1", "RLR-2", "RLR-3", "RLR-4", "RLR-5", "RLR-6", "RLR-7", "RLR-8", "RLR-9", "RLR-10",
//     "RLR-11", "RLR-12", "RLR-13", "RLR-14", "RLR-15", "RLR-16", "RLR-17", "RLR-18", "First_Time_Pass_Rate_bag"
//   ],
//   RC: [
//     "CLR-1", "CLR-2", "CLR-3", "CLR-4", "CLR-5", "CLR-6", "CLR-7", "CLR-8", "CLR-9", "CLR-10",
//     "CLR-11", "CLR-12", "CLR-13", "CLR-14", "First_Time_Pass_Rate_cushion"
//   ]
// };



// influxRouter.get('/Quality/data/:line/:shift/:date',getQualityData)








// const torqueFields={
//   Front_Line:[ "Id","SequenceNo",
//     "Varient","Handside", 
    
//     "PSN", "PSN_Time", "BillTktDateTime",
//     "BuckleTorque", "FrameAssyTorqueM10_1",
//     "FrameAssyTorqueM10_2", "FrameAssyTorqueM6", "Load@35kg", "Load@6kg",
    
//     "MfgDateTime" ],

//     RB:[
//     "Sn",
//     "SequenceNo",
//     "Station",
//     "PSN",
//     "PSN_Time",
//     "Status_60",
//     "Status_40",
//     "BuiltTkt60Date",
//     "BuiltTkt40Date",
//     "Mfg_Date60",
//     "Mfg_Date40",
//     "Mfg_FinalBarcode60",
//     "Mfg_FinalBarcode40",
//     "ELR_Torque_Angle",
//     "Frame60",
//     "Frame40",
//     "Torque1Angle1",
//     "Torque2Angle2",
//     "Torque3Angle3",
//     "Torque4Angle4",
//     "Trim60RB",
//     "Trim40RB",
//     "Final_Status60",
//     "Final_Status40"
// ]

// ,RC:[
//     "Sn",
//     "SequenceNo",
//     "Station",
//     "PSN",
//     "PSN_Time",
//     "Status_60",
//     "Status_40",
//     "BuiltTkt60Date",
//     "BuiltTkt40Date",
//     "Mfg_Date60",
//     "Mfg_Date40",
//     "Mfg_FinalBarcode60",
//     "Mfg_FinalBarcode40",
//     "ELR_Torque_Angle",
//     "Frame60",
//     "Frame40",
//     "Torque1Angle1",
//     "Torque2Angle2",
//     "Torque3Angle3",
//     "Torque4Angle4",
//     "Trim60RB",
//     "Trim40RB",
//     "Final_Status60",
//     "Final_Status40"
// ]
// }

// function getLastValidItem(results) {
//   for (let i = results.length - 1; i >= 0; i--) {
//     const item = results[i];
//     const hasValidData =
//       item.Avg_Cycle_Time !== null && item.Avg_Cycle_Time !== undefined &&
//       item.pph !== null && item.pph !== undefined &&
//       item.Total_Target_Prod !== null && item.Total_Target_Prod !== undefined;

//     if (hasValidData) return item;
//   }
//   return null;
// }

// influxRouter.get('/line/data/:line/:shift/:date',getLineData)



// function extractHPCData(dataObj, bucket) {
//   const expectedLines = ["Front_Line", "RB", "RC"];

//   // We now use total_production_set time series (per line values)
//   const seriesRaw = Array.isArray(dataObj?.total_production_set)
//     ? dataObj.total_production_set
//     : [];

//   if (!seriesRaw.length) return [];

//   const toMin = (hhmm) => {
//     const [h, m] = String(hhmm).split(":").map(Number);
//     return h * 60 + (m || 0);
//   };

//   // Parse points: [{tMin, adjMin, vByLine}]
//   const points = seriesRaw
//     .filter((p) => p && typeof p.time === "string" && p.value && typeof p.value === "object")
//     .map((p) => {
//       const tMin = toMin(p.time);
//       return { tMin, time: p.time, vByLine: p.value };
//     });

//   if (!points.length) return [];

//   // Detect midnight-crossing window (e.g., has 23xx and 00xx)
//   const hasLate = points.some((p) => p.tMin >= 23 * 60);
//   const hasEarly = points.some((p) => p.tMin < 6 * 60);
//   const crossesMidnight = hasLate && hasEarly;

//   const adj = (m) => (crossesMidnight && m < 6 * 60 ? m + 1440 : m);

//   const ptsAsc = points
//     .map((p) => ({ ...p, adjMin: adj(p.tMin) }))
//     .sort((a, b) => a.adjMin - b.adjMin);

//   // Build per-line series with carry-forward (handles missing line values)
//   const lineSeries = {};
//   expectedLines.forEach((ln) => (lineSeries[ln] = []));

//   const last = {};
//   expectedLines.forEach((ln) => (last[ln] = null));

//   for (const p of ptsAsc) {
//     expectedLines.forEach((ln) => {
//       const v = p.vByLine?.[ln];
//       if (v !== undefined && v !== null) last[ln] = Number(v);
//       lineSeries[ln].push({
//         adjMin: p.adjMin,
//         v: Number.isFinite(last[ln]) ? last[ln] : null,
//       });
//     });
//   }
// // After building lineSeries...
// const firstAdjByLine = {};
// expectedLines.forEach((ln) => {
//   const first = (lineSeries[ln] || []).find((p) => p.v != null);
//   firstAdjByLine[ln] = first ? first.adjMin : null;
// });

//   // binary search: last value at/before boundary
//   const valueAtOrBeforeAdj = (arrAsc, boundaryAdjMin) => {
//     if (!arrAsc.length) return null;
//     let lo = 0,
//       hi = arrAsc.length - 1,
//       ans = null;
//     while (lo <= hi) {
//       const mid = (lo + hi) >> 1;
//       if (arrAsc[mid].adjMin <= boundaryAdjMin) {
//         ans = arrAsc[mid].v;
//         lo = mid + 1;
//       } else {
//         hi = mid - 1;
//       }
//     }
//     return ans;
//   };

//   // Build slot starts from available time range
//   const minAdj = ptsAsc[0].adjMin;
//   const maxAdj = ptsAsc[ptsAsc.length - 1].adjMin;

//   const floorToHour = (m) => Math.floor(m / 60) * 60;
//   const ceilToHour = (m) => Math.ceil(m / 60) * 60;

//   const startAdj = floorToHour(minAdj);
//   const endAdj = ceilToHour(maxAdj);

//   // Helper for labels
//   const pad2 = (n) => String(n).padStart(2, "0");
//   const hhmmFromAdj = (a) => {
//     const m = ((a % 1440) + 1440) % 1440;
//     const h = Math.floor(m / 60);
//     const mm = m % 60;
//     return `${pad2(h)}:${pad2(mm)}`;
//   };

//   const makeStdLabel = (startAdjMin) => {
//     const startMin = ((startAdjMin % 1440) + 1440) % 1440;
//     const hour = Math.floor(startMin / 60);
//     const nextHour = hour === 23 ? 24 : (hour + 1) % 24;
//     return `${pad2(hour)}-${pad2(nextHour)}`;
//   };

//   const slots = [];

//   for (let cur = startAdj; cur < endAdj; cur += 60) {
//     const curMod = ((cur % 1440) + 1440) % 1440;

//     // Special split only when bucket !== TODAY
//     if (bucket !== "TODAY" && curMod === 14 * 60) {
//       // 14:00-14:30
//       slots.push({ startAdj: cur, endAdj: cur + 30, label: "14:00-14:30" });
//       // 14:30-15:00
//       slots.push({ startAdj: cur + 30, endAdj: cur + 60, label: "14:30-15:00" });
//       continue;
//     }

//     slots.push({ startAdj: cur, endAdj: cur + 60, label: makeStdLabel(cur) });
//   }

//   // Now compute delta(counter) for each slot per line and return same format
//   const out = slots.map((sl) => {
//     const latestValues = expectedLines.map((line) => {
//       const arr = lineSeries[line] || [];
// let startVal = valueAtOrBeforeAdj(arr, sl.startAdj);

// // end boundary: try exact first, then fallback to just-before (helps missing exact boundary)
// let endVal = valueAtOrBeforeAdj(arr, sl.endAdj);
// if (endVal == null) endVal = valueAtOrBeforeAdj(arr, sl.endAdj - 1);

// // if no end, we still can't compute
// if (endVal == null) return { line, value: 0 };

// // ONLY for the first slot that contains the first real point for this line:
// const firstAdj = firstAdjByLine[line];
// const isFirstSlotForThisLine =
//   firstAdj != null && sl.startAdj <= firstAdj && firstAdj < sl.endAdj;

// if (isFirstSlotForThisLine) {
//   startVal = 0; // baseline only once
// } else if (startVal == null) {
//   return { line, value: 0 }; // keep your strict behavior for all other slots
// }

// let produced = (Number(endVal) || 0) - (Number(startVal) || 0);

// // keep your old rule for later resets
// if (produced < 0) produced = 0;

//       return { line, value: produced };
//     });

//     return { time: sl.label, value: latestValues };
//   });

//   // Keep your exact night-first sorting behavior
//   return out.sort((a, b) => {
//     const aStart = parseInt(a.time.split("-")[0]);
//     const bStart = parseInt(b.time.split("-")[0]);

//     const aIsNight = aStart >= 23 || aStart < 6;
//     const bIsNight = bStart >= 23 || bStart < 6;

//     if (aIsNight && bIsNight) {
//       const aAdj = aStart < 6 ? aStart + 24 : aStart;
//       const bAdj = bStart < 6 ? bStart + 24 : bStart;
//       return aAdj - bAdj;
//     }
//     if (aIsNight) return -1;
//     if (bIsNight) return 1;
//     return aStart - bStart;
//   });
// }

// const plantFields=[
// 	"rework", "Today_Production_plan","Total_Production","Total_Target_Prod","pph", "reject", "First_Time_Pass_Rate","Today_planned_Prod","total_production_set",

//   // New OEE-related fields
//   "OEE", "Productivity", "Quality", "Avail", "pph",
//  "HRP06:00", "HRP07:00",
//   "HRP08:00", "HRP09:00", "HRP10:00", "HRP11:00",
//   "HRP12:00", "HRP13:00", "HRP14:00", "HRP14:30",
//  "HRP15:00", "HRP16:00", "HRP17:00", "HRP18:00",
//   "HRP19:00", "HRP20:00", "HRP21:00", "HRP22:00",
//   "HRP23:00",
//   "HRP00:00", "HRP01:00", "HRP02:00", "HRP03:00",
//   "HRP04:00", "HRP05:00",
//   "HRP23:00"


// ]



// influxRouter.get('/Plant/data/:shift/:date',getPlantData)

// influxRouter.get('/ceo/:date/:line/:field',getCeoData)




// influxRouter.get('/ceo/seatProduction/:shift',getCeoSeatProductionData)



// influxRouter.get('/ceo/runningSeat/:shift',getRunningSeatData)


// influxRouter.get('/ceo/torqueGun/:station/:torqueGun/:date/:shift',getCeoTorqueData)


// influxRouter.get('/ceo/qualityReview/:line/:date/:shift',getCeoQualityData)

// influxRouter.get("/plantReportRange/:shift/:date", getPlantReportDateRange);



// influxRouter.get('/plantReport/:shift/:date',getPlantReportDate)

// let isEmailSent=false;
// // Get today's 6 AM IST in ISO string (UTC format)
// let now = new Date();
// let istOffset = 5.5 * 60 * 60 * 1000; // IST offset in ms (UTC+5:30)

// // Start of today in IST
// let todayIST = new Date(now.getTime() + istOffset);
// todayIST.setHours(6, 0, 0, 0); // Set to 6:00 AM IST

// // Convert back to UTC ISO string
// let lastRealtimeDataTime = new Date(todayIST.getTime() - istOffset).toISOString();

// console.log(lastRealtimeDataTime,"on start of the server setting lastRealtimeDataTime");


//      function sleep(ms) {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }


// function isnotRealtime(utcTimeStr) {
// 	console.log("hii from realtime function")

// 	async function sendMailsSequentially2(emails, floorTime) {
//   for (const email of emails) {
//     try {
//       await SendMailNUCAlert(email, floorTime);
//       console.log(` Power off email Sent to ${email}`);
//       await sleep(2000); // wait 2 seconds before sending next
//     } catch (err) {
//       console.error(`Failed to send to ${email}:`, err.message);
//     }
//   }
// }

//  // const inputTime = new Date(utcTimeStr);
//       const inputTime = new Date(!utcTimeStr?lastRealtimeDataTime:utcTimeStr);

//   const currentTime = new Date();

//   const diffMs = Math.abs(currentTime - inputTime);
//   const diffMinutes = diffMs / 60000;
//   console.log(diffMinutes,currentTime,inputTime,utcTimeStr);

// //  console.log(`⏱️ Difference: ${diffMinutes.toFixed(2)} minutes`);
// 	const floorTime=Math.floor(diffMinutes/5)*5;
//         console.log(`⏱️  Difference: ${floorTime} minutes`);

// 	if(floorTime===5 || (floorTime>=20 && floorTime%20===0)){
// // 	 const emails=[
// // 		 "naresh.yadav@bharatseats.net",
// // 		 "ommishra@opsight.ai",
// // //		 "pulakrijhwani@opsight.ai",
// // 		          "nishant.kundu@bharatseats.net",
// //                     "mohan.mishra@bharatseats.net",
// // 	//	 "arunkumar@opsight.ai",
// //       "mukesh.yadav@bharatseats.net",
// // 		 ]

//      	 const emails=[
// 		 "ommishra@opsight.ai",
// 		 ]
// 		 isEmailSent=true;
//      console.log("Changing the variable to ",isEmailSent)
// 		sendMailsSequentially2(emails,floorTime)
// 	}

	

//   return diffMinutes > 3;
// }


// const isBefore5PM_IST = () => {
//   const now = new Date(); // IST assumed
//   const currentHour = now.getHours();
//   const day = now.getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6

//   // Format current date as YYYY-MM-DD
//   const todayStr = now.toISOString().slice(0, 10);

//   // Block list of holidays (YYYY-MM-DD)
//   const blockDates = [
//     "2025-04-14", // Ambedkar Jayanti
//     "2025-06-07", // Eid Ul Adha
//     "2025-08-09", // Rakshabandhan
//     "2025-08-15", // Independence Day
//     "2025-08-16", // Janmashtami
//     "2025-09-17", // Vishwakarma Day
//     "2025-10-02", // Gandhi Jayanti
//     "2025-10-21", // Diwali
// 	  "2025-10-20", // Diwali
//     "2025-10-22", // Diwali
//     "2025-10-23", // Govardhan Pooja
// 	  "2025-11-05", // random 
//     "2025-01-26", // Republic Day
//     "2025-03-04", // Holi
//     "2025-03-05", // Holi
//     "2024-10-10",
//     "2024-10-20",
//     "2024-06-30",
//     "2024-11-05",
//     "2024-12-27",
//     "2024-07-19",
//     "2024-11-24"
//   ];

//   // Working Sundays that should NOT be blocked
//   const workingSundays = [
//      "2024-10-12",
//   "2024-10-19",
//   "2024-10-26",
//   "2024-11-02",
//   "2025-01-04",
//   "2025-01-25",
//   "2025-03-08"
//   ];

//   const isBlockedDate = blockDates.includes(todayStr);
// 	console.log(todayStr,"today's date")
//   const isLateNightOrEarlyMorning = currentHour >= 23 || currentHour < 6;

//   // Sunday check, but allow working Sundays
//   const isSunday = day === 0;
//   const isBlockedSunday = isSunday && !workingSundays.includes(todayStr);

//   console.log(`🕒 IST Time: ${currentHour}:${now.getMinutes()} (Day: ${day})`);
//   console.log(`📅 Blocked Date: ${isBlockedDate}`);
//   console.log(`📅 Blocked Sunday: ${isBlockedSunday}`);

//   return isLateNightOrEarlyMorning || isBlockedDate || isBlockedSunday;
// };

// async function getDurations(data) {
//   const nameMap = {
//     Front_Line: "Front Line",
//     RB: "Rear Back",
//     RC: "Rear Cushion",
//   };

//   data.sort((a, b) => new Date(a._time) - new Date(b._time));

//   const latestDowntime = {};
//   const latestDuration = {};
//   const state = {};

//   for (const entry of data) {
//     const line = entry.LINE;
//     const time = new Date(entry._time);
//     if (Number.isNaN(time.getTime())) continue;

//     if (!state[line]) {
//       state[line] = {
//         lastTime: time,
//         lastValue: entry.Total_Prod_Today,
//         duration: 0,
//         inDowntime: false,
//         downtimeStartTime: null,
//       };
//       continue;
//     }

//     const s = state[line];
//     const minutes = Math.round((time - s.lastTime) / (1000 * 60));

//     if (line in nameMap) {
//       if (entry.Total_Prod_Today === s.lastValue) {
//         s.duration += minutes;

//         if (!s.inDowntime) {
//           s.inDowntime = true;
//           s.downtimeStartTime = s.lastTime;
//         }
//       } else {
//         if (s.inDowntime) {
//           if (s.duration >= 5) {
//             latestDowntime[line] = {
//               startTime: s.downtimeStartTime,
//               endTime: time,
//               duration: Math.round(s.duration / 5) * 5,
//             };
//           }
//           s.inDowntime = false;
//           s.downtimeStartTime = null;
//         }
//         s.duration = 0;
//       }
//       s.lastValue = entry.Total_Prod_Today;

//       latestDuration[line] = {
//         _time: entry._time,
//         duration: Math.round(s.duration / 5) * 5,
//       };

//       if (s.inDowntime && latestDuration[line].duration >= 5) {
//         latestDowntime[line] = {
//           startTime: s.downtimeStartTime,
//           endTime: time,
//           duration: latestDuration[line].duration,
//         };
//       }
//     }

//     s.lastTime = time;
//   }

//   const qualifyingLines = Object.entries(latestDuration).filter(
//     ([line, { duration }]) => duration >= 5
//   );

//   const durationsString = qualifyingLines
//     .map(([line, { duration }]) => `${nameMap[line]}: ${duration} minutes`)
//     .join(", ");

//   const lineNames = qualifyingLines.map(([line]) => nameMap[line]);

//   let maxDurationValue = 0;
//   let maxDurationLine = null;

//   for (const [line, { duration, _time }] of qualifyingLines) {
//     if (!Number.isFinite(duration)) continue;
//     if (
//       duration > maxDurationValue ||
//       (duration === maxDurationValue &&
//         new Date(_time) >
//           new Date(latestDuration[maxDurationLine]?._time || 0))
//     ) {
//       maxDurationValue = duration;
//       maxDurationLine = line;
//     }
//   }

//   // ✅ Save/Update UnplannedDowntime rows in DB
//   const res = await saveLatestDowntime({ latestDowntime });
//   console.log("latestDowntime (synced):", res.results[0]?.data || {});

//   // ✅ Build a map: lineName -> { id, reason, ... }
//   // res shape: { ok:true, results:[ {lineKey, ok, action, data:{...plannedShutdown, lines:[...]}} ] }
//   const downtimeReasonByLineName = {};

//   const results = Array.isArray(res?.results) ? res.results : [];
//   for (const r of results) {
//     if (!r?.ok) continue;

//     const lineKey = r.lineKey; // RB/RC/Front_Line
//     const lineName = nameMap[lineKey] || lineKey;

//     const ps = r?.data; // plannedShutdown row
//     if (!ps?.id) continue;

//     downtimeReasonByLineName[lineName] = {
//       id: ps.id,
//       reason: ps.reason ?? "",
//       startTime: ps.startTime ?? null,
//       endTime: ps.endTime ?? null,
//       description: ps.description ?? "",
//     };
//   }
//   // ✅ optional: also map by lineKey if you prefer
//   const downtimeReasonByLineKey = {};
//   for (const [lineName, obj] of Object.entries(downtimeReasonByLineName)) {
//     const key = Object.keys(nameMap).find((k) => nameMap[k] === lineName);
//     if (key) downtimeReasonByLineKey[key] = obj;
//   }
//   console.log("downtimeReasonByLineName:", downtimeReasonByLineName);

//   return {
//     durationsString,
//     lineNames,
//     latestDuration,
//     maxDurationValue,
//     latestDowntime,

//     // ✅ NEW: use this to get reason for a particular line
//     // e.g. downtimeReasonByLineName["Rear Back"]?.reason
//     downtimeReasonByLineName,

//     // ✅ optional
//     downtimeReasonByLineKey,
//   };
// }

// function getDurations2(data) {
//   const nameMap = {
//     Front_Line: "Front Line",
//     RB: "Rear Back",
//     RC: "Rear Cushion",
//   };

//   // Sort data by time
//   data.sort((a, b) => new Date(a._time) - new Date(b._time));

//   const latestDuration = {};
//   const state = {};

//   for (const entry of data) {
//     const line = entry.LINE;
//     const time = new Date(entry._time);

//     if (!state[line]) {
//       state[line] = {
//         lastTime: time,
//         lastValue: entry._value,
//         duration: 0,
//       };
//       continue;
//     }

//     const s = state[line];
//     const minutes = Math.round((time - s.lastTime) / (1000 * 60));

//     if (line in nameMap) {
//       if (entry.Total_Prod_Today === s.lastValue) {
//         s.duration += minutes;
//       } else {
//         s.duration = 0;
//       }

//       s.lastValue = entry.Total_Prod_Today;

//       latestDuration[line] = {
//         _time: entry._time,
//         duration: Math.round(s.duration/5)*5,
//       };
//     }

//     s.lastTime = time;
//   }

//   // Filter lines with duration >= 5 minutes
//   const qualifyingLines = Object.entries(latestDuration)
//     .filter(([line, { duration }]) => duration >= 5);

//   // Format outputs
//   const durationsString = qualifyingLines
//     .map(([line, { duration }]) => `${nameMap[line]}: ${duration} minutes`)
//     .join(", ");

//   const lineNames = qualifyingLines.map(([line]) => nameMap[line]);

//   // Find max duration among qualifying lines
//   let maxDurationValue = 0;
//   let maxDurationLine = null;

//   for (const [line, { duration, _time }] of qualifyingLines) {
//     if (
//       duration > maxDurationValue ||
//       (duration === maxDurationValue &&
//         new Date(_time) > new Date(latestDuration[maxDurationLine]?.__time || 0))
//     ) {
//       maxDurationValue = duration;
//       maxDurationLine = line;
//     }
//   }

//   return {
//     durationsString,
//     lineNames,
//     maxDurationValue,
//   };
// }

// function formatLineNames(lineNames) {
//   const len = lineNames.length;

//   if (len === 0) return '';
//   if (len === 1) return lineNames[0];
//   if (len === 2) return `${lineNames[0]} and ${lineNames[1]}`;

//   // For 3 or more items
//   const allButLast = lineNames.slice(0, -1).join(', ');
//   const last = lineNames[len - 1];
//   return `${allButLast}, and ${last}`;
// }

// function istToUtc(hour, minute) {
//   const now = new Date(); // current local time
//   const year = now.getUTCFullYear();
//   const month = now.getUTCMonth(); // 0-indexed
//   const day = now.getUTCDate();

//   const utcDate = new Date(Date.UTC(year, month, day, hour, minute));
//   return utcDate.toISOString();
// }


// function getLatestStatus(data) {
//   const result = {};

//   data.forEach(entry => {
//     const line = entry.LINE;
//     const field = entry._field;
//     const value = entry._value;
//     const timeStr = entry._time;
//     const time = new Date(timeStr); // parse to Date object

//     if (!result[line]) {
//       result[line] = {};
//     }

//     // If no entry yet or current time is newer
//     if (
//       !result[line][field] || 
//       new Date(result[line][field]._time) < time
//     ) {
//       result[line][field] = {
//         value,
//         _time: timeStr
//       };
//     }
//   });

//   return result;
// }

// function findLatestOutOfSyncPeriod(directArray, viaReplicationArray) {
//   const stripToMinutes = (iso) => {
//     const d = new Date(iso);
//     d.setSeconds(0, 0);
//     return d;
//   };

//   const toIST = (isoDate) => {
//     const istMillis = isoDate.getTime() + (5.5 * 60 * 60 * 1000);
//     return new Date(istMillis).toISOString();
//   };

//   const directTimes = directArray.map(d => stripToMinutes(d._time));
//   const viaTimes = viaReplicationArray.map(d => stripToMinutes(d._time));

//   const allTimesSet = new Set([...directTimes, ...viaTimes].map(d => d.getTime()));
//   const allTimes = Array.from(allTimesSet).sort((a, b) => a - b).map(ms => new Date(ms));

//   let lastOutOfSyncStart = null;
//   let firstBackInSyncAfterOutage = null;
//   let outOfSync = false;

//   const isWithin3Minutes = (time1, time2) => {
//     return Math.abs(time1.getTime() - time2.getTime()) <= 3 * 60 * 1000;
//   };

//   for (let time of allTimes) {
//     const hasDirect = directTimes.some(d => isWithin3Minutes(d, time));
//     const hasVia = viaTimes.some(v => isWithin3Minutes(v, time));

//     if (hasDirect && hasVia) {
//       if (outOfSync && firstBackInSyncAfterOutage === null) {
//         firstBackInSyncAfterOutage = time;
//       }
//       outOfSync = false;
//     } else {
//       if (!outOfSync) {
//         lastOutOfSyncStart = time;
//         firstBackInSyncAfterOutage = null;
//       }
//       outOfSync = true;
//     }
//   }

//   return {
//     outOfSyncStartUTC: lastOutOfSyncStart ? lastOutOfSyncStart.toISOString() : null,
//     firstBackInSyncUTC: firstBackInSyncAfterOutage ? firstBackInSyncAfterOutage.toISOString() : null,
//     outOfSyncStartIST: lastOutOfSyncStart ? toIST(lastOutOfSyncStart) : null,
//     firstBackInSyncIST: firstBackInSyncAfterOutage ? toIST(firstBackInSyncAfterOutage) : null
//   };
// }



// function TagsSyncStatus(obj1, obj2) {
//   const lines = Object.keys(obj1);
//   const maxTimeDiffMs = 4 * 60 * 1000;
//   const inSyncLines = [];

//   for (const line of lines) {
//     const tag1 = obj1[line];
//     const tag2 = obj2[line];

//     const tag1Data =
//       tag1.communication_status_direct ||
//       tag1.communication_status_via_replication;

//     const tag2Data =
//       tag2.communication_status_direct ||
//       tag2.communication_status_via_replication;

//     if (!tag1Data || !tag2Data) continue;

//     const time1 = new Date(tag1Data._time).getTime();
//     const time2 = new Date(tag2Data._time).getTime();
//     const timeDiff = Math.abs(time1 - time2);

//     if (tag1Data.value === tag2Data.value && timeDiff <= maxTimeDiffMs) {
//       inSyncLines.push(line);
// 	    console.log(time1,time2,timeDiff)
//     }
//   }
// 	if(inSyncLines.length===0){
// 		return true;
// 	}


//   // Return only the lines that are in sync
//   return inSyncLines;
// }
// function getLatestTimeOfTags(data) {
//   let latestTime = null;

//   Object.values(data).forEach(line => {
//     ['communication_status_direct', 'communication_status_via_replication'].forEach(key => {
//       const entry = line[key];
//       if (entry && entry._time) {
//         const currentTime = new Date(entry._time);
//         if (!latestTime || currentTime > new Date(latestTime)) {
//           latestTime = entry._time;
//         }
//       }
//     });
//   });

//   return latestTime;
// }

//   async function sendMailsSequentiallyForRestore(emails) {
//   for (const email of emails) {
//     try {
//       await SendMailNUCRestored(email);
//       console.log(` Power on email Sent to ${email}`);
//       await sleep(2000); // wait 2 seconds before sending next
//     } catch (err) {
//       console.error(`Failed to send to ${email}:`, err.message);
//     }
//   }
// }

// async function checkLast5MinutesData(data) {
//   // Step 1: Sort data in increasing order of time
//   const sorted = [...data].sort((a, b) => new Date(a._time) - new Date(b._time));

//   // Step 2: Create unique times based only on hours and minutes (ignore seconds)
//   const seenMinutes = new Set();
//   const minuteTimes = [];

//   for (const item of sorted) {
//     const date = new Date(item._time);
//     const key = `${date.getUTCFullYear()}-${date.getUTCMonth()}-${date.getUTCDate()} ${date.getUTCHours()}:${date.getUTCMinutes()}`;
//     if (!seenMinutes.has(key)) {
//       seenMinutes.add(key);
//       minuteTimes.push(new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes())));
//     }
//   }

//   // Step 3: Check last 5 unique minute timestamps
//   const recent5 = minuteTimes.slice(-5);
// 	console.log(recent5)
//   if (recent5.length < 5) {
//     console.log("Not enough minute-level timestamps to determine continuity");
//     return false;
//   }


//   // Step 4: Check each pair for 1-minute gap
//   for (let i = 1; i < 5; i++) {
//     const prev = recent5[i - 1];
//     const curr = recent5[i];
//     const diffMin = (curr - prev) / (1000 * 60);

//     if (diffMin >3) {
//       console.log("Power Up Detected");
// 	     isEmailSent=false;
//       console.log("changing the isEmailsent to ",isEmailSent)
// 	     const emails=[
// 		    //  "naresh.yadav@bharatseats.net",
//                  "ommishra@opsight.ai",
//     // "nishant.kundu@bharatseats.net",
// 		    //  "mohan.mishra@bharatseats.net",
//       // "mukesh.yadav@bharatseats.net",
//                  ]
//                 sendMailsSequentiallyForRestore(emails)

//       return true;
//     }
//   }

//   console.log("Last 5 minutes are continuous");
// 	return false;
// }



// // const mailConfig = {
// //     5: {
// //       level: "Level 1",
// //       emails: [
// // 	      "ommishra@opsight.ai",
// //         "mukesh.yadav@bharatseats.net",
// //       ],
// //     },
// //     10: {
// //       level: "Level 2",
// //       emails: [
// // 	      "ommishra@opsight.ai",
// //        // "aniket.singh@bharatseats.net",
// //         "mukesh.yadav@bharatseats.net",
// // 	      "Yogesh.Bansal@bharatseats.net",
// //       ],
// //     },
// // 	20:{
// // 		level:"suman",
// // 		emails:["Suman.Yadav@bharatseats.net","mukesh.yadav@bharatseats.net"]
// // 	},
// //     35: {
// //       level: "Level 3",
// //       emails: [
// //         "ommishra@opsight.ai",
// //          "naresh.yadav@bharatseats.net",
// //          "aniket.singh@bharatseats.net",
// //          "mukesh.yadav@bharatseats.net",
// // 	     "arunkumar@opsight.ai",
// // 	     "Rajiv.Arora@bharatseats.net",
// //       ],
// //     },
// //   };

// const mailConfig = {
//     5: {
//       level: "Level 1",
//       emails: [
// 	      "ommishra@opsight.ai",
//       ],
//     },
//     10: {
//       level: "Level 2",
//       emails: [
// 	      "ommishra@opsight.ai",
//       ],
//     },
// 	20:{
// 		level:"suman",
// 		emails:["ommishra@opsight.ai"]
// 	},
//     35: {
//       level: "Level 3",
//       emails: [
//         "ommishra@opsight.ai",
//       ],
//     },
//   };



// function buildDowntimeMessage(durations) {
//   let isCeoSend = true;

//   const map = durations?.downtimeReasonByLineName || {};
//   const latest = durations?.latestDuration || {}; // { RB:{duration}, ... }

//   const nameToKey = {
//     "Front Line": "Front_Line",
//     "Rear Back": "RB",
//     "Rear Cushion": "RC",
//   };

//   const lines = [];
//   const badReasons = new Set(["", "No reason alloted"]);

//   for (const [lineName, obj] of Object.entries(map)) {
//     const key = nameToKey[lineName];
//     const dur = latest?.[key]?.duration ?? 0; // already 5-rounded

//     if (dur < 5) continue;

//     const reasonRaw = (obj?.reason ?? "").trim();
    

//     // ✅ if any line (that qualifies) has empty or "No reason alloted" => block CEO send
//     if (badReasons.has(reasonRaw)) {
//       isCeoSend = false;
//     }

//     lines.push(`${lineName}: ${dur} min | Reason: ${reasonRaw || "NA"}`);
//   }

//   if (lines.length === 0) return { message: "", isCeoSend: false };

//   return {
//     message: `Downtime Alert:\n${lines.join("\n")}`,
//     isCeoSend,
//   };
// }

// const checkRunModeAndSendAlerts = async () => {
// if(isBefore5PM_IST()){
//                 console.log(isBefore5PM_IST())
// 	lastRealtimeDataTime=istToUtc(0,30)
	
// 	console.log("Not the time to send email and changing lastRealtimeDataTime to ",lastRealtimeDataTime)
//                 return ;
//       }

// let startTime=istToUtc(0,30)
// const endTime=istToUtc(17,30);	
// const QueryForLive = `
//   from(bucket: "TODAY")
//     |> range(start: time(v: "${startTime}"),stop:time(v:"${endTime}"))
//     |> filter(fn: (r) => r["_measurement"] == "Performance")
//   |> filter(fn: (r) => r["LINE"] == "RB" or r["LINE"] == "RC" or r["LINE"] == "Front_Line")
//   |> filter(fn: (r) => r["_field"] == "communication_status_direct")
//     |> aggregateWindow(every: 20s, fn: last, createEmpty: false)
//     |> sort(columns: ["_time"], desc: false)
// `;

// const QueryForLive2 = `
//   from(bucket: "TODAY")
//     |> range(start: time(v: "${startTime}"),stop:time(v:"${endTime}"))
//      |> filter(fn: (r) => r["_measurement"] == "Performance")
//   |> filter(fn: (r) => r["LINE"] == "RB" or r["LINE"] == "RC" or r["LINE"] == "Front_Line")
//   |> filter(fn: (r) => r["_field"] == "communication_status_via_replication")
//     |> aggregateWindow(every: 20s, fn: last, createEmpty: false)
//     |> sort(columns: ["_time"], desc: false)
// `;
// 	console.log("start and end time of communication query",startTime,endTime)



// const rows=await queryApi.collectRows(QueryForLive2);
// const rowsDirect = await queryApi.collectRows(QueryForLive);


// console.log(rows[0],rowsDirect[0])
// console.log(getLatestStatus(rows),getLatestStatus(rowsDirect))

// 	const lastTimeDirect=getLatestTimeOfTags(getLatestStatus(rowsDirect))
// 	const lastTime=getLatestTimeOfTags(getLatestStatus(rows))
// 	console.log("inside this console",lastTimeDirect)
// 	if(isnotRealtime(lastTimeDirect)){
// 		console.log("Email sent for not in realtime Data ")
// 		return ;
// 	}else{

// 	   if(isEmailSent && checkLast5MinutesData(rowsDirect)){
// 		   console.log("just powered up email sent for power up nuc or restored connection ")
// 		   return;
// 	   }
	   
// 		if(TagsSyncStatus(getLatestStatus(rows),getLatestStatus(rowsDirect))===true){
// 		   console.log("email for not time sync for all 3 lines ");
// 		return ;
// 	   }

// 	}

	
//  startTime=findLatestOutOfSyncPeriod(rows,rowsDirect)?.firstBackInSyncUTC || istToUtc(0,30);


// const linesList=TagsSyncStatus(getLatestStatus(rows),getLatestStatus(rowsDirect));
// 	if(linesList.length<3){
// 		console.log("Changing time as the data is not reset")
//                 const now=new Date()
//                 const hour=now.getHours();
// 		const minutes=now.getMinutes()
//                 startTime=istToUtc(hour,minutes);

// 	}

// 	console.log("Data is realtime and the replication is in sync for these lines ",linesList,startTime ,endTime)
//             lastRealtimeDataTime=lastTimeDirect; 
//   console.log("changed the value of lastRealtimeDataTime to ",lastTimeDirect)
// 	const lineFilter = linesList.map(line => `r["LINE"] == "${line}"`).join(" or ");
// 	const fluxQuery = `
//         from(bucket: "TODAY")
//         |> range(start: time(v: "${startTime}"),stop:time(v:"${endTime}"))
        
//           |> filter(fn: (r) => r["_measurement"] == "Performance")
// 	   |> filter(fn: (r) => ${lineFilter})
//   |> filter(fn: (r) => r["_field"] == "Total_Prod_Today")
//           |> aggregateWindow(every: 1m, fn: last, createEmpty: false)
//             |> pivot(rowKey:["_time"], columnKey:["_field"], valueColumn:"_value")
//             |> sort(columns: ["_time"], desc: false)
//         `;




//   try { 
// 	  const rows2 = await queryApi.collectRows(fluxQuery);
// 	  	  const durations = await getDurations(rows2);
// const info = durations.durationsString;
// const maxDuration = durations.maxDurationValue;
// const floorTime = Math.floor(maxDuration / 5) * 5;

// const message = buildDowntimeMessage(durations);

// console.log("floorTime:", floorTime);
// console.log("message:\n", message.message);

//          const lineName=formatLineNames(durations.lineNames);	


//           console.log(lineName,info,"So email will be sent for this floortime ",floorTime,message);


	 
// async function sendMailsSequentially(emails, info, lineName) {
//   for (const email of emails) {
//     try {
// 	    console.log("sending in process ,for ",email)
// 	          if((email==="Rajiv.Arora@bharatseats.net" || email==="ommishra@opsight.ai" || email==="arunkumar@opsight.ai" || email==="aniket.singh@bharatseats.net") && !message.isCeoSend){
//         console.log("Skipping CEO email as reason not allotted")
//         continue;
//       }
//       await SendMailToUserAlert(email, message?.message, lineName);
//       console.log(`✅ Sent to ${email}`);
//       await sleep(2000); // wait 2 seconds before sending next
//     } catch (err) {
//       console.error(`❌ Failed to send to ${email}:`, err.message);
//     }
//   }
// }

// async function processMailLogic(floorTime, info, lineName) {

//   // Extend support for 35, 55, 75, etc.
// 	console.log("Process mail logic function , check")
//   const isExtendedLevel3 = floorTime > 35 && (floorTime - 30) % 20 === 0;

//   const config =
//     mailConfig[floorTime] || (isExtendedLevel3 ? mailConfig[35] : null);
//    console.log("outside config",floorTime) 
//   if (config) {
// 	  console.log("inside sendMailSequence")
//     await sendMailsSequentially(config.emails, info, lineName);
//     console.log(`${config.level} mail sent for floorTime:`, floorTime);
//   } else {
//     console.log("✅ No alert triggered at this duration.");
//   }
// }

// // Call the function
// processMailLogic(floorTime, info, lineName);
//   } catch (err) {
//     console.error("❌ Error in checkRunModeAndSendAlerts:", err);
//   }
// };

// // ✅ Manual route trigger
// influxRouter.post("/check-runmode", async (req, res) => {
//   await checkRunModeAndSendAlerts();
//   res.status(200).json({message:"Triggered check manually."});
// });




//   // const mailConfig2 = {
//   //   12: {
//   //     level: "Level 1",
//   //     emails: [
//   //        "mukesh.yadav@bharatseats.net",
//   //        "ommishra@opsight.ai",
//   //        "mohan.mishra@bharatseats.net",
//   //       "Gaurav.kumar@bharatseats.net",
//   //     ],
//   //   },
//   //   15: {
//   //     level: "Level 2",
//   //     emails: [
//   //        "Suman.Yadav@bharatseats.net",
//   //        "ommishra@opsight.ai",
//   //      //  "arunkumar@opsight.ai"
//   //       ,"mohan.mishra@bharatseats.net",

//   //     ],
//   //   },
//   //   20: {
//   //     level: "Level 3",
//   //     emails: [
//   //        "Rajiv.Arora@bharatseats.net",
//   //     //  "arunkumar@opsight.ai",
//   //       "mohan.mishra@bharatseats.net",

//   //     ],
//   //   },
//   // };

// // --- Flags to track whether we've already sent email ---

//   const mailConfig2 = {
//     12: {
//       level: "Level 1",
//       emails: [
//          "ommishra@opsight.ai",
//       ],
//     },
//     15: {
//       level: "Level 2",
//       emails: [
//          "ommishra@opsight.ai",

//       ],
//     },
//     20: {
//       level: "Level 3",
//       emails: [
//         ,"ommishra@opsight.ai"

//       ],
//     },
//   };
// let c93Triggered = false;
// let c94Triggered = false;
// let c95Triggered = false;

// const sendBitEmails = async () => {
//   try {
//     const bitQuery = `
//       from(bucket: "TODAY")
//         |> range(start: -90s) // last 40 seconds
//         |> filter(fn: (r) => r["_measurement"] == "connection")
//         |> filter(fn: (r) => r["_field"] == "c93" or r["_field"] == "c94" or r["_field"] == "c95")
//         |> last()
//     `;

//     // Fetch rows
//     const rows = [];
//     for await (const { values, tableMeta } of queryApi.iterateRows(bitQuery)) {
//       rows.push(tableMeta.toObject(values));
//     }

//     if (rows.length === 0) {
//       console.log("No data found in last 30s for c93, c94, c95");
//       // reset all flags if no data comes
//       c93Triggered = false;
//       c94Triggered = false;
//       c95Triggered = false;
//       return;
//     }

//     // Build latestValues map
//     const latestValues = {};
//     rows.forEach((row) => {
//       latestValues[row._field] = {
//         value: row._value,
//         time: row._time,
//       };
//     });

//     console.log("Latest values (last 40s):", latestValues);

//     // --------------------
//     // Handle c95
//     // --------------------
//     if (latestValues.c95 && latestValues.c95.value === 1) {
//       if (!c95Triggered) {
//         c95Triggered = true; // lock it
//         const config = mailConfig2[20];
//         const msg = `The dispatch wagon has been delayed for more than 20 minutes.`;
//         await sendEmails(config, msg);
//       }
//     } else {
//       c95Triggered = false; // reset if 0 or missing
//     }

//     // --------------------
//     // Handle c94
//     // --------------------
//     if (latestValues.c94 && latestValues.c94.value === 1) {
//       if (!c94Triggered) {
//         c94Triggered = true;
//         const config = mailConfig2[15];
//         const msg = `The dispatch wagon has been delayed for more than 15 minutes.`;
//         await sendEmails(config, msg);
//       }
//     } else {
//       c94Triggered = false;
//     }

//     // --------------------
//     // Handle c93
//     // --------------------
//     if (latestValues.c93 && latestValues.c93.value === 1) {
//       if (!c93Triggered) {
//         c93Triggered = true;
//         const config = mailConfig2[12];
//         const msg = `The dispatch wagon has been delayed for more than 12 minutes.`;
//         await sendEmails(config, msg);
//       }
//     } else {
//       c93Triggered = false;
//     }

//   } catch (err) {
//     console.error("Error in sendBitEmails:", err);
//   }
// };

// // helper function to send all emails for a config
// async function sendEmails(config, message) {
//   console.log(`Triggering ${config.level} emails`);

//   const emailPromises = config.emails.map(async (email) => {
//     try {
//       await SendEmailDispatchDelay(email, message);
//       console.log(`Email sent successfully to ${email} for ${config.level}`);
//     } catch (error) {
//       console.error(`Failed to send email to ${email}:`, error);
//     }
//   });

//   await Promise.allSettled(emailPromises);
//   console.log(`All emails processed for ${config.level}`);
// }


// influxRouter.get("/performance-report",getDowntimeReportByLineDateShiftCumulative)



//   module.exports = {influxRouter,getShiftTiming ,sendBitEmails};



const express = require("express");

const influxRouter = express.Router();

const {
  getDowntimeReportByLineDateShiftCumulative,
  getSingleTorqueGun,
  getAllTorqueGuns,
  getSingleDrive,
  getQualityData,
  getLineData,
  getPlantData,
  getCeoQualityData,
  getCeoTorqueData,
  getRunningSeatData,
  getCeoSeatProductionData,
  getCeoData,
  getPlantReportDate,
  getPlantReportDateRange,
  getAllDrivesData,
  getPerformanceReportPdf,
} = require("../Controllers/influxControllers.js");


// moved out (email/alert logic)

// moved out (shift timing helper)
const { checkRunModeAndSendAlerts, sendBitEmails } = require("../functions/emailFunctions.js");

// -------- Routes (unchanged) --------

influxRouter.get("/SingleTorqueGun/data/:shift/:date/:torquegunName/:station", getSingleTorqueGun);
influxRouter.get("/torqueGun/data/:shift/:date", getAllTorqueGuns);

influxRouter.get("/SingleDrive/data/:drive/:shift/:date", getSingleDrive);
influxRouter.get("/drive/data/:shift/:date", getAllDrivesData);

influxRouter.get("/Quality/data/:line/:shift/:date", getQualityData);

influxRouter.get("/line/data/:line/:shift/:date", getLineData);

influxRouter.get("/Plant/data/:shift/:date", getPlantData);

influxRouter.get("/ceo/:date/:line/:field", getCeoData);
influxRouter.get("/ceo/seatProduction/:shift", getCeoSeatProductionData);
influxRouter.get("/ceo/runningSeat/:shift", getRunningSeatData);
influxRouter.get("/ceo/torqueGun/:station/:torqueGun/:date/:shift", getCeoTorqueData);
influxRouter.get("/ceo/qualityReview/:line/:date/:shift", getCeoQualityData);

influxRouter.get("/plantReportRange/:shift/:date", getPlantReportDateRange);
influxRouter.get("/plantReport/:shift/:date", getPlantReportDate);

influxRouter.get("/performance-report", getPerformanceReportPdf);

// Manual trigger (unchanged behavior)
influxRouter.post("/check-runmode", async (req, res) => {
  await checkRunModeAndSendAlerts();
  res.status(200).json({ message: "Triggered check manually." });
});

// Keep the same exports as before
module.exports = { influxRouter, sendBitEmails };













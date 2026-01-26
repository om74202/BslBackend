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
      start: getTime(6, 0), // 6:00 AM IST
      end: getTime(14, 30), // 2:30 PM IST
    },
    B: {
      start: getTime(14, 30), // 2:30 PM IST
      end: getTime(23, 0), // 11:00 PM IST
    },
    C: {
      start: getTime(23, 0), // 11:00 PM IST
      end: getTime(6, 0, 1), // next day 6:00 AM IST
    },
    r: {
      start: getTime(6, 0),
      end: getTime(6, 0, 1),
    },
  };

  console.log(shift, selectedDate);

  const result = shiftTimes[shift];
  if (!result) throw new Error("Invalid shift. Must be 'A', 'B', or 'C'");
  console.log(result);

  return {
    startTime: result.start,
    endTime: result.end,
  };
}
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
module.exports = { getShiftTiming ,plantFields,extractHPCData,torqueFields,getLastValidItem,reasonsMap };

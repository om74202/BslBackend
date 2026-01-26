// controllers/line.controller.js
// make sure you have prisma imported/initialized somewhere
// const { PrismaClient } = require("@prisma/client");
// const prisma = new PrismaClient();

const prismaClient = require("../lib/prismaClient");

const { publishJphSet } = require("../functions/mqtt");
const { getShiftTiming } = require("../functions/shiftTimings");



const createLine=async(req , res)=>{
const {lineName , lineType  , organizationId , noOfShifts=0 , noOfCustomShifts=0 , noOfStations=0 , customShiftsTimings=[] ,stations=[] }=req.body
let shiftIds=[];
console.log(req.body)
try{
  const orgData=await prismaClient.organization.findUnique({
  where:{
    id:organizationId
  },include:{
    shifts:true
  }
})
if(!orgData){
  return res.status(400).json({message:"Organization ID  is invalid "})
}

const totalShiftIds=orgData.shifts.map((shift)=>shift.id)

if(noOfShifts>totalShiftIds.length){
  return res.status(400).json({message:"No. of Shifts is invalid "})
}


for(let i=0;i<noOfShifts;i++){
  shiftIds[i]=totalShiftIds[i];
}


console.log(shiftIds);
}catch(e){
  console.log(e)  
return res.status(404).json({message:"No shiftIds" , error :e})
}

  if (!lineName) return res.status(400).send({ message: "Line Name is required" });
if (!organizationId) return res.status(400).send({ message: "organization ID is required" });
if (!noOfShifts) return res.status(400).send({ message: "No. of shifts are   required" });
if (!noOfStations) return res.status(400).send({ message: "Station Count is required" });
if (!lineType) return res.status(400).send({ message: "line Type  is required" });



try{
    console.time("createLine")
const line=await prismaClient.line.create({
    data:{
        lineName:lineName,
        organizationId:organizationId,
        lineType:lineType,
        noOfStations:noOfStations,
        noOfShifts:noOfShifts,
        noOfCustomShifts:noOfCustomShifts,
      
        stations:{
          create:stations.map((station)=>({
            name:station.name,
            Pokayoke:station.Pokayoke || false
          }))
        },  
        shiftTimings:{
          connect:shiftIds.map((id)=>({id}))
        }, 
        customShiftsTimings: {
          create: customShiftsTimings.map((shift) => ({
            start: shift.start,
            end: shift.end,
            plannedBreaksCustom: {
      create: Array.isArray(shift.plannedBreaksCustom)
        ? shift.plannedBreaksCustom.map((breakObj) => ({
            start: breakObj.start,
            end: breakObj.end,
            typeOfBreak: breakObj.typeOfBreak
          }))
        : [] // fallback to empty array if not passed or not an array
    }
          }))
        }
    }
})

console.timeEnd("createLine");
res.json({message:"Line Created Successfully",line})
}catch(e){
  console.log(e);
    res.status(500).json({message:"Internal Server Error "})
}
}


const getLines=async(req , res)=>{
    try{
        const Lines=await prismaClient.line.findMany({
          include:{
            shiftTimings:true,
            customShiftsTimings:true,
            stations:true,
            devices:true
          }
        });
        res.status(200).json({Lines:Lines , status:"success"})
      }catch(e){
        res.status(404).json({message:"Line not found"})
      }
}


const getLinesByOrgId=async (req, res)=>{
    try{
        const {orgId} = req.params
        const Lines=await prismaClient.line.findMany({
          where:{
            organizationId:req.params.orgId,
		  lineType:"mainLine"
          },
          include:{
            shiftTimings:true,
            customShiftsTimings:true,
            stations:true,
            devices:true
          }
        });

	            const idealParams=await prismaClient.idealParameters.findMany();

        res.status(200).json({Lines:Lines,idealParams:idealParams , status:"success"})
      }catch(e){
        res.status(404).json({message:"Line not found"})
      }
}


const updateTargetJPH = async (req, res) => {
  try {
     // adjust if your user id key differs
    const { lineId, targetJPH,user } = req.body || {};
    const userId = req.user?.id || req.user?._id || user?.user?.id || user?.id;
    console.log("userId",userId)

    

    if (!lineId || typeof lineId !== "string") {
      return res.status(404).json({
        success: false,
        message: "lineId is required",
      });
    }

    if (targetJPH === undefined || targetJPH === null || Number.isNaN(Number(targetJPH))) {
      return res.status(400).json({
        success: false,
        message: "targetJPH must be provided as a number",
      });
    }

    const nextJPH = Number(targetJPH);

    const existing = await prismaClient.line.findUnique({
      where: { lineId },
      select: {
        lineId: true,
        lineName: true,
        targetJPH: true,
        organizationId: true,
      },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Line not found",
      });
    }

    if (Number(existing.targetJPH) === nextJPH) {
      return res.status(200).json({
        success: true,
        message: "TargetJPH already up to date",
        data: existing,
      });
    }

    const updated = await prismaClient.$transaction(async (tx) => {
      const updatedLine = await tx.line.update({
        where: { lineId },
        data: { targetJPH: nextJPH },
        select: {
          lineId: true,
          lineName: true,
          targetJPH: true,
          organizationId: true,
        },
      });

      await tx.targetJPHUpdateHistory.create({
        data: {
          userId,
          lineId,
          updatedValue:nextJPH
        },
      });

      return updatedLine;
    });

    publishJphSet([{ line: updated.lineName, jph: nextJPH*2 }]);
	  

    return res.status(200).json({
      success: true,
      message: "TargetJPH updated for line",
      data: updated,
    });
  } catch (err) {
    console.error("bulkUpdateTargetJPH:", err);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err?.message || String(err),
    });
  }
};

const getTargetJPHUpdateHistory = async (req, res) => {
  try {
    const { month } = req.query;

    if (month === "All") {
      const history = await prismaClient.targetJPHUpdateHistory.findMany({
        orderBy: {
          updatedAt: "asc",
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
          line: {
            select: {
              lineId: true,
              lineName: true,
            },
          },
        },
      });

      return res.status(200).json({
        month,
        count: history.length,
        data: history,
      });
    }

    // 1️⃣ Determine month range
    let startDate;
    let endDate;

    if (month && typeof month === "string") {
      // Expected format: YYYY-MM
      const [year, monthIndex] = month.split("-").map(Number);

      if (!year || !monthIndex) {
        return res.status(400).json({
          message: "Invalid month format. Use YYYY-MM",
        });
      }

      startDate = new Date(year, monthIndex - 1, 1);
      endDate = new Date(year, monthIndex, 1); // start of next month
    } else {
      // Default → current month
      const now = new Date();
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    }

    // 2️⃣ Fetch history
    const history = await prismaClient.targetJPHUpdateHistory.findMany({
      where: {
        updatedAt: {
          gte: startDate,
          lt: endDate,
        },
      },
      orderBy: {
        updatedAt: "asc",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        line: {
          select: {
            lineId: true,
            lineName: true,
          },
        },
      },
    });

    return res.status(200).json({
      month: month || "current",
      count: history.length,
      data: history,
    });
  } catch (error) {
    console.error("Error fetching JPH update history:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// fallback if you don't want to import parseReportDate
const parseYMD = (ymd) => {
  if (!ymd) return null;
  const [y, m, d] = String(ymd).split("-").map(Number);
  if ([y, m, d].some((n) => Number.isNaN(n))) return null;
  // "local" midnight is risky; better keep consistent with your app
  // If your reportDate is stored at 00:00:00Z, do this:
  return new Date(Date.UTC(y, m - 1, d, 0, 0, 0, 0));
};

const getJphHistoryForShift = async (req, res) => {
  try {
    const { lineId, lineName, date, shift } = req.query;

    if ((!lineId && !lineName) || !date || !shift) {
      return res.status(400).json({
        success: false,
        message: "lineId (or lineName), date (YYYY-MM-DD), shift are required",
      });
    }

    const selectedDate = parseYMD(date);
    if (!selectedDate || Number.isNaN(selectedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format. Expected YYYY-MM-DD",
      });
    }


    // resolve lineId if lineName provided
    let resolvedLineId ="";


    const lineRow = await prismaClient.line.findFirst({
	    where: { lineName:lineName},
      select: { lineId: true, lineName: true, targetJPH: true },
    });
	  resolvedLineId=lineRow.lineId

    if (!lineRow) {
      return res.status(404).json({ success: false, message: "Line not found" });
    }

    // compute shift start/end (UTC ISO strings or Dates — depends on your helper)
    const { startTime, endTime } = getShiftTiming(shift, selectedDate);
    if (!startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: "Unable to compute startTime/endTime for shift/date",
      });
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    // ✅ get one value "active at shift start" (latest before start)
    const prior = await prismaClient.targetJPHUpdateHistory.findFirst({
      where: {
        lineId: resolvedLineId,
        updatedAt: { lt: start },
      },
      orderBy: { updatedAt: "desc" },
      select: { updatedAt: true, updatedValue: true },
    });

    // ✅ all updates within shift
    const within = await prismaClient.targetJPHUpdateHistory.findMany({
      where: {
        lineId: resolvedLineId,
        updatedAt: { gte: start, lte: end },
      },
      orderBy: { updatedAt: "asc" },
      select: { updatedAt: true, updatedValue: true, userId: true },
    });

    // base JPH if nothing exists before: use Line.targetJPH or 100 fallback
    const defaultJph = Number.isFinite(lineRow.targetJPH) ? lineRow.targetJPH : 100;

    // ✅ return timeline points: time + value
    // include a "start marker" so frontend can draw step chart correctly
    const timeline = [];

    const initialValue =
      prior?.updatedValue != null ? prior.updatedValue : defaultJph;

    timeline.push({
      time: start.toISOString(),
      value: Number(initialValue) || 0,
      source: prior ? "history_before_shift" : "default",
    });

    for (const h of within) {
      timeline.push({
        time: new Date(h.updatedAt).toISOString(),
        value: Number(h.updatedValue) || 0,
        source: "history_in_shift",
        userId: h.userId,
      });
    }

    // optional: include end marker for charts
    timeline.push({
      time: end.toISOString(),
      value: timeline.length ? timeline[timeline.length - 1].value : defaultJph,
      source: "shift_end_marker",
    });

    return res.status(200).json({
      success: true,
      meta: {
        lineId: lineRow.lineId,
        lineName: lineRow.lineName,
        shift: shift,
        date,
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        defaultJph,
      },
      data: timeline, // [{time,value}]
    });
  } catch (err) {
    console.error("getJphHistoryForShift:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err?.message || String(err),
    });
  }
};


const getStationByOrgId = async (req, res) => {
  try{
      const {orgId} = req.params
      
      const Lines=await prismaClient.station.findMany({
        where:{
          line:{
            organizationId:orgId
          }
        },
        include:{
          line:true,
          torqueGuns:true,
        }
      });
      res.status(200).json({stations:Lines , status:"success"})
    }catch(e){
      res.status(404).json({message:"Line not found"})
    }
}

const setLinesStatus=async (req, res)=>{
  try{
    const {status}=req.body;
	  console.log(status)
    if( status!=="Active" &&  status!=="Inactive"){
      return res.status(500).json({message:"Invalid Status , it must be Active or Inactive"})
    }
      const {lineId} = req.params
      const Orgs=await prismaClient.line.update({
        where:{
          lineId:lineId
        },
        data:{
          status:status
        }
      });
      res.status(200).json({message:`Status updated to ${status}`, status:"success"})
    }catch(e){
      res.status(404).json({message:"Line not found", error:e})
    }
}

module.exports = {
  updateTargetJPH,
  getTargetJPHUpdateHistory,
  getJphHistoryForShift,
  getStationByOrgId,
  setLinesStatus,
  createLine
  ,getLines,getLinesByOrgId
};


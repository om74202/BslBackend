const express = require('express');
const { prismaClient } = require('../lib/prismaClient');

const LineRouter=express.Router();

LineRouter.post('/createLine',async(req , res)=>{
const {lineName , lineType  , organizationId , noOfShifts , noOfCustomShifts , noOfStations , customShiftsTimings=[] ,stations=[]}=req.body
let shiftIds=[];

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
})

LineRouter.get('/getLines',async(req , res)=>{
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
})

LineRouter.get('/getLines/:orgId',async (req, res)=>{
    try{
        const {orgId} = req.params
        const Lines=await prismaClient.line.findMany({
          where:{
            organizationId:req.params.orgId
          },
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
})

module.exports=LineRouter;

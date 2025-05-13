const express = require('express');
const { prismaClient } = require('../lib/prismaClient');

const LineRouter=express.Router();

LineRouter.post('/createLine',async(req , res)=>{
const {name , type  , organizationId , userId , shiftCount , customShiftCount , stationCount ,shiftIds=[] , customShifts=[] ,stations=[]}=req.body

if (!name) return res.status(400).send({ message: "Name is required" });
if (!organizationId) return res.status(400).send({ message: "Name is required" });

try{
    console.time("createLine")
const line=await prismaClient.line.create({
    data:{
        name:name,
        organizationId:organizationId,
        type:type,
        stationCount:stationCount,
        shiftCount:shiftCount,
        customShiftCount:customShiftCount,
        stations:{
          create:stations.map((station)=>({
            name:station.name,
            isCritical:station.isCritical || false
          }))
        },
        shifts:{
          connect:shiftIds.map((id)=>({id}))
        },
        customShifts: {
          create: customShifts.map((shift) => ({
            start: shift.start,
            end: shift.end,
            plannedBreaksCustomCount:shift.plannedBreaksCustomCount,
            plannedBreaksCustom: {
              create: shift.plannedBreaksCustom.map((breakObj) => ({
                start: breakObj.start,
                end: breakObj.end,
                typeOfBreak: breakObj.typeOfBreak
              }))
            }
          }))
        }
    }
})
console.timeEnd("createLine");
res.json({message:"Line Created Successfully"})
}catch(e){
  console.log(e);
    res.status(500).json({message:"Internal Server Error "})
}
})

LineRouter.get('/getLines',async(req , res)=>{
    try{
        const Lines=await prismaClient.line.findMany({
          include:{
            shifts:true,
            customShifts:true,
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
            shifts:true,
            customShifts:true,
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

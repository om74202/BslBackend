const express = require('express');
const { prismaClient } = require('../lib/prismaClient');

const deviceRouter=express.Router();

deviceRouter.post('/addDevice',async(req , res)=>{
    const {name , type , organizationId , lineId ,status  }=req.body;

    try{
        const device=await prismaClient.device.create({
            data:{
                name:name,
                type:type,
                organizationId:organizationId,
                lineId:lineId,
                status:status
            }
        })
        res.json({message:"Device created Successfully " , device})
    }catch(e){
        res.status(500).json({message:"Internal Server Error", error:e})
    }

})

deviceRouter.get('/getDevices',async(req , res)=>{
    try{
        const devices=await prismaClient.device.findMany();
        res.status(200).json({devices:devices , status:"success"})
      }catch(e){
        res.status(404).json({message:"Devices not found"})
      }
})


deviceRouter.get('/getDevices/:orgId',async(req , res)=>{
    try{
        const devices=await prismaClient.device.findMany({
            where:{
                organizationId:req.params.orgId
            }
        });
        res.status(200).json({devices:devices ,message:"devices found at organization ", status:"success"})
      }catch(e){
        res.status(404).json({message:"Devices not found"})
      }
})

module.exports=deviceRouter;
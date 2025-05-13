const express = require('express');
const { prismaClient } = require('../lib/prismaClient');

const organisationRouter=express.Router();

organisationRouter.post('/createOrganization',async(req,res)=>{
    const {name , email , address, phoneNumber , imageUrl , shiftCount , unit , Department , Desingation , shifts=[] ,breaks }=req.body

    if (!name) return res.status(400).send({ message: "Name is required" });
    if (!email) return res.status(400).send({ message: "Email is required" });
    if (!phoneNumber) return res.status(400).send({ message: "Phone number is required" });
    if (!address) return res.status(400).send({ message: "address  is required" });
    if (!shiftCount) return res.status(400).send({ message: "Shift number is required" });


    try{
      
        const org=await prismaClient.organization.create({
            data:{
                name:name,
            address:address,
            phoneNumber:phoneNumber,
            imageUrl:imageUrl,
            shiftCount:shiftCount,
            email:email,
            unit:unit,
            Department:Department,
            Desingation:Desingation,
            shifts: {
              create: shifts.map((shift) => ({
                start: shift.start,
                end: shift.end,
                plannedBreaksCount: shift.plannedBreaks.length,
                plannedBreaks: {
                  create: shift.plannedBreaks.map((breakItem) => ({
                    start: breakItem.start,
                    end: breakItem.end,
                    type: breakItem.type,
                  })),
                },
              })),
            }
        }})

        res.json({message:"Organization Created Successfully"})
    }catch(e){
        console.log(e);
        res.status(501).json({message:"Internal Server Error"})
    }
})

organisationRouter.get('/getOrganization',async(req , res)=>{
    try{
      console.time("fetch")
        const Orgs=await prismaClient.organization.findMany();
        res.status(200).json({organization:Orgs , status:"success"})
        console.timeEnd("fetch");
      }catch(e){
        res.status(404).json({message:"Organization not found"})
      }
})

organisationRouter.get('/getOrganization/:orgId',async (req, res)=>{
    try{
        const {orgId} = req.params
        const Orgs=await prismaClient.organization.findUnique({
          where:{
            id:orgId
          }
        });
        res.status(200).json({organizations:Orgs , status:"success"})
      }catch(e){
        res.status(404).json({message:"Organization not found", error:e})
      }
})

module.exports=organisationRouter;
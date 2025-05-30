const express = require('express');
const prismaClient  = require('../lib/prismaClient');
const { isSignedIn, isSuperAdmin, isAdmin } = require('../middlewares/userMiddlewares');
const { influxDB, bucketsAPI } = require('../db/influxDB/influx');
const axios =require('axios')
const organisationRouter=express.Router();

organisationRouter.post('/createOrganization',async(req,res)=>{
    const {name , email , address, phoneNumber , uploadImageUrl , shiftCount , unit , Department , Desingation , shifts=[] ,breaks }=req.body

    if (!name) return res.status(400).send({ message: "Name is required" });
    if (!email) return res.status(400).send({ message: "Email is required" });
    if (!phoneNumber) return res.status(400).send({ message: "Phone number is required" });
    if (!address) return res.status(400).send({ message: "address  is required" });
    // if (!shiftCount) return res.status(400).send({ message: "Shift number is required" });


    try{
      
        const org=await prismaClient.organization.create({
            data:{
                name:name,
            address:address,
            phoneNumber:phoneNumber,
            uploadImageUrl:uploadImageUrl,
            shiftCount:shiftCount,
            email:email,
            unit:unit,
            Department:Department,
            Desingation:Desingation,
            shifts: {
              create: shifts.map((shift) => ({
                start: shift.start,
                end: shift.end,
                plannedBreaks: {
                  create: shift.plannedBreaks.map((breakItem) => ({
                    start: breakItem.start,
                    end: breakItem.end,
                    typeOfBreak: breakItem.typeOfBreak,
                  })),
                },
              })),
            }
        }})

        const influxData={name:name}

        const influxResponse = await axios.post(`http://localhost:8086/api/v2/orgs`, influxData, {
                        headers: {
                            Authorization: `Token d9PzP1NDlWYBfKNQtRYkaAvo9wcL3Yptb1-h8BuM3d-prZRIuslNwKYbqIdU4I6GG-a_-qtTJYGxFClKhelipQ==`,
                            'Content-Type': 'application/json'
                        }
                    });

                   if (influxResponse.status === 201) {
                                   // Update MongoDB document with InfluxDB ID
                                   try{
                                    const influxOrgId = influxResponse.data.id;
                                   await prismaClient.organization.update({
                                    where:{
                                      id:org.id
                                    },
                                    data:{
                                      influxOrgID:influxOrgId
                                    }
                                   })
                                   
                                   return  res.status(201).json({
                                       message: 'Organization created successfully in Database and InfluxDB!',
                                       influxOrg: influxResponse.data
                                   })
                                  }catch(e){
                                    console.log(e)
                                    return res.status(500).json({
                                      message:"Internal Server Error",error:e
                                    })
                                   }

                                   
                               } else {
                                  
                                   const deletedorg=await  prismaClient.organization.delete({
                                    where:{
                                      id:org.id
                                    }
                                   })
                                   console.log("organization deleted")
                                   res.status(500).json({ message: 'Failed to create organization in InfluxDB. Organization was rolled back from DataBase.' });
                               }

        res.json({message:"Organization Created Successfully"})
    }catch(e){
        console.log(e);
        res.status(501).json({message:"Internal Server Error"})
    }
})

organisationRouter.get('/getOrganization',isSignedIn,async(req , res)=>{
    try{
      console.time("fetch")
      console.log(prismaClient)
        const Orgs=await prismaClient.organization.findMany({include:{shifts:true}});
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
          },include:{
            shifts:true
          }
        });
        res.status(200).json({organizations:Orgs , status:"success"})
      }catch(e){
        res.status(404).json({message:"Organization not found", error:e})
      }
})

module.exports=organisationRouter;
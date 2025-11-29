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

        const influxResponse = await axios.post(`http://20.198.22.6:8086/api/v2/orgs`, influxData, {
                        headers: {
                            Authorization: `Token Y__1DCnm2uTaCeqnTy2Xe6AScyzrM1zSwfrPBiXy9ZjuxEx5DAWfOz4BD-weu0NyQDeR7ig_uBaj2k8B8gKc9A==`,
                            'Content-Type': 'application/json'
                        }
                    });
console.log(influxResponse.status);
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
				       const deleteShift=await prismaClient.shiftTimings.deleteMany({
                                    where:{
                                      organizationId:org.id
                                    }
                                  })

                                  const deletedevice=await prismaClient.device.deleteMany({
                                    where:{
                                      organizationId:org.id
                                    }
                                  })
                                   const deletedorg=await  prismaClient.organization.deleteMany({
                                    where:{
                                      id:org.id
                                    }
                                   })

                                   console.log("organization deleted")
                                  return  res.status(500).json({ message: 'Failed to create organization in InfluxDB. Organization was rolled back from DataBase.' });
                               }

       return  res.json({message:"Organization Created Successfully"})
    }catch(e){
        console.log(e);
	    console.log(e);
       return res.status(501).json({message:"Internal Server Error",error:e})
    }
})

organisationRouter.get('/getOrganization',async(req , res)=>{
    try{
      console.time("fetch")
      console.log(prismaClient)
        const Orgs=await prismaClient.organization.findMany({
		 include:{
            shifts:true,
            lines:true,
            drives:true
          }
	});
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
          },
		 include:{
		shifts:{
                include:{
                  plannedBreaks:true
                }
              },
            lines:true,
            drives:true
          }

        });
        res.status(200).json({organizations:Orgs , status:"success"})
      }catch(e){
        res.status(404).json({message:"Organization not found", error:e})
      }
})

organisationRouter.put('/setStatus/:orgId',async (req, res)=>{
  try{

    const {status}=req.body;
	  if(status!=="Active" && status!=="Inactive"){
      return res.status(500).json({message:"Invalid Status , it must be Active or Inactive"})
    }
      const {orgId} = req.params
      const Orgs=await prismaClient.organization.update({
        where:{
          id:orgId
        },
        data:{
          status:status
        }
      });
      res.status(200).json({message:`Status updated to ${status}`, status:"success"})
    }catch(e){
      res.status(404).json({message:"Organization not found", error:e})
    }
})


  organisationRouter.put('/updateOrganization/:id', async (req, res) => {
    const { id } = req.params;
    const {
      name,
      email,
      address,
      phoneNumber,
      uploadImageUrl,
      shiftCount,
      unit,
      Department,
      Desingation,
      influxOrgID,
      shifts = [],
    } = req.body;
	  console.log(shifts)

    try {
      // Prepare update object only with defined fields
      const updateData = {};

      if (name !== undefined) updateData.name = name;
      if (email !== undefined) updateData.email = email;
      if (address !== undefined) updateData.address = address;
      if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;
      if (uploadImageUrl !== undefined) updateData.uploadImageUrl = uploadImageUrl;
      if (shiftCount !== undefined) updateData.shiftCount = shiftCount;
      if (unit !== undefined) updateData.unit = unit;
      if (Department !== undefined) updateData.Department = Department;
      if (Desingation !== undefined) updateData.Desingation = Desingation;
      if (influxOrgID !== undefined) updateData.influxOrgID = influxOrgID;

      // Update main organization fields
      const updatedOrg = await prismaClient.organization.update({
        where: { id },
        data: updateData,
      });

      // If shifts array is provided, update shifts
      if (shifts.length > 0) {
        // Delete existing shifts
        await prismaClient.shiftTimings.deleteMany({
          where: { organizationId: id },
        });

        // Recreate shifts
        for (const shift of shifts) {
          await prismaClient.shiftTimings.create({
            data: {
              start: shift.start,
              end: shift.end,
              organizationId: id,
              plannedBreaks: {
                create: shift.plannedBreaks.map(breakItem => ({
                  start: breakItem.start,
                  end: breakItem.end,
                  lineName:breakItem.lineName,
                  typeOfBreak: breakItem.typeOfBreak,
                })),
              },
            },
          });
        }
      }

      return res.status(200).json({
        message: 'Organization updated successfully',
        organization: updatedOrg,
      });
    } catch (error) {
      console.error('Update error:', error);
      return res.status(500).json({
        message: 'Failed to update organization',
        error: error.message,
      });
    }
  });

module.exports=organisationRouter;

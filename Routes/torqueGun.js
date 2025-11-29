const express = require('express');
const prismaClient  = require('../lib/prismaClient');

const torqueRouter=express.Router();

torqueRouter.post('/add',async(req , res)=>{
    const {torqueGunName , torqueGunMaxLimit , torqueGunMinLimit , torqueGunMaxAngle , torqueGunMinAngle , stationName}=req.body;
    console.log(req.body)

    if (!torqueGunName) return res.status(400).send({ message: "Torque Gun Name is required" });
    if (!torqueGunMaxLimit) return res.status(400).send({ message: "Torque Gun Maximum limit is required" });
    if (!torqueGunMinLimit) return res.status(400).send({ message: "Torque Gun Minimum limit is required" });
    if (!torqueGunMaxAngle) return res.status(400).send({ message: "Torque Gun Maximum Angle limit is required" });
    if (!torqueGunMinAngle) return res.status(400).send({ message: "Torque Gun Minimum Angleis required" });
    if (!stationName) return res.status(400).send({ message: "StationName is  required" });

    const station=await prismaClient.station.findFirst({
        where:{
            name:stationName
        }
    })
    
try{
    console.time("torqueGun creation")
    const torqueGun=await prismaClient.torqueGun.create({
        data:{
            torqueGunMaxAngle:torqueGunMaxAngle,
            torqueGunName:torqueGunName,
            torqueGunMinAngle:torqueGunMinAngle,
            torqueGunMaxLimit:torqueGunMaxLimit,
            torqueGunMinLimit:torqueGunMinLimit,
            stationId:station.id
        }
    })

    console.timeEnd("torqueGun creation")
    res.json({message:"TorqueGun Created Successfully",torqueGun})
}catch(e){
    console.log(e);
    return res.status(400).send({message:"Internal Server Error " , status:"fail" , error :e})

}

})



torqueRouter.get('/getAll',async(req , res)=>{

    
try{
    console.time("torqueGun get")
    const torqueGuns=await prismaClient.torqueGun.findMany({
        include:{
            station:true
        }
    });

    console.timeEnd("torqueGun get")
    return res.json({status:"pass", torqueGuns:torqueGuns})
}catch(e){
    console.log(e);
    return res.status(400).send({message:"Internal Server Error " , status:"fail" , error :e})

}



})



torqueRouter.get('/getAll/:orgId',async(req , res)=>{
    const {orgId}=req.params

    
    try{
        console.time("torqueGun get")

       
        const torqueGuns=await prismaClient.torqueGun.findMany({
           where:{
            station:{
                line:{
                    organization:{
                        id:orgId
                    }
                }
            }
           },
           include:{
            station:true
           }
        });
    
        console.timeEnd("torqueGun get")
        return res.json({status:"pass", torqueGuns:torqueGuns})
    }catch(e){
        console.log(e);
        return res.status(400).send({message:"Internal Server Error " , status:"fail" , error :e})
    
    }
    
    
    
    })





torqueRouter.put('/setStatusTorque/:torqueGunId',async (req, res)=>{
    try{
      const {status}=req.body;
      if(!status || status!=="Active" && status!=="Inactive"){
        return res.status(500).json({message:"Invalid Status , it must be Active or Inactive"})
      }
        const {torqueGunId} = req.params
        const Orgs=await prismaClient.torqueGun.update({
          where:{
            torqueGunId:torqueGunId
          },
          data:{
            status:status
          }
        });
        res.status(200).json({message:`Status updated to ${status}`, status:"success"})
      }catch(e){
        res.status(404).json({message:"torqueGun not found", error:e})
      }
  })

module.exports=torqueRouter;

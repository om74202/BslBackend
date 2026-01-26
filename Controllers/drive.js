const prismaClient  = require('../lib/prismaClient');

const addDrive=async(req , res)=>{
    const {driveName , organizationId , currentMaxLimit , currentMinLimit , voltageMaxLimit , voltageMinLimit , frequencyMaxLimit , frequencyMinLimit}=req.body

    if (!driveName) return res.status(400).send({ message: "Drive Name is required" });
    if (!currentMaxLimit) return res.status(400).send({ message: "Current Maximum limit is required" });
    if (!currentMinLimit) return res.status(400).send({ message: "Current  Minimum value is required" });
    if (!voltageMaxLimit) return res.status(400).send({ message: "Voltage Maximum  limit is required" });
    if (!voltageMinLimit) return res.status(400).send({ message: "voltage  Minimum value  required" });
    if (!organizationId) return res.status(400).send({ message: "Organization ID is  required" });

    const existingDrive=await prismaClient.drive.findFirst({
        where:{
            driveName:driveName
        }
    })
    if(existingDrive){
        return res.status(400).send({message:"Please give the Drive a unique name " , status:"fail"})
    }

    try{
        const drive=await prismaClient.drive.create({
            data:{
                driveName:driveName,
                currentMaxLimit:currentMaxLimit,
                currentMinLimit:currentMinLimit,
                voltageMaxLimit:voltageMaxLimit,
                voltageMinLimit:voltageMinLimit,
                organizationId:organizationId,
                frequencyMaxLimit:frequencyMaxLimit,
                frequencyMinLimit:frequencyMinLimit
            }
        })

        res.json({status:"pass", message:"Drive created Successfully",drive})
    }catch(e){
        console.log(e)
        return res.status(400).send({message:" Internal Server Error" , status:"fail" , error :e})
        
    }

}


const getAllDrives=async(req ,res)=>{
    try{
        const drives=await prismaClient.drive.findMany();

        return res.json({message:"Get All drives Successfull",drives})
    }catch(e){
        return res.status(400).send({message:" Internal Server Error" , status:"fail" , error :e})

    }
}


const getAllDrivesByOrgId=async(req ,res)=>{
    const {orgId}=req.params
    try{
        const drives=await prismaClient.drive.findMany({
            where:{
                organizationId:orgId
            }
        });

        return res.json({message:"Get All drives Successfull",drives:drives})
    }catch(e){
        return res.status(400).send({message:" Internal Server Error" , status:"fail" , error :e})

    }
}

const setDriveStatus=async (req, res)=>{
    try{
      const {status}=req.body;
      if(!status || status!=="Active" && status!=="Inactive"){
        return res.status(500).json({message:"Invalid Status , it must be Active or Inactive"})
      }
        const {driveId} = req.params
        const Orgs=await prismaClient.drive.update({
          where:{
            driveId:driveId
          },
          data:{
            status:status
          }
        });
        res.status(200).json({message:`Status updated to ${status}`, status:"success"})
      }catch(e){
        res.status(404).json({message:"drive not found", error:e})
      }
  }
module.exports={addDrive,getAllDrives,getAllDrivesByOrgId,setDriveStatus}
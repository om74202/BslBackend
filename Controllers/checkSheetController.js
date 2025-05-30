const prismaClient = require("../lib/prismaClient")



const addTemplate=async (req , res)=>{
    const {checksheetName="new2" , organizationId="b5a19199-e724-4864-ae29-a90c841a9e7b"  , checksheetType="Template"}=req.body
    const file=req.file;

    if (!file) return res.status(400).send("No file uploaded");
    if (!checksheetName) return res.status(400).send("Name for checksheet is required")
    if (!checksheetType) return res.status(400).send("checksheet Type  is required")
    if (!organizationId) return res.status(400).send("Organization ID  for checksheet is required")

    try{
        const checksheet=await prismaClient.checksheet.create({
            data:{
                checksheetName:checksheetName,
                checksheetType:checksheetType,
                organizationId:organizationId,
                checksheetData:file.buffer
            }
        })
    
        res.status(201).json({ message: "Checksheet uploaded", checksheet });
    }catch(e){
        res.status(500).json({message:"Internal Server Error",error:e})
    }
    
}





const getTemplate=async(req , res)=>{
    const { organizationId , checksheetName} = req.params;
   if(!organizationId) return res.status(500).json({message:"Organization Id required"})
    if(!checksheetName) return res.status(500).json({message:"Name required"})


    try{
        const pdf = await prismaClient.checksheet.findFirst({
            where:{
                checksheetName:checksheetName,
                organizationId:organizationId
            }
        });
      
        if (!pdf) return res.status(404).send('Not found');
      
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${pdf.checksheetName}.pdf"`);
        res.send(pdf.checksheetData);
    }catch(e){
        console.log(e)
        return res.status(500).json({message:"Internal Server Errro",error:e})
    }
}



module.exports={addTemplate , getTemplate}
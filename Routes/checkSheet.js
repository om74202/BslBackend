const express = require('express');
const prismaClient  = require('../lib/prismaClient');

const checkSheetRoute=express.Router();


checkSheetRoute.post('/add/:organizationId', async (req, res) => {
	console.log(prismaClient)
  try {
	  const {organizationId}=req.params
    const {
      name,
	    userId,
      data: {
        tableData = [],
        cellProperties = {},
        cellStyles = {}
      } = {}
    } = req.body;

    const newTable = await prismaClient.checksheetTable.create({
      data: {
        name,
        organizationId,
        tableData,
        cellProperties,
        cellStyles,
	      userId
      }
    });

    return res.status(201).json({ success: true, table: newTable });
  } catch (err) {
    console.error("Error adding table:", err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

checkSheetRoute.post('/submission/add/:orgId', async (req, res) => {
  try {
    const {orgId}=req.params
    const organizationId=orgId
    const {
	    location="",
	    line="",
	    shift="",
      name,
     // optional
     userId, 
      data: {
        tableData = [],
        cellProperties = {},
        cellStyles = {}
      } = {}
    } = req.body;

    const newTable = await prismaClient.submission.create({
      data: {
        name,
        organizationId,
        tableData,
        cellProperties,
        cellStyles,
        userId,
	      location,
	      line,
	      shift
      }
    });

    return res.status(201).json({ success: true, table: newTable });
  } catch (err) {
    console.error("Error adding table:", err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});


checkSheetRoute.put('/submission/update/:submissionId', async (req, res) => {
  try {
    const { submissionId } = req.params;
    const {
      data: {
        tableData = [],
        cellProperties = {},
        cellStyles = {}
      } = {}
    } = req.body;

    // Check if submission exists
    const existing = await prismaClient.submission.findUnique({
      where: { id: submissionId }
    });

    if (!existing) {
      return res.status(404).json({ success: false, error: 'Submission not found' });
    }

    const updatedTable = await prismaClient.submission.update({
      where: { id: submissionId },
      data: {
        tableData,
        cellProperties,
        cellStyles
      }
    });

    return res.status(200).json({ success: true, table: updatedTable });
  } catch (err) {
    console.error("Error updating table:", err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});


checkSheetRoute.get('/submissions', async (req, res) => {
  try {

    const submissions = await prismaClient.submission.findMany();

    // const uniqueTables = submissions.map(sub => sub.table);

    return res.status(200).json(submissions);
  } catch (err) {
    console.error("Error fetching tables for user:", err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});





checkSheetRoute.get('/submissions/:orgId', async (req, res) => {
  try {
    const { orgId} = req.params;

    const submissions = await prismaClient.submission.findMany({
      where: { organizationId:orgId },
      include: {
        user:{
          select:{
            name:true
          }
        }
      }
    });

    return res.status(200).json(submissions);
  } catch (err) {
    console.error("Error fetching tables for user:", err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

checkSheetRoute.get('/submissionsByUser/:id', async (req, res) => {
  try {
    const { id} = req.params;
    const user=await prismaClient.user.findUnique({
      where:{
        id:id
      }
    })
let userName;
    if(user){
      userName=user.name;
    }else{
      return res.status(5000).json({message:"User not found"})
    }

    const submissions = await prismaClient.submission.findMany({
      where: { userId:id},
	    include:{
        user:{
          select:{
            name:true
          }
        }
      }
    });
	  
    return res.status(200).json(submissions);
  } catch (err) {
    console.error("Error fetching tables for user:", err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});




checkSheetRoute.get('/submissionsById/:id', async (req, res) => {
  try {
    const { id} = req.params;



    const submission = await prismaClient.submission.findMany({
      where: { id:id},
      include:{
        user:{
          select:{
            name:true
          }
        }
      }
    });
    return res.status(200).json(submission);
  } catch (err) {
    console.error("Error fetching tables for user:", err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});



checkSheetRoute.put('/setStatus/:submissionId', async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { status,comment="" } = req.body;

    // Allow only "accept" or "reject"

    // Update the submission
    const updatedSubmission = await prismaClient.submission.update({
      where: { id:submissionId},
      data: { status:status ,comment:comment},
    });

    return res.status(200).json({
      success: true,
      message: `Submission status updated to "${status}".`,
      submission: updatedSubmission,
    });
  } catch (err) {
    console.error("Error updating submission status:", err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
});


checkSheetRoute.get("/getTables/:orgId", async (req, res) => {
const {orgId}=req.params
  try {
    
    const tables = await prismaClient.checksheetTable.findMany({
      where:{
        organizationId:orgId
      },
      include:{
        user:{
          select:{
            name:true
          }
        }
      }
    });

    return res.status(200).json(tables);
  } catch (error) {
    console.error("Error fetching tables:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

checkSheetRoute.get("/getTableById/:id", async (req, res) => {
  const {id}=req.params
    try {
      
      const tables = await prismaClient.checksheetTable.findUnique({
       where:{
        id:id
       }
      });
  
      return res.status(200).json(tables);
    } catch (error) {
      console.error("Error fetching tables:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });


  checkSheetRoute.get("/getTablesByUserId/:id", async (req, res) => {
    const {id}=req.params
      try {
        
        const tables = await prismaClient.checksheetTable.findMany({
          where:{
            userId:id
          },
          include:{
            user:{
              select:{
                name:true
              }
            }
          }
        });
    
        return res.status(200).json(tables);
      } catch (error) {
        console.error("Error fetching tables:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    });
    





 checkSheetRoute.delete("/deleteTableById/:id", async (req, res) => {
    const {id}=req.params
      try {
        
        const tables = await prismaClient.checksheetTable.delete({
         where:{
          id:id
         }
        });
    
        return res.status(200).json("Table deleted successfully",tables);
      } catch (error) {
        console.error("Error fetching tables:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    });

// checkSheetRoute.post('/addData',async(req , res)=>{})

// checkSheetRoute.get('/getData',async(req , res)=>{})


module.exports=checkSheetRoute;






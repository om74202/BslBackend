const prismaClient = require("../lib/prismaClient")


const addChecksheet=async (req, res) => {
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
}



const submitChecksheet=async (req, res) => {
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
}


const updateSubmission=async (req, res) => {
  try {
    const { submissionId } = req.params;
    const {
	    status="Pending",
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
	      status:status,
        cellProperties,
        cellStyles
      }
    });

    return res.status(200).json({ success: true, table: updatedTable });
  } catch (err) {
    console.error("Error updating table:", err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}



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

const getSubmission=async (req, res) => {
  try {

    const submissions = await prismaClient.submission.findMany();

    // const uniqueTables = submissions.map(sub => sub.table);

    return res.status(200).json(submissions);
  } catch (err) {
    console.error("Error fetching tables for user:", err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

const getSubmissionByOrgId=async (req, res) => {
  try {
    const { orgId } = req.params;
    const { startTime, endTime } = req.query;

    // Convert ISO strings to JS Date objects if provided
    const start = startTime ? new Date(startTime) : null;
    const end = endTime ? new Date(endTime) : null;

    // Construct dynamic where clause
    const whereClause = {
      organizationId: orgId
    };

    if (start && end) {
      whereClause.createdAt = {
        gte: start,
        lte: end
      };
    } else if (start) {
      whereClause.createdAt = {
        gte: start
      };
    } else if (end) {
      whereClause.createdAt = {
        lte: end
      };
    }

    const submissions = await prismaClient.submission.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            name: true
          }
        }
      }
    });

    return res.status(200).json(submissions);
  } catch (err) {
    console.error("Error fetching submissions:", err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

const getStatusCounts=async (req, res) => {
  try {
    const {orgId}=req.params;
    const submissions = await prismaClient.submission.findMany({
      where:{
        organizationId:orgId
      },select: {
        status: true
      }
    });

    const counts = {
      Pending: 0,
      Approved: 0,
      Rejected: 0
    };

    for (const sub of submissions) {
      if (sub.status === 'Pending') counts.Pending += 1;
      else if (sub.status === 'Approved') counts.Approved += 1;
      else if (sub.status === 'Rejected') counts.Rejected += 1;
    }

    return res.status(200).json({ success: true, counts });
  } catch (err) {
    console.error("Error fetching status counts:", err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
const getSubmissionByUserId=async (req, res) => {
  try {
    const { id } = req.params;
    const { startTime, endTime } = req.query; // Accept from query string

    // Find user by ID
    const user = await prismaClient.user.findUnique({
      where: { id }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Convert time strings to Date if provided
    const start = startTime ? new Date(startTime) : null;
    const end = endTime ? new Date(endTime) : null;

    // Dynamic where clause
    const whereClause = {
      userId: id,
      ...(start || end ? {
        createdAt: {
          ...(start && { gte: start }),
          ...(end && { lte: end }),
        }
      } : {})
    };

    const submissions = await prismaClient.submission.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            name: true
          }
        }
      }
    });

    return res.status(200).json(submissions);
  } catch (err) {
    console.error("Error fetching submissions:", err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}


const getSubmissionById=async (req, res) => {
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
}

const setStatusSubmission=async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { status,comment="" ,ApprovedBy} = req.body;

    // Allow only "accept" or "reject"

    // Update the submission
    if(!ApprovedBy){
      return res.json({message:"please send Approving user's id "})
    }
    const user=await prismaClient.user.findUnique({
      where:{
        id:ApprovedBy
      }
    })
    const name=user.name;
    const updatedSubmission = await prismaClient.submission.update({
      where: { id:submissionId},
      data: { status:status ,comment:comment , ApprovedBy:name},
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
}

const getTables=async (req, res) => {
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
}

const getTableById=async (req, res) => {
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
  }

  const getTableByUserId=async (req, res) => {
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
    }


    const deleteTableById= async (req, res) => {
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
    }
module.exports={updateSubmission,addTemplate , getTemplate,addChecksheet,submitChecksheet,getSubmission,getSubmissionByOrgId,getTableById,getTableByUserId,deleteTableById,getTableById,setStatusSubmission,getStatusCounts,getSubmissionByUserId,getSubmissionById,getTables}
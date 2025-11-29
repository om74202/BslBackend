const express = require('express');
const prismaClient  = require('../lib/prismaClient');

const maintenanceRouter=express.Router();






// Create maintenance
// Update maintenance by ID

maintenanceRouter.post('/createMessage', async (req, res) => {
  try {
    const {
      description,
      line,
      userId,
      startingTime,
    } = req.body;


    const user=await prismaClient.user.findUnique({
      where:{
        id:userId
      }
    })
    const currline=await prismaClient.line.findFirst({
      where:{
        lineName:line
      }
    })

    const maintenanceData = {
      message: description,
      createdBy: user.name,
      status: 'open',
      lineId: currline.lineId,
    };
    
    // Only set startTime and endTime if provided
    if (startingTime) maintenanceData.startTime = startingTime;

    const maintenance = await prismaClient.maintenance.create({
      data: maintenanceData,
    });

    res.status(201).json(maintenance);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create maintenance', details: error.message });
  }
});


maintenanceRouter.put('/update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      message,
      userId,
      lineId
    } = req.body;
const user=await prismaClient.user.findUnique({
        where:{
          id:userId
        }
      })
    const maintenance = await prismaClient.maintenance.update({
      where: { id },
      data: {
        message,
        approvedBy:user.name,
        lineId
      }
    });

    res.json(maintenance);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update maintenance', details: error.message });
  }
});

// Change status only
maintenanceRouter.put('/status/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, userId,reviewComment } = req.body;

    const user=await prismaClient.user.findUnique({
      where:{
        id:userId
      }
    })

    const maintenance = await prismaClient.maintenance.update({
      where: { id },
      data: {
        status,
        reviewComment:reviewComment,
        approvedBy:user.name
      }
    });

    res.json(maintenance);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update status', details: error.message });
  }
});


 maintenanceRouter.get('/byUser/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const user=await prismaClient.user.findUnique({
        where:{
          id:userId
        }
      })
      const maintenance = await prismaClient.maintenance.findMany({
        where:{
            createdBy:user.name
        },
        include:{
          line:{
            select:{
              lineName:true
            }
          }
        }
      });
  
      res.json(maintenance);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update status', details: error.message });
    }
  });

maintenanceRouter.get('/:orgId', async (req, res) => {
    try {
      const { orgId } = req.params;

      const maintenance = await prismaClient.maintenance.findMany({
        where:{
            line:{
                    is:{
                  organizationId:orgId
                }
            }
        },
        include:{
          line:{
            select:{
              lineName:true
            }
          }
        }
      });

      res.json(maintenance);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update status', details: error.message });
    }
  });





module.exports=maintenanceRouter;

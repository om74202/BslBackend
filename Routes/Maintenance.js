const express = require('express');
const prismaClient  = require('../lib/prismaClient');
const { getMaintenanceByOrgId, getMaintenanceByUser, updateMaintenanceStatus, updateMaintenance, createMaintenance } = require('../Controllers/Maintenance');

const maintenanceRouter=express.Router();






// Create maintenance
// Update maintenance by ID

maintenanceRouter.post('/createMessage', createMaintenance);


maintenanceRouter.put('/update/:id', updateMaintenance);

// Change status only
maintenanceRouter.put('/status/:id', updateMaintenanceStatus);


 maintenanceRouter.get('/byUser/:userId', getMaintenanceByUser);

maintenanceRouter.get('/:orgId', getMaintenanceByOrgId);





module.exports=maintenanceRouter;

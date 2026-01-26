const express = require('express');
const prismaClient  = require('../lib/prismaClient');
const { addDrive, getAllDrives, getAllDrivesByOrgId, setDriveStatus } = require('../Controllers/drive');

const driveRouter=express.Router();

driveRouter.post('/add',addDrive)


driveRouter.get('/getAll',getAllDrives)

driveRouter.get('/getAll/:orgId',getAllDrivesByOrgId)


driveRouter.put('/setStatusDrive/:driveId',setDriveStatus)


module.exports=driveRouter

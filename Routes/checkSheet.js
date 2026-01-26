const express = require('express');
const prismaClient  = require('../lib/prismaClient');
const { addChecksheet, submitChecksheet, updateSubmission, getSubmission, getSubmissionByOrgId, setStatusSubmission, getSubmissionByUserId, getSubmissionById, getStatusCounts, getTables, getTableById, getTableByUserId, deleteTableById } = require('../Controllers/checkSheetController');

const checkSheetRoute=express.Router();


checkSheetRoute.post('/add/:organizationId', addChecksheet);

checkSheetRoute.post('/submission/add/:orgId', submitChecksheet);


checkSheetRoute.put('/submission/update/:submissionId', updateSubmission);


checkSheetRoute.get('/submissions', getSubmission);





checkSheetRoute.get('/submissions/:orgId', getSubmissionByOrgId);




checkSheetRoute.get('/submission/status-counts/:orgId',getStatusCounts);

checkSheetRoute.get('/submissionsByUser/:id', getSubmissionByUserId );




checkSheetRoute.get('/submissionsById/:id', getSubmissionById);




checkSheetRoute.put('/setStatus/:submissionId', setStatusSubmission);

checkSheetRoute.get("/getTables/:orgId", getTables);

checkSheetRoute.get("/getTableById/:id", getTableById);


  checkSheetRoute.get("/getTablesByUserId/:id", getTableByUserId);
    





 checkSheetRoute.delete("/deleteTableById/:id",deleteTableById);

// checkSheetRoute.post('/addData',async(req , res)=>{})

// checkSheetRoute.get('/getData',async(req , res)=>{})


module.exports=checkSheetRoute;






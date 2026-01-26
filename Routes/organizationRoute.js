const express = require('express');
const prismaClient  = require('../lib/prismaClient');
const organisationRouter=express.Router();
const {createOrganization, updateOrganization, getOrganizations, getOrganizationById, updateOrganizationStatus}=require('../Controllers/organizationControllers.js');

organisationRouter.post('/createOrganization',createOrganization)

organisationRouter.get('/getOrganization',getOrganizations)

organisationRouter.get('/getOrganization/:orgId',getOrganizationById)

organisationRouter.put('/setStatus/:orgId',updateOrganizationStatus)


  organisationRouter.put('/updateOrganization/:id',updateOrganization);

module.exports=organisationRouter;

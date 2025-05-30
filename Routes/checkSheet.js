const express = require('express');
const prismaClient  = require('../lib/prismaClient');
const {addTemplate , getTemplate} = require('../Controllers/checkSheetController');

const checkSheetRoute=express.Router();

checkSheetRoute.post('/addTemplate',addTemplate);


checkSheetRoute.get('/getTemplate/:checksheetName/:organizationId',getTemplate);


checkSheetRoute.post('/addData',async(req , res)=>{})

checkSheetRoute.get('/getData',async(req , res)=>{})


module.exports=checkSheetRoute;
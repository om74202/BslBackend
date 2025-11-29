const express=require("express")
const { createIdealParameter, updateIdealParameter, getIdealParameters } = require("../Controllers/IdealParams");

const idealParamRoute=express.Router();

idealParamRoute.post(`/save`,createIdealParameter)

idealParamRoute.put(`/update`,updateIdealParameter)

idealParamRoute.get(`/getAll`,getIdealParameters);

module.exports=idealParamRoute

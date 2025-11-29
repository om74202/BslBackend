const express =require("express");
const { createDowntime, updateDowntime, deleteDowntime, getDowntime ,addDowntimeReason, updateOptions, getAllReasons} = require("../Controllers/downtime");

const downtimeRouter=express.Router();


downtimeRouter.post("/save", createDowntime);
downtimeRouter.put("/update/:id", updateDowntime);
downtimeRouter.delete("/delete/:id", deleteDowntime);
downtimeRouter.get(`/getAll/:date/:shift`,getDowntime);

downtimeRouter.post(`/reason/save`,addDowntimeReason);
downtimeRouter.put(`/reason/update/:name`,updateOptions);
downtimeRouter.get(`/reason/getAll`,getAllReasons);


module.exports=downtimeRouter

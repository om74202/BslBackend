const express = require('express');
const { getShiftLogBook, createShiftLogBook, updateShiftLogBook, upsertShiftLogBook, submitShiftLogBook } = require('../Controllers/ShiftLogBook');

const shiftLogBookRouter = express.Router();

shiftLogBookRouter.get("/", getShiftLogBook);
shiftLogBookRouter.post("/",  createShiftLogBook);
shiftLogBookRouter.put("/", updateShiftLogBook);
shiftLogBookRouter.post("/upsert", upsertShiftLogBook);
shiftLogBookRouter.put("/submit",  submitShiftLogBook);

module.exports = shiftLogBookRouter;



const express = require('express');
const prismaClient  = require('../lib/prismaClient');
const { updateTargetJPH, getTargetJPHUpdateHistory, getJphHistoryForShift, createLine, getLinesByOrgId, getLines, setLinesStatus, getStationByOrgId } = require('../Controllers/lineController');

const LineRouter=express.Router();

LineRouter.post('/createLine',createLine)

LineRouter.get('/getLines',getLines)

LineRouter.get('/getLines/:orgId',getLinesByOrgId)


LineRouter.get('/getStation/:orgId',getStationByOrgId)



LineRouter.put('/setStatusLine/:lineId',setLinesStatus)

LineRouter.patch('/update-jph',updateTargetJPH)

LineRouter.get(`/jph-history/`,getTargetJPHUpdateHistory)
LineRouter.get(`/jph-history/shift`,getJphHistoryForShift)

module.exports=LineRouter;

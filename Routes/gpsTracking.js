const express = require('express');
const { createTruck, updateTruck, getAllTrucks, getLiveTrucks, getTrucksSummaryByDate, getTripsForTruckByDate, getPsnCardsNotDepartedAfterPsn, movePsnBetweenRfids } = require('../Controllers/gpsTracking');

const gpsTrackingRouter=express.Router()

gpsTrackingRouter.post(`/truck`,createTruck)
gpsTrackingRouter.patch(`/psn-move`,movePsnBetweenRfids)

gpsTrackingRouter.get(`/live/truck`,getLiveTrucks)
gpsTrackingRouter.put(`/truck`,updateTruck)
gpsTrackingRouter.get(`/truck`,getAllTrucks)
gpsTrackingRouter.get(`/trucks/summary`,getTrucksSummaryByDate)
gpsTrackingRouter.get(`/trucks/:truckId/trips`, getTripsForTruckByDate)
gpsTrackingRouter.get(`/psn-not-departed-trucks`,getPsnCardsNotDepartedAfterPsn)


module.exports=gpsTrackingRouter


const express = require('express');
const { createTruck, updateTruck, getAllTrucks, getLiveTrucks, getTrucksSummaryByDate, getTripsForTruckByDate } = require('../Controllers/gpsTracking');

const gpsTrackingRouter=express.Router()

gpsTrackingRouter.post(`/truck`,createTruck)
gpsTrackingRouter.get(`/live/truck`,getLiveTrucks)
gpsTrackingRouter.put(`/truck`,updateTruck)
gpsTrackingRouter.get(`/truck`,getAllTrucks)
gpsTrackingRouter.get(`/trucks/summary`,getTrucksSummaryByDate)
gpsTrackingRouter.get(`/trucks/:truckId/trips`, getTripsForTruckByDate)

module.exports=gpsTrackingRouter





const express = require("express");

const influxRouter = express.Router();

const {
  getDowntimeReportByLineDateShiftCumulative,
  getSingleTorqueGun,
  getAllTorqueGuns,
  getSingleDrive,
  getQualityData,
  getLineData,
  getPlantData,
  getCeoQualityData,
  getCeoTorqueData,
  getRunningSeatData,
  getCeoSeatProductionData,
  getCeoData,
  getPlantReportDate,
  getPlantReportDateRange,
  getAllDrivesData,
  getPerformanceReportPdf,
} = require("../Controllers/influxControllers.js");


// moved out (email/alert logic)

// moved out (shift timing helper)
const { checkRunModeAndSendAlerts, sendBitEmails } = require("../functions/emailFunctions.js");

// -------- Routes (unchanged) --------

influxRouter.get("/SingleTorqueGun/data/:shift/:date/:torquegunName/:station", getSingleTorqueGun);
influxRouter.get("/torqueGun/data/:shift/:date", getAllTorqueGuns);

influxRouter.get("/SingleDrive/data/:drive/:shift/:date", getSingleDrive);
influxRouter.get("/drive/data/:shift/:date", getAllDrivesData);

influxRouter.get("/Quality/data/:line/:shift/:date", getQualityData);

influxRouter.get("/line/data/:line/:shift/:date", getLineData);

influxRouter.get("/Plant/data/:shift/:date", getPlantData);

influxRouter.get("/ceo/:date/:line/:field", getCeoData);
influxRouter.get("/ceo/seatProduction/:shift", getCeoSeatProductionData);
influxRouter.get("/ceo/runningSeat/:shift", getRunningSeatData);
influxRouter.get("/ceo/torqueGun/:station/:torqueGun/:date/:shift", getCeoTorqueData);
influxRouter.get("/ceo/qualityReview/:line/:date/:shift", getCeoQualityData);

influxRouter.get("/plantReportRange/:shift/:date", getPlantReportDateRange);
influxRouter.get("/plantReport/:shift/:date", getPlantReportDate);

influxRouter.get("/performance-report", getPerformanceReportPdf);

// Manual trigger (unchanged behavior)
influxRouter.post("/check-runmode", async (req, res) => {
  await checkRunModeAndSendAlerts();
  res.status(200).json({ message: "Triggered check manually." });
});

// Keep the same exports as before
module.exports = { influxRouter, sendBitEmails };













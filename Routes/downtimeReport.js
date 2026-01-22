const express = require("express");
const {
  getDowntimeReportByLineDateShift,
  createDowntimeReport,
  updateDowntimeReportById,
  updateDowntimeReportByLineDateShift,
  getJPHReportRows,
} = require("../Controllers/downtimeReport");

const downtimeReportRouter = express.Router();

downtimeReportRouter.get("/", getDowntimeReportByLineDateShift);
downtimeReportRouter.post("/", createDowntimeReport);
downtimeReportRouter.put("/:id", updateDowntimeReportById);
downtimeReportRouter.put("/by-key", updateDowntimeReportByLineDateShift);
downtimeReportRouter.get("/unSubmitted-report/:date/:line/:shift",getJPHReportRows);

module.exports = downtimeReportRouter;


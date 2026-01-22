const express = require("express");
const {
  createPlannedShutdown,
  updatePlannedShutdown,
	getPlannedVsUnplannedMinutes,
  deletePlannedShutdown,
  getAllPlannedShutdowns,
  getPlannedShutdownById,
  getPlannedShutdownUpdateHistory,
} = require("../Controllers/plannedShutdown");

const plannedShutdownRouter = express.Router();
plannedShutdownRouter.get("/planned-vs-unplanned", getPlannedVsUnplannedMinutes);


plannedShutdownRouter.post("/", createPlannedShutdown);
plannedShutdownRouter.put("/:id", updatePlannedShutdown);
plannedShutdownRouter.delete("/:id", deletePlannedShutdown);
plannedShutdownRouter.get("/", getAllPlannedShutdowns);
plannedShutdownRouter.get("/history", getPlannedShutdownUpdateHistory);
plannedShutdownRouter.get("/:id", getPlannedShutdownById);

module.exports = plannedShutdownRouter;


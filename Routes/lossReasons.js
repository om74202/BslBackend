const express = require("express");
const {
  createProductionLossReason,
  updateProductionLossReason,
  getAllProductionLossReasons,
  deleteProductionLossReason,
	getLossParetoSingleLine,
  getLossReasonCounts,
} = require("../Controllers/lossReasons.js");

const lossReasonsRouter = express.Router();

lossReasonsRouter.post("/", createProductionLossReason);
lossReasonsRouter.put("/:id", updateProductionLossReason);
lossReasonsRouter.get("/", getAllProductionLossReasons);
lossReasonsRouter.get(`/getLossCount`,getLossReasonCounts)
lossReasonsRouter.get(`/loss-reason-report`,getLossParetoSingleLine)
lossReasonsRouter.delete("/:id", deleteProductionLossReason);

module.exports = lossReasonsRouter;


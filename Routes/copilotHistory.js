const express = require("express");
const {
  listConversations,
  getConversation,
  getTurn,
  saveTurn,
  deleteConversation,
  clearConversations,
} = require("../Controllers/copilotHistory");

const copilotHistoryRouter = express.Router();

copilotHistoryRouter.get("/", listConversations);
copilotHistoryRouter.post("/turns", saveTurn);
copilotHistoryRouter.delete("/", clearConversations);
copilotHistoryRouter.get("/turns/:turnId", getTurn);
copilotHistoryRouter.get("/:sessionId", getConversation);
copilotHistoryRouter.delete("/:sessionId", deleteConversation);

module.exports = copilotHistoryRouter;

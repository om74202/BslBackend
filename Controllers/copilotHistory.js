const prismaClient = require("../lib/prismaClient");

const CONVERSATION_FIELDS = ["id", "sessionId", "title", "context", "userId", "organizationId", "createdAt", "updatedAt"];
const TURN_FIELDS = ["id", "conversationId", "question", "response", "queries", "createdAt"];

function selectFields(value, allowedFields, defaultFields) {
  const fields = typeof value === "string" && value.trim()
    ? value.split(",").map((field) => field.trim()).filter(Boolean)
    : defaultFields;
  const invalidFields = fields.filter((field) => !allowedFields.includes(field));
  if (invalidFields.length) return { error: `Unsupported fields: ${invalidFields.join(", ")}` };
  return { select: Object.fromEntries([...new Set(fields)].map((field) => [field, true])) };
}

const getUser = (req) => {
  if (!req.user?.id) return null;
  return prismaClient.user.findUnique({
    where: { id: String(req.user.id) },
    select: { id: true, organizationId: true },
  });
};

const listConversations = async (req, res) => {
  try {
    const user = await getUser(req);
    const fields = selectFields(req.query.fields, CONVERSATION_FIELDS, ["sessionId", "title", "createdAt", "updatedAt"]);
    if (!user) return res.status(401).json({ message: "User not found" });
    if (fields.error) return res.status(400).json({ message: fields.error });

    const conversations = await prismaClient.copilotConversation.findMany({
      where: { userId: user.id },
      select: fields.select,
      orderBy: { updatedAt: "desc" },
      take: 100,
    });

    return res.json({ conversations });
  } catch (error) {
    console.error("listCopilotConversations:", error);
    return res.status(500).json({ message: "Failed to load Copilot conversations" });
  }
};

const getConversation = async (req, res) => {
  try {
    const user = await getUser(req);
    const fields = selectFields(req.query.fields, CONVERSATION_FIELDS, CONVERSATION_FIELDS);
    const turnFields = selectFields(req.query.turnFields, TURN_FIELDS, ["id", "question", "response", "queries", "createdAt"]);
    if (!user) return res.status(401).json({ message: "User not found" });
    if (fields.error || turnFields.error) return res.status(400).json({ message: fields.error || turnFields.error });

    const conversation = await prismaClient.copilotConversation.findFirst({
      where: { sessionId: req.params.sessionId, userId: user.id },
      select: {
        ...fields.select,
        turns: { select: turnFields.select, orderBy: { createdAt: "asc" } },
      },
    });

    if (!conversation) return res.status(404).json({ message: "Conversation not found" });
    return res.json({ conversation });
  } catch (error) {
    console.error("getCopilotConversation:", error);
    return res.status(500).json({ message: "Failed to load Copilot conversation" });
  }
};

const getTurn = async (req, res) => {
  try {
    const user = await getUser(req);
    const fields = selectFields(req.query.fields, TURN_FIELDS, TURN_FIELDS);
    if (!user) return res.status(401).json({ message: "User not found" });
    if (fields.error) return res.status(400).json({ message: fields.error });

    const turn = await prismaClient.copilotTurn.findFirst({
      where: { id: req.params.turnId, conversation: { userId: user.id } },
      select: fields.select,
    });

    if (!turn) return res.status(404).json({ message: "Copilot turn not found" });
    return res.json({ turn });
  } catch (error) {
    console.error("getCopilotTurn:", error);
    return res.status(500).json({ message: "Failed to load Copilot turn" });
  }
};

const saveTurn = async (req, res) => {
  try {
    const user = await getUser(req);
    const { sessionId, response, title, context, queries } = req.body || {};
    const question = req.body?.question ?? req.body?.query;
    if (!user) return res.status(401).json({ message: "User not found" });
    if (typeof sessionId !== "string" || !/^[A-Za-z0-9_-]{1,100}$/.test(sessionId) || typeof question !== "string" || !question.trim() || question.length > 1000 || response === null || Array.isArray(response) || typeof response !== "object") {
      return res.status(400).json({ message: "sessionId, question, and response are required" });
    }

    const existing = await prismaClient.copilotConversation.findUnique({ where: { sessionId } });
    if (existing && existing.userId !== user.id) {
      return res.status(403).json({ message: "Conversation belongs to another user" });
    }

    const turn = {
      question: question.trim(),
      response,
      ...(queries !== undefined ? { queries } : response.queries !== undefined ? { queries: response.queries } : {}),
    };
    const conversationData = {
      ...(typeof title === "string" && title.trim() ? { title: title.trim().slice(0, 160) } : {}),
      ...(context !== undefined ? { context } : {}),
    };

    const conversation = existing
      ? await prismaClient.copilotConversation.update({
          where: { id: existing.id },
          data: { ...conversationData, turns: { create: turn } },
          include: { turns: { orderBy: { createdAt: "asc" } } },
        })
      : await prismaClient.copilotConversation.create({
          data: {
            sessionId,
            title: typeof title === "string" && title.trim() ? title.trim().slice(0, 160) : question.trim().slice(0, 160),
            userId: user.id,
            organizationId: user.organizationId,
            ...conversationData,
            turns: { create: turn },
          },
          include: { turns: true },
        });

    return res.status(existing ? 200 : 201).json({ conversation });
  } catch (error) {
    console.error("saveCopilotTurn:", error);
    return res.status(500).json({ message: "Failed to save Copilot turn" });
  }
};

const deleteConversation = async (req, res) => {
  try {
    const user = await getUser(req);
    if (!user) return res.status(401).json({ message: "User not found" });

    const result = await prismaClient.copilotConversation.deleteMany({
      where: { sessionId: req.params.sessionId, userId: user.id },
    });
    if (!result.count) return res.status(404).json({ message: "Conversation not found" });
    return res.json({ success: true });
  } catch (error) {
    console.error("deleteCopilotConversation:", error);
    return res.status(500).json({ message: "Failed to delete Copilot conversation" });
  }
};

const clearConversations = async (req, res) => {
  try {
    const user = await getUser(req);
    if (!user) return res.status(401).json({ message: "User not found" });

    await prismaClient.copilotConversation.deleteMany({ where: { userId: user.id } });
    return res.json({ success: true });
  } catch (error) {
    console.error("clearCopilotConversations:", error);
    return res.status(500).json({ message: "Failed to clear Copilot conversations" });
  }
};

module.exports = { listConversations, getConversation, getTurn, saveTurn, deleteConversation, clearConversations };

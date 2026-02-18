const prismaClient = require("../lib/prismaClient");

const getUserId = (req) => {
  // adjust according to your auth payload
  return (
    req.user?.id ||
    req.user?._id ||
    req.user?.user?.id ||
    null
  );
};

const sanitizePayload = (payload) => {
  // You can harden this later if needed
  // For now, ensure it's at least an object
  if (payload == null || typeof payload !== "object") return {};
  return payload;
};


/**
 * POST /shift-log-book
 * Body: { lineId, reportDate, shift, payload, isSubmitted? }
 * Creates ONLY (fails if exists due to @@unique)
 */
const createShiftLogBook = async (req, res) => {
  try {
    const { lineId, reportDate, shift, payload, isSubmitted } = req.body;

    if (!lineId || !reportDate || !shift) {
      return res.status(400).json({
        success: false,
        message: "lineId, reportDate, shift are required",
      });
    }

    const createdBy = getUserId(req);

    const created = await prismaClient.shiftLogBook.create({
      data: {
        lineId: String(lineId),
        reportDate: String(reportDate),
        shift: String(shift),
        payload: sanitizePayload(payload),
        isSubmitted: Boolean(isSubmitted),
        createdBy: createdBy ? String(createdBy) : null,
      },
    });

    return res.status(201).json({ success: true, data: created });
  } catch (error) {
    console.error("createShiftLogBook error:", error);

    // Unique violation -> already exists
    if (error?.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "Shift log already exists for this line/date/shift",
      });
    }

    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * PUT /shift-log-book
 * Body: { lineId, reportDate, shift, payload?, isSubmitted? }
 * Updates ONLY (fails if record does not exist)
 */
const updateShiftLogBook = async (req, res) => {
  try {
    const { lineId, reportDate, shift, payload, isSubmitted } = req.body;

    if (!lineId || !reportDate || !shift) {
      return res.status(400).json({
        success: false,
        message: "lineId, reportDate, shift are required",
      });
    }

    const updated = await prismaClient.shiftLogBook.update({
      where: {
        lineId_reportDate_shift: {
          lineId: String(lineId),
          reportDate: String(reportDate),
          shift: String(shift),
        },
      },
      data: {
        payload: payload !== undefined ? sanitizePayload(payload) : undefined,
        isSubmitted: typeof isSubmitted === "boolean" ? isSubmitted : undefined,
      },
    });

    return res.json({ success: true, data: updated });
  } catch (error) {
    console.error("updateShiftLogBook error:", error);

    // Not found
    if (error?.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Shift log not found for this line/date/shift",
      });
    }

    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * POST /shift-log-book/upsert
 * Body: { lineId, reportDate, shift, payload, isSubmitted? }
 * Creates if missing, updates if exists.
 * This is what you’ll typically use for "Save Draft".
 */
const upsertShiftLogBook = async (req, res) => {
  try {
    const { lineId, reportDate, shift, payload, isSubmitted } = req.body;

    if (!lineId || !reportDate || !shift) {
      return res.status(400).json({
        success: false,
        message: "lineId, reportDate, shift are required",
      });
    }

    const createdBy = getUserId(req);

    const saved = await prismaClient.shiftLogBook.upsert({
      where: {
        lineId_reportDate_shift: {
          lineId: String(lineId),
          reportDate: String(reportDate),
          shift: String(shift),
        },
      },
      create: {
        lineId: String(lineId),
        reportDate: String(reportDate),
        shift: String(shift),
        payload: sanitizePayload(payload),
        isSubmitted: Boolean(isSubmitted),
        createdBy: createdBy ? String(createdBy) : null,
      },
      update: {
        payload: sanitizePayload(payload),
        isSubmitted: typeof isSubmitted === "boolean" ? isSubmitted : undefined,
      },
    });

    return res.json({ success: true, data: saved });
  } catch (error) {
    console.error("upsertShiftLogBook error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * PUT /shift-log-book/submit
 * Body: { lineId, reportDate, shift }
 * Marks isSubmitted=true (does not change payload)
 */
const submitShiftLogBook = async (req, res) => {
  try {
    const { lineId, reportDate, shift } = req.body;

    if (!lineId || !reportDate || !shift) {
      return res.status(400).json({
        success: false,
        message: "lineId, reportDate, shift are required",
      });
    }

    const updated = await prismaClient.shiftLogBook.update({
      where: {
        lineId_reportDate_shift: {
          lineId: String(lineId),
          reportDate: String(reportDate),
          shift: String(shift),
        },
      },
      data: {
        isSubmitted: true,
      },
    });

    return res.json({ success: true, data: updated });
  } catch (error) {
    console.error("submitShiftLogBook error:", error);

    if (error?.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Shift log not found for this line/date/shift",
      });
    }

    return res.status(500).json({ success: false, message: "Server error" });
  }
};


const getShiftLogBook = async (req, res) => {
  try {
    const { lineId, reportDate, shift } = req.query;

    if (!lineId || !reportDate || !shift) {
      return res.status(400).json({
        success: false,
        message: "lineId, reportDate, shift are required",
      });
    }

    const row = await getShiftLogBookByKey({
      lineId,
      reportDate,
      shift,
    });

    return res.json({ success: true, data: row || null });
  } catch (error) {
    console.error("getShiftLogBook error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
const getShiftLogBookByKey = async ({ lineId, reportDate, shift }) => {
  if (!lineId || !reportDate || !shift) {
    throw new Error("lineId, reportDate, shift are required");
  }

  return prismaClient.shiftLogBook.findUnique({
    where: {
      lineId_reportDate_shift: {
        lineId: String(lineId),
        reportDate: String(reportDate),
        shift: String(shift),
      },
    },
  });
};

module.exports={
    createShiftLogBook,
    updateShiftLogBook,
    upsertShiftLogBook,
    submitShiftLogBook,
    getShiftLogBook,
    getShiftLogBookByKey
}
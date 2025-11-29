const prismaClient = require("../lib/prismaClient");

// Create new IdealParameter
const createIdealParameter = async (req, res) => {
  try {
    const { JPH, Quality, lineName } = req.body;

    if (!value || !lineName) {
      return res.status(400).json({ error: "value and lineName are required" });
    }

    const newParam = await prismaClient.idealParameters.create({
      data: {
        JPH: JPH ?? "50",
        Quality: Quality ?? "99",
        lineName
      },
    });

    res.status(201).json(newParam);
  } catch (error) {
    console.error("Error creating IdealParameter:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all IdealParameters (optional filter by lineName)
const getIdealParameters = async (req, res) => {
  try {
    const { lineName } = req.query;

    const params = await prismaClient.idealParameters.findMany();

    res.json(params);
  } catch (error) {
    console.error("Error fetching IdealParameters:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update IdealParameter by ID
const updateIdealParameter = async (req, res) => {
  try {
    const { id, JPH, Quality,  lineName } = req.body;

    if (!id) {
      return res.status(400).json({ error: "id is required" });
    }

    const updatedParam = await prismaClient.idealParameters.update({
      where: { id },
      data: {
        ...(JPH !== undefined && { JPH }),
        ...(Quality !== undefined && { Quality }),
        ...(lineName !== undefined && { lineName }),
      },
    });

    res.json(updatedParam);
  } catch (error) {
    console.error("Error updating IdealParameter:", error);
    if (error.code === "P2025") {
      return res.status(404).json({ error: "IdealParameter not found" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createIdealParameter,
  getIdealParameters,
  updateIdealParameter
};


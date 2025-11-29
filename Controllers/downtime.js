
const prismaClient  = require('../lib/prismaClient');

/**
 * Create Downtime Management record
 */
const createDowntime = async (req, res) => {
  try {
    const { type="Planned", reason, reasonType="Planned", startTime, endTime, lineName } = req.body;


    if(!type || !lineName){
    res.status(500).json({ error: "Failed to create downtime" });
        return 
    }

    const line=await prismaClient.line.findFirst({
        where:{
            lineName:lineName
        }
    })
    const lineId=line.lineId;
    const start = new Date(startTime);
    const end = new Date(endTime);


    // Check if there's already a downtime for this lineId
    // with exact same times or overlapping period
    const existingDowntime = await prismaClient.downtimeManagement.findFirst({
      where: {
        lineId,
	type,
        OR: [
          // Case 1: Exact same start & end time
          {
            startTime: startTime,
            endTime: endTime
          },
          // Case 2: New period is inside existing downtime
          {
            startTime: { lte: startTime },
            endTime: { gte: endTime }
          }
        ]
      }
    });

    if (existingDowntime) {
      return res.status(400).json({
        error: "Downtime already exists for this line and time range."
      });
    }

    // If not found, create new downtime
    const newDowntime = await prismaClient.downtimeManagement.create({
      data: {
        type,
        reason,
        reasonType,
        startTime: startTime,
        endTime: endTime,
        lineId,
      },
    });

    res.status(201).json({newDowntime,status:"success"});
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Failed to create downtime" ,e:e});
  }
};


const createDowntime2 = async (durations) => {
  try {
    if (!durations || typeof durations !== "object" || Object.keys(durations).length === 0) {
      console.log("Invalid input");
      return;
    }

    const nameMap = {
      Front_Line: "Front Line",
      RB: "Rear Back",
      RC: "Rear Cushion",
    };

    const results = [];
    const skipped = [];

    const lineIdMap = {
      "Rear Back": "cae9fc0d-d004-4e14-9eeb-0bdf8cd65e27",
      "Rear Cushion": "ac79359f-d903-4e7a-9b49-ecacc9fdef77",
      "Front Line": "59401238-53da-4c32-882c-ebefea46fd33",
    };

    // 🔹 Process sequentially instead of Promise.all
    for (const [abbrevName, downtimeData] of Object.entries(durations)) {
      const fullLineName = nameMap[abbrevName];
      if (!fullLineName) {
        skipped.push({ abbrevName, reason: "Unknown line abbreviation" });
        continue;
      }

      if (!downtimeData?.startTime || !downtimeData?.endTime) {
        skipped.push({ lineName: fullLineName, reason: "Missing start/end time" });
        continue;
      }

      const start = new Date(downtimeData.startTime);
      const end = new Date(downtimeData.endTime);
      const lineId = lineIdMap[fullLineName];

      if (!lineId) {
        skipped.push({ lineName: fullLineName, reason: "Line not found" });
        continue;
      }

      // 🔹 Check overlap
      const existingDowntime = await prismaClient.downtimeManagement.findFirst({
        where: {
          lineId,
          OR: [
            { startTime: start, endTime: end },
            { startTime: { lte: start }, endTime: { gte: end } },
            { startTime: { lte: start }, endTime: { gte: start, lt: end } },
            { startTime: { gt: start, lte: end }, endTime: { gte: end } },
          ],
        },
      });

      if (existingDowntime) {
        skipped.push({ lineName: fullLineName, reason: "Overlaps with existing downtime" });
        continue;
      }

      // 🔹 Create downtime
      const newDowntime = await prismaClient.downtimeManagement.create({
        data: {
          type: "Unplanned",
          reason: "Auto-created ",
          reasonType: "system",
          startTime: start,
          endTime: end,
          lineId,
        },
      });

      results.push(newDowntime);
    }

    console.log("Success Creation", results, skipped);
    return { results, skipped };
  } catch (error) {
    console.error("Error creating downtime:", error);
    throw error;
  }
};




/**
 * Edit (Update) Downtime Management record
 */
const updateDowntime = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const updatedDowntime = await prismaClient.downtimeManagement.update({
      where: { id },
      data: {
        reason
      },
    });

    res.json(updatedDowntime);
  } catch (error) {
    console.error("Error updating downtime:", error);
    res.status(500).json({ error: "Failed to update downtime" });
  }
};

/**
 * Delete Downtime Management record
 */
const deleteDowntime = async (req, res) => {
  try {
    const { id } = req.params;

    await prismaClient.downtimeManagement.delete({
      where: { id },
    });

    res.json({ message: "Downtime deleted successfully" });
  } catch (error) {
    console.error("Error deleting downtime:", error);
    res.status(500).json({ error: "Failed to delete downtime" });
  }
};


const getDowntime = async (req, res) => {
  try {
    // Date passed from frontend in "YYYY-MM-DD" format, and shift param
    const { date, shift } = req.params; // or req.query depending on your route

    if (!date) {
      return res.status(400).json({ error: "Date is required in YYYY-MM-DD format" });
    }

    // Parse date string (e.g. "2025-08-19")
    const selectedDate = new Date(date);

    // IST offset
    const istOffset = 330 * 60 * 1000; // 5h30m in ms

    // Base IST midnight
    const baseIST = new Date(selectedDate.getTime() + istOffset);
    baseIST.setHours(0, 0, 0, 0);

    let startOfShiftIST, endOfShiftIST;

    if (shift === "A") {
      // 06:00 → 14:30
      startOfShiftIST = new Date(baseIST.getTime());
      startOfShiftIST.setHours(6, 0, 0, 0);

      endOfShiftIST = new Date(baseIST.getTime());
      endOfShiftIST.setHours(14, 30, 0, 0);

    } else if (shift === "B") {
      // 14:30 → 23:00
      startOfShiftIST = new Date(baseIST.getTime());
      startOfShiftIST.setHours(14, 30, 0, 0);

      endOfShiftIST = new Date(baseIST.getTime());
      endOfShiftIST.setHours(23, 0, 0, 0);

    } else if (shift === "C") {
      // 23:00 → next day 06:00
      startOfShiftIST = new Date(baseIST.getTime());
      startOfShiftIST.setHours(23, 0, 0, 0);

      endOfShiftIST = new Date(baseIST.getTime() + 24 * 60 * 60 * 1000); // next day
      endOfShiftIST.setHours(6, 0, 0, 0);

    } else {
      // Whole day
      startOfShiftIST = new Date(baseIST.getTime());
      startOfShiftIST.setHours(0, 0, 0, 0);

      endOfShiftIST = new Date(baseIST.getTime());
      endOfShiftIST.setHours(23, 59, 59, 999);
    }

    // Convert both to UTC
    const startOfShiftUTC = new Date(startOfShiftIST.getTime() - istOffset);
    const endOfShiftUTC = new Date(endOfShiftIST.getTime() - istOffset);

    const downtimes = await prismaClient.downtimeManagement.findMany({
      where: {
        startTime: {
          gte: startOfShiftUTC,
          lte: endOfShiftUTC,
        },
      },
      include: {
        line: {
          select: { lineName: true },
        },
      },
    });

    const downtimeReasons = await prismaClient.downtimeReasons.findMany({});

    res.json({ downtimes, downtimeReasons });

  } catch (error) {
    console.error("Error fetching downtime:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


// ✅ Add a new dropdown reason with empty options
const addDowntimeReason = async (req, res) => {
  try {
    const { name,options=[] } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }
    const reason = await prismaClient.downtimeReasons.create({
      data: {
        name,
        options: options // always empty at creation
      },
    });

    res.status(201).json(reason);
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(400).json({ error: "Reason name must be unique" });
    }
    res.status(500).json({ error: error.message });
  }
};

// ✅ Edit options by name (replace entire array with new options)
const updateOptions = async (req, res) => {
  try {
    const { name } = req.params;
    const { options } = req.body;

    if (!Array.isArray(options)) {
      return res.status(400).json({ error: "Options must be an array of strings" });
    }

    const updated = await prismaClient.downtimeReasons.update({
      where: { name },
      data: { options },
    });

    res.json(updated);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Reason not found" });
    }
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get all reasons
const getAllReasons = async (req, res) => {
  try {
    const reasons = await prismaClient.downtimeReasons.findMany();
    res.json(reasons);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports={deleteDowntime,createDowntime,updateDowntime,createDowntime2,getDowntime,addDowntimeReason,updateOptions,getAllReasons};


const cron = require("node-cron");
const { exec } = require("child_process");
const path = require("path");

const PROJECT_ROOT = path.resolve(__dirname, "..");

// Helper to get yesterday's date in YYYY-MM-DD format
function getYesterdayYmd() {
  const IST_OFFSET_MS = 330 * 60 * 1000;
  // Get current time, shift to IST, subtract 1 day
  const now = new Date();
  const istNow = new Date(now.getTime() + IST_OFFSET_MS);
  const yesterdayIst = new Date(istNow.getTime() - 86400000);

  const pad2 = (n) => String(n).padStart(2, "0");
  return `${yesterdayIst.getUTCFullYear()}-${pad2(yesterdayIst.getUTCMonth() + 1)}-${pad2(yesterdayIst.getUTCDate())}`;
}

const runScript = (scriptName, args = [], onComplete) => {
  const scriptPath = path.join(PROJECT_ROOT, "jobs", scriptName);
  const command = `node ${scriptPath} ${args.join(" ")}`;

  console.log(
    `\n[CRON] Starting ${scriptName} for date ${args[0] || "today"}...`,
  );

  exec(command, { cwd: PROJECT_ROOT }, (error, stdout, stderr) => {
    if (error) {
      console.error(`[CRON] ❌ Error in ${scriptName}:`, error.message);
    } else {
      const lines = stdout.split("\n");
      const summary = lines
        .filter(
          (line) =>
            line.includes("✅") ||
            line.includes("❌") ||
            line.includes("Wrote") ||
            line.includes("COMPLETE"),
        )
        .join("\n");
      if (summary) console.log(`[CRON] Output from ${scriptName}:\n${summary}`);
    }

    if (onComplete) onComplete();
  });
};

// ==========================================
// CRON JOBS
// ==========================================

// 1. Daily Tasks (End of Shift C: 06:05 AM IST)
// Runs L4, L5, L6 sequentially for yesterday
cron.schedule(
  "5 6 * * *",
  () => {
    const targetDate = getYesterdayYmd();
    console.log(`\n⏰ [CRON] Starting Daily Rollups for ${targetDate}...`);

    runScript("l4Daily.js", [targetDate], () => {
      runScript("l5Weekly.js", [targetDate], () => {
        runScript("l6Monthly.js", [targetDate]);
      });
    });
  },
  { scheduled: true, timezone: "Asia/Kolkata" },
);

// 2. Monthly Tasks (Last day of the month at 08:00 AM IST)
// Runs L7, L8, L9 for yesterday (which is the end of the month)
cron.schedule(
  "0 8 28-31 * *",
  () => {
    const today = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
    );
    const lastDay = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0,
    ).getDate();

    if (today.getDate() === lastDay) {
      const targetDate = getYesterdayYmd();
      console.log(
        `\n⏰ [CRON] Last day of month detected. Starting L7, L8, L9 Rollups for ${targetDate}...`,
      );
      runScript("l789Rollup.js", [targetDate]);
    }
  },
  { scheduled: true, timezone: "Asia/Kolkata" },
);

console.log(
  "🕒 Cron scheduler initialized (IST timezone). Waiting for tasks...",
);

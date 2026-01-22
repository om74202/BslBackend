// in-memory "sent today" guard (resets if server restarts)
const { sendTodayPerformanceReportPdf } = require('../Controllers/influxControllers.js');



const reportSentSet = new Set();

const getIstNow = () => new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));

const getIstYyyyMmDd = () =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

// checks IST time and triggers report mail at 14:30 (A) and 23:00 (B)
function maybeSendDailyShiftReports() {
  const istNow = getIstNow();
  const hh = istNow.getHours();
  const mm = istNow.getMinutes();

  let shiftToSend = null;
  if (hh === 14 && mm === 30) shiftToSend = "A";
  if (hh === 23 && mm === 00) shiftToSend = "B";
  if (!shiftToSend) return;

  const todayIst = getIstYyyyMmDd();
  const key = `${todayIst}|${shiftToSend}`;

  if (reportSentSet.has(key)) return;
  reportSentSet.add(key);

  // Fire-and-forget (do not block ping loop)
  sendTodayPerformanceReportPdf({ shift: shiftToSend })
    .then((info) => {
      console.log("[daily-report] sent:", {
        date: info?.date,
        shift: info?.shift,
        fileName: info?.fileName,
        mailedTo: info?.mailedTo,
      });
    })
    .catch((err) => {
      console.error("[daily-report] failed:", err?.message || err);
      // optional: allow reattempt later if you want (but next tick won't match exact time)
      // reportSentSet.delete(key);
    });
}
module.exports={maybeSendDailyShiftReports}

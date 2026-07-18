

const { influxDB } = require("../db/influxDB/influx");
const {
  SendMailToUserAlert,
  SendMailNUCAlert,
  SendMailNUCRestored,
  SendEmailDispatchDelay,
} = require("./userFunctions");

const { saveLatestDowntime } = require("../Controllers/plannedShutdown");

const queryApi = influxDB.getQueryApi("BSL Kharkhoda");

let isEmailSent = false;

// Get today's 6 AM IST in ISO string (UTC format)
let now = new Date();
let istOffset = 5.5 * 60 * 60 * 1000; // IST offset in ms (UTC+5:30)

// Start of today in IST
let todayIST = new Date(now.getTime() + istOffset);
todayIST.setHours(6, 0, 0, 0); // Set to 6:00 AM IST

// Convert back to UTC ISO string
let lastRealtimeDataTime = new Date(todayIST.getTime() - istOffset).toISOString();

console.log(lastRealtimeDataTime, "on start of the server setting lastRealtimeDataTime");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function logEmailSkip(reason, context = {}) {
  console.warn("[email][skip]", reason, context);
}

function logEmailFailure(reason, context = {}, error) {
  console.error("[email][failure]", reason, context, {
    message: error?.message,
    stack: error?.stack,
  });
}

function isnotRealtime(utcTimeStr) {
  console.log("hii from realtime function");

  async function sendMailsSequentially2(emails, floorTime) {
    if (!Array.isArray(emails) || emails.length === 0) {
      logEmailSkip("NUC alert email list is empty", { floorTime });
      return;
    }

    for (const email of emails) {
      try {
        await SendMailNUCAlert(email, floorTime);
        console.log(` Power off email Sent to ${email}`);
        await sleep(2000); // wait 2 seconds before sending next
      } catch (err) {
        logEmailFailure("Failed to send NUC alert email", { email, floorTime }, err);
      }
    }
  }

  const inputTime = new Date(!utcTimeStr ? lastRealtimeDataTime : utcTimeStr);
  const currentTime = new Date();

  const diffMs = Math.abs(currentTime - inputTime);
  const diffMinutes = diffMs / 60000;
  console.log(diffMinutes, currentTime, inputTime, utcTimeStr);

  const floorTime = Math.floor(diffMinutes / 5) * 5;
  console.log(`⏱️  Difference: ${floorTime} minutes`);

  if (floorTime === 5 || (floorTime >= 20 && floorTime % 20 === 0)) {
    	 const emails=[
				"naresh.yadav@bharatseats.net",
		 "ommishra@opsight.ai",
		          "nishant.kundu@bharatseats.net",
                    "mohan.mishra@bharatseats.net",
      "mukesh.yadav@bharatseats.net",
		 ]
    // const emails = ["ommishra@opsight.ai"];
    isEmailSent = true;
    console.log("Changing the variable to ", isEmailSent);
    sendMailsSequentially2(emails, floorTime);
  } else {
    logEmailSkip("Realtime outage detected but floorTime does not match NUC alert thresholds", {
      floorTime,
      diffMinutes,
      inputTime: inputTime.toISOString(),
      currentTime: currentTime.toISOString(),
    });
  }

  return diffMinutes > 3;
}

const isBefore5PM_IST = () => {
  const now = new Date(); // IST assumed
  const currentHour = now.getHours();
  const day = now.getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6

  // Format current date as YYYY-MM-DD
  const todayStr = now.toISOString().slice(0, 10);

  // Block list of holidays (YYYY-MM-DD)
  const blockDates = [
    "2025-04-14",
    "2025-06-07",
    "2025-08-09",
    "2025-08-15",
    "2025-08-16",
    "2025-09-17",
    "2025-10-02",
    "2025-10-21",
    "2025-10-20",
    "2025-10-22",
    "2025-10-23",
    "2025-11-05",
    "2025-01-26",
    "2025-03-04",
    "2025-03-05",
    "2024-10-10",
    "2024-10-20",
    "2024-06-30",
    "2024-11-05",
    "2024-12-27",
    "2024-07-19",
    "2024-11-24",
  ];

  // Working Sundays that should NOT be blocked
  const workingSundays = ["2024-10-12", "2024-10-19", "2024-10-26", "2024-11-02", "2025-01-04", "2025-01-25", "2025-03-08"];

  const isBlockedDate = blockDates.includes(todayStr);
  console.log(todayStr, "today's date");
  const isLateNightOrEarlyMorning = currentHour >= 23 || currentHour < 6;

  // Sunday check, but allow working Sundays
  const isSunday = day === 0;
  const isBlockedSunday = isSunday && !workingSundays.includes(todayStr);

  console.log(`🕒 IST Time: ${currentHour}:${now.getMinutes()} (Day: ${day})`);
  console.log(`📅 Blocked Date: ${isBlockedDate}`);
  console.log(`📅 Blocked Sunday: ${isBlockedSunday}`);

  return isLateNightOrEarlyMorning || isBlockedDate || isBlockedSunday;
};

async function getDurations(data) {
  const nameMap = {
    Front_Line: "Front Line",
    RB: "Rear Back",
    RC: "Rear Cushion",
  };

  data.sort((a, b) => new Date(a._time) - new Date(b._time));

  const latestDowntime = {};
  const latestDuration = {};
  const state = {};

  for (const entry of data) {
    const line = entry.LINE;
    const time = new Date(entry._time);
    if (Number.isNaN(time.getTime())) continue;

    if (!state[line]) {
      state[line] = {
        lastTime: time,
        lastValue: entry.Total_Prod_Today,
        duration: 0,
        inDowntime: false,
        downtimeStartTime: null,
      };
      continue;
    }

    const s = state[line];
    const minutes = Math.round((time - s.lastTime) / (1000 * 60));

    if (line in nameMap) {
      if (entry.Total_Prod_Today === s.lastValue) {
        s.duration += minutes;

        if (!s.inDowntime) {
          s.inDowntime = true;
          s.downtimeStartTime = s.lastTime;
        }
      } else {
        if (s.inDowntime) {
          if (s.duration >= 5) {
            latestDowntime[line] = {
              startTime: s.downtimeStartTime,
              endTime: time,
              duration: Math.round(s.duration / 5) * 5,
            };
          }
          s.inDowntime = false;
          s.downtimeStartTime = null;
        }
        s.duration = 0;
      }
      s.lastValue = entry.Total_Prod_Today;

      latestDuration[line] = {
        _time: entry._time,
        duration: Math.round(s.duration / 5) * 5,
      };

      if (s.inDowntime && latestDuration[line].duration >= 5) {
        latestDowntime[line] = {
          startTime: s.downtimeStartTime,
          endTime: time,
          duration: latestDuration[line].duration,
        };
      }
    }

    s.lastTime = time;
  }

  const qualifyingLines = Object.entries(latestDuration).filter(([line, { duration }]) => duration >= 5);

  const durationsString = qualifyingLines.map(([line, { duration }]) => `${nameMap[line]}: ${duration} minutes`).join(", ");
  const lineNames = qualifyingLines.map(([line]) => nameMap[line]);

  let maxDurationValue = 0;
  let maxDurationLine = null;

  for (const [line, { duration, _time }] of qualifyingLines) {
    if (!Number.isFinite(duration)) continue;
    if (
      duration > maxDurationValue ||
      (duration === maxDurationValue && new Date(_time) > new Date(latestDuration[maxDurationLine]?._time || 0))
    ) {
      maxDurationValue = duration;
      maxDurationLine = line;
    }
  }

  const res = await saveLatestDowntime({ latestDowntime });
  console.log("latestDowntime (synced):", res.results[0]?.data || {});

  const downtimeReasonByLineName = {};
  const results = Array.isArray(res?.results) ? res.results : [];
  for (const r of results) {
    if (!r?.ok) continue;

    const lineKey = r.lineKey; // RB/RC/Front_Line
    const lineName = nameMap[lineKey] || lineKey;

    const ps = r?.data;
    if (!ps?.id) continue;

    downtimeReasonByLineName[lineName] = {
      id: ps.id,
      reason: ps.reason ?? "",
      startTime: ps.startTime ?? null,
      endTime: ps.endTime ?? null,
      description: ps.description ?? "",
    };
  }

  const downtimeReasonByLineKey = {};
  for (const [lineName, obj] of Object.entries(downtimeReasonByLineName)) {
    const key = Object.keys(nameMap).find((k) => nameMap[k] === lineName);
    if (key) downtimeReasonByLineKey[key] = obj;
  }
  console.log("downtimeReasonByLineName:", downtimeReasonByLineName);

  return {
    durationsString,
    lineNames,
    latestDuration,
    maxDurationValue,
    latestDowntime,
    downtimeReasonByLineName,
    downtimeReasonByLineKey,
  };
}

function formatLineNames(lineNames) {
  const len = lineNames.length;

  if (len === 0) return "";
  if (len === 1) return lineNames[0];
  if (len === 2) return `${lineNames[0]} and ${lineNames[1]}`;

  const allButLast = lineNames.slice(0, -1).join(", ");
  const last = lineNames[len - 1];
  return `${allButLast}, and ${last}`;
}

function istToUtc(hour, minute) {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth();
  const day = now.getUTCDate();

  const utcDate = new Date(Date.UTC(year, month, day, hour, minute));
  return utcDate.toISOString();
}

function getLatestStatus(data) {
  const result = {};

  data.forEach((entry) => {
    const line = entry.LINE;
    const field = entry._field;
    const value = entry._value;
    const timeStr = entry._time;
    const time = new Date(timeStr);

    if (!result[line]) {
      result[line] = {};
    }

    if (!result[line][field] || new Date(result[line][field]._time) < time) {
      result[line][field] = {
        value,
        _time: timeStr,
      };
    }
  });

  return result;
}

function findLatestOutOfSyncPeriod(directArray, viaReplicationArray) {
  const stripToMinutes = (iso) => {
    const d = new Date(iso);
    d.setSeconds(0, 0);
    return d;
  };

  const toIST = (isoDate) => {
    const istMillis = isoDate.getTime() + 5.5 * 60 * 60 * 1000;
    return new Date(istMillis).toISOString();
  };

  const directTimes = directArray.map((d) => stripToMinutes(d._time));
  const viaTimes = viaReplicationArray.map((d) => stripToMinutes(d._time));

  const allTimesSet = new Set([...directTimes, ...viaTimes].map((d) => d.getTime()));
  const allTimes = Array.from(allTimesSet)
    .sort((a, b) => a - b)
    .map((ms) => new Date(ms));

  let lastOutOfSyncStart = null;
  let firstBackInSyncAfterOutage = null;
  let outOfSync = false;

  const isWithin3Minutes = (time1, time2) => {
    return Math.abs(time1.getTime() - time2.getTime()) <= 3 * 60 * 1000;
  };

  for (let time of allTimes) {
    const hasDirect = directTimes.some((d) => isWithin3Minutes(d, time));
    const hasVia = viaTimes.some((v) => isWithin3Minutes(v, time));

    if (hasDirect && hasVia) {
      if (outOfSync && firstBackInSyncAfterOutage === null) {
        firstBackInSyncAfterOutage = time;
      }
      outOfSync = false;
    } else {
      if (!outOfSync) {
        lastOutOfSyncStart = time;
        firstBackInSyncAfterOutage = null;
      }
      outOfSync = true;
    }
  }

  return {
    outOfSyncStartUTC: lastOutOfSyncStart ? lastOutOfSyncStart.toISOString() : null,
    firstBackInSyncUTC: firstBackInSyncAfterOutage ? firstBackInSyncAfterOutage.toISOString() : null,
    outOfSyncStartIST: lastOutOfSyncStart ? toIST(lastOutOfSyncStart) : null,
    firstBackInSyncIST: firstBackInSyncAfterOutage ? toIST(firstBackInSyncAfterOutage) : null,
  };
}

function TagsSyncStatus(obj1, obj2) {
  const lines = Object.keys(obj1);
  const maxTimeDiffMs = 4 * 60 * 1000;
  const inSyncLines = [];

  for (const line of lines) {
    const tag1 = obj1[line];
    const tag2 = obj2[line];

    const tag1Data = tag1.communication_status_direct || tag1.communication_status_via_replication;
    const tag2Data = tag2.communication_status_direct || tag2.communication_status_via_replication;

    if (!tag1Data || !tag2Data) continue;

    const time1 = new Date(tag1Data._time).getTime();
    const time2 = new Date(tag2Data._time).getTime();
    const timeDiff = Math.abs(time1 - time2);

    if (tag1Data.value === tag2Data.value && timeDiff <= maxTimeDiffMs) {
      inSyncLines.push(line);
      console.log(time1, time2, timeDiff);
    }
  }

  if (inSyncLines.length === 0) {
    return true;
  }

  return inSyncLines;
}

function getLatestTimeOfTags(data) {
  let latestTime = null;

  Object.values(data).forEach((line) => {
    ["communication_status_direct", "communication_status_via_replication"].forEach((key) => {
      const entry = line[key];
      if (entry && entry._time) {
        const currentTime = new Date(entry._time);
        if (!latestTime || currentTime > new Date(latestTime)) {
          latestTime = entry._time;
        }
      }
    });
  });

  return latestTime;
}

async function sendMailsSequentiallyForRestore(emails) {
  if (!Array.isArray(emails) || emails.length === 0) {
    logEmailSkip("Restore email list is empty", {});
    return;
  }

  for (const email of emails) {
    try {
      await SendMailNUCRestored(email);
      console.log(` Power on email Sent to ${email}`);
      await sleep(2000);
    } catch (err) {
      logEmailFailure("Failed to send restore email", { email }, err);
    }
  }
}

async function checkLast5MinutesData(data) {
  const sorted = [...data].sort((a, b) => new Date(a._time) - new Date(b._time));

  const seenMinutes = new Set();
  const minuteTimes = [];

  for (const item of sorted) {
    const date = new Date(item._time);
    const key = `${date.getUTCFullYear()}-${date.getUTCMonth()}-${date.getUTCDate()} ${date.getUTCHours()}:${date.getUTCMinutes()}`;
    if (!seenMinutes.has(key)) {
      seenMinutes.add(key);
      minuteTimes.push(new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes())));
    }
  }

  const recent5 = minuteTimes.slice(-5);
  console.log(recent5);

  if (recent5.length < 5) {
    console.log("Not enough minute-level timestamps to determine continuity");
    return false;
  }

  for (let i = 1; i < 5; i++) {
    const prev = recent5[i - 1];
    const curr = recent5[i];
    const diffMin = (curr - prev) / (1000 * 60);

    if (diffMin > 3) {
      console.log("Power Up Detected");
      isEmailSent = false;
      console.log("changing the isEmailsent to ", isEmailSent);

      const emails = [
        "naresh.yadav@bharatseats.net",
        "ommishra@opsight.ai",
        "nishant.kundu@bharatseats.net",
        "mohan.mishra@bharatseats.net",
        "mukesh.yadav@bharatseats.net",
      ];
      sendMailsSequentiallyForRestore(emails);

      return true;
    }
  }

  console.log("Last 5 minutes are continuous");
  return false;
}
const mailConfig = {
    5: {
      level: "Level 1",
      emails: [
	      "ommishra@opsight.ai",
        "mukesh.yadav@bharatseats.net",
      ],
    },
    10: {
      level: "Level 2",
      emails: [
	      "ommishra@opsight.ai",
        "mukesh.yadav@bharatseats.net",
	      "Yogesh.Bansal@bharatseats.net",
      ],
    },
	20:{
		level:"suman",
		emails:[
      "Suman.Yadav@bharatseats.net"
      // ,"ommishra@opsight.ai",
      ,"mukesh.yadav@bharatseats.net"
    ]
	},
    35: {
      level: "Level 3",
      emails: [
        "ommishra@opsight.ai",
         "naresh.yadav@bharatseats.net",
         "aniket.singh@bharatseats.net",
         "mukesh.yadav@bharatseats.net",
	     "Rajiv.Arora@bharatseats.net",
      ],
    },
  };


function buildDowntimeMessage(durations) {
  let isCeoSend = true;

  const map = durations?.downtimeReasonByLineName || {};
  const latest = durations?.latestDuration || {};

  const nameToKey = {
    "Front Line": "Front_Line",
    "Rear Back": "RB",
    "Rear Cushion": "RC",
  };

  const lines = [];
  const badReasons = new Set(["", "No reason alloted"]);

  for (const [lineName, obj] of Object.entries(map)) {
    const key = nameToKey[lineName];
    const dur = latest?.[key]?.duration ?? 0;

    if (dur < 5) continue;

    const reasonRaw = (obj?.reason ?? "").trim();

    if (badReasons.has(reasonRaw)) {
      isCeoSend = false;
    }

    lines.push(`${lineName}: ${dur} min | Reason: ${reasonRaw || "NA"}`);
  }

  if (lines.length === 0) return { message: "", isCeoSend: false };

  return {
    message: `Downtime Alert:\n${lines.join("\n")}`,
    isCeoSend,
  };
}

const checkRunModeAndSendAlerts = async () => {
  if (isBefore5PM_IST()) {
    console.log(isBefore5PM_IST());
    lastRealtimeDataTime = istToUtc(0, 30);

    logEmailSkip("Downtime email check skipped due to blocked time window or holiday", {
      lastRealtimeDataTime,
    });
    return;
  }

  let startTime = istToUtc(0, 30);
  const endTime = istToUtc(17, 30);

  const QueryForLive = `
  from(bucket: "TODAY")
    |> range(start: time(v: "${startTime}"),stop:time(v:"${endTime}"))
    |> filter(fn: (r) => r["_measurement"] == "Performance")
  |> filter(fn: (r) => r["LINE"] == "RB" or r["LINE"] == "RC" or r["LINE"] == "Front_Line")
  |> filter(fn: (r) => r["_field"] == "communication_status_direct")
    |> aggregateWindow(every: 20s, fn: last, createEmpty: false)
    |> sort(columns: ["_time"], desc: false)
`;

  const QueryForLive2 = `
  from(bucket: "TODAY")
    |> range(start: time(v: "${startTime}"),stop:time(v:"${endTime}"))
     |> filter(fn: (r) => r["_measurement"] == "Performance")
  |> filter(fn: (r) => r["LINE"] == "RB" or r["LINE"] == "RC" or r["LINE"] == "Front_Line")
  |> filter(fn: (r) => r["_field"] == "communication_status_via_replication")
    |> aggregateWindow(every: 20s, fn: last, createEmpty: false)
    |> sort(columns: ["_time"], desc: false)
`;

  console.log("start and end time of communication query", startTime, endTime);

  const rows = await queryApi.collectRows(QueryForLive2);
  const rowsDirect = await queryApi.collectRows(QueryForLive);

  console.log(rows[0], rowsDirect[0]);
  console.log(getLatestStatus(rows), getLatestStatus(rowsDirect));

  const lastTimeDirect = getLatestTimeOfTags(getLatestStatus(rowsDirect));
  const lastTime = getLatestTimeOfTags(getLatestStatus(rows));
  console.log("inside this console", lastTimeDirect);

  if (isnotRealtime(lastTimeDirect)) {
    console.log("Email sent for not in realtime Data ");
    return;
  } else {
    if (isEmailSent && await checkLast5MinutesData(rowsDirect)) {
  console.log("just powered up email sent for power up nuc or restored connection ");
  return;
}

    if (TagsSyncStatus(getLatestStatus(rows), getLatestStatus(rowsDirect)) === true) {
      console.log("email for not time sync for all 3 lines ");
      return;
    }
  }

  startTime = findLatestOutOfSyncPeriod(rows, rowsDirect)?.firstBackInSyncUTC || istToUtc(0, 30);

  const linesList = TagsSyncStatus(getLatestStatus(rows), getLatestStatus(rowsDirect));
  if (linesList.length < 3) {
    console.log("Changing time as the data is not reset");
    const now = new Date();
    const hour = now.getHours();
    const minutes = now.getMinutes();
    startTime = istToUtc(hour, minutes);
  }

  console.log("Data is realtime and the replication is in sync for these lines ", linesList, startTime, endTime);
  lastRealtimeDataTime = lastTimeDirect;
  console.log("changed the value of lastRealtimeDataTime to ", lastTimeDirect);

  const lineFilter = linesList.map((line) => `r["LINE"] == "${line}"`).join(" or ");
  const fluxQuery = `
        from(bucket: "TODAY")
        |> range(start: time(v: "${startTime}"),stop:time(v:"${endTime}"))
          |> filter(fn: (r) => r["_measurement"] == "Performance")
	   |> filter(fn: (r) => ${lineFilter})
  |> filter(fn: (r) => r["_field"] == "Total_Prod_Today")
          |> aggregateWindow(every: 1m, fn: last, createEmpty: false)
            |> pivot(rowKey:["_time"], columnKey:["_field"], valueColumn:"_value")
            |> sort(columns: ["_time"], desc: false)
        `;

  try {
    const rows2 = await queryApi.collectRows(fluxQuery);
    const durations = await getDurations(rows2);
    const info = durations.durationsString;
    const maxDuration = durations.maxDurationValue;
    const floorTime = Math.floor(maxDuration / 5) * 5;

    const message = buildDowntimeMessage(durations);

    console.log("floorTime:", floorTime);
    console.log("message:\n", message.message);

    const lineName = formatLineNames(durations.lineNames);

    console.log(lineName, info, "So email will be sent for this floortime ", floorTime, message);

    async function sendMailsSequentially(emails, info, lineName) {
      console.log("send mails sequentially function , check",emails);
      if (!Array.isArray(emails) || emails.length === 0) {
        logEmailSkip("Downtime alert recipient list is empty", {
          floorTime,
          lineName,
          info,
        });
        return;
      }

      if (!message?.message) {
        logEmailSkip("Downtime alert message is empty", {
          floorTime,
          lineName,
          info,
        });
        return;
      }

      for (const email of emails) {
        try {
          console.log("sending in process ,for ", email,message);
          if (
            (email === "Rajiv.Arora@bharatseats.net" ||
              email === "arunkumar@opsight.ai" ||
              email==="ommishra@opsight.ai" ||
              email === "aniket.singh@bharatseats.net") &&
            !message.isCeoSend
          ) {
            logEmailSkip("Skipping CEO/escalation email because downtime reason is missing", {
              email,
              lineName,
              floorTime,
              message: message?.message,
            });
            continue;
          }
          await SendMailToUserAlert(email, message?.message, lineName);
          console.log(`✅ Sent to ${email}`);
          await sleep(2000);
        } catch (err) {
          logEmailFailure("Failed to send downtime alert email", {
            email,
            lineName,
            floorTime,
            info,
            message: message?.message,
          }, err);
        }
      }
    }

    async function processMailLogic(floorTime, info, lineName) {
      console.log("Process mail logic function , check");
      const isExtendedLevel3 = floorTime > 35 && (floorTime - 30) % 20 === 0;

      const config = mailConfig[floorTime] || (isExtendedLevel3 ? mailConfig[35] : null);
      console.log("outside config", floorTime);
      if (config) {
        await sendMailsSequentially(config.emails, info, lineName);
        console.log(`${config.level} mail sent for floorTime:`, floorTime);
      } else {
        logEmailSkip("No downtime alert triggered because floorTime does not match configured thresholds", {
          floorTime,
          lineName,
          info,
        });
      }
    }

    await processMailLogic(floorTime, info, lineName);
  } catch (err) {
    logEmailFailure("Error in checkRunModeAndSendAlerts", {
      startTime,
      endTime,
    }, err);
  }
};

  const mailConfig2 = {
    12: {
      level: "Level 1",
      emails: [
         "mukesh.yadav@bharatseats.net",
         "ommishra@opsight.ai",
         "mohan.mishra@bharatseats.net",
        "Gaurav.kumar@bharatseats.net",
      ],
    },
    15: {
      level: "Level 2",
      emails: [
         "Suman.Yadav@bharatseats.net",
         "ommishra@opsight.ai",
        ,"mohan.mishra@bharatseats.net",

      ],
    },
    20: {
      level: "Level 3",
      emails: [
         "Rajiv.Arora@bharatseats.net",
        "mohan.mishra@bharatseats.net",
        "ommishra@opsight.ai",

      ],
    },
  };


let c93Triggered = false;
let c94Triggered = false;
let c95Triggered = false;

async function sendEmails(config, message) {
  if (!config) {
    logEmailSkip("Dispatch delay email config missing", { message });
    return;
  }

  if (!Array.isArray(config.emails) || config.emails.length === 0) {
    logEmailSkip("Dispatch delay email list is empty", {
      level: config.level,
      message,
    });
    return;
  }

  console.log(`Triggering ${config.level} emails`);

  const emailPromises = config.emails.map(async (email) => {
    try {
      await SendEmailDispatchDelay(email, message);
      console.log(`Email sent successfully to ${email} for ${config.level}`);
    } catch (error) {
      logEmailFailure("Failed to send dispatch delay email", {
        email,
        level: config.level,
        message,
      }, error);
    }
  });

  await Promise.allSettled(emailPromises);
  console.log(`All emails processed for ${config.level}`);
}

const sendBitEmails = async () => {
  try {
    const bitQuery = `
      from(bucket: "TODAY")
        |> range(start: -90s)
        |> filter(fn: (r) => r["_measurement"] == "connection")
        |> filter(fn: (r) => r["_field"] == "c93" or r["_field"] == "c94" or r["_field"] == "c95")
        |> last()
    `;

    const rows = [];
    for await (const { values, tableMeta } of queryApi.iterateRows(bitQuery)) {
      rows.push(tableMeta.toObject(values));
    }

    if (rows.length === 0) {
      logEmailSkip("Dispatch delay email check skipped because no BIT data was found", {
        window: "last 90s",
      });
      c93Triggered = false;
      c94Triggered = false;
      c95Triggered = false;
      return;
    }

    const latestValues = {};
    rows.forEach((row) => {
      latestValues[row._field] = { value: row._value, time: row._time };
    });

    console.log("Latest values (last 40s):", latestValues);

    if (latestValues.c95 && latestValues.c95.value === 1) {
      if (!c95Triggered) {
        c95Triggered = true;
        const config = mailConfig2[20];
        const msg = `The dispatch wagon has been delayed for more than 20 minutes.`;
        await sendEmails(config, msg);
      }
    } else {
      c95Triggered = false;
    }

    if (latestValues.c94 && latestValues.c94.value === 1) {
      if (!c94Triggered) {
        c94Triggered = true;
        const config = mailConfig2[15];
        const msg = `The dispatch wagon has been delayed for more than 15 minutes.`;
        await sendEmails(config, msg);
      }
    } else {
      c94Triggered = false;
    }

    if (latestValues.c93 && latestValues.c93.value === 1) {
      if (!c93Triggered) {
        c93Triggered = true;
        const config = mailConfig2[12];
        const msg = `The dispatch wagon has been delayed for more than 12 minutes.`;
        await sendEmails(config, msg);
      }
    } else {
      c93Triggered = false;
    }
  } catch (err) {
    console.error("Error in sendBitEmails:", err);
  }
};

module.exports = { checkRunModeAndSendAlerts, sendBitEmails };

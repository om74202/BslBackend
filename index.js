
const express=require('express');
const { prismaClient, torqueGun } = require('./lib/prismaClient');
const userRouter = require('./Routes/userRoutes');
const session = require("express-session");
const cors=require('cors');
const  {influxRouter,sendBitEmails} = require('./Routes/influxRoutes');
const organisationRouter = require('./Routes/organizationRoute');
const LineRouter = require('./Routes/machineRoute');
const deviceRouter = require('./Routes/deviceRouter');
const cookieParser = require('cookie-parser');
const torqueRouter = require('./Routes/torqueGun');
const driveRouter = require('./Routes/drive');
const checkSheetRoute = require('./Routes/checkSheet');
const maintenanceRouter = require('./Routes/Maintenance');
const downtimeRouter = require('./Routes/downtime.js');
const multer = require('multer');
const upload=multer()
require('dotenv').config({ path: '.env.influx' });
require('./Routes/Websocket');
const http = require('http');
const  idealParamRoute = require('./Routes/idealParams');


const app=express();
app.use(cookieParser())
app.set('trust proxy', 1);
app.use(
  cors({
	  origin: ["https://20.198.22.6","http://192.168.1.13:5173","http://20.198.22.6", "http://localhost:5173"], // URL of your React frontend
    credentials: true,
    allowedHeaders: ['Authorization', 'Content-Type']
  }))





function pingRunModeAPI() {
  fetch("http://localhost:3001/api/influx/check-runmode", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(res => res.json())
    .then(data => {
      const now = new Date();
      const istTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
      console.log("✔️ Pinged runmode API:", istTime.toLocaleString(), "Response:" );
    })
    .catch(err => {
      console.error("❌ Error pinging runmode API:", err.message);
    });
}

// Calculate how many ms to wait until next round 5-minute mark in IST
function scheduleNextRun() {
  const now = new Date();
  const istNow = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));

  const next = new Date(istNow);
  next.setSeconds(0);
  next.setMilliseconds(0);

  // Round up to next 5th minute
  const minutes = istNow.getMinutes();
  next.setMinutes(minutes + (5 - (minutes % 5)));

  const delay = next - istNow;
  console.log("🕒 Scheduling first run at:", next.toLocaleString());

  setTimeout(() => {
    pingRunModeAPI();
    setInterval(pingRunModeAPI, 5 * 60 * 1000); // repeat every 5 minutes after that
  }, delay);
}

scheduleNextRun();

async function runSendBitEmails() {
  try {
    console.log("Running sendBitEmails at:", new Date().toISOString());
    await sendBitEmails();
  } catch (err) {
    console.error("Error in scheduled sendBitEmails:", err);
  } finally {
    // Schedule next run after 1 minute
    setTimeout(runSendBitEmails, 60 * 1000);
  }
}

// Start immediately
runSendBitEmails();


app.use(express.json());
app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
      secure: true,           // only send over HTTPS
      httpOnly: true,
      sameSite: 'lax',        // or 'none' if cross-origin (not needed here)
    }

    })
  );


app.get('/',async (req,res)=>{
    res.json({message:"hiiii "})
})
app.use("/api/user",userRouter)
app.use('/api/influx',influxRouter);
app.use('/api/org',organisationRouter)
app.use('/api/line',LineRouter);
app.use('/api/device',deviceRouter);
app.use('/api/maintenance',maintenanceRouter)
app.use(`/api/downtime`,downtimeRouter)
app.use(`/api/productionPlanning`,idealParamRoute);
app.use('/api/torque/',torqueRouter);
app.use('/api/drive',driveRouter);
app.use('/api/checksheet',upload.single("checksheetData"),checkSheetRoute);

app.listen(3001,()=>{
    console.log("server is running on port 3001");
})

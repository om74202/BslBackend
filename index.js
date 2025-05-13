
const express=require('express');
const { prismaClient } = require('./lib/prismaClient');
const userRouter = require('./Routes/userRoutes');
const session = require("express-session");
const cors=require('cors');
const influxRouter = require('./Routes/influxRoutes');
const organisationRouter = require('./Routes/organizationRoute');
const LineRouter = require('./Routes/machineRoute');
const deviceRouter = require('./Routes/deviceRouter');
require('dotenv').config();
require('./Routes/Websocket');

const app=express();

app.use(
  cors({
    origin: ["http://40.81.226.154", "http://localhost:5173"], // URL of your React frontend
    credentials: true,
    allowedHeaders: ['Authorization', 'Content-Type']
  }))
app.use(express.json());
app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: { expires: null },
    })
  );


app.get('/',async (req,res)=>{
    res.json({message:"hiiii "})
})
app.use("/user",userRouter)
app.use('/',influxRouter);
app.use('/org',organisationRouter)
app.use('/',LineRouter);
app.use('/',deviceRouter);

app.listen(3001,()=>{
    console.log("server is running on port 3001");
})
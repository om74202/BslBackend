const express = require('express');
const { prismaClient } = require('../lib/prismaClient');
const { hashPassword, comparePassword } = require('../functions/userFunctions');
const JWT =require('jsonwebtoken');
const userRouter=express.Router();
const bcrypt=require('bcrypt')

userRouter.post('/register',async (req,res)=>{
    const {name , email , password , role , address , phoneNumber , organizationId,imageUrl ,lines=[]}=req.body;

    if (!name) return res.status(400).send({ message: "Name is required" });
    if (!email) return res.status(400).send({ message: "Email is required" });
    if (!password) return res.status(400).send({ message: "Password is required" });
    if (!role) return res.status(400).send({ message: "Role is required" });
    if (!phoneNumber) return res.status(400).send({ message: "Phone number is required" });

    if (!['SuperAdmin', 'Admin','SuperUser','CheckSheetUser', 'User'].includes(role)) {
        return res.send({ message: "Invalid role" });
      }

      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email)) {
        return res.status(400).send({ message: "Invalid email format." });
      }
  
      //For Password complexity (uppercase, lowercase, special character)
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).+$/;
      if (!passwordRegex.test(password)) {
        return res.status(400).send({ message: "Password must contain at least one uppercase letter, one lowercase letter, and one special character." });
      }
    try{
        const existingUser=await prismaClient.user.findUnique({
            where:{
                email:email
            }
        })
        if(existingUser){
            return res.status(409).json({message:"User already exist with this email, Please Login"})
        }
        const hashedPassword=await hashPassword(password);

        console.time("register")

        const user =await prismaClient.user.create({
            data:{
                name:name,
                imageUrl:imageUrl,
                email:email,
                password:hashedPassword,
                role:role,
                address:address,
                phoneNumber:phoneNumber,
                organizationId:organizationId,
                lines:{
                  connect:lines.map((id)=>({id}))
                }
            }
        })
        console.timeEnd("register")

        res.status(201).json({message:"User created ",status:"success"})
    }catch(e){
        console.log(e);
        res.status(500).json({message :"Internal Server Error ",status:"Failed",
            error:e
        })
    }
})


userRouter.post('/login' , async (req, res)=>{
    const {email,password}=req.body;

    // Validate the request body parameters
    if (!email || !password) {
        return res.status(404).send({
          success: false,
          message: "Invalid email or password",
        });
      }

      const user=await prismaClient.user.findUnique({
        where:{
            email:email
        }
      })

      if (!user) {
        return res.status(404).send({
          success: false,
          message: "Email is not registerd",
        });
      }

      if (user.status == "Inactive") {
        return res.status(404).send({
          success: false,
          message: "Please connect to organisation",
        });
      }
      const passwordMatch=await comparePassword(password,user.password);
      if (!passwordMatch) {
        return res.status(200).send({
          success: false,
          message: "Invalid Password",
        });
      }
      const id=user.id;

      const token = JWT.sign({id:user.id,email:user.email,role:user.role},process.env.JWT_SECRET_KEY)

      res.cookie("authToken", token);

      req.session.user = {
        id: id,
        email: email,
        role: user.role,
      };
      

      res.status(200).send({
        status:"success",
        message:"Login Successfull",
        token:token,
        user:user
      })


  
})

userRouter.post('/logout',async(req,res)=>{
    res.clearCookie("authToken"); 
  req.session.destroy(); 
  res.json({ message: "Logged out successfully" });
})


userRouter.post('/updatePassword',async (req,res)=>{
  // const { id,email, role  } = req.user;
    const { oldPassword, newPassword, confirmPassword,id,email } = req.body;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).+$/;
    if (!passwordRegex.test(newPassword)) {
      return res.send({ message: "Password must contain at least one uppercase letter, one lowercase letter, and one special character." });
    }

    try{

      if (oldPassword && newPassword && confirmPassword) {
        const user = await prismaClient.user.findUnique({
          where:{
            email:email
          }
        })
        const ismatched = await bcrypt.compare(oldPassword, user.password);
        if (!ismatched) {
          res.status(500).send({
            success: false,
            message: "Old password is not matched"
          });
        } else {
          if (newPassword !== confirmPassword) {
            res.status(500).send({
              success: false,
              message: "Password and confirm password does not matched",
            });
          } else {
            const newHashPassword = await bcrypt.hash(newPassword, 10);
            const updatedUser=await prismaClient.user.update({
              where:{
                email:email
              },
              data:{
                password:newHashPassword
              }
            })
            res.status(200).json({
              message:"Password updated successfully",
              status:"success",
              user:updatedUser
            })
          }
        }
      } else {
        res.status(500).send({
          success: false,
          message: "All field are required",
        });
      }

    }catch(e){
      console.log(e);
      res.status(500).json({message:"Internal Server Error",status:"Failed",error:e})
    }
    
    
  
})



userRouter.get('/getUser/:orgId',async(req,res)=>{
  try{
    const {orgId} = req.params
    const users=await prismaClient.user.findMany({
      where:{
        organizationId:req.params.orgId
      },
      include:{
        lines:true
      }
    });
    res.status(200).json({users:users , status:"success"})
  }catch(e){
    res.status(404).json({message:"User not found"})
  }
})

userRouter.get('/getUser/:emailId',async(req,res)=>{
  try{
    const users=await prismaClient.user.findMany({
      where:{
        email:req.params.emailId
      },
      include:{
        lines:true
      }
    });
    res.status(200).json({users:users , status:"success"})
  }catch(e){
    res.status(404).json({message:"User not found"})
  }
})

userRouter.get('/getUser',async(req,res)=>{
  try{
    const users=await prismaClient.user.findMany();
    res.status(200).json({users:users , status:"success"})
  }catch(e){
    res.status(404).json({message:"User not found"})
  }
})
module.exports=userRouter;
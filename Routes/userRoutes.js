const express = require('express');
const prismaClient = require('../lib/prismaClient');
const { hashPassword, comparePassword,SendMailToUser  } = require('../functions/userFunctions');
const JWT =require('jsonwebtoken');
const userRouter=express.Router();
const bcrypt=require('bcrypt');
const { isSignedIn } = require('../middlewares/userMiddlewares');

userRouter.post('/register',async (req,res)=>{
    const {name , email , password , role , address , phoneNumber , organizationId,uploadImageUrl ,lineName=[]}=req.body;
    const lines=lineName;
    if (!name) return res.status(400).send({ message: "Name is required" });
    if (!email) return res.status(400).send({ message: "Email is required" });
    if (!password) return res.status(400).send({ message: "Password is required" });
    if (!role) return res.status(400).send({ message: "Role is required" });
    if (!phoneNumber) return res.status(400).send({ message: "Phone number is required" });

    if (!['SuperAdmin', 'Admin','SuperUser','CheckSheetUser', 'User','CEO'].includes(role)) {
        return res.send({ message: "Invalid role" });
      }

	if(role!=="Admin" && role!=="SuperAdmin"){
        if(lines.length===0){
          return res.status(500).send({ message: "User must be assigned to atleast one line" });
        }
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

        const lineRecords = await prismaClient.line.findMany({
      where: {
        lineName: {
          in: lines
        }
      },
      select: { lineId: true }
    });

    const onlyIds = lineRecords.map((line) => line.lineId);
    console.log(onlyIds)


        console.time("register")
	    SendMailToUser(email,password,name , organizationName="Bharat Seats, Kharkhoda")

        const user =await prismaClient.user.create({
            data:{
                name:name,
                uploadImageUrl:uploadImageUrl,
                email:email,
                password:hashedPassword,
                role:role,
                address:address,
                phoneNumber:phoneNumber,
                organizationId:organizationId,
               lines:{
                connect:onlyIds.map((lineId)=>({lineId}))
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



userRouter.put('/updateProfile/:id', async (req, res) => {
  const { name, phoneNumber, uploadImageUrl } = req.body;
  const {id}=req.params
        console.log(req.body)

  if (!id) {
    return res.status(400).json({ message: "User ID is required." });
  }

  try {
    // Check if user exists
    const existingUser = await prismaClient.user.findUnique({
      where: { id:id }
    });

    if (!existingUser) {
      return res.status(404).json({ message: "User not found." });
    }

    // Update allowed fields
    const updatedUser = await prismaClient.user.update({
      where: { id:id },
      data: {
              name:name,
              phoneNumber:phoneNumber,
              uploadImageUrl:uploadImageUrl
      }
    });

    return res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
});


userRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ Validate the request body parameters
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }

    const user = await prismaClient.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registered",
      });
    }

    if (user.status === "Inactive") {
      return res.status(404).send({
        success: false,
        message: "Please connect to organisation",
      });
    }

    const passwordMatch = await comparePassword(password, user.password);
    if (!passwordMatch) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password",
      });
    }

    const id = user.id;
    const token = JWT.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "30d" }
    );

    res.cookie("authToken", token, {
      httpOnly: true, // 🚫 Blocks JavaScript access
      secure: false,  // ✅ false for dev; ⚠️ must be true in production (HTTPS)
      sameSite: "Lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    req.session.user = {
      id,
      email,
      role: user.role,
    };

    return res.status(200).send({
      status: "success",
      message: "Login Successful",
      token,
      user,
    });
  } catch (error) {
    console.error("❌ Login error:", error);

    return res.status(500).send({
      success: false,
      message: error,
      error: error.message,
    });
  }
});


userRouter.use(isSignedIn);

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
        lines:true,
	      organization:true
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
	  const users=await prismaClient.user.findMany({
      include:{
        lines:true,
	      organization:true
      }
    });
    res.status(200).json({users:users , status:"success"})
  }catch(e){
    res.status(404).json({message:"User not found"})
  }
})


userRouter.put('/setStatusUser/:userId',async (req, res)=>{
  try{
    const {status}=req.body;
    if( status!=="Active" && status!=="Inactive"){
      return res.status(500).json({message:"Invalid Status , it must be Active or Inactive"})
    }
      const {userId} = req.params
      const user=await prismaClient.user.update({
        where:{
          id:userId
        },
        data:{
          status:status
        }
      });
      res.status(200).json({message:`Status updated to ${status}`, status:"success"})
    }catch(e){
      res.status(404).json({message:"User not found", error:e})
    }
})
module.exports=userRouter;

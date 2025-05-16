const bcrypt=require('bcrypt')
const jwt = require('jsonwebtoken');
const nodemailer=require('nodemailer')


const hashPassword = async (password) => {
    try {
      const salt = 10;
      const hashedPassword = await bcrypt.hash(password, salt);
      return hashedPassword;
    } catch (error) {
      console.log(error);
    }
  };
  
  const comparePassword = async (password, hashedPassword) => {
    try {
      
      // Ensure both arguments are present
      if (!password || !hashedPassword) {
        throw new Error('data and hash arguments required');
      }
  
      // Compare the plain password with the hashed password
      return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
      throw new Error(error.message);
    }
  };


const getRole = async (authToken) => {
  try {
    const decoded = jwt.verify(authToken, process.env.JWT_SECRET_KEY);

    if (!decoded) {
      throw new Error("Invalid token");
    }

    const { role, id, email } = decoded;
    return { role, id, email }; // Only return needed fields

  } catch (error) {
    console.error("Error decoding token:", error.message);
    return null;
  }
};



const SendMailToUser = async (email, password, name, organisationName)=>{
  // Create a transporter object
  const transporter = nodemailer.createTransport({
    host: 'smtppro.zoho.in',
    port: 465,
    secure: true, 
    auth: {
      user: process.env.ZOHO_MAIL,
      pass: process.env.ZOHO_PASSWORD,
    }
  });

  // Configure the mailoptions object
  const mailOptions = {
    from: process.env.ZOHO_MAIL,
    to: email,
    subject: 'User Credentials Information',
    html:
      `<div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <h2 style="color: #4CAF50;">Welcome, ${name}!</h2>
      <p style="font-size: 16px;">Admin joined you in the <strong style="color: #007BFF;">${organisationName}</strong> Organisation.</p>
      
      <p style="font-size: 16px;">Please check your <b style="color: #d9534f;">LOGIN Credentials</b> for using the Platform Dashboard:</p>
      
      <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin-top: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <p style="font-size: 16px;"><b>LogIn ID:</b> <span style="color: #555;">${email}</span></p>
        <p style="font-size: 16px;"><b>Password:</b> <span style="color: #555;">${password}</span></p>
      </div>

      <p style="font-size: 16px; margin-top: 20px;">Click here to Login:</p>
      <p style="font-size: 16px;">
        <a href="http://localhost:3000/login" style="color: #007BFF; text-decoration: none; font-weight: bold;">Login Now</a>
      </p>
      
      <p style="font-size: 14px; color: #6c757d; margin-top: 30px;">Please do not ignore this mail.</p>
    </div>`
  };

  // Send the email
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log('Error:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
}

  module.exports={comparePassword,hashPassword,getRole , SendMailToUser}
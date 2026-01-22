const bcrypt=require('bcrypt')
const jwt = require('jsonwebtoken');
const nodemailer=require('nodemailer')




















// Reuse a single transporter (better than creating every time)
const getMailerTransporter = () => {
  return nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.BSL_MAIL,
      pass: process.env.BSL_PASSWORD,
    },
  });
};

/**
 * Send Performance Report PDF as attachment.
 * to can be string or array of emails
 */
const sendPerformanceReportPdfMail = async ({
  to,
  cc,
  bcc,
  subject,
  html,
  pdfBuffer,
  fileName = "Performance_Report.pdf",
}) => {
  if (!pdfBuffer || !Buffer.isBuffer(pdfBuffer)) {
    throw new Error("pdfBuffer must be a Buffer");
  }

  if (!to || (Array.isArray(to) && to.length === 0)) {
    throw new Error("Recipient email(s) required");
  }

  const transporter = getMailerTransporter();

  const mailOptions = {
    from: process.env.BSL_MAIL,
    to, // can be string or array
    cc,
    bcc,
    subject: subject || "Performance Report",
    html:
      html ||
      `<div style="font-family: Arial, sans-serif; color:#333;">
        <p>Please find the attached Performance Report PDF below.</p>
      </div>`,
    attachments: [
      {
        filename: fileName,
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ],
  };

  // sendMail returns a promise if you don't pass a callback
  return await transporter.sendMail(mailOptions);
};











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





const SendMailToUser = async (email, password, name, organisationName="Bharat Seats , Kharkhoda")=>{
  // Create a transporter object
  const transporter = nodemailer.createTransport({
      host: 'smtp.office365.com',
    port: 587,
          secure:false,

    auth: {
	    user: process.env.BSL_MAIL,
      pass: process.env.BSL_PASSWORD,

    }
  });

  // Configure the mailoptions object
  const mailOptions = {
    from: process.env.BSL_MAIL,
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
        <a href="https://20.198.22.6/" style="color: #007BFF; text-decoration: none; font-weight: bold;">Login Now</a>
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

function formatDurationString(durations) {
  const nameMap = {
    Front_Line: "Front Line",
    RB: "Rear Back",
    RC: "Rear Cushion",
  };

  return Object.entries(durations)
    .filter(([, data]) => data.duration > 10)
    .map(([line, data]) => {
      const roundedDuration = Math.round(data.duration / 5) * 5;
      return `${nameMap[line]}: ${roundedDuration} mins`;
    })
    .join(", ");
}



const SendMailToUserAlert = async (email, message, lineName, duration) => {
  console.log(email, message, lineName, duration, "inside the mail function");

  const transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.BSL_MAIL,
      pass: process.env.BSL_PASSWORD,
    },
  });

  // Convert "Downtime Alert:\nLine: ...\nLine: ..." into HTML safely
  const safeMessage = String(message || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br/>");

  const mailOptions = {
    from: process.env.BSL_MAIL,
    to: email,
    subject: `DOWNTIME ALERT: ${lineName}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 18px; color: #000;">
        <h2 style="margin: 0 0 14px 0; font-size: 24px; font-weight: 700;">
          Downtime Alert
        </h2>

        <p style="margin: 0 0 12px 0; font-size: 18px; line-height: 1.6;">
          A downtime condition has been detected at BSL Kharkhoda Plant.
        </p>

        <!-- No border, bigger text -->
        <div style="margin: 14px 0; padding: 12px;">
          <div style="font-size: 18px; line-height: 1.7; white-space: normal;">
            ${safeMessage}
          </div>
        </div>

        <p style="margin: 14px 0 0 0; font-size: 18px; line-height: 1.6;">
          Please take corrective action to resume operations.
        </p>

        <p style="margin: 20px 0 0 0; font-size: 14px; line-height: 1.5;">
          This is an automated alert from the BSL Digital Factory application.
        </p>
      </div>
    `,
  };

  transporter.sendMail(mailOptions, function (error) {
    if (error) {
      console.log("Error:", error);
    } else {
      console.log("Email sent:", email);
    }
  });
};


const SendMailToUserAlert222 = async (email, info ,lineName="Front Line") => {
	console.log(email,info , lineName,"inside the mail function");
  const transporter = nodemailer.createTransport({
	  host: 'smtp.office365.com',
    port: 587,
	  secure:false,
    auth: {
      user: process.env.BSL_MAIL,
      pass: process.env.BSL_PASSWORD,
    }
  });

  const mailOptions = {
    from: process.env.BSL_MAIL,
    to: email,
    subject: `DOWNTIME ALERT:${lineName}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9; color: #333;">
        <h2 style=""> ${lineName}  Downtime Alert</h2>
        <p style="font-size: 16px;">${lineName} in <strong style="color: #007BFF;">BSL Kharkhoda Plant</strong> has been detected as <strong>inactive</strong> for the past</p>
        
        <p style="font-size: 16px;">
          <b style="">${info}  </b> 
        </p>
	<p>Please take corrective action for resuming operations</p>


        <p style="font-size: 14px; color: #6c757d; margin-top: 30px;">This is an automated alert from the BSL Digital Factory application. Please do not ignore this notification .</p>
      </div>
    `
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log('Error:', error);
    } else {
      console.log('Email sent:', email);
    }
  });
}








const SendMailNUCAlert = async (email, duration) => {
  const transporter = nodemailer.createTransport({
          host: 'smtp.office365.com',
    port: 587,
          secure:false,
    auth: {
      user: process.env.BSL_MAIL,
      pass: process.env.BSL_PASSWORD,
    }
  });

  const mailOptions = {
    from: process.env.BSL_MAIL,
    to: email,
 subject: `IIoT Gateway Connectivity Failure Alert `,
   html: `
  <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9; color: #333;">
    <h2>IIoT Gateway Connectivity Failure Alert</h2>
    <p style="font-size: 16px;">
      Data Communication between Kharkhoda Plant and IIoT Application is down since past <strong>${duration} minutes</strong>
    </p>
    <p style="font-size: 16px;">
      
    </p>
    <p>Kindly ensure the Internet Connectivity and Power On Status at the site on priority.</p>
    <p style="font-size: 14px; color: #6c757d; margin-top: 30px;">
      This is an automated alert from the BSL Digital Factory application. Please do not ignore this notification.
    </p>
  </div>
`
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log('Error:', error);
    } else {
      console.log('Email sent:', email);
    }
  });
}




const SendMailNUCRestored = async (email) => {
  const transporter = nodemailer.createTransport({
          host: 'smtp.office365.com',
    port: 587,
          secure:false,
    auth: {
      user: process.env.BSL_MAIL,
      pass: process.env.BSL_PASSWORD,
    }
  });

  const mailOptions = {
    from: process.env.BSL_MAIL,
    to: email,
	   subject: `IIoT Gateway Connectivity Restored`,
    html: `
  <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9; color: #333;">
    <h2>IIoT Gateway Connectivity Restored</h2>
    <p style="font-size: 16px;">
      Data Communication between Kharkhoda Plant and IIoT Application has been restored. If the issue was due to a network outage, the stored data will be reflected on the dashboard after some time.
    </p>
    <p style="font-size: 14px; color: #6c757d; margin-top: 30px;">
      This is an automated alert from the BSL Digital Factory application. Please do not ignore this notification.
    </p>
  </div>
`
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log('Error:', error);
    } else {
      console.log('Email sent:', email);
    }
  });
}







const SendEmailDispatchDelay = async (email,message) => {
  const transporter = nodemailer.createTransport({
          host: 'smtp.office365.com',
    port: 587,
          secure:false,
    auth: {
      user: process.env.BSL_MAIL,
      pass: process.env.BSL_PASSWORD,
    }
  });

  const mailOptions = {
    from: process.env.BSL_MAIL,
    to: email,
	   subject: `Dispatch Wagon Delay `,
    html: `
  <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9; color: #333;">
    <h2>Dispatch Wagon Delay</h2>
    <p style="font-size: 16px;">
      ${message}
    </p>
    <p>Please take corrective actions </p>
    <p style="font-size: 14px; color: #6c757d; margin-top: 30px;">
      This is an automated alert from the BSL Digital Factory application. Please do not ignore this notification.
    </p>
  </div>
`
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log('Error:', error);
    } else {
      console.log('Email sent:', email);
    }
  });
}










  module.exports={comparePassword,hashPassword,getRole,sendPerformanceReportPdfMail , SendMailToUser, SendMailToUserAlert , SendMailNUCAlert , SendMailNUCRestored ,SendEmailDispatchDelay}


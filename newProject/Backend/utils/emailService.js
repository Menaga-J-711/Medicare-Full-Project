// Backend/utils/emailService.js
const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // true only if using port 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendOTP(email, otp) {
  try {
    const info = await transporter.sendMail({
      from: `"MediCare" <${process.env.FROM_EMAIL}>`,
      to: email,
      subject: "Your MediCare OTP Verification Code",
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.5;color:#333">
          <h2>OTP Verification</h2>
          <p>Hello,</p>
          <p>Your one-time password (OTP) for joining the MediCare queue is:</p>
          <h1 style="color:#2e86de;">${otp}</h1>
          <p>This code is valid for 5 minutes. Please do not share it with anyone.</p>
          <hr/>
          <p>Thanks,<br/>MediCare Support</p>
        </div>
      `,
    });
    console.log("✅ OTP email sent to:", email, "| Message ID:", info.messageId);
  } catch (error) {
    console.error("❌ Error sending OTP email:", error);
  }
}

module.exports = sendOTP;

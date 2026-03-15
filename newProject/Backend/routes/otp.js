// backend/routes/otp.js
const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const Otp = require("../models/Otp");
const Appointment = require("../models/Appointment");
require("dotenv").config();

// ✅ Send OTP
router.post("/send-otp", async (req, res) => {
  const { email } = req.body;

  if (!email)
    return res.status(400).json({ success: false, msg: "Email required" });

  try {

    // 🔹 Step 1: Check if email exists at all
    const emailExists = await Appointment.findOne({ email });

    if (!emailExists) {
      return res.status(400).json({
        success: false,
        msg: "Email not found in appointment records"
      });
    }

    // 🔹 Step 2: Get today's date
    const today = new Date().toISOString().split("T")[0];

    // 🔹 Step 3: Check if appointment is for today
    const todayAppointment = await Appointment.findOne({
      email,
      date: today,
      status: "Waiting"
    });

    if (!todayAppointment) {
      return res.status(400).json({
        success: false,
        msg: "No valid appointment for today"
      });
    }

    // 🔹 Step 4: Generate OTP ONLY AFTER CHECKS
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await Otp.create({ email, otp });

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  connectionTimeout: 60000,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

    await transporter.sendMail({
      from: `"MediCare Team" <${process.env.FROM_EMAIL}>`,
      to: email,
      subject: "Your MediCare OTP Code",
      text: `Your OTP is ${otp}. Valid for 5 minutes.`,
    });

    res.json({ success: true, msg: "OTP sent successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
});

// ✅ Verify OTP
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ success: false, msg: "Missing fields" });

  try {
    const record = await Otp.findOne({ email, otp });
    if (!record) {
      return res.status(400).json({ success: false, msg: "Invalid or expired OTP" });
    }

    // Delete OTP once verified
    await Otp.deleteMany({ email });

    res.json({ success: true, msg: "OTP verified successfully" });
  } catch (err) {
    console.error("❌ Error verifying OTP:", err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
});

module.exports = router;

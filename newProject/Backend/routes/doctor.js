//const express = require("express");
const bcrypt = require("bcryptjs");
const Doctor = require("../models/Doctor");

const router =require("express").Router();

/**
 * POST /api/doctors/login
 * Doctor login
 */
router.post("/login", async (req, res) => {
  

  try {
    const { doctorId, email, password } = req.body;

    // 1️⃣ Validate input
    if (!doctorId || !email || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    // 2️⃣ Find doctor
    const doctor = await Doctor.findOne({ doctorId, email });

    if (!doctor) {
      return res.status(401).json({ msg: "Invalid Doctor ID or Email" });
    }

    // 3️⃣ Compare password
    const isMatch = await bcrypt.compare(password, doctor.password);

    if (!isMatch) {
      return res.status(401).json({ msg: "Invalid Password" });
    }

    // 4️⃣ Mark doctor available
    doctor.available = true;
    await doctor.save();

    // 5️⃣ Success response
    res.status(200).json({
      success: true,
      msg: "Doctor login successful",
      doctor: {
        id: doctor._id,
        doctorId: doctor.doctorId,
        name: doctor.name,
        specialization: doctor.specialization
      }
    });

  } catch (error) {
    console.error("Doctor login error:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

// Get doctors by hospital
router.get("/hospital/:hospitalId", async (req, res) => {
  try {
    const doctors = await Doctor.find({
      hospital: req.params.hospitalId
    });

    res.json(doctors);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;

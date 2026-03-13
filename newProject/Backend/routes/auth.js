const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const Admin = require("../models/Admin");
const Doctor = require("../models/Doctor");
const Hospital = require("../models/Hospital");

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password, role, hospitalId } = req.body;

    if (!email || !password || !role || !hospitalId) {
      return res.status(400).json({ msg: "Missing fields" });
    }

    // Validate hospital exists
    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
      return res.status(404).json({ msg: "Hospital not found" });
    }

    let user;

    if (role === "admin") {
      // Search with hospital as STRING (because it's stored as string in DB)
      user = await Admin.findOne({ email, hospital: hospitalId });
    } else if (role === "doctor") {
      // Search with hospital as STRING (because it's stored as string in DB)
      user = await Doctor.findOne({ email, hospital: hospitalId });
    } else {
      return res.status(400).json({ msg: "Invalid role" });
    }

    if (!user) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        role,
        hospitalId
      },
      process.env.JWT_SECRET || "devsecret",
      { expiresIn: "1d" }
    );

    res.json({
      success: true,
      token,
      role,
      hospitalId,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

module.exports = router;
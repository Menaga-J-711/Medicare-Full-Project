// routes/emergency.js
const express = require("express");
const router = express.Router();
const Emergency = require("../models/Emergency");

// POST - save emergency request
router.post("/", async (req, res) => {
  try {
    console.log("🚨 Incoming Emergency Request:", req.body); // 👈 log input

    const { location, bloodGroup } = req.body;

    if (!location || !bloodGroup) {
      console.log("❌ Missing fields:", req.body);
      return res.status(400).json({ msg: "Location and blood group are required" });
    }

    const newEmergency = new Emergency({ location, bloodGroup });
    await newEmergency.save();

    console.log("✅ Emergency saved:", newEmergency);
    res.status(201).json({ msg: "Emergency request saved", data: newEmergency });
  } catch (err) {
    console.error("🔥 Error in /api/emergency:", err);
    res.status(500).json({ error: err.message });
  }
});


// GET - fetch all emergencies (optional for admin dashboard)
router.get("/", async (req, res) => {
  try {
    const emergencies = await Emergency.find().sort({ createdAt: -1 });
    res.json(emergencies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
    
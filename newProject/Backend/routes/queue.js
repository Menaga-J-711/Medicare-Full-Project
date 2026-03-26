const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");

// ===============================
// JOIN QUEUE
// ===============================
router.post("/join", async (req, res) => {
  const { email } = req.body;

  try {
    const appointment = await Appointment.findOne({
      email,
      status: "Waiting"
    });

    if (!appointment) {
      return res.status(400).json({
        message: "No valid appointment found"
      });
    }

    appointment.status = "In Queue";
    await appointment.save();

    // 🔥 SOCKET EMIT (REALTIME FIX)
    const io = req.app.get("io");
    io.emit("queueUpdateDoctor");

    res.json({ message: "Joined queue successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ===============================
// LEAVE QUEUE
// ===============================
router.post("/leave", async (req, res) => {
  const { email } = req.body;

  try {
    const appointment = await Appointment.findOne({
      email,
      status: "In Queue"
    });

    if (!appointment) {
      return res.status(400).json({
        message: "Not currently in queue"
      });
    }

    appointment.status = "Left";
    await appointment.save();

    // 🔥 SOCKET EMIT
    const io = req.app.get("io");
    io.emit("queueUpdateDoctor");

    res.json({ message: "Left queue successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ===============================
// GET QUEUE DETAILS
// ===============================
router.get("/:email", async (req, res) => {
  try {
    const { email } = req.params;

    // 1️⃣ Find current user
    const patient = await Appointment.findOne({
      email,
      status: "In Queue"
    }).populate("doctor", "name");

    if (!patient) {
      return res.json({ inQueue: false });
    }

    // 2️⃣ Get queue (FIXED SORTING 🔥)
    const queueList = await Appointment.find({
      doctor: patient.doctor._id,
      date: patient.date,
      status: "In Queue"
    })
      .populate("doctor", "name")
      .select("patientName email doctor date")
      .sort({ updatedAt: 1 }); // ✅ FIXED

    // 3️⃣ Position
    const position =
      queueList.findIndex(p => p.email === email) + 1;

    res.json({
      inQueue: true,
      doctor: patient.doctor.name,
      queue: queueList,
      position
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

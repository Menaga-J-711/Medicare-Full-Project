const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");

// JOIN QUEUE
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

    res.json({ message: "Joined queue successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// LEAVE QUEUE
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

    res.json({ message: "Left queue successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET QUEUE DETAILS (Professional Auto Fetch)
router.get("/:email", async (req, res) => {
  try {
    const { email } = req.params;

    // 1️⃣ Find this patient who is currently in queue
    const patient = await Appointment.findOne({
    email,
    status: "In Queue"
      }).populate("doctor", "name");

    if (!patient) {
      return res.json({ inQueue: false });
    }

    // 2️⃣ Get all patients for same doctor & same date
    const queueList = await Appointment.find({
      doctor: patient.doctor._id,
      date: patient.date,
      status: "In Queue"
    }).populate("doctor", "name").sort({ createdAt: 1 });

    // 3️⃣ Calculate position
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
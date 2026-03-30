const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");

// ===============================
// JOIN QUEUE
// ===============================
router.post("/join", async (req, res) => {
  const { email, patientName, doctor, hospital, date, time } = req.body;

  try {
    if (!email || !patientName || !doctor || !hospital || !date || !time) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existing = await Appointment.findOne({
      email,
      status: "In Queue",
    });

    if (existing) {
      return res.status(400).json({
        message: "You are already in queue",
      });
    }

    const count = await Appointment.countDocuments({
      doctor,
      date,
      status: "In Queue",
    });

    const newAppointment = new Appointment({
      email,
      patientName,
      doctor,
      hospital,
      date,
      time,
      queueNumber: count + 1,
      status: "In Queue",
    });

    await newAppointment.save();

    // ✅ 🔥 EMIT BEFORE RESPONSE
    req.app.get("io").emit("queueUpdateDoctor");

    // ✅ KEEP ONLY ONE RESPONSE
    res.status(200).json({
      message: "Joined queue successfully",
      appointment: newAppointment,
    });

  } catch (error) {
    console.error("JOIN ERROR:", error);
    res.status(500).json({
      message: "Error joining queue",
    });
  }
});

// ===============================
// LEAVE QUEUE
// ===============================
router.post("/leave", async (req, res) => {
  try {
    const { email } = req.body;

    await Appointment.findOneAndDelete({
      email,
      status: "In Queue",
    });

    // ✅ 🔥 BROADCAST UPDATE
    req.app.get("io").emit("queueUpdateDoctor");

    res.json({ message: "Left queue successfully" });

  } catch (err) {
    console.error("LEAVE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

// ===============================
// GET QUEUE DETAILS
// ===============================
router.get("/:email", async (req, res) => {
  try {
    const { email } = req.params;

    // 1️⃣ Find current patient
    const patient = await Appointment.findOne({
      email,
      status: "In Queue",
    }).populate("doctor", "name");

    if (!patient) {
      return res.json({ inQueue: false });
    }

    // 2️⃣ Get full queue (FIFO)
    const queueList = await Appointment.find({
      doctor: patient.doctor._id,
      date: patient.date,
      status: "In Queue",
    })
      .populate("doctor", "name")
      .select("patientName email doctor date createdAt")
      .sort({ createdAt: 1 });

    // 3️⃣ Calculate position
    const position =
      queueList.findIndex(
        (p) => p.email.toLowerCase() === email.toLowerCase()
      ) + 1;

    // 4️⃣ Format queue
    const formattedQueue = queueList.map((q) => ({
      _id: q._id,
      email: q.email,
      patientName: q.patientName || "No Name",
    }));

    res.json({
      inQueue: true,
      doctor: patient.doctor?.name || "Doctor",
      queue: formattedQueue,
      position,
      total: queueList.length,
      isNext: position === 1,
    });
  } catch (err) {
    console.error("GET QUEUE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

// ===============================
// GET QUEUE DETAILS (FINAL FIXED)
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
      .select("patientName email doctor date createdAt") // ✅ cleaned
      .sort({ createdAt: 1 });

    // 3️⃣ Calculate position
    const position =
      queueList.findIndex(
        (p) => p.email.toLowerCase() === email.toLowerCase()
      ) + 1;

    // 4️⃣ Format queue response
    const formattedQueue = queueList.map((q) => ({
      _id: q._id,
      email: q.email,
      patientName: q.patientName || "No Name", // ✅ only correct field
    }));

    res.json({
      inQueue: true,
      doctor: patient.doctor?.name || "Doctor",
      queue: formattedQueue,
      position,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

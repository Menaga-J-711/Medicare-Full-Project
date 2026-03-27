```js
// ===============================
// GET QUEUE DETAILS (FINAL WORKING)
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

    // 2️⃣ Get queue (FIFO order)
    const queueList = await Appointment.find({
      doctor: patient.doctor._id,
      date: patient.date,
      status: "In Queue"
    })
      .populate("doctor", "name")
      // 🔥 IMPORTANT: include BOTH fields
      .select("patientName name email doctor date createdAt")
      .sort({ createdAt: 1 });

    // 3️⃣ Calculate position
    const position =
      queueList.findIndex(
        (p) => p.email.toLowerCase() === email.toLowerCase()
      ) + 1;

    // 4️⃣ FORMAT RESPONSE (🔥 FINAL FIX HERE)
    const formattedQueue = queueList.map((q) => ({
      _id: q._id,
      email: q.email,
      patientName: q.patientName || q.name || "No Name", // ✅ supports old + new data
    }));

    res.json({
      inQueue: true,
      doctor: patient.doctor?.name || "Doctor",
      queue: formattedQueue,
      position
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});
```

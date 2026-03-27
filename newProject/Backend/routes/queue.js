```js
// ===============================
// GET QUEUE DETAILS (FINAL FIXED)
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

    // 2️⃣ Get queue (🔥 FIXED SORTING)
    const queueList = await Appointment.find({
      doctor: patient.doctor._id,
      date: patient.date,
      status: "In Queue"
    })
      .populate("doctor", "name")
      .select("patientName email doctor date createdAt")
      .sort({ createdAt: 1 }); // ✅ CORRECT (FIFO)

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
```

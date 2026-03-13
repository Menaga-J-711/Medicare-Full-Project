const mongoose = require("mongoose");

const QueueSchema = new mongoose.Schema({
  patientName: { type: String, required: true },

  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hospital",
    required: true
  },

  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true
  },

  status: {
    type: String,
    enum: ["waiting", "consulting", "completed"],
    default: "waiting"
  },

  joinedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Queue", QueueSchema);

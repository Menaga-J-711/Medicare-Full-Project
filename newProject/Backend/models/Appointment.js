const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    { timestamps: true },

    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },

    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      required: true,
    },

    date: { type: String, required: true },
    time: { type: String, required: true },

    queueNumber: { type: Number },

    status: {
      type: String,
       enum: ["Waiting", "In Queue", "Completed", "Left"],
      default: "Waiting",
    },

    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", AppointmentSchema);

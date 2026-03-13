const mongoose = require("mongoose");

const HospitalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  city: String,
  latitude: Number,
  longitude: Number,
  bloodGroups: [String]
}, { timestamps: true });

module.exports = mongoose.model("Hospital", HospitalSchema);

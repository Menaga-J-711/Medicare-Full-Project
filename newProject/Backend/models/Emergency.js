// models/Emergency.js
const mongoose = require("mongoose");

const EmergencySchema = new mongoose.Schema({
  location: { type: String, required: true },
  bloodGroup: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Emergency", EmergencySchema);

const mongoose = require("mongoose");

// Doctor Schema Definition
const DoctorSchema = new mongoose.Schema({

  // Unique Doctor ID (custom ID like DOC001)
  doctorId: { 
    type: String, 
    required: true, 
    unique: true 
  },

  // Doctor full name
  name: { 
    type: String, 
    required: true 
  },

  // Doctor login email
  email: { 
    type: String, 
    required: true 
  },

  // Doctor login password (should be hashed before saving)
  password: { 
    type: String, 
    required: true 
  },

  // Role field (default role is doctor)
  role: { 
    type: String, 
    default: "doctor" 
  },

  // Medical specialization (Cardiology, ENT, etc.)
  specialization: String,

  // Years of experience
  experience: Number,

  // 🔥 Reference to Hospital collection
  // This links doctor to a specific hospital using ObjectId
  hospital: {
    type: mongoose.Schema.Types.ObjectId,  // Stores Hospital _id
    ref: "Hospital",                       // References Hospital model
    required: true
  },

  // Doctor availability status (for appointment system)
  available: { 
    type: Boolean, 
    default: false 
  },

  // Current working status
  status: {
    type: String,
    enum: ["idle", "consulting"],  // Only these two values allowed
    default: "idle"
  },

  // Doctor profile image URL
  image: String

}, { 
  timestamps: true   // Automatically adds createdAt and updatedAt fields
});

// Export Doctor model
module.exports = mongoose.model("Doctor", DoctorSchema);
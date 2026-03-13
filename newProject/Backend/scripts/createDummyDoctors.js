const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Doctor = require("../models/Doctor");

mongoose.connect("YOUR_MONGODB_ATLAS_URL")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

async function createDoctors() {
  const doctors = [
    {
      doctorId: "DOC101",
      email: "doc1@medicare.com",
      password: await bcrypt.hash("doc101", 10),
      name: "Dr. Arjun Kumar",
      specialization: "Cardiology",
      experience: 8,
      hospital: new mongoose.Types.ObjectId(),
    },
    {
      doctorId: "DOC102",
      email: "doc2@medicare.com",
      password: await bcrypt.hash("doc102", 10),
      name: "Dr. Meera Nair",
      specialization: "Neurology",
      experience: 6,
      hospital: new mongoose.Types.ObjectId(),
    },
    {
      doctorId: "DOC103",
      email: "doc3@medicare.com",
      password: await bcrypt.hash("doc103", 10),
      name: "Dr. Rahul Singh",
      specialization: "Orthopedics",
      experience: 10,
      hospital: new mongoose.Types.ObjectId(),
    }
  ];

  await Doctor.insertMany(doctors);
  console.log("Dummy doctors inserted");
  process.exit();
}

createDoctors();

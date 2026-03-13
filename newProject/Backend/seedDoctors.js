const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const connectDB = require("./db");
const Doctor = require("./models/Doctor");
const Hospital = require("./models/Hospital");

const seedDoctors = async () => {
  try {
    await connectDB();

    const hospital = await Hospital.findOne(); // single hospital (as you decided)
    if (!hospital) {
      console.log("❌ No hospital found. Seed hospital first.");
      process.exit();
    }

    await Doctor.deleteMany();

    const hashedPassword = await bcrypt.hash("doctor@123", 10);

    const doctors = [
      {
        doctorId: "DOC101",
        name: "Dr. A. Kumar",
        email: "kumar@medicare.com",
        password:"$2b$10$0IsW8qCGd6uvdt1lElwrZ.vzsOF8/./dArNHPgAj.rJqbeMRncS9y",
        specialization: "Cardiologist",
        experience: 12,
        hospital:"69744ea44ab50ee072fe7162",
        image: "https://cdn-icons-png.flaticon.com/512/387/387561.png"
      },
      {
        doctorId: "DOC102",
        name: "Dr. S. Meena",
        email: "meena@medicare.com",
        password: "$2b$10$0IsW8qCGd6uvdt1lElwrZ.vzsOF8/./dArNHPgAj.rJqbeMRncS9y",
        specialization: "Dermatologist",
        experience: 8,
        hospital: "69744ea44ab50ee072fe7162",
        image: "https://cdn-icons-png.flaticon.com/512/387/387569.png"
      },
      {
        doctorId: "DOC103",
        name: "Dr. R. Vivek",
        email: "vivek@medicare.com",
        password: "$2b$10$0IsW8qCGd6uvdt1lElwrZ.vzsOF8/./dArNHPgAj.rJqbeMRncS9y",
        specialization: "Orthopedic",
        experience: 15,
        hospital: "69744ea44ab50ee072fe7162",
        image: "https://cdn-icons-png.flaticon.com/512/414/414927.png"
      }
    ];

    await Doctor.insertMany(doctors);
    console.log("✅ Doctors seeded successfully");
    process.exit();

  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDoctors();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Doctor = require("./models/Doctor");
const Hospital = require("./models/Hospital");

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://medicare_user:menaga2004@medicare-cluster.vvdtg2s.mongodb.net/medicare?appName=medicare-cluster",
      { useNewUrlParser: true, useUnifiedTopology: true }
    );
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

const debug = async () => {
  await connectDB();

  const email = "rajesh@medicare.com";
  const hospitalId = "69744ea44ab50ee072fe7162";
  const password = "doctor123";

  console.log("\n🔍 TEST 1: Find doctor by email only");
  const test1 = await Doctor.findOne({ email });
  console.log("Result:", test1 ? "✅ FOUND" : "❌ NOT FOUND");
  if (test1) {
    console.log("Doctor:", {
      email: test1.email,
      hospital: test1.hospital,
      hospitalType: typeof test1.hospital
    });
  }

  console.log("\n🔍 TEST 2: Find doctor by email + hospital (string)");
  const test2 = await Doctor.findOne({ email, hospital: hospitalId });
  console.log("Result:", test2 ? "✅ FOUND" : "❌ NOT FOUND");

  console.log("\n🔍 TEST 3: Check password");
  if (test1) {
    const isMatch = await bcrypt.compare(password, test1.password);
    console.log("Password match:", isMatch ? "✅ YES" : "❌ NO");
  }

  console.log("\n🔍 TEST 4: Check hospital exists");
  const hospital = await Hospital.findById(hospitalId);
  console.log("Hospital found:", hospital ? "✅ YES" : "❌ NO");

  mongoose.connection.close();
};

debug();
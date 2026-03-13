const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://medicare_user:menaga2004@medicare-cluster.vvdtg2s.mongodb.net/medicare?appName=medicare-cluster",
      { useNewUrlParser: true, useUnifiedTopology: true }
    );
    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
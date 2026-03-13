const mongoose = require("mongoose");
const Hospital = require("./models/Hospital");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI);

const hospitals = [
  {
    name: "Sivakasi Government Hospital",
    city: "Sivakasi",
    latitude: 9.4496,
    longitude: 77.7974,
    doctorsAvailable: 12,
    bloodGroups: ["A+", "O+", "B+"],
  },
  {
    name: "Apollo Clinic Sivakasi",
    city: "Sivakasi",
    latitude: 9.4521,
    longitude: 77.8001,
    doctorsAvailable: 8,
    bloodGroups: ["A-", "AB+", "B+"],
  },
  {
    name: "Kovilpatti Government Hospital",
    city: "Kovilpatti",
    latitude: 9.1736,
    longitude: 77.8696,
    doctorsAvailable: 15,
    bloodGroups: ["A+", "B+", "O+"],
  },
  {
    name: "Rajapalayam GH",
    city: "Rajapalayam",
    latitude: 9.4525,
    longitude: 77.5536,
    doctorsAvailable: 18,
    bloodGroups: ["O+", "AB+", "B+"],
  },
];

async function seed() {
  await Hospital.deleteMany();
  await Hospital.insertMany(hospitals);
  console.log("Hospitals seeded");
  process.exit();
}

seed();

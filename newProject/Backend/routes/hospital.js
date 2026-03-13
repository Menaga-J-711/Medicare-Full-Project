const express = require("express");
const router = express.Router();
const Hospital = require("../models/Hospital");

// 📏 Distance calculator (Haversine)
function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}




// Get all hospitals
router.get("/", async (req, res) => {
  try {
    const hospitals = await Hospital.find();
    res.json(hospitals);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// module.exports = router;



// 🚨 Emergency Hospital Search
router.post("/search", async (req, res) => {
  try {
    const { latitude, longitude, bloodGroup } = req.body;

    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({ message: "Location required" });
    }

    // 🔹 Fetch all hospitals
    const hospitals = await Hospital.find().lean();

    // 🔹 Attach distance + required fields
    let results = hospitals.map((h) => {
      const distance = getDistanceKm(
        latitude,
        longitude,
        h.latitude,
        h.longitude
      );

      return {
        id: h._id,
        name: h.name,
        address: h.address,
        city: h.city,
        latitude: h.latitude,
        longitude: h.longitude,
        bloodGroups: h.bloodGroups || [],
        ambulanceAvailable: !!h.ambulanceAvailable,
        ambulanceNumber: h.ambulanceNumber || null,
        doctorsAvailable: h.doctorsAvailable ?? 0,
        distance: Number(distance.toFixed(2)),
      };
    });

    // 🔹 Blood group filter (optional)
    if (bloodGroup) {
      results = results.filter((h) =>
        Array.isArray(h.bloodGroups) &&
        h.bloodGroups.includes(bloodGroup)
      );
    }

    // 🔹 Sort by nearest first
    results.sort((a, b) => a.distance - b.distance);

    // 🔹 Primary filter: within 30 km
    const nearby = results.filter((h) => h.distance <= 30);

    // 🔹 EMERGENCY FALLBACK
    // If no hospitals within 30km → return nearest hospitals anyway
    const finalResults =
      nearby.length > 0 ? nearby : results.slice(0, 5);

    res.json(finalResults);
  } catch (err) {
    console.error("🔥 Hospital search error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

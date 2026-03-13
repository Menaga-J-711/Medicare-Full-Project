const express = require("express");
const router = express.Router();
const Doctor = require("../models/Doctor");

// Get doctors by hospital ID
router.get("/hospital/:hospitalId", async (req, res) => {
  try {
    const doctors = await Doctor.find({
      hospital: req.params.hospitalId
    });

    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
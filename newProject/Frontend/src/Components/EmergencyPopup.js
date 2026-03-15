// ✅ EmergencyPopup.js — UI Upgraded with Framer Motion
// 📦 Requires: npm install framer-motion (already installed from LandingPage)
// ✅ Core logic 100% unchanged

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./EmergencyPopup.css";
import HospitalListPopup from "./HospitalListPopup";

// ── Animation Variants ──────────────────────────────────────
const overlayAnim = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.28 } },
  exit:    { opacity: 0, transition: { duration: 0.22 } },
};

const containerAnim = {
  hidden:  { opacity: 0, scale: 0.82, y: 50 },
  visible: { opacity: 1, scale: 1,    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, scale: 0.88, y: 30,
    transition: { duration: 0.28, ease: "easeIn" } },
};

const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.1 } },
};

// ── Component ───────────────────────────────────────────────
const EmergencyPopup = ({ onClose }) => {

  // ── Original state — NOT touched ──
  const [isEmergency,      setIsEmergency]      = useState(null);
  const [locationInput,    setLocationInput]    = useState("");
  const [coords,           setCoords]           = useState(null);
  const [bloodGroup,       setBloodGroup]       = useState("");
  const [hospitalResults,  setHospitalResults]  = useState([]);
  const [showHospitalList, setShowHospitalList] = useState(false);
  const [loadingLocation,  setLoadingLocation]  = useState(false);
  const [loadingHospitals, setLoadingHospitals] = useState(false);
  const [locationError,    setLocationError]    = useState("");

  const API_URL = "https://medicare-full-project.onrender.com";

  // ── Original handlers — NOT touched ──
  const handleYes = () => {
    setIsEmergency(true);
    setLocationError("");
    setLoadingLocation(true);
    if (!navigator.geolocation) {
      setLocationError("Geolocation not supported.");
      setLoadingLocation(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setCoords({ latitude: lat, longitude: lng });
        setLocationInput(`${lat}, ${lng}`);
        setLoadingLocation(false);
      },
      () => {
        setLocationError("Unable to fetch location. You can type your city.");
        setLoadingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 20000 }
    );
  };

  const geocodeLocation = async (place) => {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(place)}`
    );
    const data = await res.json();
    if (!data || data.length === 0) return null;
    return { latitude: parseFloat(data[0].lat), longitude: parseFloat(data[0].lon) };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!locationInput) { alert("📍 Please enter or allow location"); return; }
    setLoadingHospitals(true);
    let finalCoords = coords;
    if (locationInput.includes(",")) {
      const [lat, lng] = locationInput.split(",").map((v) => parseFloat(v.trim()));
      if (!isNaN(lat) && !isNaN(lng)) finalCoords = { latitude: lat, longitude: lng };
    }
    if (!finalCoords) {
      const geo = await geocodeLocation(locationInput);
      if (!geo) { alert("❌ Location not found. Try a nearby city."); setLoadingHospitals(false); return; }
      finalCoords = geo;
    }
    try {
      const res = await fetch(`${API_URL}/api/hospitals/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ latitude: finalCoords.latitude, longitude: finalCoords.longitude, bloodGroup }),
      });
      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0) alert("⚠️ No nearby hospitals found. Showing closest results.");
      setHospitalResults(data);
      setShowHospitalList(true);
    } catch {
      alert("Server error while fetching hospitals.");
    } finally {
      setLoadingHospitals(false);
    }
  };

  // ── JSX ─────────────────────────────────────────────────────
  return (
    <AnimatePresence>
      <motion.div
        className="popup-overlay"
        variants={overlayAnim}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <motion.div
          className="popup-container"
          variants={containerAnim}
          initial="hidden"
          animate="visible"
          exit="exit"
        >

          {/* ── Step 1: YES / NO ── */}
          <AnimatePresence mode="wait">
            {isEmergency === null && (
              <motion.div
                key="yesno"
                variants={stagger}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
              >
                {/* Pulse icon */}
                <motion.div
                  className="emergency-icon"
                  animate={{ scale: [1, 1.12, 1] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                >
                  🚨
                </motion.div>

                <motion.h2 variants={fadeUp} custom={0}>
                  Are you in an Emergency?
                </motion.h2>

                <motion.p className="popup-subtitle" variants={fadeUp} custom={1}>
                  We'll find the nearest hospitals and ambulances for you immediately.
                </motion.p>

                <motion.div className="popup-buttons" variants={fadeUp} custom={2}>
                  <motion.button
                    className="btn-yes"
                    onClick={handleYes}
                    whileHover={{ scale: 1.06, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    🆘 Yes, Emergency!
                  </motion.button>
                  <motion.button
                    className="btn-no"
                    onClick={onClose}
                    whileHover={{ scale: 1.04, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    No, I'm Fine
                  </motion.button>
                </motion.div>
              </motion.div>
            )}

            {/* ── Step 2: FORM ── */}
            {isEmergency && !showHospitalList && (
              <motion.form
                key="form"
                className="popup-form"
                onSubmit={handleSubmit}
                variants={stagger}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
              >
                <motion.div className="form-header" variants={fadeUp} custom={0}>
                  <span className="form-header-icon">🏥</span>
                  <h2>Emergency Details</h2>
                  <p className="popup-subtitle">Fill in the details below and we'll locate the nearest help.</p>
                </motion.div>

                {/* Location field */}
                <motion.div className="form-group" variants={fadeUp} custom={1}>
                  <label>📍 Location (Auto-detected or type city)</label>
                  <div className="input-wrapper">
                    <input
                      type="text"
                      placeholder="Detecting location… or type city name"
                      value={locationInput}
                      onChange={(e) => {
                        setLocationInput(e.target.value);
                        setCoords(null);
                      }}
                    />
                    {loadingLocation && (
                      <span className="input-status detecting">
                        <span className="spinner" /> Detecting…
                      </span>
                    )}
                  </div>
                  {locationError && (
                    <motion.p
                      className="location-error"
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      ⚠️ {locationError}
                    </motion.p>
                  )}
                </motion.div>

                {/* Blood group */}
                <motion.div className="form-group" variants={fadeUp} custom={2}>
                  <label>🩸 Blood Group <span className="optional">(Optional)</span></label>
                  <select value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)}>
                    <option value="">I don't know</option>
                    {["A+","A-","B+","B-","O+","O-","AB+","AB-"].map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </motion.div>

                {/* Submit */}
                <motion.button
                  type="submit"
                  className="submit-btn"
                  disabled={loadingHospitals}
                  variants={fadeUp}
                  custom={3}
                  whileHover={!loadingHospitals ? { scale: 1.03, y: -2 } : {}}
                  whileTap={!loadingHospitals ? { scale: 0.97 } : {}}
                >
                  {loadingHospitals ? (
                    <span className="btn-loading">
                      <span className="spinner white" /> Searching Hospitals…
                    </span>
                  ) : (
                    "🔍 Find Nearby Hospitals"
                  )}
                </motion.button>

                <motion.button
                  type="button"
                  className="cancel-link"
                  onClick={onClose}
                  variants={fadeUp}
                  custom={4}
                  whileHover={{ scale: 1.02 }}
                >
                  Cancel
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* ── Step 3: Hospital List ── */}
          {showHospitalList && (
            <HospitalListPopup
              hospitals={hospitalResults}
              onClose={() => { setShowHospitalList(false); onClose(); }}
            />
          )}

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EmergencyPopup;

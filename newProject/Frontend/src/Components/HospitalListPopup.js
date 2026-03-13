// ✅ HospitalListPopup.js — UI Upgraded with Framer Motion
// ✅ Core logic 100% unchanged — same props, same handlers

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./HospitalListPopup.css";

const overlayAnim = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.28 } },
  exit:    { opacity: 0, transition: { duration: 0.22 } },
};

const popupAnim = {
  hidden:  { opacity: 0, scale: 0.88, y: 50 },
  visible: { opacity: 1, scale: 1,    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, scale: 0.9,  y: 30,
    transition: { duration: 0.28, ease: "easeIn" } },
};

const cardAnim = {
  hidden:  { opacity: 0, y: 36 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.09 } },
};

const HospitalListPopup = ({ hospitals = [], onClose }) => {
  return (
    <AnimatePresence>
      <motion.div
        className="hospital-popup-overlay"
        variants={overlayAnim}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <motion.div
          className="hospital-popup"
          variants={popupAnim}
          initial="hidden"
          animate="visible"
          exit="exit"
        >

          {/* ── HEADER ── */}
          <div className="hospital-popup-header">
            <div className="header-left">
              <span className="header-icon">🏥</span>
              <div>
                <h2>Nearby Hospitals</h2>
                <p className="header-sub">
                  {hospitals.length > 0
                    ? `${hospitals.length} result${hospitals.length > 1 ? "s" : ""} found near you`
                    : "No results found"}
                </p>
              </div>
            </div>
            <motion.button
              className="close-btn"
              onClick={onClose}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.22 }}
            >
              ×
            </motion.button>
          </div>

          {/* ── BODY ── */}
          <div className="hospital-popup-body">
            {hospitals.length === 0 ? (
              <motion.div
                className="no-data"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="no-data-icon">🔍</span>
                <p>No hospitals available in this area.</p>
                <span>Try searching a different city or expanding your range.</span>
              </motion.div>
            ) : (
              <motion.div
                className="cards-wrapper"
                variants={stagger}
                initial="hidden"
                animate="visible"
              >
                {hospitals.map((h, idx) => (
                  <motion.div
                    key={idx}
                    className="hospital-card"
                    variants={cardAnim}
                    custom={idx}
                    whileHover={{ y: -6, transition: { duration: 0.28 } }}
                  >
                    <div className="card-rank">#{idx + 1}</div>

                    <div className="hospital-title">
                      <h3>{h.name}</h3>
                      <span className="distance">📍 {h.distance} km</span>
                    </div>

                    <div className="info-grid">
                      <div className="info-item">
                        <span className="info-label">📍 Address</span>
                        <span className="info-value">{h.address}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">🩸 Blood Groups</span>
                        <span className="info-value">
                          {h.bloodGroups?.length ? h.bloodGroups.join(", ") : "N/A"}
                        </span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">👨‍⚕️ Doctors</span>
                        <span className="info-value">{h.doctorsAvailable ?? 0} Available</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">🚑 Ambulance</span>
                        <span className={`info-value badge ${h.ambulanceAvailable ? "badge-green" : "badge-red"}`}>
                          {h.ambulanceAvailable ? "✅ Available" : "❌ Not Available"}
                        </span>
                      </div>
                    </div>

                    <div className="button-group">
                      <motion.a
                        href={`https://www.google.com/maps/search/?api=1&query=${h.latitude},${h.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <button className="navigate-btn">🗺 Navigate</button>
                      </motion.a>

                      {h.ambulanceAvailable && h.ambulanceNumber && (
                        <motion.button
                          className="ambulance-btn"
                          onClick={() => window.open(`tel:${h.ambulanceNumber}`)}
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.97 }}
                        >
                          📞 Call Ambulance
                        </motion.button>
                      )}
                    </div>

                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default HospitalListPopup;
// ✅ buildy/Frontend/src/Components/LandingPage.js
// 🎨 UI UPGRADED with Framer Motion — core logic almost unchanged (OTP removed)

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./LandingPage.css";

// ── Animation variants ──────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 48 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.65, delay: i * 0.14, ease: [0.22, 1, 0.36, 1] },
  }),
};
const fadeLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};
const fadeRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13 } },
};
const modalAnim = {
  hidden: { opacity: 0, scale: 0.82, y: 44 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.42 } },
  exit: { opacity: 0, scale: 0.82, y: 44, transition: { duration: 0.28 } },
};
const overlayAnim = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.28 } },
  exit: { opacity: 0, transition: { duration: 0.22 } },
};

const LandingPage = () => {
  const navigate = useNavigate();

  // ✅ ONLY CHANGE: email state added
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [hospitals, setHospitals] = useState([]);

  const handleJoinQueue = () => setShowModal(true);

  // ✅ SIMPLE JOIN (NO OTP)
  const handleJoinQueueDirect = () => {
    if (!email) return alert("Please enter your email");

    localStorage.setItem("email", email);
    setShowModal(false);
    navigate("/queue", { state: { email } });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return alert("Enter your city name");

    let body;
    if (searchQuery.toLowerCase().includes("kovil"))
      body = { latitude: 9.17, longitude: 77.86, bloodGroup: "A+" };
    else if (searchQuery.toLowerCase().includes("rajap"))
      body = { latitude: 9.45, longitude: 77.55, bloodGroup: "A+" };
    else if (searchQuery.toLowerCase().includes("sivak"))
      body = { latitude: 9.45, longitude: 77.79, bloodGroup: "A+" };
    else return alert("No hospitals found!");

    try {
      const res = await fetch("https://medicare-full-project.onrender.com/api/hospitals/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      setHospitals(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="landing-container">

      {/* NAVBAR */}
      <motion.nav className="navbar" initial={{ y: -80 }} animate={{ y: 0 }}>
        <div className="logo">MediCare</div>

        <ul className="nav-links">
          <li><Link to="/">Emergency</Link></li>
          <li><Link to="/findhospital">Find Hospitals</Link></li>
          <li><Link to="/login">Login</Link></li>
          <li>
            <button onClick={handleJoinQueue} className="queue-btn">
              🚑 Join Queue
            </button>
          </li>
        </ul>
      </motion.nav>

      {/* ✅ UPDATED MODAL (ONLY THIS CHANGED) */}
      <AnimatePresence>
        {showModal && (
          <motion.div className="modal-overlay" variants={overlayAnim} initial="hidden" animate="visible" exit="exit">
            <motion.div className="modal" variants={modalAnim}>
              <h2>📧 Join Queue</h2>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <motion.button onClick={handleJoinQueueDirect}>
                Join Queue
              </motion.button>

              <button onClick={() => setShowModal(false)}>Cancel</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO */}
      <section className="hero">
        <h1>Book Your Doctor Appointment Easily</h1>
      </section>

      {/* SEARCH */}
      <section className="find-hospital">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Enter city"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>

        {hospitals.map((h) => (
          <div key={h.id}>{h.name}</div>
        ))}
      </section>

      <footer>© 2025 MediCare</footer>
    </div>
  );
};

export default LandingPage;

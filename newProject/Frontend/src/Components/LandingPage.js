// ✅ buildy/Frontend/src/Components/LandingPage.js
// 🎨 UI UPGRADED with Framer Motion — core logic 100% unchanged
// 📦 First run: npm install framer-motion

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
  hidden:  { opacity: 0, scale: 0.82, y: 44 },
  visible: { opacity: 1, scale: 1,    y: 0,  transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, scale: 0.82, y: 44, transition: { duration: 0.28, ease: "easeIn" } },
};
const overlayAnim = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.28 } },
  exit:    { opacity: 0, transition: { duration: 0.22 } },
};

// ── Component ───────────────────────────────────────────────
const LandingPage = () => {
  const navigate = useNavigate();

  // ✅ FIXED STATE (email restored, OTP removed)
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [hospitals, setHospitals] = useState([]);
  const [patientName, setPatientName] = useState("");

  const handleJoinQueue = () => setShowModal(true);

  // ✅ NEW SIMPLE JOIN (NO OTP)
const handleJoinDirect = () => {
  if (!email) return alert("Please enter your appointment email");

  if (!patientName) return alert("Please enter your name"); // ✅ use state

  localStorage.setItem("email", email);
  localStorage.setItem("patientName", patientName); // ✅ store correct name

  setShowModal(false);

  navigate("/queue", {
    state: { email, patientName }
  });
};

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return alert("Enter your city name");
    let body;
    if      (searchQuery.toLowerCase().includes("kovil")) body = { latitude: 9.17, longitude: 77.86, bloodGroup: "A+" };
    else if (searchQuery.toLowerCase().includes("rajap")) body = { latitude: 9.45, longitude: 77.55, bloodGroup: "A+" };
    else if (searchQuery.toLowerCase().includes("sivak")) body = { latitude: 9.45, longitude: 77.79, bloodGroup: "A+" };
    else return alert("No hospitals found for this location!");
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
      <motion.nav className="navbar" initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <div className="logo">MediCare</div>
        <ul className="nav-links">
          <li><Link to="/">Emergency</Link></li>
          <li><Link to="/findhospital">Find Hospitals</Link></li>
          <li><Link to="/login">Login</Link></li>
          <li>
            <button onClick={handleJoinQueue} className="queue-btn">🚑 Join Queue</button>
          </li>
        </ul>
      </motion.nav>

      {/* ✅ UPDATED MODAL (OTP REMOVED ONLY) */}
      <AnimatePresence>
        {showModal && (
          <motion.div className="modal-overlay" variants={overlayAnim} initial="hidden" animate="visible" exit="exit">
            <motion.div className="modal" variants={modalAnim}>
              <h2>📧 Join Queue via Email</h2>

             <input
                type="text"
                placeholder="Enter your name"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
              />

              <input
                type="email"
                placeholder="Enter your appointment email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <motion.button onClick={handleJoinDirect} disabled={loading}>
                Join Queue
              </motion.button>

              <motion.button className="cancel-btn" onClick={() => setShowModal(false)}>
                Cancel
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

       {/* ── HERO ── */}
      <section className="hero">
        {/* Floating background particles */}
        <div className="hero-particles">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className={`particle particle-${i + 1}`}
              animate={{ y: [0, -22, 0], opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 3.5 + i * 0.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.35 }}
            />
          ))}
        </div>

        {/* Hero Text */}
        <motion.div className="hero-text" variants={fadeLeft} initial="hidden" animate="visible">
          <motion.span
            className="hero-badge"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35, duration: 0.5 }}
          >
            🏥 Trusted Emergency Care
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            Book Your Doctor <br />
            <span className="highlight-text">Appointment Easily</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.58, duration: 0.6 }}
          >
            Fast, reliable, and convenient appointment booking with top doctors at your fingertips.
          </motion.p>

          <motion.div
            className="hero-buttons"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.72, duration: 0.6 }}
          >
            <motion.span whileHover={{ scale: 1.06, y: -3 }} whileTap={{ scale: 0.97 }}>
              <Link to="/doctors" className="btn-primary">🔍 Find a Doctor</Link>
            </motion.span>
            <motion.span whileHover={{ scale: 1.06, y: -3 }} whileTap={{ scale: 0.97 }}>
              <Link to="/bookMyAppointment" className="btn-secondary">📅 Book Appointment</Link>
            </motion.span>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            className="hero-stats"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.88, duration: 0.6 }}
          >
            {[
              { value: "500+", label: "Doctors" },
              { value: "50+",  label: "Hospitals" },
              { value: "24/7", label: "Support" },
            ].map((s) => (
              <div className="stat-item" key={s.label}>
                <span className="stat-value">{s.value}</span>
                <span className="stat-label">{s.label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Hero Image */}
        <motion.div className="hero-image" variants={fadeRight} initial="hidden" animate="visible">
          <motion.div
            className="hero-image-wrapper"
            animate={{ y: [0, -18, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <img src="/images/doctors-group.png" alt="Doctor-Team" />
            <div className="hero-image-glow" />
          </motion.div>

          <motion.div
            className="floating-badge badge-1"
            animate={{ y: [0, -9, 0] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
          >
            <span className="badge-icon">✅</span>
            <span>Verified Doctors</span>
          </motion.div>

          <motion.div
            className="floating-badge badge-2"
            animate={{ y: [0, -9, 0] }}
            transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 1.1 }}
          >
            <span className="badge-icon">⚡</span>
            <span>Instant Booking</span>
          </motion.div>
        </motion.div>
      </section>

      {/* ── FIND HOSPITAL ── */}
      <motion.section
        className="find-hospital"
        initial={{ opacity: 0, y: 60 }}
        viewport={{ once: true }}
        viewport={{ once: true, amount: 0.18 }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.h2
          initial={{ opacity: 0, y: 28 }}
          viewport={{ once: true }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Find Hospitals in Your City
        </motion.h2>

        <motion.form
          className="search-bar"
          onSubmit={handleSearch}
          initial={{ opacity: 0, y: 20 }}
          viewport={{ once: true }}
          viewport={{ once: true }}
          transition={{ delay: 0.18, duration: 0.6 }}
        >
          <input
            type="text"
            placeholder="🔍  Type your city (e.g., Kovilpatti)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <motion.button type="submit" whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }}>
            Search
          </motion.button>
        </motion.form>

        <motion.div
          className="hospital-list"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {hospitals.length === 0 ? (
            <motion.p className="no-results" variants={fadeUp}>
              🏙️ Start by searching your city above.
            </motion.p>
          ) : (
            hospitals.map((hosp, i) => (
              <motion.div
                key={hosp._id || hosp.id}
                className="hospital-card"
                variants={fadeUp}
                custom={i}
                whileHover={{ y: -12, scale: 1.03, transition: { duration: 0.3 } }}
                onClick={() => navigate(`/doctors?hospital=${encodeURIComponent(hosp.name)}`)}
              >
                <h3>{hosp.name}</h3>
                <p>📍 {hosp.city}</p>
                <p>🚑 Ambulance: {hosp.ambulanceAvailable ? "Available ✅" : "Unavailable ❌"}</p>
                <p>👨‍⚕️ Doctors: {hosp.doctorsAvailable}</p>
              </motion.div>
            ))
          )}
        </motion.div>
      </motion.section>

      {/* ── FEATURES ── */}
      <section className="features">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          viewport={{ once: true }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
        >
          Why Choose Us?
        </motion.h2>

        <motion.div
          className="feature-list"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {[
            {
              img: "https://cdn-icons-png.flaticon.com/512/2910/2910768.png",
              alt: "easy", title: "Easy Booking",
              desc: "Book appointments anytime, anywhere in just a few clicks.",
            },
            {
              img: "https://cdn-icons-png.flaticon.com/512/2920/2920348.png",
              alt: "secure", title: "Secure Data",
              desc: "Your personal details and health records are safe with us.",
            },
            {
              img: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
              alt: "top-doctors", title: "Top Doctors",
              desc: "Connect with verified, experienced healthcare professionals.",
            },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              className="feature-item"
              variants={fadeUp}
              custom={i}
              whileHover={{ y: -14, scale: 1.04, transition: { duration: 0.3 } }}
            >
              <motion.img
                src={item.img}
                alt={item.alt}
                whileHover={{ rotate: -8, scale: 1.18, transition: { duration: 0.3 } }}
              />
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <motion.footer
        className="footer"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55 }}
      >
        <p>© 2025 MediCare. All rights reserved.</p>
      </motion.footer>

    </div>
  );
};

export default LandingPage;

// DoctorAdminLogin.js — original logic preserved 100%
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const fadeUp = {
  hidden:  { opacity: 0, y: 18 },
  visible: (i=0) => ({ opacity:1, y:0, transition:{ duration:0.45, delay:i*0.08, ease:[0.22,1,0.36,1] } }),
};
const stagger = { hidden:{}, visible:{ transition:{ staggerChildren:0.08 } } };

const DoctorAdminLogin = () => {
  const navigate = useNavigate();

  // ── original state ──
  const [role,     setRole]     = useState("doctor");
  const [doctorId, setDoctorId] = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [hospital, setHospital] = useState("");
  const [loading,  setLoading]  = useState(false);

  // ── original handler ──
  const handleLogin = async () => {
    setLoading(true);
    try {
      let response;
      if (role === "doctor") {
        response = await fetch("http://localhost:5000/api/doctors/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ doctorId, email, password }),
        });
      } else {
        response = await fetch("http://localhost:5000/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role: "admin", hospital, email, password }),
        });
      }
      const data = await response.json();
      if (!response.ok) { alert(data.message); return; }
      if (role === "doctor") navigate("/queue/");
      else navigate("/admin-dashboard", { state: { hospital } });
    } catch (error) {
      console.error(error);
      alert("Server error");
    } finally { setLoading(false); }
  };

  return (
    <motion.div
      className={`login-section ${role === "admin" ? "admin-section" : "doctor-section"}`}
      variants={stagger} initial="hidden" animate="visible"
    >
      <motion.div
        className={`section-badge ${role === "doctor" ? "doctor-badge" : "admin-badge"}`}
        variants={fadeUp} custom={0}
      >
        {role === "doctor" ? "🩺 Medical Staff" : "🏥 Administration"}
      </motion.div>

      <motion.h2 variants={fadeUp} custom={1}>Doctor / Admin Login</motion.h2>
      <motion.p className="sub-text" variants={fadeUp} custom={2}>
        {role === "doctor" ? "Manage your patient queue" : "Hospital operations panel"}
      </motion.p>

      {/* Role toggle */}
      <motion.div className="role-toggle" variants={fadeUp} custom={3}>
        <button
          className={`role-toggle-btn ${role === "doctor" ? "active-doctor" : ""}`}
          onClick={() => setRole("doctor")}
        >
          🩺 Doctor
        </button>
        <button
          className={`role-toggle-btn ${role === "admin" ? "active-admin" : ""}`}
          onClick={() => setRole("admin")}
        >
          🏥 Admin
        </button>
      </motion.div>

      {/* Role-specific field */}
      <AnimatePresence mode="wait">
        {role === "doctor" ? (
          <motion.div key="doc" className="form-group"
            initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
            exit={{ opacity:0, y:-10 }} transition={{ duration:0.25 }}
          >
            <label className="form-label">Doctor ID</label>
            <input className="login-input" type="text" placeholder="e.g. DOC-1023"
              value={doctorId} onChange={e => setDoctorId(e.target.value)} />
          </motion.div>
        ) : (
          <motion.div key="adm" className="form-group"
            initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
            exit={{ opacity:0, y:-10 }} transition={{ duration:0.25 }}
          >
            <label className="form-label">Hospital</label>
            <select className="login-select" value={hospital} onChange={e => setHospital(e.target.value)}>
              <option value="">Select Hospital</option>
              <option>City Care Hospital</option>
              <option>MedLife Medical Center</option>
              <option>Global Health Hospital</option>
            </select>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div className="form-group" variants={fadeUp} custom={4}>
        <label className="form-label">Email</label>
        <input className="login-input" type="email" placeholder="your@hospital.com"
          value={email} onChange={e => setEmail(e.target.value)} />
      </motion.div>

      <motion.div className="form-group" variants={fadeUp} custom={5}>
        <label className="form-label">Password</label>
        <input className="login-input" type="password" placeholder="Enter your password"
          value={password} onChange={e => setPassword(e.target.value)} />
      </motion.div>

      <motion.button
        className={`login-btn ${role === "doctor" ? "login-btn-doctor" : "login-btn-admin"}`}
        onClick={handleLogin}
        disabled={loading}
        variants={fadeUp} custom={6}
        whileHover={{ scale:1.03, y:-2 }}
        whileTap={{ scale:0.97 }}
      >
        {loading ? "Signing in…" : role === "doctor" ? "🩺 Login as Doctor" : "🏥 Login as Admin"}
      </motion.button>
    </motion.div>
  );
};

export default DoctorAdminLogin;
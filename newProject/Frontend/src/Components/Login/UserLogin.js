// UserLogin.js
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const fadeUp = {
  hidden:  { opacity: 0, y: 18 },
  visible: (i=0) => ({ opacity:1, y:0, transition:{ duration:0.45, delay:i*0.08, ease:[0.22,1,0.36,1] } }),
};
const stagger = { hidden:{}, visible:{ transition:{ staggerChildren:0.08 } } };

const UserLogin = () => {
  const navigate = useNavigate();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);

  const handleLogin = async () => {
    if (!email || !password) return alert("Please fill all fields");
    setLoading(true);
    try {
      const res  = await fetch("http://localhost:5000/api/auth/user-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { alert(data.message); return; }
      navigate("/");
    } catch { alert("Server error"); }
    finally  { setLoading(false); }
  };

  return (
    <motion.div className="login-section" variants={stagger} initial="hidden" animate="visible">
      <motion.div className="section-badge user-badge" variants={fadeUp} custom={0}>
        👤 Patient Portal
      </motion.div>
      <motion.h2 variants={fadeUp} custom={1}>User Login</motion.h2>
      <motion.p className="sub-text" variants={fadeUp} custom={2}>
        Access your appointments &amp; queue status
      </motion.p>

      <motion.div className="form-group" variants={fadeUp} custom={3}>
        <label className="form-label">Email Address</label>
        <input className="login-input" type="email" placeholder="patient@email.com"
          value={email} onChange={e => setEmail(e.target.value)} />
      </motion.div>

      <motion.div className="form-group" variants={fadeUp} custom={4}>
        <label className="form-label">Password</label>
        <input className="login-input" type="password" placeholder="Enter your password"
          value={password} onChange={e => setPassword(e.target.value)} />
      </motion.div>

      <motion.button
        className="login-btn login-btn-user"
        onClick={handleLogin}
        disabled={loading}
        variants={fadeUp} custom={5}
        whileHover={{ scale:1.03, y:-2 }}
        whileTap={{ scale:0.97 }}
      >
        {loading ? "Signing in…" : "🔐 Login"}
      </motion.button>
    </motion.div>
  );
};

export default UserLogin;
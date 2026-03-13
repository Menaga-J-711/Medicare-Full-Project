// HeartbeatDivider.js
import React from "react";
import { motion } from "framer-motion";

const HeartbeatDivider = () => {
  return (
    <div className="divider">
      <div className="heartbeat-container">
        <motion.div
          className="plus"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
        >
          ✚
        </motion.div>
        <div className="brand-name">Medicare</div>
        <div className="divider-line" />
      </div>
    </div>
  );
};

export default HeartbeatDivider;
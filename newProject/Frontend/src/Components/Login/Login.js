

import React from "react";
import "./Login.css";
import UserLogin from "./UserLogin";
import DoctorAdminLogin from "./DoctorAdminLogin";
import HeartbeatDivider from "./HeartbeatDivider";

const Login = () => {
  return (
    <div className="login-page">
      <div className="login-card">
        <UserLogin />
        <HeartbeatDivider />
        <DoctorAdminLogin />
      </div>
    </div>
  );
};

export default Login;
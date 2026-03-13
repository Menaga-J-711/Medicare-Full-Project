import React from "react";
import { useLocation } from "react-router-dom";

const AdminDashboard = () => {
  const { state } = useLocation();

  return (
    <div style={{ padding: 30 }}>
      <h1>Admin Dashboard</h1>
      <p>Hospital: {state?.hospital}</p>
      <p>Manage doctors, hospitals, availability</p>
    </div>
  );
};

export default AdminDashboard;

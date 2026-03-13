import React from "react";
import { useLocation } from "react-router-dom";

const DoctorQueue = () => {
  const { state } = useLocation();

  return (
    <div style={{ padding: 30 }}>
      <h1>Doctor Queue Dashboard</h1>
      <p>Hospital: {state?.hospital}</p>
      <p>View and manage patient queue</p>
    </div>
  );
};

export default DoctorQueue;

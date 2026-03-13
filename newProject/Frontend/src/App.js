import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";

import LandingPage from "./Components/LandingPage";
import FindDoctors from "./Components/FindDoctors";
import BookAppointment from "./Components/BookAppointment";
// import Queue from "./Components/Queue"; 
import EmergencyPopup from "./Components/EmergencyPopup"; // ✅ Import popup
import FindHospital from "./Components/FindHospital";
import QueuePage from "./Components/QueuePage";
import Login from "./Components/Login/Login";
import DoctorQueue from "./Components/DoctorQueue";
import AdminDashboard from "./Components/AdminDashboard";
import HospitalListPopup from "./Components/HospitalListPopup";

function App() {
  const [showPopup, setShowPopup] = useState(true); // Popup shows on entry

  return (
    <Router>
      {/* ✅ Emergency Popup appears first */}
      {showPopup && <EmergencyPopup onClose={() => setShowPopup(false)} />}

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/doctors" element={<FindDoctors />} />
        <Route path="/bookMyAppointment" element={<BookAppointment />} />
        {/* <Route path="/queue" element={<Queue />} /> */}
         <Route path="/hospitals" element={<HospitalListPopup />} /> 
         <Route path="/findhospital" element={<FindHospital />} />
         <Route path="/queue" element={<QueuePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/doctor-queue" element={<DoctorQueue />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />

      </Routes>
    </Router>
  );
}

export default App;

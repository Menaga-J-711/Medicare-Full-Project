import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./FindDoctors.css";

const FindDoctors = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Get hospitalId from URL
  const params = new URLSearchParams(location.search);
  const hospitalId = params.get("hospitalId");

  const [doctors, setDoctors] = useState([]);
  const [hospitalName, setHospitalName] = useState("");

  // ✅ Fetch doctors from backend
  useEffect(() => {
    if (!hospitalId) return;

    fetch(`http://localhost:5000/api/doctors/hospital/${hospitalId}`)
      .then((res) => res.json())
      .then((data) => {
        setDoctors(data);

        // Optional: get hospital name from first doctor
        if (data.length > 0 && data[0].hospital?.name) {
          setHospitalName(data[0].hospital.name);
        }
      })
      .catch((err) => console.error("Error fetching doctors:", err));
  }, [hospitalId]);

  const handleBookAppointment = (doctor) => {
    navigate(`/bookMyAppointment?doctorId=${doctor._id}`);
  };

  return (
    <div className="find-doctors-container">
      <h1>{hospitalName || "Doctors List"}</h1>
      <p>Available Doctors in this Hospital</p>

      <div className="doctor-list">
        {doctors.length > 0 ? (
          doctors.map((doc) => (
            <div key={doc._id} className="doctor-card">
              <img
                src={
                  doc.image ||
                  "https://cdn-icons-png.flaticon.com/512/387/387561.png"
                }
                alt={doc.name}
              />
              <h3>{doc.name}</h3>
              <p>{doc.specialization}</p>
              <p>{doc.experience} years of experience</p>
              <button onClick={() => handleBookAppointment(doc)}>
                Book Appointment
              </button>
            </div>
          ))
        ) : (
          <p className="no-doctors">No doctors found for this hospital.</p>
        )}
      </div>
    </div>
  );
};

export default FindDoctors;
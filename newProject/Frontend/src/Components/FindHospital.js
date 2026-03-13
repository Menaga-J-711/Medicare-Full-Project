import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./FindHospital.css";

const FindHospital = () => {
  const navigate = useNavigate();

  const [city, setCity] = useState("");
  const [results, setResults] = useState([]);
  const [allHospitals, setAllHospitals] = useState([]);

  // 🔥 Fetch hospitals from backend (MongoDB cluster)
  useEffect(() => {
    fetch("https://medicare-full-project.onrender.com/api/hospitals")
      .then((res) => res.json())
      .then((data) => {
        setAllHospitals(data);
      })
      .catch((err) => console.error("Error fetching hospitals:", err));
  }, []);

  const handleSearch = () => {
    const formattedCity = city.trim().toLowerCase();

    const filtered = allHospitals.filter(
      (hosp) =>
        hosp.city &&
        hosp.city.toLowerCase() === formattedCity
    );

    if (filtered.length > 0) {
      setResults(filtered);
    } else {
      setResults([]);
      alert("No hospitals found for this city!");
    }
  };

  const handleViewDoctors = (hospital) => {
    navigate(`/doctors?hospitalId=${hospital._id}`);
  };

  return (
    <div className="find-hospital-container">

      {/* HERO SECTION */}
      <div className="hero-section">

        <h1>Find Hospitals Near You</h1>

        <p>
          Discover trusted hospitals in your city and connect with
          experienced doctors instantly.
        </p>

      </div>

      {/* SEARCH SECTION (YOUR ORIGINAL LOGIC) */}

      <div className="search-section">

        <input
          type="text"
          placeholder="Enter city name..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />

        <button onClick={handleSearch}>Search</button>

      </div>

      {/* QUICK INFO CARDS */}

      <div className="info-cards">

        <div className="info-card">
          <h3>150+</h3>
          <p>Registered Hospitals</p>
        </div>

        <div className="info-card">
          <h3>500+</h3>
          <p>Qualified Doctors</p>
        </div>

        <div className="info-card">
          <h3>24/7</h3>
          <p>Emergency Support</p>
        </div>

      </div>


      {/* HOSPITAL RESULTS (YOUR ORIGINAL LOGIC) */}

      <div className="hospital-results">

        {results.length > 0 ? (
          results.map((hosp) => (
            <div
              key={hosp._id}
              className="hospital-card"
              onClick={() => handleViewDoctors(hosp)}
            >
              <h3>{hosp.name}</h3>
              <p>{hosp.city}</p>
            </div>
          ))
        ) : (
          <p className="no-results">
            Search for a city to view available hospitals.
          </p>
        )}

      </div>


      {/* HOW IT WORKS */}

      <div className="how-section">

        <h2>How It Works</h2>

        <div className="steps">

          <div className="step">
            <h3>1. Enter Your City</h3>
            <p>
              Type your city name to find nearby hospitals
              available in your area.
            </p>
          </div>

          <div className="step">
            <h3>2. Select Hospital</h3>
            <p>
              Choose the hospital that best matches your
              healthcare needs.
            </p>
          </div>

          <div className="step">
            <h3>3. View Doctors</h3>
            <p>
              Click the hospital card to explore doctors
              and available services.
            </p>
          </div>

        </div>

      </div>


      {/* BENEFITS */}

      <div className="benefits-section">

        <h2>Why Choose Our Platform?</h2>

        <div className="benefits">

          <div className="benefit-card">
            <h3>Trusted Hospitals</h3>
            <p>
              All hospitals listed are verified and
              trusted healthcare providers.
            </p>
          </div>

          <div className="benefit-card">
            <h3>Easy Search</h3>
            <p>
              Quickly find hospitals and doctors
              with our fast search system.
            </p>
          </div>

          <div className="benefit-card">
            <h3>Better Healthcare Access</h3>
            <p>
              Connect patients with hospitals
              and doctors instantly.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};

export default FindHospital;

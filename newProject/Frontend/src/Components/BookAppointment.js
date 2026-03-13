import React, { useState, useEffect } from "react";
// import { useLocation } from "react-router-dom";
import "./BookAppointment.css";
import { useLocation, useNavigate } from "react-router-dom";





const BookAppointment = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const preselectedDoctor = params.get("doctorId") || "";

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    doctor: preselectedDoctor,
    date: "",
    time: "",
    notes: ""
  });

  // ✅ Auto-fill doctor name if navigated from FindDoctors page
  useEffect(() => {
    setFormData((prev) => ({ ...prev, doctor: preselectedDoctor }));
  }, [preselectedDoctor]);

  const availableTimes = [
    { time: "09:00 AM", available: true },
    { time: "10:00 AM", available: false },
    { time: "11:00 AM", available: true },
    { time: "12:00 PM", available: true },
    { time: "02:00 PM", available: true },
    { time: "03:00 PM", available: false },
  ];

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleTimeSelect = (time, available) => {
    if (!available) return;
    setFormData({ ...formData, time });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.time) {
      alert("Please select an available time slot");
      return;
    }
    localStorage.setItem("email", formData.email);
    try {
      const res = await fetch("http://localhost:5000/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Appointment booked successfully!");
        navigate("/");
        setFormData({
          name: "",
          email: "",
          doctor: preselectedDoctor,
          date: "",
          time: "",
          notes: "",
        });
      } else {
        alert("Failed to book appointment.");
      }
    } catch (err) {
      console.log(err);
      alert("Error connecting to server");
    }
  };

  return (
    <div className="book-appointment-container">
      <h1>Book My Appointment</h1>
      <form onSubmit={handleSubmit} className="appointment-form">
        {/* Name Field */}
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        {/* ✅ FIXED: Added onChange={handleChange} here so email becomes editable */}
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}   // 🟢 FIXED LINE
          required
        />

        {/* Doctor Name (auto-filled if navigated from FindDoctors) */}
        <input
          type="text"
          name="doctor"
          value={formData.doctor}
          onChange={handleChange}
          required
        />

        {/* Appointment Date */}
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />

        {/* Time Slots */}
        <div className="time-slots">
          {availableTimes.map((slot) => (
            <button
              type="button"
              key={slot.time}
              className={`time-slot ${
                slot.available ? "available" : "unavailable"
              } ${formData.time === slot.time ? "selected" : ""}`}
              onClick={() => handleTimeSelect(slot.time, slot.available)}
            >
              {slot.time}
            </button>
          ))}
        </div>

        {/* Additional Notes */}
        <textarea
          name="notes"
          placeholder="Additional Notes"
          value={formData.notes}
          onChange={handleChange}
        ></textarea>

        <button type="submit">Confirm Appointment</button>
      </form>
    </div>
  );
};

export default BookAppointment;

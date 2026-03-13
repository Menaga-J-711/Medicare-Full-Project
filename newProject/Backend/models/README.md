# Smart Emergency Healthcare & Queue Management System

## 📌 Project Overview
This project is a backend-driven Smart Emergency Healthcare System designed to manage hospitals, doctors, patients, queues, appointments, and emergency requests in real time.

The system is built using **Node.js, Express.js, MongoDB**, and **Socket.IO**, with the goal of supporting:
- Doctor availability tracking
- Patient queue management
- Emergency hospital discovery
- Secure authentication
- Real-time updates using sockets

This repository currently contains the **backend implementation**.

---

## 🛠 Tech Stack
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas
- **Real-time:** Socket.IO
- **Authentication:** bcrypt (password hashing)
- **Environment Config:** dotenv
- **API Testing:** Postman

---

## 📂 Project Structure
backend/
│
├── server.js
├── db.js
├── models/
│ ├── Doctor.js
│ ├── Hospital.js
│ └── (other models)
│
├── routes/
│ ├── auth.js
│ ├── doctor.js
│ ├── hospital.js
│ ├── appointment.js
│ ├── emergency.js
│ ├── queue.js
│ └── otp.js
│
├── .env
├── package.json
└── README.md


---

## ✅ Features Implemented
- MongoDB Atlas connection (working)
- Express server setup with middleware
- Route segregation (auth, doctor, hospital, queue, etc.)
- Doctor model with:
  - doctorId
  - email
  - hashed password
  - hospital reference
  - availability status
- Socket.IO setup for real-time communication
- API structure finalized

---

## 🔐 Doctor Authentication (Current Status)
Doctor records are **already present in MongoDB** with:
- `doctorId`
- `email`
- **bcrypt-hashed password**
- `hospital` ObjectId reference

Example document:
```json
{
  "doctorId": "DOC101",
  "email": "rajesh@medicare.com",
  "password": "$2b$10$...",
  "hospital": "ObjectId(...)"
}
❗ Known Issue (IMPORTANT)
🚨 POST /api/doctors/login returns Cannot POST /api/doctors/login
Server runs successfully

MongoDB connection is successful

Routes appear correctly defined

Postman request body is valid

No runtime crash occurs

However:

Express returns a 404 Not Found

The route handler is not being reached

This indicates a routing-level issue, not a database or authentication issue.

🧠 Suspected Root Causes (For Next Developer)
Please verify the following carefully:

Entry File Mismatch

Ensure the file being executed (npm start) is the same server.js being edited.

Duplicate Express App

Ensure no express() instance exists inside route files.

Route Export/Import Consistency

module.exports = router;

Correct require() usage in server.js

Middleware / Catch-all Order

Ensure no wildcard app.use("*") or 404 handler is registered before routes.

Port / Multiple Server Instances

Ensure only one Node server is running on the active port.

Strict Routing / Trailing Slash

Test both /login and /login/
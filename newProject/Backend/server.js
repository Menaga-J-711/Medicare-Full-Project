// ✅ backend/server.js
const express = require("express");
require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./db");
const cors = require("cors");

// Routes
const authRoutes = require("./routes/auth");
const appointmentRoutes = require("./routes/appointment");
const emergencyRoutes = require("./routes/emergency");
const hospitalRoutes = require("./routes/hospital");
const doctorRoutes = require("./routes/doctorRoutes");
const queueRoutes = require("./routes/queue");
const otpRoutes = require("./routes/otp");

const app = express();

// Middleware

app.get("/ping", (req, res) => {
  res.send("SERVER IS ALIVE");
});
app.post("/__test", (req, res) => {
  res.status(200).json({ alive: true });
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect Database
connectDB();

// ===============================
// 🔥 SOCKET.IO SETUP (SAFE)
// ===============================
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

// app.set("io", io); // ✅ MUST EXIST
// ✅ VERY IMPORTANT (THIS FIXES THE ERROR)
app.set("io", io);

// ===============================
// Routes (UNCHANGED)
// ===============================
app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/emergency", emergencyRoutes);
app.use("/api/hospitals", hospitalRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/queue", queueRoutes);
app.use("/api/otp", otpRoutes);

// ===============================
// 🔌 SOCKET CONNECTION
// ===============================
io.on("connection", (socket) => {
  console.log("🟢 Socket connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 Socket disconnected:", socket.id);
  });
});

// ===============================
// 🚀 START SERVER
// ===============================
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

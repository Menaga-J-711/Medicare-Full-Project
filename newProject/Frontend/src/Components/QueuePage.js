// frontend/src/pages/QueuePage.js
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import "./QueuePage.css";

const socket = io("https://medicare-full-project.onrender.com"); // 🔗 connect to backend WebSocket server

const QueuePage = () => {
  const [queue, setQueue] = useState([]);
  const [userPosition, setUserPosition] = useState(null);
  const [statusMessage, setStatusMessage] = useState("Connecting to queue...");

  // 🧠 Simulate patient name from previous session or appointment
  const userEmail = localStorage.getItem("email") || "user@example.com";
  
useEffect(() => {

  const joinQueue = async () => {
    await fetch("https://medicare-full-project.onrender.com/api/queue/join", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email: userEmail })
    });
  };

  const fetchQueue = async () => {
    const res = await fetch(
      `https://medicare-full-project.onrender.com/api/queue/${userEmail}`
    );

    const data = await res.json();

    if (data.inQueue) {
      setQueue(data.queue);
      setUserPosition(data.position);
      setStatusMessage(`Doctor: ${data.doctor}`);
    } else {
      setUserPosition(null);
    }
  };

  const init = async () => {
    await joinQueue();  // ⭐ FIRST JOIN
    await fetchQueue(); // ⭐ THEN FETCH QUEUE
  };

  init();

  socket.on("queueUpdateDoctor", fetchQueue);

  return () => {
    socket.off("queueUpdateDoctor");
  };

}, [userEmail]);

  return (
    <div className="queue-page-container">
      <h1>🏥 Live Queue Status</h1>
      <p className="status">{statusMessage}</p>

      {userPosition ? (
        <>
          <div className="queue-status-card">
            <h2>Your Position: {userPosition}</h2>
            <p>
              {userPosition === 1
                ? "You're next to see the doctor! 💉"
                : `There are ${userPosition - 1} people ahead of you.`}
            </p>
          </div>

          <div className="queue-list">
            <h3>Current Queue</h3>
            <ul>
              {queue.map((q, idx) => (
                <li
                  key={idx}
                  className={q.email === userEmail ? "highlight" : ""}
                >
                  {idx + 1}. {q.name}
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <p className="no-queue">You are not currently in the queue.</p>
      )}
    </div>
  );
};

export default QueuePage;

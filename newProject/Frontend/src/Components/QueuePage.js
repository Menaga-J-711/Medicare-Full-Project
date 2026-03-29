// frontend/src/pages/QueuePage.js

import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import "./QueuePage.css";

const socket = io("https://medicare-full-project.onrender.com");

const QueuePage = () => {
  const [queue, setQueue] = useState([]);
  const [userPosition, setUserPosition] = useState(null);

  const userEmail = localStorage.getItem("email");
  const patientName = localStorage.getItem("patientName");

  useEffect(() => {

    // ✅ JOIN QUEUE WITH NAME
    const joinQueue = async () => {
      await fetch("https://medicare-full-project.onrender.com/api/queue/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: userEmail,
          patientName: patientName // 🔥 IMPORTANT
        })
      });
    };

    // ✅ FETCH QUEUE
    const fetchQueue = async () => {
      const res = await fetch(
        `https://medicare-full-project.onrender.com/api/queue/${userEmail}`
      );
      const data = await res.json();

      if (data.inQueue) {
        setQueue(data.queue);
        setUserPosition(data.position);
      } else {
        setQueue([]);
        setUserPosition(null);
      }
    };

    const init = async () => {
      await joinQueue();
      await fetchQueue();
    };

    init();

    socket.on("queueUpdateDoctor", fetchQueue);

    return () => {
      socket.off("queueUpdateDoctor");
    };

  }, [userEmail, patientName]);

  return (
    <div className="queue-page-container">
      <h1>🏥 Live Queue</h1>

      {userPosition ? (
        <>
          <h2>Your Position: {userPosition}</h2>

          <div className="queue-list">
            {queue.map((q, idx) => (
              <div key={q._id}>
                {idx + 1}. {q.patientName || "No Name"}
              </div>
            ))}
          </div>
        </>
      ) : (
        <p>You are not in queue</p>
      )}
    </div>
  );
};

export default QueuePage;

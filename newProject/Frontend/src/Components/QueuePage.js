```jsx
// frontend/src/pages/QueuePage.js
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import "./QueuePage.css";

const socket = io("https://medicare-full-project.onrender.com");

const QueuePage = () => {
  const [queue, setQueue] = useState([]);
  const [userPosition, setUserPosition] = useState(null);
  const [statusMessage, setStatusMessage] = useState("Connecting to queue...");

  const userEmail = localStorage.getItem("email") || "user@example.com";

  useEffect(() => {

    // ✅ JOIN QUEUE
const joinQueue = async () => {
  try {
    await fetch("https://medicare-full-project.onrender.com/api/queue/join", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: userEmail,
        patientName: localStorage.getItem("patientName") // ✅ FIXED
      })
    });
  } catch (err) {
    console.error("Join Error:", err);
  }
};

    // ✅ FETCH QUEUE
    const fetchQueue = async () => {
      try {
        const res = await fetch(
          `https://medicare-full-project.onrender.com/api/queue/${userEmail}`
        );

        const data = await res.json();
        console.log("QUEUE DATA:", data);

        if (data.inQueue) {
          setQueue(data.queue);
          setUserPosition(data.position);
          setStatusMessage(`Doctor: ${data.doctor}`);
        } else {
          setUserPosition(null);
          setQueue([]);
        }

      } catch (err) {
        console.error("Fetch Error:", err);
      }
    };

    const init = async () => {
      await joinQueue();
      await fetchQueue();
    };

    init();

    // ✅ REALTIME UPDATE
    socket.on("queueUpdateDoctor", fetchQueue);

    return () => {
      socket.off("queueUpdateDoctor");
    };

  }, [userEmail]);

  // ✅ LEAVE QUEUE
  const handleLeave = async () => {
    try {
      await fetch("https://medicare-full-project.onrender.com/api/queue/leave", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: userEmail })
      });

      setUserPosition(null);
      setQueue([]);

    } catch (err) {
      console.error("Leave Error:", err);
    }
  };

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

            {queue.map((q, idx) => {

              console.log("Logged user:", userEmail);
              console.log("Queue user:", q.email);

              return (
                <div
                  key={q._id}
                  className={`queue-item ${
                    q.email?.toLowerCase() === userEmail?.toLowerCase()
                      ? "highlight"
                      : ""
                  }`}
                >
                  <span>
                    {idx + 1}. {q.patientName || q.name || "No Name"}
                  </span>

                  {/* ✅ SHOW ONLY FOR CURRENT USER */}
                  {q.email?.toLowerCase() === userEmail?.toLowerCase() && (
                    <button
                      className="leave-btn"
                      onClick={handleLeave}
                    >
                      Leave
                    </button>
                  )}
                </div>
              );
            })}

          </div>
        </>
      ) : (
        <p className="no-queue">You are not currently in the queue.</p>
      )}
    </div>
  );
};

export default QueuePage;
```

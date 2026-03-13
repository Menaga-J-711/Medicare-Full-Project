// src/Components/Queue.js
import React, { useState, useEffect } from "react";
import socket from "../socket";
import "./Queue.css";

const Queue = () => {
  const [queue, setQueue] = useState([]);
  const [name, setName] = useState("");

  useEffect(() => {
    // listen for queue updates from server
    socket.on("queueUpdate", (updatedQueue) => {
      setQueue(updatedQueue);
    });

    return () => socket.off("queueUpdate");
  }, []);

  const handleJoin = () => {
    if (!name) return alert("Enter your name first");
    const patient = { id: Date.now(), name };
    socket.emit("joinQueue", patient);
    setName("");
  };

  const handleLeave = (id) => {
    socket.emit("leaveQueue", id);
  };

  return (
    <div className="queue-container">
      <h2>Live Queue</h2>

      <div className="queue-actions">
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button onClick={handleJoin}>Join Queue</button>
      </div>

      <ul className="queue-list">
        {queue.length === 0 ? (
          <p>No one in the queue yet.</p>
        ) : (
          queue.map((p, i) => (
            <li key={p.id}>
              #{i + 1} — {p.name}
              <button onClick={() => handleLeave(p.id)}>Leave</button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default Queue;

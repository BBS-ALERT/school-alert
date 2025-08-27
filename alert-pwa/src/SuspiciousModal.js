import React, { useState } from "react";

// Suspicious Alert Modal Component
function SuspiciousModal({ onSend, onClose }) {
  const [message, setMessage] = useState("");

  function handleSend(e) {
    e.preventDefault();
    if (message.trim()) {
      onSend(message);
      setMessage("");
    }
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>⚠️ Suspicious Alert</h3>
        <form onSubmit={handleSend}>
          <input
            type="text"
            placeholder="Describe the suspicious activity..."
            value={message}
            onChange={e => setMessage(e.target.value)}
            autoFocus
          />
          <div className="modal-actions">
            <button type="submit">Send</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SuspiciousModal;

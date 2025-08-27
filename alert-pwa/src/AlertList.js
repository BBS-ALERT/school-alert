import React from "react";

// Alert List Component
function AlertList({ alerts }) {
  return (
    <div className="alert-list">
      <h2>Alerts</h2>
      {alerts.length === 0 && <p>No alerts yet.</p>}
      <ul>
        {alerts.map((alert, idx) => (
          <li key={idx}>
            <strong>{alert.title}</strong>: {alert.body} <span className="time">{alert.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AlertList;

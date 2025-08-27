import React, { useEffect, useState } from "react";
import { messaging, onMessage, getToken } from "./firebase";
import AlertList from "./AlertList";
import SuspiciousModal from "./SuspiciousModal";

// Main App Component
function App() {
  const [alerts, setAlerts] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // Register for FCM push notifications
  useEffect(() => {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        getToken(messaging, { vapidKey: "YOUR_VAPID_KEY" }).then(token => {
          // Register token with backend
          fetch("/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token })
          });
        });
      }
    });

    // Listen for foreground messages
    onMessage(messaging, payload => {
      if (payload.notification) {
        // Show browser notification
        new Notification(payload.notification.title, {
          body: payload.notification.body,
          icon: "/icon-192.png"
        });
        // Update alert list
        setAlerts(prev => [
          { title: payload.notification.title, body: payload.notification.body, time: new Date().toLocaleTimeString() },
          ...prev
        ]);
      }
    });

    // Fetch alerts from backend
    fetchAlerts();
    // Poll for new alerts every 10 seconds
    const interval = setInterval(fetchAlerts, 10000);
    return () => clearInterval(interval);
  }, []);

  // Fetch alerts from backend
  function fetchAlerts() {
    fetch("/alerts")
      .then(res => res.json())
      .then(data => setAlerts(data.reverse()))
      .catch(() => {});
  }

  // Send Panic Alert (plays sound and adds alert)
  function sendPanic() {
    setAlerts(prev => [
      { title: "🚨 Panic Alert", body: "🚨 Panic Alert!", time: new Date().toLocaleTimeString() },
      ...prev
    ]);
    const audio = document.getElementById("panic-audio");
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    }
  }

  // Send Suspicious Alert (adds alert and shows notification)
  function sendSuspicious(message) {
    setAlerts(prev => [
      { title: "⚠️ Suspicious Alert", body: message, time: new Date().toLocaleTimeString() },
      ...prev
    ]);
    if (Notification.permission === "granted") {
      new Notification("⚠️ Suspicious Alert", {
        body: message,
        icon: "/icon-192.png"
      });
    }
    setShowModal(false);
  }

  // Request notification permission on mount
  React.useEffect(() => {
    if (Notification && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  return (
    <div className="container">
      <h1>🚨 Emergency Alert System</h1>
      <audio id="panic-audio" src="/panic.mp3" preload="auto"></audio>
      <div className="button-group">
        <button className="panic" onClick={sendPanic}>🚨 Panic Alert</button>
        <button className="suspicious" onClick={() => setShowModal(true)}>⚠️ Suspicious Alert</button>
      </div>
      <AlertList alerts={alerts} />
      {showModal && (
        <SuspiciousModal
          onSend={sendSuspicious}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

export default App;

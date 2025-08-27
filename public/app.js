import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging.js";

const firebaseConfig = {
  apiKey: "AIzaSyAbohcONTb1FGRjPiVxWblTc-esImwEcI8",
  authDomain: "bbs-alert.firebaseapp.com",
  projectId: "bbs-alert",
  storageBucket: "bbs-alert.firebasestorage.app",
  messagingSenderId: "188088530343",
  appId: "1:188088530343:web:63f5a52963276ed0cdf282",
  measurementId: "G-3E21ZRM641"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

Notification.requestPermission().then(permission => {
  if (permission === "granted") {
    getToken(messaging, { vapidKey: "BN8YH1KjQ1mCz8J9z8J9z8J9z8J9z8J9z8J9z8J9z8J9z8J9" }).then(token => {
      if (token) {
        fetch("/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token })
        });
      }
    });
  }
});

onMessage(messaging, payload => {
  document.getElementById("log").innerHTML += `<p>${payload.notification.title}: ${payload.notification.body}</p>`;
});

function playPanicSound() {
  const audio = document.getElementById("panic-audio");
  if (audio) {
    audio.currentTime = 0;
    audio.play().catch(error => {
      console.error("Audio playback failed:", error);
      alert("Unable to play sound. Please check your browser settings.");
    });
  }
}

document.getElementById("panic-btn").addEventListener("click", () => {
  fetch("/alert", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "panic",
      message: "🚨 Panic Alert!"
    })
  });
  playPanicSound();
});

document.getElementById("suspicious-btn").addEventListener("click", () => {
  fetch("/alert", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "suspicious",
      message: "👀 Suspicious Activity"
    })
  });
});
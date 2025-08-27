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
    getToken(messaging, { vapidKey: "YOUR_VAPID_KEY" }).then(token => {
      console.log("FCM Token:", token);
      fetch("/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token })
      });
    });
  }
});

onMessage(messaging, payload => {
  console.log("Message received:", payload);
  document.getElementById("log").innerHTML += `<p>${payload.notification.title}: ${payload.notification.body}</p>`;
});

window.sendAlert = function(type) {
  fetch("/alert", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type,
      message: type === "panic" ? "🚨 Panic Alert!" : "👀 Suspicious Activity"
    })
  });

  if (type === "panic") {
    const audio = document.getElementById("panic-audio");
    if (audio) audio.play();
  }
};
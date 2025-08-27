const express = require("express");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
const path = require("path");

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Firebase Admin SDK setup
const serviceAccount = require("./serviceAccountKey.json"); // download from Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

let tokens = [];

// Serve index.html for the root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Register device
app.post("/register", (req, res) => {
  const { token } = req.body;
  if (!tokens.includes(token)) tokens.push(token);
  console.log("Registered:", token);
  res.sendStatus(200);
});

// Handle alerts
app.post("/alert", async (req, res) => {
  const { type, message } = req.body;
  const payload = {
    notification: {
      title: type === "panic" ? "🚨 Panic Alert" : "👀 Suspicious Alert",
      body: message
    }
  };

  try {
    await admin.messaging().sendToDevice(tokens, payload);
    console.log("Alert sent:", payload);
    res.sendStatus(200);
  } catch (error) {
    console.error("Error sending alert:", error);
    res.sendStatus(500);
  }
});

app.listen(3000, () => console.log("🚀 Server running on port 3000"));
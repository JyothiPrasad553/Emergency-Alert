// save as server.js

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import twilio from "twilio";

const app = express();

// Enable CORS for all origins (for development)
app.use(cors());

// Parse JSON bodies
app.use(bodyParser.json());

// Twilio credentials
const accountSid = "ACda1586f76e3638d9e364faee8f27c4ab";
const authToken = "07cdb7dd7ed4339012898c72c2be81b4";
const client = twilio(accountSid, authToken);

// Emergency endpoint
app.post("/api/emergency", async (req, res) => {
  const { latitude, longitude, source } = req.body;

  const locationText = (latitude && longitude)
    ? `https://www.google.com/maps?q=${latitude},${longitude}`
    : "Location unavailable";

  const message = `🚨 Emergency detected via ${source}, Location: ${locationText}`;

  try {
    const msg = await client.messages.create({
      body: message,
      from: "+12312723942", // your Twilio number
      to: "+919515776159"  // emergency contact number
    });

    console.log("Emergency alert sent:", msg.sid);
    res.json({ success: true, sid: msg.sid });
  } catch (e) {
    console.error("Twilio send error:", e.message);
    res.status(500).json({ success: false, error: e.message });
  }
});

// Start server
app.listen(5000, () => {
  console.log("Emergency backend running on http://localhost:5000");
});

// server.js
const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors());

app.get("/proxy", async (req, res) => {
  const { url } = req.query;

  if (!url || !url.startsWith("https://www.swiggy.com")) {
    return res.status(400).json({ error: "Invalid or missing Swiggy URL." });
  }

  try {
    const response = await fetch(url);
    const text = await response.text();

    try {
      const json = JSON.parse(text);
      res.json(json);
    } catch {
      console.error("❌ Invalid JSON from Swiggy");
      res.status(500).json({ error: "Swiggy returned non-JSON response" });
    }
  } catch (err) {
    console.error("❌ Proxy error:", err);
    res.status(500).json({ error: "Failed to fetch from Swiggy" });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`✅ Proxy server running on port ${PORT}`);
});

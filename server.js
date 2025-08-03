const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

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
      res.status(500).json({ error: "Swiggy returned HTML or invalid JSON." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch from Swiggy." });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`✅ Swiggy proxy running at http://localhost:${PORT}`);
});

const express = require("express");
const router = express.Router();
const Prompt = require("../models/prompt.model");

// POST /api/prompt/submit
router.post("/prompt", async (req, res) => {
  const { name, phone, email } = req.body;

  if (!name || !phone || !email) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const newPrompt = new Prompt({ name, phone, email });
    await newPrompt.save();
    return res.status(200).json({ message: "Form submitted and saved." });
  } catch (error) {
    console.error("Error saving prompt:", error);
    return res.status(500).json({ error: "Failed to save form." });
  }
});

module.exports = router;

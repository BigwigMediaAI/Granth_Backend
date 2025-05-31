const express = require("express");
const router = express.Router();
const enquirySchema = require("../models/enquiry.model");

// POST /api/prompt/submit
router.post("/enquiry", async (req, res) => {
  const { name, phone, email, message } = req.body;

  if (!name || !phone || !email || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const Enquiry = new enquirySchema({ name, phone, email, message });
    await Enquiry.save();
    return res.status(200).json({ message: "Form submitted and saved." });
  } catch (error) {
    console.error("Error saving prompt:", error);
    return res.status(500).json({ error: "Failed to save form." });
  }
});

module.exports = router;

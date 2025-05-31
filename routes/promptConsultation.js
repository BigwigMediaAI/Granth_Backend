const express = require("express");
const router = express.Router();
const Prompt = require("../models/prompt.model");
const sendEmail = require("../utils/sendEmail");

// POST /api/prompt/submit
router.post("/prompt", async (req, res) => {
  const { name, phone, email } = req.body;

  if (!name || !phone || !email) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const existing = await Prompt.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: "Email already exist" });
    }
    const newPrompt = new Prompt({ name, phone, email });
    await sendEmail({
      to: email,
      subject: "📬 Thank You for Submitting Your Details",
      text: "We've received your information and will get back to you shortly.",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2>✅ Details Received</h2>
          <p>Hi there,</p>
          <p>Thank you for submitting your details. We've received your information successfully.</p>
          <p>Our team will review your query and get in touch with you shortly.</p>
          <hr style="margin: 20px 0;" />
          <p style="font-size: 14px; color: #888;">If you didn't fill out a form recently, you can safely ignore this email.</p>
          <p>Best regards,<br>The Team</p>
        </div>
      `,
    });
    await newPrompt.save();
    return res.status(200).json({ message: "Form submitted and saved." });
  } catch (error) {
    console.error("Error saving prompt:", error);
    return res.status(500).json({ error: "Failed to save form." });
  }
});

module.exports = router;

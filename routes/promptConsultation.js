const express = require("express");
const router = express.Router();
const Prompt = require("../models/prompt.model");
const sendEmail = require("../utils/sendEmail");

// STEP 1: Send OTP
router.post("/send-otp", async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ error: "Email is required." });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  try {
    await Prompt.findOneAndUpdate(
      { email },
      { otp, otpExpires, isVerified: false },
      { upsert: true, new: true }
    );

    await sendEmail({
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}`,
      html: `<p>Your OTP is <b>${otp}</b>. It will expire in 10 minutes.</p>`,
    });

    return res.status(200).json({ message: "OTP sent successfully." });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return res.status(500).json({ error: "Failed to send OTP." });
  }
});

// STEP 2: Verify OTP and Submit Form
router.post("/verify-otp", async (req, res) => {
  const { name, phone, email, otp } = req.body;

  if (!name || !phone || !email || !otp)
    return res.status(400).json({ error: "All fields are required." });

  try {
    const prompt = await Prompt.findOne({ email });

    if (!prompt || prompt.otp !== otp || prompt.otpExpires < new Date()) {
      return res.status(400).json({ error: "Invalid or expired OTP." });
    }

    prompt.name = name;
    prompt.phone = phone;
    prompt.isVerified = true;
    prompt.otp = null;
    prompt.otpExpires = null;
    await prompt.save();

    await sendEmail({
      to: email,
      subject: "📬 Thank You for Submitting Your Details",
      text: "We've received your information and will get back to you shortly.",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2>✅ Details Received</h2>
          <p>Hi ${name},</p>
          <p>Thank you for submitting your details. We've received your information successfully.</p>
          <p>Our team will review your query and get in touch with you shortly.</p>
          <hr style="margin: 20px 0;" />
          <p style="font-size: 14px; color: #888;">If you didn't fill out a form recently, you can safely ignore this email.</p>
          <p>Best regards,<br>The Team</p>
        </div>
      `,
    });

    return res
      .status(200)
      .json({ message: "OTP verified and form submitted." });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(500).json({ error: "OTP verification failed." });
  }
});

router.get("/leads", async (req, res) => {
  try {
    const leads = await Prompt.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

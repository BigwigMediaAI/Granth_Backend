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
      subject: "Thank You for Visiting Granth- Dream Homes! 🏡",
      text: "We've received your information and will get back to you shortly.",
      html: `
         <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <p>Hi <strong>${name}</strong>,</p>
      <p>Thank you for visiting <strong>Granth Dream Homes</strong>! We’re glad you stopped by and took the first step toward finding your perfect home or investment property. 🏠✨</p>
      <p>Whether you're buying, selling, or just exploring the market, our expert team is here to guide you every step of the way. We’re committed to helping you make informed, confident decisions in today’s real estate market.</p>
      <p>If you have any questions or would like to schedule a consultation, just hit reply — we’d be happy to help!</p>
      <p>Looking forward to connecting with you soon.</p>
      <br/>
      <p>Warm regards,<br/>
      <strong>Team Granth Dream Homes</strong><br/>
      📞 9811735666</p>
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

// DELETE lead by ID
router.delete("/leads/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedLead = await Prompt.findByIdAndDelete(id);

    if (!deletedLead) {
      return res.status(404).json({ error: "Lead not found." });
    }

    return res.status(200).json({ message: "Lead deleted successfully." });
  } catch (error) {
    console.error("Error deleting lead:", error);
    return res.status(500).json({ error: "Failed to delete lead." });
  }
});

module.exports = router;

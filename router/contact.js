const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");
// ===== Public Routes =====

router.post("/", async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res
      .status(400)
      .json({ success: false, error: "All fields are required" });
  }

  try {
    const newContact = new Contact({ name, email, subject, message });
    await newContact.save();

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

module.exports = router;

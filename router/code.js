const express = require("express");
const router = express.Router();
const fs = require("fs");
const Code = require("../models/Code");
const auth = require("../middleware/auth");
const cloudinary = require("../config/cloudinary");
const { sendToTelegram } = require("../service/telegram");
const multer = require("multer");

const upload = multer({ dest: "uploads/" });

// create
router.post("/", auth, async (req, res) => {
  try {
    const code = new Code(req.body);
    await code.save();
    res.json(code);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// List codes
router.get("/", auth, async (req, res) => {
  try {
    const codes = await Code.find().sort({ createdAt: -1 });
    res.json(codes);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// read one
// read one by slug
router.get("/:slug", async (req, res) => {
  try {
    const code = await Code.findOne({ slug: req.params.slug });
    if (!code) return res.status(404).json({ msg: "Code not found" });
    res.json(code);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// Update by id
router.put("/:id", auth, async (req, res) => {
  try {
    const code = await Code.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!code) return res.status(404).json({ msg: "Code not found" });
    res.json(code);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Delete by slug
router.delete("/:id", auth, async (req, res) => {
  try {
    const code = await Code.findById(req.params.id);
    if (!code) return res.status(404).json({ message: "Code not found" });

    // ✅ Delete image from Cloudinary
    if (code.imagePublicId) {
      await cloudinary.uploader.destroy(code.imagePublicId);
    }

    await code.deleteOne();

    res.json({ message: "Code and image deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/:id/send", auth, upload.single("video"), async (req, res) => {
  try {
    const code = await Code.findById(req.params.id);
    if (!code) return res.status(404).json({ msg: "Code not found" });

    const codeLink = `https://hepptoblogs.vercel.app/a/${code.slug}/p1`;

    if (req.file) {
      // ✅ If user uploaded video → send video
      await sendToTelegram({
        filePath: req.file.path,
        reelNo: code.slug,
        codeLink,
      });

      // cleanup uploaded file
      if (req.file && fs.existsSync(req.file.path)) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (err) {
          console.warn("⚠️ Failed to delete temp file:", err.message);
        }
      }

      return res.json({ success: true, msg: "✅ Video sent to Telegram!" });
    } else {
      return res.status(400).json({ success: false, msg: "No video uploaded" });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;

const express = require ("express");
const multer = require ("multer");
const cloudinary = require ("../config/cloudinary.js");

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({storage});

// POST /api/upload
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "codes", // optional folder
    });
    res.json({ url: result.secure_url, public_id: result.public_id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload failed" });
  }
});

module.exports = router;

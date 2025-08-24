const express = require('express');
const router = express.Router();
const Code = require('../models/Code');
const auth = require('../middleware/auth');
const rateLimit = require('express-rate-limit');

// ===== Public Routes =====

// Get code meta
router.get('/:slug', async (req, res) => {
  const { slug } = req.params;
  const doc = await Code.findOne({ slug });
  if(!doc) return res.status(404).json({ error: 'Not found' });

  res.json({
    slug: doc.slug,
    title: doc.title,
    description: doc.description,
    verifiedAt: doc.verifiedAt,
    active: doc.active,
    validFrom: doc.validFrom,
    validTo: doc.validTo
  });
});

// Reveal code (rate limited)
const revealLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 6,
  message: { error: 'Too many reveal attempts. Try again later.' }
});

router.post('/:slug/reveal', revealLimiter, async (req, res) => {
  const { slug } = req.params;
  
  const doc = await Code.findOne({ slug, active: true });
  if(!doc) return res.status(404).json({ error: 'Not found or inactive' });

  doc.revealCount += 1;
  doc.verifiedAt = doc.verifiedAt || new Date();
  await doc.save();

  res.json({ code: doc.code, shortenerUrl: doc.shortenerUrl || null });
});

// ===== Admin Routes (protected) =====
router.use(auth);

// Create code
router.post('/', async (req, res) => {
  try {
    const doc = new Code(req.body);
    await doc.save();
    res.json(doc);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// List codes
router.get('/', async (req, res) => {
  const docs = await Code.find().sort({ createdAt: -1 }).limit(200);
  res.json(docs);
});

// Update by slug
router.put('/:slug', async (req, res) => {
  const updated = await Code.findOneAndUpdate({ slug: req.params.slug }, req.body, { new: true });
  res.json(updated);
});

// Delete by slug
router.delete('/:slug', async (req, res) => {
  await Code.findOneAndDelete({ slug: req.params.slug });
  res.json({ ok: true });
});

module.exports = router;

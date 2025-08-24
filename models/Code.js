const mongoose = require('mongoose');

const CodeSchema = new mongoose.Schema({
  slug: { type: String, required: true }, // used in /c/:slug
  title: String,
  description: String,
  code: String, // the 6-digit (stored securely)
  shortenerUrl: String, // optional: external shortener or redirect url
  validFrom: Date,
  validTo: Date,
  verifiedAt: Date,
  revealCount: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
  stats: {
    views: { type: Number, default: 0 },     // landing page views
    reveals: { type: Number, default: 0 }    // how many clicked reveal
  }
}, { timestamps: true });

module.exports = mongoose.model('Code', CodeSchema);

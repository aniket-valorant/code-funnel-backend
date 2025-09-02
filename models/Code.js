const mongoose = require('mongoose');

const CodeSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true }, // used in /c/:slug
  code: String, 
  imageUrl: String,
  imagePublicId: String
}, { timestamps: true });

module.exports = mongoose.model('Code', CodeSchema);

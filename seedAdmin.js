require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

async function run(){
  await mongoose.connect(process.env.MONGO_URI);
  const pw = process.env.ADMIN_PASSWORD || 'ChangeMe123';
  const email = process.env.ADMIN_EMAIL || 'admin@you.com';
  const hashed = await bcrypt.hash(pw, 10);
  const existing = await User.findOne({ email });
  if(existing) {
    console.log('Admin exists');
    process.exit(0);
  }
  const u = new User({ email, password: hashed });
  await u.save();
  console.log('Admin created:', email);
  process.exit(0);
}
run().catch(err => { console.error(err); process.exit(1); });

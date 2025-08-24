require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();
app.use(cors());
app.use(express.json());

// Bacis rate limiting
const globalLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 200
}); 
app.use(globalLimiter);

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("mongoDb Conneted"))
    .catch((err) => {console.error(err); process.exit(1); })

app.use('/api/auth', require('./router/auth.js'))
console.log("reached")
app.use('/api/codes', require('./router/codes.js'))

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`))
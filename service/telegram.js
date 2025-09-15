// services/telegram.js
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const https = require("https");

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// ✅ Force IPv4 & add timeout
const agent = new https.Agent({ family: 4 });

async function sendToTelegram({ filePath, reelNo, codeLink }) {
  try {
const caption = `🎬 Video – ${reelNo}\n
🔑 Code Link 👇\n
👉 ${codeLink}\n\n
📌 How to Get & Use the Code\n
✅ Check the Pinned Message for full details`;


    const formData = new FormData();
    formData.append("chat_id", TELEGRAM_CHAT_ID);
    formData.append("caption", caption);
    formData.append("video", fs.createReadStream(filePath)); // ✅ send local file

    await axios.post(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendVideo`,
      formData,
      {
        headers: formData.getHeaders(),
        httpsAgent: agent, // force IPv4
        timeout: 60000, // 30 seconds
      }
    );

    console.log("✅ Sent video to Telegram:", reelNo);
  } catch (err) {
    console.error("❌ Telegram Error:", err.response?.data || err.message);
    throw err;
  }
}

module.exports = { sendToTelegram };

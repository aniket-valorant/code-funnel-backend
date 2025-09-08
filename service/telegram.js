// services/telegram.js
const axios = require("axios");

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

async function sendToTelegram({ imageUrl, reelNo, codeLink }) {
  try {
    const caption = `🎥 Reel No:- ${reelNo}\n🔑 Code → ${codeLink}`;

    await axios.post(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`,
      {
        chat_id: TELEGRAM_CHAT_ID,
        photo: imageUrl,
        caption,
      }
    );
    console.log("✅ Sent to Telegram:", reelNo);
  } catch (err) {
    console.error("❌ Telegram Error:", err.response?.data || err.message);
  }
}

module.exports = { sendToTelegram };

const axios = require('axios');

const GAS_CHAT = -1001248549898;
const TELEGRAM_TOKEN = '1536983859:AAG8oTHy4gFKnJkOSfmwNbqXfvNrV2zBvN4';

module.exports = {
  async send(text) {
    try {
      await axios.post(
        `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`,
        {
          chat_id: GAS_CHAT,
          text,
        },
      );
    } catch (error) {
      console.log(error);
    }
  }
};

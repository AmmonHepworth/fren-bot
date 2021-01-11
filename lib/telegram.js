const axios = require('axios');

const { GAS_CHAT, TELEGRAM_TOKEN } = process.env

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
  },
};

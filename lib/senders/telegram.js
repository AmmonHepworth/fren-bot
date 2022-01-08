const axios = require('axios');

const { TELEGRAM_TOKEN } = process.env;

module.exports = {
  /**
   * Send a message to Telegram on the given channel
   * @param {String} text Text to send
   * @param {Number} chat_id Id of the channel
   * @return {Promise<void>}
   */
  async send(text, chat_id) {
    try {
      await axios.post(
        `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`,
        {
          chat_id,
          text,
        },
      );
    } catch (error) {
      console.log(error);
    }
  },
};

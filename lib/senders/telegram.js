const axios = require('axios');

const { TELEGRAM_TOKEN } = process.env;

module.exports = {
  /**
   * Send a message to Telegram on the given channel
   * @param {String} text Text to send
   * @param {Number} chatId Id of the channel
   * @return {Promise<void>}
   */
  async send(text, chatId) {
    try {
      await axios.post(
        `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`,
        {
          chat_id: chatId,
          text,
        }
      );
    } catch (error) {
      console.log(error);
    }
  },
};

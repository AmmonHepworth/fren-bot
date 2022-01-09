const { WebClient } = require('@slack/web-api');

const { SM_TOKEN } = process.env;

const slack = new WebClient(SM_TOKEN);

module.exports = {
  /**
   * Send a message to Slack on the given channel
   * @param {String} text Text to send
   * @param {Number} channelId Id of the channel
   * @return {Promise<void>}
   */
  async send(text, channelId) {
    try {
      await slack.chat.postMessage({
        text,
        channel: channelId,
      });
    } catch (error) {
      console.log(error);
    }
  },
};

const BaseListener = require('./base');

const DiscordClient = require('../clients/discord');

class DiscordListener extends BaseListener {
  constructor(guildId, voiceChannelId) {
    super();

    this.guildId = guildId;
    this.voiceChannelId = voiceChannelId;

    DiscordClient.on('voiceStateUpdate', (oldState, newState) => {
      const { channelId: oldChannel } = oldState;
      const { channelId: newChannel, member } = newState;

      if (
        oldChannel === this.voiceChannelId &&
        newChannel !== this.voiceChannelId
      ) {
        console.log(`${member.user.username} has disconnected.`);

        this.emit(this.LEFT, member.user.username);
      }

      if (
        newChannel === this.voiceChannelId &&
        oldChannel !== this.voiceChannelId
      ) {
        console.log(`${member.user.username} has connected.`);

        this.emit(this.JOINED, member.user.username);
      }
    });
  }

  /**
   * Get the current member count
   * @return {Promise<Number>}
   */
  async memberCount() {
    const { members } = await DiscordClient.guilds.cache
      .get(this.guildId)
      .channels.fetch(this.voiceChannelId);

    return members.size;
  }
}

module.exports = DiscordListener;

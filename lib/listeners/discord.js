const { Client, GatewayIntentBits } = require('discord.js');
const BaseListener = require('./base');

const { DISCORD_TOKEN } = process.env;

class DiscordListener extends BaseListener {
  constructor(guildId, voiceChannelId) {
    super();

    this.guildId = guildId;
    this.voiceChannelId = voiceChannelId;

    this.client = new Client({
      intents: [GatewayIntentBits.GuildVoiceStates],
    });

    this.client.login(DISCORD_TOKEN);

    this.client.on('voiceStateUpdate', (oldState, newState) => {
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
    const { members } = await this.client.guilds.cache
      .get(this.guildId)
      .channels.fetch(this.voiceChannelId);

    console.log(members.size);
    return members.size;
  }
}

module.exports = DiscordListener;

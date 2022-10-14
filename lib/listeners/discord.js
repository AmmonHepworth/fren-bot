const { Client, GatewayIntentBits } = require('discord.js');
const BaseListener = require('./base');

const { GUILD_ID, VOICE_CHANNEL_ID, DISCORD_TOKEN } = process.env;

class DiscordListener extends BaseListener {
  constructor() {
    super();

    this.client = new Client({
      intents: [GatewayIntentBits.GuildVoiceStates],
    });

    this.client.login(DISCORD_TOKEN);

    this.client.on('voiceStateUpdate', (oldState, newState) => {
      const { channelID: oldChannel } = oldState;
      const { channelID: newChannel, member } = newState;

      if (oldChannel === VOICE_CHANNEL_ID && newChannel !== VOICE_CHANNEL_ID) {
        console.log(`${member.user.username} has disconnected.`);

        this.emit(this.LEFT, member.user.username);
      }

      if (newChannel === VOICE_CHANNEL_ID && oldChannel !== VOICE_CHANNEL_ID) {
        console.log(`${member.user.username} has connected.`);

        this.emit(this.JOINED, member.user.username);
      }
    });
  }

  /**
   * Get the current member count (cached)
   * @return {Number}
   */
  get memberCount() {
    const {
      members: { size: memberCount },
    } = this.client.guilds.cache
      .get(GUILD_ID)
      .channels.cache.get(VOICE_CHANNEL_ID);

    return memberCount;
  }
}

module.exports = DiscordListener;

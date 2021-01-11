require('dotenv-flow').config();
const Discord = require('discord.js');

const { VOICE_CHANNEL_ID, DISCORD_TOKEN } = process.env;

const client = new Discord.Client();
const frenCount = require('./responders/fren_count')(client);

client.login(DISCORD_TOKEN);

client.on('voiceStateUpdate', (oldState, newState) => {
  const { channelID: oldChannel } = oldState;
  const { channelID: newChannel, member } = newState;

  if (oldChannel === VOICE_CHANNEL_ID && newChannel !== VOICE_CHANNEL_ID) {
    frenCount.onDisconnect(member);
  }

  if (newChannel === VOICE_CHANNEL_ID && oldChannel !== VOICE_CHANNEL_ID) {
    frenCount.onJoin(member);
  }
});

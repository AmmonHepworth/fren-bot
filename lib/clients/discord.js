const { Client, GatewayIntentBits } = require('discord.js');

const { DISCORD_TOKEN } = process.env;

const DiscordClient = new Client({
  intents: [GatewayIntentBits.GuildVoiceStates],
});

DiscordClient.login(DISCORD_TOKEN);

module.exports = DiscordClient;

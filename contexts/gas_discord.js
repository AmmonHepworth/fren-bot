const {
  DISCORD_RESPONDER_ENABLED,
  GAS_CHAT,
  GUILD_ID,
  VOICE_CHANNEL_ID,
} = process.env;

const telegram = require('../lib/senders/telegram');

const DiscordListener = require('../lib/listeners/discord');
const FrenCountResponder = require('../lib/responders/fren_count');

if (DISCORD_RESPONDER_ENABLED === 'true') {
  const discordResponder = new FrenCountResponder((frenCount) => {
    const plural = frenCount > 1;
    const msg = `There ${plural ? 'are' : 'is'} ${frenCount} fren${
      plural ? 's' : ''
    } in the leb.`;

    telegram.send(msg, GAS_CHAT);
  });

  const discord = new DiscordListener();

  discord.onJoin((user) => {
    console.log(`${user} has connected to Discord.`);

    discordResponder.onJoin(user, discord.memberCount);
  });

  discord.onLeave((user) => {
    console.log(`${user} has disconnected from Discord.`);

    discordResponder.onLeave(user, discord.memberCount);
  });
}

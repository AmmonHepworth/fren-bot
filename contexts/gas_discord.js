const {
  DISCORD_RESPONDER_ENABLED,
  GAS_GAMER_CHAT,
  GUILD_ID,
  VOICE_CHANNEL_ID,
} = process.env;

const telegram = require('../lib/senders/telegram');

const DiscordListener = require('../lib/listeners/discord');
const FrenCountResponder = require('../lib/responders/fren_count');

if (DISCORD_RESPONDER_ENABLED === 'true') {
  const discordResponder = new FrenCountResponder((frenCount) => {
    const plural = frenCount > 1;
    const msg = `There ${plural ? 'are' : 'is'} ${frenCount} kitten${
      plural ? 's' : ''
    } in the leb.`;

    telegram.send(msg, GAS_GAMER_CHAT);
  });

  const discord = new DiscordListener(GUILD_ID, VOICE_CHANNEL_ID);

  discord.onJoin(async (user) => {
    console.log(`${user} has connected to Discord.`);

    const memberCount = await discord.memberCount();

    discordResponder.onJoin(user, memberCount);
  });

  discord.onLeave(async (user) => {
    console.log(`${user} has disconnected from Discord.`);

    const memberCount = await discord.memberCount();

    discordResponder.onLeave(user, memberCount);
  });
}

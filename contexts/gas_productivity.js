const {
  DISCORD_RESPONDER_ENABLED,
  GAS_CHAT,
  GUILD_ID,
  PRODUCTIVITY_CHANNEL_ID,
} = process.env;

const telegram = require('../lib/senders/telegram');

const FrenCountResponder = require('../lib/responders/fren_count');
const DiscordListener = require('../lib/listeners/discord');

if (DISCORD_RESPONDER_ENABLED === 'true') {
  const productivityResponder = new FrenCountResponder((frenCount) => {
    const plural = frenCount > 1;
    const msg = `${frenCount} fren${plural ? 's' : ''} ${
      plural ? 'are' : 'is'
    } being productive 😌.`;

    telegram.send(msg, GAS_CHAT);
  });

  const discordProductivity = new DiscordListener(
    GUILD_ID,
    PRODUCTIVITY_CHANNEL_ID
  );

  discordProductivity.onJoin(async (user) => {
    console.log(`${user} has connected to Productive Zone.`);

    const memberCount = await discordProductivity.memberCount();

    productivityResponder.onJoin(user, memberCount);
  });

  discordProductivity.onLeave(async (user) => {
    console.log(`${user} has disconnected from Productive Zone.`);

    const memberCount = await discordProductivity.memberCount();

    productivityResponder.onLeave(user, memberCount);
  });
}

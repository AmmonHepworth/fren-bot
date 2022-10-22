const {
  PRODUCTIVITY_RESPONDER_ENABLED,
  GAS_CHAT,
  GUILD_ID,
  PRODUCTIVITY_CHANNEL_ID,
} = process.env;

const telegram = require('./lib/senders/telegram');

if (DISCORD_RESPONDER_ENABLED === 'true') {
  const productivityResponder = new FrenCountResponder((frenCount) => {
    const plural = frenCount > 1;
    const msg = `${frenCount} fren${
      plural ? 's' : ''
    } ${plural ? 'are' : 'is'} being productive 😌.`;

    telegram.send(msg, GAS_CHAT);
  });

  const discordProductivity = new DiscordListener(GUILD_ID, PRODUCTIVITY_CHANNEL_ID);

  discordProductivity.onJoin((user) => {
    console.log(`${user} has connected to Productive Zone.`);

    productivityResponder.onJoin(user, discordProductivity.memberCount);
  });

  discordProductivity.onLeave((user) => {
    console.log(`${user} has disconnected from Productive Zone.`);

    productivityResponder.onLeave(user, discordProductivity.memberCount);
  });
}

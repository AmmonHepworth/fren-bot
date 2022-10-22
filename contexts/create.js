const {
  CREATE_RESPONDER_ENABLED,
  GAS_GAMER_CHAT,
  SM_MC_CHANNEL,
  FRENCRAFT_CREATE_HOST,
  MC_CREATE_POLL_INTERVAL,
  FRENCRAFT_CREATE_PORT,
} = process.env;

const telegram = require('../lib/senders/telegram');
const slack = require('../lib/senders/slack');

const MinecraftListener = require('../lib/listeners/minecraft');
const FrenCountResponder = require('../lib/responders/fren_count');

if (CREATE_RESPONDER_ENABLED === 'true') {
  const minecraftCreateResponder = new FrenCountResponder((frenCount) => {
    const plural = frenCount > 1;
    const msg = `There ${plural ? 'are' : 'is'} ${frenCount} fren${
      plural ? 's' : ''
    } on the create server.`;

    telegram.send(msg, GAS_GAMER_CHAT);
    slack.send(msg, SM_MC_CHANNEL);
  });

  const minecraftCreate = new MinecraftListener(
    FRENCRAFT_CREATE_HOST,
    MC_CREATE_POLL_INTERVAL,
    Number.parseInt(FRENCRAFT_CREATE_PORT, 10)
  );

  minecraftCreate.onJoin((user) => {
    console.log(`${user} has connected to the Create server.`);

    minecraftCreateResponder.onJoin(user, minecraftCreate.playerCount);
  });

  minecraftCreate.onLeave((user) => {
    console.log(`${user} has disconnected from the Create server.`);

    minecraftCreateResponder.onLeave(user, minecraftCreate.playerCount);
  });
}

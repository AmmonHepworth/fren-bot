const {
  FRENCRAFT_RESPONDER_ENABLED,
  GAS_GAMER_CHAT,
  SM_MC_CHANNEL,
  FRENCRAFT_HOST,
  FRENCRAFT_PORT,
  MC_POLL_INTERVAL,
} = process.env;

const telegram = require('../lib/senders/telegram');
const slack = require('../lib/senders/slack');

const MinecraftListener = require('../lib/listeners/minecraft');
const FrenCountResponder = require('../lib/responders/fren_count');

if (FRENCRAFT_RESPONDER_ENABLED === 'true') {
  const minecraftResponder = new FrenCountResponder((frenCount) => {
    const plural = frenCount > 1;
    const msg = `There ${plural ? 'are' : 'is'} ${frenCount} fren${
      plural ? 's' : ''
    } on the frencraft server.`;

    telegram.send(msg, GAS_GAMER_CHAT);
    slack.send(msg, SM_MC_CHANNEL);
  });

  const minecraft = new MinecraftListener(
    FRENCRAFT_HOST,
    MC_POLL_INTERVAL,
    Number.parseInt(FRENCRAFT_PORT, 10)
  );

  minecraft.onJoin((user) => {
    console.log(`${user} has connected to Frencraft.`);

    minecraftResponder.onJoin(user, minecraft.playerCount);
  });

  minecraft.onLeave((user) => {
    console.log(`${user} has disconnected from Frencraft.`);

    minecraftResponder.onLeave(user, minecraft.playerCount);
  });
}

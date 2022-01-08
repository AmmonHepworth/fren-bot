require('dotenv-flow').config();

const { GAS_CHAT, GAS_GAMER_CHAT } = process.env;

const telegram = require('./lib/senders/telegram');

const DiscordListener = require('./lib/listeners/discord.js');
const MinecraftListener = require('./lib/listeners/minecraft.js');
const FrenCountResponder = require('./lib/responders/fren_count.js');

const gasFrensResponder = new FrenCountResponder((msg) => telegram.send(msg, GAS_CHAT));
const gasGamerResponder = new FrenCountResponder((msg) => telegram.send(msg, GAS_GAMER_CHAT));

const discord = new DiscordListener();
const minecraft = new MinecraftListener();

discord.onJoin((user) => {
  console.log(`${user} has connected to Discord.`);

  gasFrensResponder.onJoin(user, discord.memberCount);
});

discord.onLeave((user) => {
  console.log(`${user} has disconnected from Discord.`);

  gasFrensResponder.onLeave(user, discord.memberCount);
});

minecraft.onJoin((user) => {
  console.log(`${user} has connected to Frencraft.`);

  gasGamerResponder.onJoin(user, minecraft.playerCount);
});

minecraft.onLeave((user) => {
  console.log(`${user} has disconnected from Frencraft.`);

  gasGamerResponder.onLeave(user, minecraft.playerCount);
});

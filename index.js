require('dotenv-flow').config();

const Discord = require('discord.js');

const telegram = require('./lib/telegram');
const client = new Discord.Client();
const disconnectTimes = {};
const {
  VOICE_CHANNEL_ID,
  GUILD_ID,
  DISCORD_TOKEN,
  WAIT_DELAY,
} = process.env;

console.log(process.env);

client.login(DISCORD_TOKEN);

client.on('voiceStateUpdate', (
  { channelID: newChannel },
  { channelID: oldChannel, member, id },
) => {
  const timeSinceLast = disconnectTimes[id] || Infinity;
  const { members: { size: memberCount } } = client
    .guilds.cache.get(GUILD_ID)
    .channels.cache.get(VOICE_CHANNEL_ID);

  if (oldChannel === VOICE_CHANNEL_ID && newChannel !== VOICE_CHANNEL_ID) {
    disconnectTimes[newState.id] = Date.now();

    return console.log('left');
  }

  if (newChannel === VOICE_CHANNEL_ID && oldChannel !== VOICE_CHANNEL_ID) {
    console.log(`joined, there are now ${memberCount} members`)

    if (Date.now() - timeSinceLast < WAIT_DELAY) {
      return console.log(
        `member ${member.user.username} has left too recently to be counted again`
      );
    }

    if (Math.log2(memberCount) % 1 === 0) {
      telegram.send(`There are ${memberCount} frens in the leb`);
    }
  }
});

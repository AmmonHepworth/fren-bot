import telegram from '../lib/telegram';

const { WAIT_DELAY, GUILD_ID, VOICE_CHANNEL_ID } = process.env;

class FrenCount {
  constructor(client) {
    this.client = client;
    this.disconnectTimes = {};
  }

  get memberCount() {
    const { members: { size: memberCount } } = this.client
      .guilds.cache.get(GUILD_ID)
      .channels.cache.get(VOICE_CHANNEL_ID);

    return memberCount;
  }

  get alertThresholdReached() {
    return Math.log2(this.memberCount) % 1 === 0;
  }

  timeSinceLastJoined({ id }) {
    return Date.now() - (this.disconnectTimes[id] || Infinity);
  }

  /**
   * Public methods
   */

  onJoin(member) {
    console.log(`joined, there are now ${this.memberCount} members`);

    if (this.timeSinceLastJoined(member) < WAIT_DELAY) {
      return console.log(
        `member ${member.user.username} has left too recently to be counted again`,
      );
    }

    if (this.alertThresholdReached) {
      telegram.send(`There are ${this.memberCount} frens in the leb`);
    }
  }

  onDisconnect({ id }) {
    this.disconnectTimes[id] = Date.now();

    console.log('left');
  }
}

module.exports = (client) => new FrenCount(client);

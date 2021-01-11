import telegram from '../lib/telegram';

const { WAIT_DELAY, GUILD_ID, VOICE_CHANNEL_ID } = process.env;

class FrenCount {
  /**
   * Construct a state management instance for the fren counter
   * @param {Object} client Discord.js Client object
   */
  constructor(client) {
    this.client = client;
    this.disconnectTimes = {};
  }

  /**
   * Get the current member count (cached)
   * @return {Number}
   */
  get memberCount() {
    const { members: { size: memberCount } } = this.client
      .guilds.cache.get(GUILD_ID)
      .channels.cache.get(VOICE_CHANNEL_ID);

    return memberCount;
  }

  /**
   * Determine if the amount of frens is at an increment that
   * constitutes an alert state
   * @return {Boolean}
   */
  get alertThresholdReached() {
    return Math.log2(this.memberCount) % 1 === 0;
  }

  /**
   * Get the time since a member joined
   * @param {Object} member The GuildMember object returned from Discord.js
   * @param {String} member.id The snowflake id of the member
   * @return {Number} Milliseconds since last join
   */
  timeSinceLastJoined({ id }) {
    return Date.now() - (this.disconnectTimes[id] || Infinity);
  }

  /**
   * Public methods
   */

  /**
   * Respond to a member joining the main voice channel
   * @param {Object} member The GuildMember object returned from Discord.js
   */
  onJoin(member) {
    console.log(`joined, there are now ${this.memberCount} members`);

    if (this.timeSinceLastJoined(member) < WAIT_DELAY) {
      console.log(
        `member ${member.user.username} has left too recently to be counted again`,
      );
    }

    if (this.alertThresholdReached) {
      telegram.send(`There are ${this.memberCount} frens in the leb`);
    }
  }

  /**
   * Respond to a member disconnecting from the main voice channel
   * @param {Object} member The GuildMember object returned from Discord.js
   * @param {String} member.id The snowflake id of the member
   */
  onDisconnect({ id }) {
    this.disconnectTimes[id] = Date.now();

    console.log('left');
  }
}

module.exports = (client) => new FrenCount(client);

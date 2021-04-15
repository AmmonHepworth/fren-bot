const telegram = require('../lib/telegram');

const {
  WAIT_DELAY,
  GUILD_ID,
  VOICE_CHANNEL_ID,
  ALERT_COOLDOWN,
  SCREAM_ALLOWANCE,
} = process.env;

class FrenCount {
  /**
   * Construct a state management instance for the fren counter
   * @param {Object} client Discord.js Client object
   */
  constructor(client) {
    this.client = client;
    this.disconnectTimes = {};
    this.cooldownForCount = new Map();
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
    return Date.now() - (this.disconnectTimes[id] || -Infinity);
  }

  /**
   * Begin cooldown for message events with a given number of members
   * @param {Number} number The number of members to put on cooldown
   */
  putOnCooldown(number) {
    this.cooldownForCount.set(
      number,
      setTimeout(() => this.cooldownForCount.delete(number), ALERT_COOLDOWN),
    );
  }

  /**
   * Take all numbers above given number off of cooldown
   * @param {Number} number The lower bound above which all will be anihilated
   */
  cooldownAbove(number) {
    this.cooldownForCount = new Map(
      [...this.cooldownForCount].filter(([n, timeId]) => {
        if (n < number) {
          clearTimeout(timeId);

          return false;
        }

        return true;
      }),
    );
  }

  /**
   * Get whether or not a given number of members constitutes a cooldown condition
   * @param {Number} number The number of members
   * @return {Boolean} Whether or not that member count is on cooldown
   */
  isOnCooldown(number) {
    return this.cooldownForCount.has(number);
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
      console.log(`member ${member.user.username} has left too recently to be counted again`);

      return;
    }

    if (this.isOnCooldown(this.memberCount)) {
      console.log(`notified a count of ${this.memberCount} too recently, skipping`);

      return;
    }

    if (this.alertThresholdReached) {
      telegram.send(`There are ${this.memberCount} frens in the leb`);
      this.cooldownAbove(this.memberCount);
    }
  }

  /**
   * Respond to a member disconnecting from the main voice channel
   * @param {Object} member The GuildMember object returned from Discord.js
   * @param {String} member.id The snowflake id of the member
   */
  onDisconnect(member) {
    const justScreamed = (
      this.timeSinceLastJoined(member) < SCREAM_ALLOWANCE && this.memberCount === 0
    );

    if (!justScreamed) {
      this.putOnCooldown(this.memberCount + 1);
    }

    this.disconnectTimes[member.id] = Date.now();
  }
}

module.exports = (client) => new FrenCount(client);

const telegram = require('../lib/telegram');

const {
  WAIT_DELAY,
  GUILD_ID,
  VOICE_CHANNEL_ID,
  ALERT_COOLDOWN,
} = process.env;

class FrenCount {
  /**
   * Construct a state management instance for the fren counter
   * @param {Object} client Discord.js Client object
   */
  constructor(client) {
    this.client = client;
    this.disconnectTimes = {};
    this.cooldownForCount = new Set();
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
    this.cooldownForCount.add(number);

    setTimeout(() => {
      this.cooldownForCount.delete(number);
    }, ALERT_COOLDOWN);
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
      if (this.memberCount === 1) {
        telegram.send("And Saint Attila raised the Telegram message up on high, saying, 'O Lord, bless this thy Telegram message, that with it thou mayst gather thine frens to the Discord, in thy mercy.' And the Lord did grin. And the frens did dote upon the memes, and waifus, and games, and stories, and raccoons, and chicken-nuggies, and Overwatch, and other bad games. And the Lord spake, saying, 'First shalt thou take out the Telegram token. Then the friend count shall be one, no more, no less. One shall be the number of the frens, and the number of the frens shall be one. Two shalt thou not count, neither count thou zero, excepting that thou then proceed to proclaim one. Three is right out. Once the number one, being the first number of frens, be reached, then lobbest thou telegram Notification of Antioch towards thy frens, who, being wholesome in My sight, shall join in.");
      } else {
        telegram.send(`There are ${this.memberCount} frens in the leb`);
      }
    }
  }

  /**
   * Respond to a member disconnecting from the main voice channel
   * @param {Object} member The GuildMember object returned from Discord.js
   * @param {String} member.id The snowflake id of the member
   */
  onDisconnect({ id }) {
    this.disconnectTimes[id] = Date.now();
    this.putOnCooldown(this.memberCount + 1);
  }
}

module.exports = (client) => new FrenCount(client);

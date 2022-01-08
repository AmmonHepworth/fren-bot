const {
  WAIT_DELAY,
  ALERT_COOLDOWN,
  SCREAM_ALLOWANCE,
} = process.env;

class FrenCountResponder {
  /**
   * Construct a state management instance for the a fren counter
   * @param {Function} send Function that takes the member count and sends a message
   */
  constructor(send = (msg) => console.log(msg)) {
    this.send = send;
    this.disconnectTimes = {};
    this.cooldownForCount = new Map();
  }

  /**
   * Determine if the amount of frens is at an increment that
   * constitutes an alert state
   * @param {Number} memberCount Number of members on the platform
   * @return {Boolean}
   */
  alertThresholdReached(memberCount) {
    return Math.log2(memberCount) % 1 === 0;
  }

  /**
   * Get the time since a member joined
   * @param {Object} memberName The name of the member
   * @return {Number} Milliseconds since last join
   */
  timeSinceLastJoined(memberName) {
    return Date.now() - (this.disconnectTimes[memberName] || -Infinity);
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
   * Respond to a member joining the platform
   * @param {String} memberName Name of the member
   * @param {Number} memberCount Current amount of people on the platform
   */
  onJoin(memberName, memberCount) {
    console.log(`joined, there are now ${memberCount} members`);

    if (this.timeSinceLastJoined(memberName) < WAIT_DELAY) {
      console.log(`member ${memberName} has left too recently to be counted again`);

      return;
    }

    if (this.isOnCooldown(memberCount)) {
      console.log(`notified a count of ${memberCount} too recently, skipping`);

      return;
    }

    if (this.alertThresholdReached(memberCount)) {
      this.send(memberCount);
      this.cooldownAbove(memberCount);
    }
  }

  /**
   * Respond to a member leaving the platform
   * @param {Number} memberName Name of the member
   */
  onLeave(memberName, memberCount) {
    const justScreamed = (
      this.timeSinceLastJoined(memberName) < SCREAM_ALLOWANCE && memberCount === 0
    );

    if (!justScreamed) {
      this.putOnCooldown(memberCount + 1);
    }

    this.disconnectTimes[memberName] = Date.now();
  }
}

module.exports = FrenCountResponder;

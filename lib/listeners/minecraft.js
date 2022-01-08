const { queryFull } = require('minecraft-server-util');
const BaseListener = require('./base.js');

const { FRENCRAFT_HOST, MC_POLL_INTERVAL } = process.env;

class MinecraftListener extends BaseListener {
  constructor() {
    super();

    this.playerCache = null;

    this.poll = setInterval(() => {
      this.rehydrate();
    }, MC_POLL_INTERVAL);
  }

  /**
   * Return the count of players on the server
   * @return {Number} Number of players
   */
  get playerCount() {
    return this.playerCache.length;
  }

  /**
   * Rehydrate the cached player list and handle edge state detection
   * @return {Promise<void>}
   */
  async rehydrate() {
    try {
      const lastPlayers = this.playerCache;
      const {
        players: {
          list: nextPlayers,
        },
      } = await queryFull(FRENCRAFT_HOST);

      this.playerCache = nextPlayers;

      if (lastPlayers !== null) {
        const joined = nextPlayers.filter((player) => !lastPlayers.includes(player));
        const left = lastPlayers.filter((player) => !nextPlayers.includes(player));

        if (joined.length > 0) this.emit(this.JOINED, joined);
        if (left.length > 0) this.emit(this.LEFT, left);
      }
    } catch (err) {
      console.error(err);
    }
  }
}

module.exports = MinecraftListener;

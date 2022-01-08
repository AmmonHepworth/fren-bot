const EventEmitter = require('events');

class BaseListener extends EventEmitter {
  constructor() {
    super();

    this.JOINED = 'joined';
    this.LEFT = 'left';
  }

  onJoin(...args) {
    this.on(this.JOINED, ...args);
  }

  onLeave(...args) {
    this.on(this.LEFT, ...args);
  }
}

module.exports = BaseListener;

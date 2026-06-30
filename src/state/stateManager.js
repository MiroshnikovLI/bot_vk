const { STATES } = require('../constants/index');
class UserStateManager {
  constructor () {
    this.states = new Map();
  }

  set(userId, state, data = {}) {
    this.states.set(userId, { state, ...data, updateAt: Date.now()});
  }

  get(userId) {
    return this.states.get(userId);
  }

  delete(userId) {
    this.states.delete(userId);
  }

  has(userId) {
    return this.states.has(userId);
  }

  clearExpired(maxAge = 3600000) {
    const now = Date.now();
    for (const [userId, state] of this.states.entries()) {
      if (now - state.updatedAt > maxAge) {
        this.states.delete(userId)
      }
    }
  }
}


const userStates = new UserStateManager();

module.exports = {
  userStates
}
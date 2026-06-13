const { sendMessage } = require("../config/vkApi")
const { getPrivateKeyboard } = require('../keyboards/keyboards');

function createSafeHandlers(handlers) {
  const safeHandlers = {};

  for (const [name, handlerFunc] of Object.entries(handlers)) {
    safeHandlers[name] = async (userId, ...args) => {
      try {
        await handlerFunc(userId, ...args);
      } catch (error) {
        console.log(`[FSM] ${name} error: ${error.message}`);
        await sendMessage(userId, 'Ошибка! Обратитесь к администратору!', getPrivateKeyboard());
        const { userStates } = require('../state/stateManager');
        userStates.delete(userId);
      }
    }
  }

  return safeHandlers;
}

module.exports = {
  createSafeHandlers
}
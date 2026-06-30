const { sendMessage } = require("../../config/vkApi")
const { userKeyboards } = require('../../keyboards/user/index');
const { isUserAdmin } = require('../../services/user/userService');

function createSafeHandlers(handlers) {
  const safeHandlers = {};

  for (const [name, handlerFunc] of Object.entries(handlers)) {
    safeHandlers[name] = async (userId, ...args) => {
      try {
        await handlerFunc(userId, ...args);
      } catch (error) {
        const isAdmin = await isUserAdmin(userId);
        console.log(`[FSM] ${name} error: ${error.message}`);
        await sendMessage(366402660, `[FSM] ${name} error: ${error.message}`);
        await sendMessage(userId, 'Ошибка! Обратитесь к администратору!', userKeyboards.main(isAdmin));
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
const { userStates } = require('../../../state/stateManager');
const { sendMessage } = require('../../../config/vkApi');
const { getCancelKeyboard } = require('../../../keyboards/index');
const { NOTIFICATIONS, STATES } = require('../../../constants/index');

async function handlerAddReplacement(userId) {
  userStates.set(userId, STATES.WAITING_ADD_REPLACEMENT);
  await sendMessage(userId, NOTIFICATIONS.ADD_REPLACEMENT, getCancelKeyboard());
}

module.exports = {
  handlerAddReplacement
}
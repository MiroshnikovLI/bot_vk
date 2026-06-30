const { userStates } = require('../../../state/stateManager');
const { sendMessage } = require('../../../config/vkApi');
const { getCancelKeyboard } = require('../../../keyboards/index');
const { NOTIFICATIONS, STATES } = require('../../../constants/index');

async function handlerDeleteReplacement(userId) {
  userStates.set(userId, STATES.WAITING_DELETE_REPLACEMENT);
  await sendMessage(userId, NOTIFICATIONS.DELETED_A_REPLACEMENT, getCancelKeyboard());
}

module.exports = {
  handlerDeleteReplacement
}
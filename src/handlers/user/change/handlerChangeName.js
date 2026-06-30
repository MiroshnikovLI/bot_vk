const { getCancelKeyboard } = require('../../../keyboards/index');
const { sendMessage } = require('../../../config/vkApi');
const { userStates } = require('../../../state/stateManager');
const { NOTIFICATIONS, STATES } = require('../../../constants/index');

async function handlerChangeName(userId) {
  userStates.set(userId, STATES.WAITING_CHANGE_NAME);
  await sendMessage(userId, NOTIFICATIONS.CHANGE_NAME, getCancelKeyboard());
}

module.exports = {
  handlerChangeName
}
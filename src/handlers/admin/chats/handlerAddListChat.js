const { sendMessage } = require('../../../config/vkApi');
const { NOTIFICATIONS, STATES } = require('../../../constants/index');
const { getCancelKeyboard } = require('../../../keyboards/index');
const { userStates } = require('../../../state/stateManager');

async function handlerAddListChat(userId) {
  userStates.set(userId, STATES.WAITING_NAME_LINK);
  await sendMessage(userId, NOTIFICATIONS.WAITING_NEW_VALUE('name'), getCancelKeyboard());
}

module.exports = {
  handlerAddListChat
}
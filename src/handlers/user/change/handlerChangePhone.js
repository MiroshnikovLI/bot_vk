const { getCancelKeyboard } = require('../../../keyboards/index');
const { sendMessage } = require('../../../config/vkApi');
const { userStates } = require('../../../state/stateManager');
const { NOTIFICATIONS, STATES } = require('../../../constants/index');

async function handlerChangePhone(userId) {
  userStates.set(userId, STATES.WAITING_CHANGE_PHONE);
  await sendMessage(userId, NOTIFICATIONS.CHANGE_PHONE, getCancelKeyboard());
}

module.exports = {
  handlerChangePhone
}
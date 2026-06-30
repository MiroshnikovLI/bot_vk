const { userStates } = require('../../../state/stateManager');
const { sendMessage } = require('../../../config/vkApi');
const { getCancelKeyboard } = require('../../../keyboards/index');
const { NOTIFICATIONS, STATES } = require('../../../constants/index');

async function handlerChangeWBId(userId) {
  userStates.set(userId, STATES.WAITING_CHANGE_WB_ID);
  await sendMessage(userId, NOTIFICATIONS.CHANGE_WB_ID, getCancelKeyboard());
}

module.exports = {
  handlerChangeWBId
}
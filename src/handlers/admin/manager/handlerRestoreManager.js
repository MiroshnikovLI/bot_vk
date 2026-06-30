const { userStates } = require('../../../state/stateManager');
const { sendMessage } = require('../../../config/vkApi');
const { NOTIFICATIONS, STATES } = require('../../../constants/index');
const { getCancelKeyboard } = require('../../../keyboards/index');

async function handlerRestoreManager(userId) {
  userStates.set(userId, STATES.WAITING_INFO_MANAGER, {status: "restore" });
  await sendMessage(userId, NOTIFICATIONS.WAITING_IFO_MANAGER, getCancelKeyboard());
}

module.exports = {
  handlerRestoreManager
}
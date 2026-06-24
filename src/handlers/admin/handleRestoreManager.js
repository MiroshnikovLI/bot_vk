const { userStates } = require('../../state/stateManager');
const { sendMessage } = require('../../config/vkApi');
const { NOTIFICATIONS } = require('../../constants');
const { getCancelKeyboard } = require('../../keyboards/keyboards');

async function handleRestoreManager(userId) {
  userStates.set(userId, "waitingInfoManager", {status: "restore" });
  await sendMessage(userId, NOTIFICATIONS.WAITING_IFO_MANAGER, getCancelKeyboard());
}

module.exports = {
  handleRestoreManager
}
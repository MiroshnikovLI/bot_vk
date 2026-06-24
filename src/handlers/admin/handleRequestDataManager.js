const { sendMessage } = require('../../config/vkApi');
const { NOTIFICATIONS } = require('../../constants');
const { getCancelKeyboard } = require('../../keyboards/keyboards');
const { userStates } = require('../../state/stateManager');

async function handleRequestDataManager(userId) {
  userStates.set(userId, 'waitingInfoManager');
  await sendMessage(userId, NOTIFICATIONS.WAITING_IFO_MANAGER, getCancelKeyboard());
}

module.exports = {
  handleRequestDataManager
}
const { sendMessage } = require('../../config/vkApi');
const { userStates } = require('../../state/stateManager');
const { NOTIFICATIONS } = require('../../constants/message');
const { getCancelKeyboard } = require('../../keyboards/keyboards');

async function handleDeleteManager(userId) {
  userStates.set(userId, 'waitingInfoManager', {status: 'deactive'});
  await sendMessage(userId, NOTIFICATIONS.WAITING_IFO_MANAGER, getCancelKeyboard());
}

module.exports = {
  handleDeleteManager
}
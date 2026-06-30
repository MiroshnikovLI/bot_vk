const { sendMessage } = require('../../../config/vkApi');
const { userStates } = require('../../../state/stateManager');
const { NOTIFICATIONS, STATES } = require('../../../constants/index');
const { getCancelKeyboard } = require('../../../keyboards/index');

async function handlerDeleteManager(userId) {
  userStates.set(userId, STATES.WAITING_INFO_MANAGER, {status: 'deactive'});
  await sendMessage(userId, NOTIFICATIONS.WAITING_IFO_MANAGER, getCancelKeyboard());
}

module.exports = {
  handlerDeleteManager
}
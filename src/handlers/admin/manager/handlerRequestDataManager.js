const { sendMessage } = require('../../../config/vkApi');
const { NOTIFICATIONS, STATES } = require('../../../constants/index');
const { getCancelKeyboard } = require('../../../keyboards/index');
const { userStates } = require('../../../state/stateManager');

async function handlerRequestDataManager(userId) {
  userStates.set(userId, STATES.WAITING_INFO_MANAGER);
  await sendMessage(userId, NOTIFICATIONS.WAITING_IFO_MANAGER, getCancelKeyboard());
}

module.exports = {
  handlerRequestDataManager
}
const { userStates } = require('../../../state/stateManager');
const { sendMessage } = require('../../../config/vkApi');
const { getCancelKeyboard } = require('../../../keyboards/index');
const { NOTIFICATIONS, STATES } = require('../../../constants/index');

async function handlerDeletePvzForRequest(userId) {
  userStates.set(userId, STATES.WAITING_SELECTING_PVZ_FOR_REMOVAL);
  await sendMessage(userId, NOTIFICATIONS.DELETE_PVZ_FOR_REQUEST, getCancelKeyboard());
}

module.exports = {
  handlerDeletePvzForRequest
}
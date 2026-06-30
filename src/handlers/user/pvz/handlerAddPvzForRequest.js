const { userStates } = require('../../../state/stateManager');
const { sendMessage } = require('../../../config/vkApi');
const { getCancelKeyboard } = require('../../../keyboards/index');
const { NOTIFICATIONS, STATES } = require('../../../constants/index');

async function handlerAddPvzForRequest(userId) {
  userStates.set(userId, STATES.WAITING_SELECTING_PVZ_TO_ADD);
  const state = userStates.get(userId);
  await sendMessage(userId, NOTIFICATIONS.ADD_PVZ_FOR_REQUEST, getCancelKeyboard(),
  );
}

module.exports = {
  handlerAddPvzForRequest
}
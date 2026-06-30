const { userStates } = require('../../../state/stateManager');
const { sendMessage } = require('../../../config/vkApi');
const { getCancelKeyboard } = require('../../../keyboards/index');
const { NOTIFICATIONS, STATES } = require('../../../constants/index');

async function handlerDeletePvz(userId) {
  userStates.set(userId, STATES.WAITING_ACTIVE_PVZ_ID, {status: 'deactive'});
  await sendMessage(userId, NOTIFICATIONS.WAITING_ID_PVZ_TO_SET_ACTIVE(false), getCancelKeyboard())
}

module.exports = {
  handlerDeletePvz
}
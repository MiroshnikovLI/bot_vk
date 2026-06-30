const { userStates } = require('../../../state/stateManager');
const { sendMessage } = require('../../../config/vkApi');
const { STATES, NOTIFICATIONS } = require('../../../constants/index');
const { getCancelKeyboard } = require('../../../keyboards/index');

async function handlerActivePvz(userId) {
  userStates.set(userId, STATES.WAITING_ACTIVE_PVZ_ID, { status: 'restore'});
  await sendMessage(userId, NOTIFICATIONS.WAITING_ID_PVZ_TO_SET_ACTIVE(true), getCancelKeyboard());
}

module.exports = {
  handlerActivePvz
}
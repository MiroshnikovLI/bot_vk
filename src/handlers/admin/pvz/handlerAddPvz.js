const { sendMessage } = require("../../../config/vkApi");
const { userStates } = require("../../../state/stateManager");
const { getCancelKeyboard } = require("../../../keyboards/index");
const { NOTIFICATIONS, STATES } = require('../../../constants/index');

async function handlerAddPVZ(userId) {
  userStates.set(userId, STATES.WAITING_PVZ_ID);
  await sendMessage(userId, NOTIFICATIONS.ADD_PVZ_TO_DB, getCancelKeyboard());
}

module.exports = {
  handlerAddPVZ,
};

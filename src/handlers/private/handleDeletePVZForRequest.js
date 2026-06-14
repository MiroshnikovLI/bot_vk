const { userStates } = require('../../state/stateManager');
const { sendMessage } = require('../../config/vkApi');
const { getCancelKeyboard } = require('../../keyboards/keyboards');
const { DELETE_PVZ_FOR_REQUEST } = require('../../constants/message');

async function handleDeletePVZForRequest(userId) {
  userStates.set(userId, "selectingPvzForRemoval");
  await sendMessage(userId, DELETE_PVZ_FOR_REQUEST, getCancelKeyboard());
}

module.exports = {
  handleDeletePVZForRequest
}
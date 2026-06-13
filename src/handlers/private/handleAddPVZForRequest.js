const { userStates } = require('../../state/stateManager');
const { sendMessage } = require('../../config/vkApi');
const { getCancelKeyboard } = require('../../keyboards/keyboards');
const { ADD_PVZ_FOR_REQUEST } = require('../../constants/message');

async function handleAddPVZForRequest(userId) {
  userStates.set(userId, "selectingPvzToAdd");
  const state = userStates.get(userId);
  await sendMessage(userId, ADD_PVZ_FOR_REQUEST, getCancelKeyboard(),
  );
}

module.exports = {
  handleAddPVZForRequest
}
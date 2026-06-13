const { userStates } = require('../../state/stateManager');
const { sendMessage } = require('../../config/vkApi');
const { getCancelKeyboard } = require('../../keyboards/keyboards');
const { ADD_REPLECAMENT } = require('../../constants/message');

async function handleAddReplacement(userId) {
  userStates.set(userId, "addReplacement");
  await sendMessage(userId, ADD_REPLECAMENT, getCancelKeyboard());
}

module.exports = {
  handleAddReplacement
}
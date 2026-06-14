const { userStates } = require('../../state/stateManager');
const { sendMessage } = require('../../config/vkApi');
const { getCancelKeyboard } = require('../../keyboards/keyboards');
const { DELETED_A_REPLACEMENT } = require('../../constants/message');

async function handledeleteReplacement(userId) {
  userStates.set(userId, "deletedReplacement");
  await sendMessage(userId, DELETED_A_REPLACEMENT, getCancelKeyboard());
}

module.exports = {
  handledeleteReplacement
}
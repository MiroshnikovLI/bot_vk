const { getCancelKeyboard } = require('../../keyboards/keyboards');
const { sendMessage } = require('../../config/vkApi');
const { userStates } = require('../../state/stateManager');
const { CHANGE_NAME } = require('../../constants/message');

async function handleChangeName(userId) {
  userStates.set(userId, "changeName");
  await sendMessage(userId, CHANGE_NAME, getCancelKeyboard());
}

module.exports = {
  handleChangeName
}
const { getCancelKeyboard } = require('../../keyboards/keyboards');
const { sendMessage } = require('../../config/vkApi');
const { userStates } = require('../../state/stateManager');
const { CHANGE_PHONE } = require('../../constants/message');

async function handleChangePhone(userId) {
  userStates.set(userId, "changePhone");
  await sendMessage(userId, CHANGE_PHONE, getCancelKeyboard());
}

module.exports = {
  handleChangePhone
}
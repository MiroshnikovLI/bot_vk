const { userStates } = require('../../state/stateManager');
const { sendMessage } = require('../../config/vkApi');
const { getCancelKeyboard } = require('../../keyboards/keyboards');
const { CHANGE_WB_ID } = require('../../constants/message');

async function handleChangeWBId(userId) {
  userStates.set(userId, "changeWbId" );
  await sendMessage(userId, CHANGE_WB_ID, getCancelKeyboard());
}

module.exports = {
  handleChangeWBId
}
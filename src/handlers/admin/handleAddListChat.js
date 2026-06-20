const { sendMessage } = require('../../config/vkApi');
const { NOTIFICATIONS } = require('../../constants');
const { getCancelKeyboard } = require('../../keyboards/keyboards');
const { userStates } = require('../../state/stateManager');

async function handleAddListChat(userId) {
  userStates.set(userId, 'waitingNameLink');
  await sendMessage(userId, NOTIFICATIONS.WAITING_NEW_VALUE('name'), getCancelKeyboard());
}

module.exports = {
  handleAddListChat
}
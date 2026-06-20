const { sendMessage } = require('../../config/vkApi');
const { getSettingsListChats } = require('../../keyboards/keyboards');
const { SETTINGS_LIST_CHATS } = require('../../constants/message');

async function handleSettingsListGhats(userId) {
  await sendMessage(userId, SETTINGS_LIST_CHATS, getSettingsListChats());
}

module.exports = {
  handleSettingsListGhats
}
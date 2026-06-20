const { sendMessage } = require('../../config/vkApi');
const { getSettingsListChats } = require('../../keyboards/keyboards');
const { SETTINGS_LIST_CHATS } = require('../../constants/message');

async function handleSettingsListСhats(userId) {
  await sendMessage(userId, SETTINGS_LIST_CHATS, getSettingsListChats());
}

module.exports = {
  handleSettingsListСhats
}
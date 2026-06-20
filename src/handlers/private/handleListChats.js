const { sendMessage } = require("../../config/vkApi");
const { getPrivateKeyboard } = require("../../keyboards/keyboards");
const { listChats } = require('../../services/listChatsService');
async function handleListChats(userId) {
  await sendMessage(userId, await listChats());
}

module.exports = {
  handleListChats
}
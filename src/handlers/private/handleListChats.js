const { sendMessage } = require("../../config/vkApi");
const { getPrivateKeyboard } = require("../../keyboards/keyboards");
const { LIST_CHATS } = require('../../constants/index')
async function handleListChats(userId) {
  await sendMessage(userId, await LIST_CHATS());
}

module.exports = {
  handleListChats
}
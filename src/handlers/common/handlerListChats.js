const { sendMessage } = require("../../config/vkApi");
const { listChats } = require('../../services/index');

async function handlerListChats(userId) {
  await sendMessage(userId, await listChats());
}

module.exports = {
  handlerListChats
}
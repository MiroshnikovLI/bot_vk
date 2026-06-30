const { sendMessage } = require('../../../config/vkApi');
const { adminKeyboards } = require('../../../keyboards/index');
const { LIST_CHATS_MENU } = require('../../../constants/index');

async function handlerListСhatsMenu(userId) {
  await sendMessage(userId, LIST_CHATS_MENU, adminKeyboards.settingsListChats());
}

module.exports = {
  handlerListСhatsMenu
}
const { sendMessage } = require('../../config/vkApi');
const { getManagerMenuKeyboard } = require('../../keyboards/keyboards');
const { MENU_MANAGER } = require('../../constants/message');

async function handleManagerMenu(userId) {
  await sendMessage(userId, MENU_MANAGER, getManagerMenuKeyboard());
}

module.exports = {
  handleManagerMenu
}
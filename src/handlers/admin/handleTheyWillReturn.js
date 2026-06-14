const { getPrivateKeyboard, getAdminKeyboard } = require('../../keyboards/keyboards');
const { sendMessage } = require('../../config/vkApi');
const { ADMIN_MENU, NO_ACCESS_RIGHTS } = require('../../constants/message')

async function handleTheyWillReturn(userId, isAdmin) {
  if (!isAdmin) {
    const keyboard = await getPrivateKeyboard(userId)
    sendMessage(userId, NO_ACCESS_RIGHTS, keyboard);
    return;
  }

  sendMessage(userId, ADMIN_MENU, getAdminKeyboard(),);
}

module.exports = {
  handleTheyWillReturn
}
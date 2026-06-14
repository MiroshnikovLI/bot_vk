const { getPrivateKeyboard, getAdminKeyboard } = require('../../keyboards/keyboards');
const { sendMessage } = require('../../config/vkApi');
const { ADMIN_MENU, NO_ACCESS_RIGHTS } = require('../../constants/message')

async function handleTheyWillReturn(userId, isAdmin) {
  if (!isAdmin) {
    await sendMessage(userId, NO_ACCESS_RIGHTS, await getPrivateKeyboard(userId));
    return;
  }

  await sendMessage(userId, ADMIN_MENU, getAdminKeyboard(),);
}

module.exports = {
  handleTheyWillReturn
}
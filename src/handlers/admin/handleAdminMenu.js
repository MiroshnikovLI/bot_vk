const { isUserAdmin } = require('../../services/userService');
const { sendMessage } = require('../../config/vkApi');
const { getAdminKeyboard } = require('../../keyboards/keyboards');
const { ADMIN_MENU } = require('../../constants/message');
const { NO_ACCESS_RIGHTS } = require('../../constants/message');

async function handleAdminMenu(userId) {
  const isAdmin = await isUserAdmin(userId);
  if (!isAdmin) {
    await sendMessage(userId, NO_ACCESS_RIGHTS);
    return;
  }
  await sendMessage(userId, ADMIN_MENU, getAdminKeyboard(),
  );
}

module.exports = {
  handleAdminMenu
}
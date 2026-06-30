const { sendMessage } = require('../../../config/vkApi');
const { adminKeyboards } = require('../../../keyboards/index');
const { NOTIFICATIONS, ADMIN_MENU } = require('../../../constants/index');

async function handlerAdminMenu(userId) {
  await sendMessage(userId, ADMIN_MENU, adminKeyboards.adminMenu());
}

module.exports = {
  handlerAdminMenu
}
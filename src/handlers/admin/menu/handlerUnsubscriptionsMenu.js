const { adminKeyboards, userKeyboards } = require('../../../keyboards/index');
const { sendMessage } = require('../../../config/vkApi');
const { UNSUBSCRIBE_MENU_ADMIN, NOTIFICATIONS } = require('../../../constants/index');

async function handlerUnsubscriptionsMenu(userId) {
  await sendMessage(userId, UNSUBSCRIBE_MENU_ADMIN, adminKeyboards.unsubscriptions());
}

module.exports = {
  handlerUnsubscriptionsMenu
}
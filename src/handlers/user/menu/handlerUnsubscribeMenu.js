const { sendMessage } = require('../../../config/vkApi');
const { userKeyboards } = require('../../../keyboards/index');
const { UNSUBSCRIBE_MENU } = require('../../../constants/index');

async function handlerUnsubscribeMenu(userId) {
  await sendMessage(userId, UNSUBSCRIBE_MENU, userKeyboards.unsubscribe());
}


module.exports = {
  handlerUnsubscribeMenu
}
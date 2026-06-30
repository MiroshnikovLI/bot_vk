const { userKeyboards } = require('../../../keyboards/index');
const { sendMessage } = require('../../../config/vkApi');
const { EDIT_MENU } = require('../../../constants/index');

async function handlerEditMenu(userId) {
  await sendMessage(userId, EDIT_MENU, userKeyboards.editProfile());
}

module.exports = {
  handlerEditMenu
}
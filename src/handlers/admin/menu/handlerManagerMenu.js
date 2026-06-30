const { sendMessage } = require('../../../config/vkApi');
const { adminKeyboards } = require('../../../keyboards/index');
const { MANAGER_MENU } = require('../../../constants/index');

async function handlerManagerMenu(userId) {
  await sendMessage(userId, MANAGER_MENU, adminKeyboards.managerMenu());
}

module.exports = {
  handlerManagerMenu
}
const { sendMessage } = require('../../../config/vkApi');
const { SETTINGS_MENU } = require('../../../constants/index');
const { userKeyboards } = require('../../../keyboards/index');

async function handlerSettingMenu(userId) {
  await sendMessage(userId, SETTINGS_MENU, userKeyboards.settings());
}

module.exports = {
  handlerSettingMenu
}
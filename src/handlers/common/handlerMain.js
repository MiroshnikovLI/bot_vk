const { sendMessage } = require('../../config/vkApi');
const { MAIN_MENU } = require('../../constants/index');
const { isUserAdmin } = require('../../services/index');
const { userKeyboards } = require('../../keyboards/index');

async function handlerMain(userId) {
  const isAdmin = await isUserAdmin(userId);
  await sendMessage(userId, MAIN_MENU(isAdmin), userKeyboards.main(isAdmin));
}

module.exports = {
  handlerMain
}
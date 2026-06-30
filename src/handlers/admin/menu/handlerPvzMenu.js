const { sendMessage } = require("../../../config/vkApi");
const { PVZ_MENU } = require("../../../constants/index");
const { adminKeyboards } = require("../../../keyboards/index");

async function handlerPvzMenu(userId) {
  await sendMessage(userId, PVZ_MENU, adminKeyboards.pvzMenu());
}

module.exports = {
  handlerPvzMenu
}
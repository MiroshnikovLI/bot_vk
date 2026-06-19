const { sendMessage } = require("../../config/vkApi");
const { PVZ_MENU } = require("../../constants/message");
const { getPvzMenu } = require("../../keyboards/keyboards");

async function handlePvzMenu(userId) {
  await sendMessage(userId, PVZ_MENU, getPvzMenu());
}

module.exports = {
  handlePvzMenu
}
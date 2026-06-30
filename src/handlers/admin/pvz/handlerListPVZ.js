const { getAllPvzs } = require("../../../services/index");
const { sendMessage } = require("../../../config/vkApi");
const { adminKeyboards } = require("../../../keyboards/index");
const { NOTIFICATIONS } = require('../../../constants/index');

async function handlerListPvz(userId, isAdmin) {
  const pvzs = await getAllPvzs();
  if (pvzs.length === 0) {
    await sendMessage(userId, NOTIFICATIONS.NO_PVZ_LIST);
    return;
  }

  await sendMessage(userId, NOTIFICATIONS.LIST_PVZ(pvzs.data), adminKeyboards.pvzMenu());
}

module.exports = {
  handlerListPvz,
};

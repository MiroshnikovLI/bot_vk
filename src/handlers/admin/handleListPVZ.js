const { getAllPvzs } = require("../../services/pvzService");
const { sendMessage } = require("../../config/vkApi");
const { getPrivateKeyboard, getPvzMenu } = require("../../keyboards/keyboards");
const { NO_ACCESS_RIGHTS, NOTIFICATIONS } = require('../../constants/message');

async function handleListPvz(userId, isAdmin) {
  if (!isAdmin) {
    await sendMessage(userId, NO_ACCESS_RIGHTS, await getPrivateKeyboard(userId));
    return;
  }
  const pvzs = await getAllPvzs();
  if (pvzs.length === 0) {
    await sendMessage(userId, NOTIFICATIONS.NO_PVZ_LIST);
    return;
  }

  await sendMessage(userId, NOTIFICATIONS.LIST_PVZ(pvzs.data), getPvzMenu());
}

module.exports = {
  handleListPvz,
};

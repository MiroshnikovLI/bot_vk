const { getAllPvzs } = require("../../../services/pvzService");
const { cleanText } = require("../../../utils/helpers");
const { getCancelKeyboard, getAdminKeyboard } = require("../../../keyboards/keyboards");
const { userStates } = require("../../../state/stateManager");
const { sendMessage } = require("../../../config/vkApi");
const { NOTIFICATIONS, OPERATION_CANCELLED, COMMANDS } = require("../../../constants/index");

async function adminWaitingPvzId(userId, text) {
  const pvzs = await getAllPvzs();
  const pvz = pvzs.data?.find((p) => p.pvz_id === cleanText(text));
  const clearText = cleanText(text);

  if (clearText === COMMANDS.CANCELLATION) {
    userStates.delete(userId);
    sendMessage(userId, OPERATION_CANCELLED, getAdminKeyboard());
    return;
  }

  if (pvz) {
    await sendMessage(userId, "⏳", { buttons: [], one_time: false });
    await sendMessage(
      userId,
      NOTIFICATIONS.PVZ_ALREADY_ADDED(pvz),
      getCancelKeyboard(),
    );
    return;
  }

  if (!/^\d+$/.test(clearText)) {
    await sendMessage(userId, "⏳", { buttons: [], one_time: false });
    await sendMessage(
      userId,
      NOTIFICATIONS.WARNING_ID_ONLY_NUMBERS,
      getCancelKeyboard(),
    );
    return;
  }

  userStates.set(userId, "adminWaitingPvzAdress", {pvz_id: clearText});
  await sendMessage(userId, NOTIFICATIONS.WAITING_ADDRESS_PVZ, getCancelKeyboard());
}

module.exports = {
  adminWaitingPvzId,
};

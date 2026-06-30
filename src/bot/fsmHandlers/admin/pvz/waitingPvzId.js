const { getAllPvzs } = require("../../../../services/index");
const { cleanText } = require("../../../../utils/index");
const { getCancelKeyboard, adminKeyboards } = require("../../../../keyboards/index");
const { userStates } = require("../../../../state/stateManager");
const { sendMessage } = require("../../../../config/vkApi");
const { NOTIFICATIONS, COMMANDS, STATES } = require("../../../../constants/index");

async function waitingPvzId(userId, text) {
  const pvzs = await getAllPvzs();
  const pvz = pvzs.data?.find((p) => p.pvz_id === cleanText(text));
  const clearText = cleanText(text);

  if (clearText === COMMANDS.COMMON.CANCELLATION.TEXT) {
    userStates.delete(userId);
    await sendMessage(userId, NOTIFICATIONS.OPERATION_CANCELLED, adminKeyboards.pvzMenu());
    return;
  }

  if (pvz) {
    if (!pvz.is_active) {
      await sendMessage(
        userId,
        NOTIFICATIONS.PVZ_DEACTIVE(pvz),
        adminKeyboards.pvzMenu(),
      );
      return;
    }
    await sendMessage(
      userId,
      NOTIFICATIONS.PVZ_ALREADY_ADDED(pvz),
      adminKeyboards.pvzMenu(),
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

  userStates.set(userId, STATES.WAITING_PVZ_ADRESS, { pvz_id: clearText });
  await sendMessage(
    userId,
    NOTIFICATIONS.WAITING_ADDRESS_PVZ,
    getCancelKeyboard(),
  );
}

module.exports = {
  waitingPvzId,
};

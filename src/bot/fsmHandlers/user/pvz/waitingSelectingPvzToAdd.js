const { cleanText } = require("../../../../utils/index");
const { getPvzByCode, linkUserToPvz, getUserVkId } = require("../../../../services/index");
const { getCancelKeyboard, userKeyboards } = require("../../../../keyboards/index");
const { sendMessage } = require("../../../../config/vkApi");
const { userStates } = require("../../../../state/stateManager");
const { NOTIFICATIONS, COMMANDS, UNSUBSCRIBE_MENU } = require("../../../../constants/index");

async function waitingSelectingPvzToAdd(userId, text) {
  const clearText = cleanText(text);
  if (clearText === COMMANDS.COMMON.CANCELLATION.TEXT) {
    userStates.delete(userId);
    await sendMessage(userId, NOTIFICATIONS.OPERATION_CANCELLED, userKeyboards.unsubscribe());
    return;
  }

  if (!/^\d+$/.test(text)) {
    await sendMessage(
      userId,
      NOTIFICATIONS.WARNING_ID_ONLY_NUMBERS,
      getCancelKeyboard(),
    );
    return true;
  }

  const pvzCode = text.trim();
  const users = await getUserVkId(userId);
  const existingPVZ = await getPvzByCode(pvzCode);

  if (!existingPVZ) {
    await sendMessage(userId, "⏳", { buttons: [], one_time: false });
    await sendMessage(
      userId,
      NOTIFICATIONS.PVZ_NOT_FOUND(pvzCode),
      getCancelKeyboard(),
    );
    return;
  }

  const resultAddPVZ = await linkUserToPvz(users.id, existingPVZ.id);

  if (resultAddPVZ.success) {
    await sendMessage(userId, NOTIFICATIONS.PVZ_ADDED(existingPVZ));
  } else if (resultAddPVZ.message === "ПВЗ уже привязан") {
    await sendMessage(userId, NOTIFICATIONS.PVZ_ALREADY_ADDED(existingPVZ));
  } else {
    await sendMessage(userId, NOTIFICATIONS.ERROR);
  }

  userStates.delete(userId);
  await sendMessage(userId, UNSUBSCRIBE_MENU, userKeyboards.unsubscribe());
}

module.exports = {
  waitingSelectingPvzToAdd,
};

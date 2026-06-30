const { cleanText } = require('../../../../utils/index');
const { getPvzByCode, removeUserFromPvz, getUserVkId, hasUserReportedToday } = require('../../../../services/index');
const { userKeyboards, getCancelKeyboard } = require('../../../../keyboards/index');
const { sendMessage } = require('../../../../config/vkApi');
const { userStates } = require('../../../../state/stateManager');
const { NOTIFICATIONS, UNSUBSCRIBE_MENU, COMMANDS } = require('../../../../constants/index');

async function waitingSelectingPvzForRemoval(userId, text) {
  const clearText = cleanText(text);
  if (clearText === COMMANDS.COMMON.CANCELLATION.TEXT) {
    userStates.delete(userId);
    await sendMessage(
      userId,
      NOTIFICATIONS.OPERATION_CANCELLED,
      userKeyboards.unsubscribe(),
    );
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

  const pvzCodes = text.trim();
  const existingPVZs = await getPvzByCode(pvzCodes);
  const userX = await getUserVkId(userId);

  if (!existingPVZs) {
    await sendMessage(userId, "⏳", { buttons: [], one_time: false });
    await sendMessage(
      userId,
      NOTIFICATIONS.PVZ_NOT_FOUND(pvzCodes),
      getCancelKeyboard(),
    );
    return true;
  }

  const openReport = await hasUserReportedToday(userX.id);

  if (openReport.data?.pvz_id === existingPVZs.id) {
    userStates.delete(userId);
    await sendMessage(userId, NOTIFICATIONS.OPEN_SHIFT_FOR_DELETE, userKeyboards.unsubscribe());
    return;
  }

  const deletePVZ = await removeUserFromPvz(userX.id, existingPVZs.id);

  if (deletePVZ.error === "Связь между пользователем и ПВЗ не найдена") {
    await sendMessage(
      userId,
      NOTIFICATIONS.PVZ_NOT_FOUND_PINNED(deletePVZ),
    );
    return;
  } else if (deletePVZ.success) {
    await sendMessage(
      userId,
      NOTIFICATIONS.PVZ_SUCCESSFULLY_DELETED(existingPVZs),
    );
  }

  userStates.delete(userId);
  await sendMessage(
    userId,
    UNSUBSCRIBE_MENU,
    userKeyboards.unsubscribe(),
  );
}

module.exports = {
  waitingSelectingPvzForRemoval,
};

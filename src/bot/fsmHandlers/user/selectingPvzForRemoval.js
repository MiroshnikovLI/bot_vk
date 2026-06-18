const { cleanText, } = require('../../../utils/helpers');
const { logAction } = require('../../../utils/logger');
const { getPvzByCode, removeUserFromPvz, } = require('../../../services/pvzService');
const { getUserVkId } = require('../../../services/userService');
const { getUnsubscribeKeyboard, getCancelKeyboard } = require('../../../keyboards/keyboards');
const { sendMessage } = require('../../../config/vkApi');
const { userStates } = require('../../../state/stateManager');
const { OPERATION_CANCELLED, NOTIFICATIONS, UNSUBSCRIBE_SETTINGS, COMMANDS } = require('../../../constants/index');

async function selectingPvzForRemoval(userId, text) {
  const clearText = cleanText(text);
  if (clearText === COMMANDS.CANCELLATION) {
    userStates.delete(userId);
    await sendMessage(
      userId,
      OPERATION_CANCELLED,
      getUnsubscribeKeyboard(),
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
    UNSUBSCRIBE_SETTINGS,
    getUnsubscribeKeyboard(),
  );
}

module.exports = {
  selectingPvzForRemoval,
};

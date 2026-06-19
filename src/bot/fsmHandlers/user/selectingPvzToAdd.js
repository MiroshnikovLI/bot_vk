const { cleanText } = require("../../../utils/helpers");
const { getUserVkId } = require("../../../services/userService");
const { getPvzByCode, linkUserToPvz } = require("../../../services/pvzService");
const {
  getUnsubscribeKeyboard,
  getCancelKeyboard,
} = require("../../../keyboards/keyboards");
const { sendMessage } = require("../../../config/vkApi");
const { userStates } = require("../../../state/stateManager");
const {
  OPERATION_CANCELLED,
  NOTIFICATIONS,
  COMMANDS,
  UNSUBSCRIBE_SETTINGS
} = require("../../../constants/index");

async function selectingPvzToAdd(userId, text) {
  const clearText = cleanText(text);
  if (clearText === COMMANDS.CANCELLATION) {
    userStates.delete(userId);
    await sendMessage(userId, OPERATION_CANCELLED, getUnsubscribeKeyboard());
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
  await sendMessage(userId, UNSUBSCRIBE_SETTINGS, getUnsubscribeKeyboard());
}

module.exports = {
  selectingPvzToAdd,
};

const { cleanText } = require("../../../utils/helpers");
const { getUserWbId, getUserVkId } = require("../../../services/userService");
const { deleteReplacement } = require("../../../services/pvzService");
const { sendMessage } = require("../../../config/vkApi");
const {
  getUnsubscribeKeyboard,
  getCancelKeyboard,
} = require("../../../keyboards/keyboards");
const { userStates } = require("../../../state/stateManager");
const { OPERATION_CANCELLED, NOTIFICATIONS, COMMANDS } = require('../../../constants/index');

async function deletedReplacement(userId, text) {
  const cleanTextDeletedReplacement = cleanText(text);
  if (cleanTextDeletedReplacement === COMMANDS.CANCELLATION) {
    userStates.delete(userId);
    await sendMessage(
      userId,
      OPERATION_CANCELLED,
      getUnsubscribeKeyboard(),
    );
    return;
  }
  if (!/^\d+$/.test(text)) {
    await sendMessage(userId, "⏳", { buttons: [], one_time: false });
    await sendMessage(
      userId,
      NOTIFICATIONS.WARNING_ID_ONLY_NUMBERS,
      getCancelKeyboard(),
    );
    return;
  }

  const wbIdDeleted = text.trim();
  try {
    const deletedReplacement = await getUserWbId(wbIdDeleted);
    const deletedUserMain = await getUserVkId(userId);

    if (!deletedReplacement) {
      await sendMessage(userId, "⏳", { buttons: [], one_time: false });
      await sendMessage(
        userId,
        NOTIFICATIONS.USER_NOT_FOUND(wbIdDeleted),
        getUnsubscribeKeyboard(),
      );
      return;
    }

    if (deletedReplacement && deletedUserMain) {
      const resultDeletedReplecement = await deleteReplacement(
        deletedUserMain.id,
        deletedReplacement.id,
      );
      if (resultDeletedReplecement.message === "Сменщик не найден") {
        await sendMessage(
          userId,
          NOTIFICATIONS.REPLACEMENT_NOT_FOUND(wbIdDeleted),
          getUnsubscribeKeyboard(),
        );
      } else if (resultDeletedReplecement.message === "Сменщик удален") {
        await sendMessage(
          userId,
          NOTIFICATIONS.REPLACEMENT_FOUND_DELETED(deletedReplacement.full_name),
          getUnsubscribeKeyboard(),
        );
      } else {
        await sendMessage(
          userId,
          NOTIFICATIONS.ERROR,
          getUnsubscribeKeyboard(),
        );
      }
    }
  } catch (error) {
    await sendMessage(userId, NOTIFICATIONS.TECHNICAL_ERROR);
  } finally {
    userStates.delete(userId);
  }
}

module.exports = {
  deletedReplacement,
};

const { cleanText, isValidWbId } = require("../../../../utils/index");
const { getUserWbId, getUserVkId, deleteReplacement } = require("../../../../services/index");
const { sendMessage } = require("../../../../config/vkApi");
const { getCancelKeyboard, userKeyboards } = require("../../../../keyboards/index");
const { userStates } = require("../../../../state/stateManager");
const { NOTIFICATIONS, COMMANDS } = require('../../../../constants/index');

async function waitingDeleteReplacement(userId, text) {
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

  const validWb = isValidWbId(clearText);

  if (!validWb.success) {
    await sendMessage(
      userId,
      validWb.message,
      getCancelKeyboard(),
    );
    return;
  }

  const wbIdDeleted = text.trim();
  try {
    const deletedReplacement = await getUserWbId(wbIdDeleted);

    if (Number(deletedReplacement.vk_id) === Number(userId)) {
      userStates.delete(userId);
      await sendMessage(userId, NOTIFICATIONS.DELETE_YOURSSELF, userKeyboards.unsubscribe());
      return;
    }

    const deletedUserMain = await getUserVkId(userId);

    if (!deletedReplacement) {
      await sendMessage(userId, "⏳", { buttons: [], one_time: false });
      await sendMessage(
        userId,
        NOTIFICATIONS.USER_NOT_FOUND(wbIdDeleted),
        getCancelKeyboard(),
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
          userKeyboards.unsubscribe(),
        );
      } else if (resultDeletedReplecement.message === "Сменщик удален") {
        await sendMessage(
          userId,
          NOTIFICATIONS.REPLACEMENT_FOUND_DELETED(deletedReplacement.full_name),
          userKeyboards.unsubscribe(),
        );
      } else {
        await sendMessage(
          userId,
          NOTIFICATIONS.ERROR,
          userKeyboards.unsubscribe(),
        );
      }
    }
    userStates.delete(userId);
  } catch (error) {
    userStates.delete(userId);
    await sendMessage(userId, NOTIFICATIONS.TECHNICAL_ERROR);
  }
}

module.exports = {
  waitingDeleteReplacement,
};

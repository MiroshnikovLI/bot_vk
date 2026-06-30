const { cleanText, isValidWbId } = require("../../../../utils/index");
const {
  getUserWbId,
  getUserVkId,
  addReplacementDb,
} = require("../../../../services/index");
const {
  getCancelKeyboard,
  userKeyboards,
} = require("../../../../keyboards/index");
const { sendMessage } = require("../../../../config/vkApi");
const { userStates } = require("../../../../state/stateManager");
const { NOTIFICATIONS, COMMANDS } = require("../../../../constants/index");

async function waitingAddReplacement(userId, text) {
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
    await sendMessage(userId, "⏳", { buttons: [], one_time: false });
    await sendMessage(
      userId,
      validWb.message,
      getCancelKeyboard(),
    );
    return;
  }

  const wbIdAdd = clearText.trim();

  try {
    const addReplacementUser = await getUserWbId(wbIdAdd);
    const addUserMain = await getUserVkId(userId);

    if (!addReplacementUser) {
      await sendMessage(userId, "⏳", { buttons: [], one_time: false });
      await sendMessage(
        userId,
        NOTIFICATIONS.USER_NOT_FOUND(wbIdAdd),
        getCancelKeyboard(),
      );
      return;
    }

    if (addReplacementUser && addUserMain) {
      const resultAddReplecement = await addReplacementDb(
        addUserMain.id,
        addReplacementUser.id,
      );
      console.log(resultAddReplecement);
      if (resultAddReplecement.message === "Сменщик уже привязан") {
        await sendMessage(
          userId,
          NOTIFICATIONS.REPLACEMENT_ALREADY_ADDED(addReplacementUser),
          userKeyboards.unsubscribe(),
        );
      } else if (resultAddReplecement.message === "Сменщик привязан") {
        await sendMessage(
          userId,
          NOTIFICATIONS.REPLACEMENT_FOUND_ADDED(addReplacementUser),
          userKeyboards.unsubscribe(),
        );
      } else {
        await sendMessage(
          userId,
          NOTIFICATIONS.ERROR_ADDED_REPLACEMENT(resultAddReplecement.message),
          userKeyboards.unsubscribe(),
        );
      }
    } else {
      await sendMessage(
        userId,
        NOTIFICATIONS.ERROR,
        userKeyboards.unsubscribe(),
      );
    }
    userStates.delete(userId);
  } catch (error) {
    userStates.delete(userId);
    await sendMessage(
      userId,
      NOTIFICATIONS.TECHNICAL_ERROR,
      userKeyboards.unsubscribe(),
    );
  }
}

module.exports = {
  waitingAddReplacement,
};

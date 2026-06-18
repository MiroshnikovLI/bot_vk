const { cleanText } = require("../../../utils/helpers");
const { getUserWbId, getUserVkId } = require("../../../services/userService");
const { addReplacementDb } = require("../../../services/pvzService");
const {
  getUnsubscribeKeyboard,
  getCancelKeyboard,
} = require("../../../keyboards/keyboards");
const { sendMessage } = require("../../../config/vkApi");
const { userStates } = require("../../../state/stateManager");
const { OPERATION_CANCELLED, NOTIFICATIONS, COMMANDS } = require('../../../constants/index');

async function addReplacement(userId, text) {
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
  if (!/^\d+$/.test(clearText)) {
    await sendMessage(userId, "⏳", { buttons: [], one_time: false });
    await sendMessage(
      userId,
      NOTIFICATIONS.WARNING_ID_ONLY_NUMBERS,
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
        getUnsubscribeKeyboard(),
      );
      return;
    }

    if (addReplacementUser && addUserMain) {
      const resultAddReplecement = await addReplacementDb(
        addUserMain.id,
        addReplacementUser.id,
      );
      if (resultAddReplecement.message === "Сменщик уже привязан") {
        await sendMessage(
          userId,
          NOTIFICATIONS.REPLACEMENT_ALREADY_ADDED(addReplacementUser),
          getUnsubscribeKeyboard(),
        );
      } else if (resultAddReplecement.message === "Сменщик привязан") {
        await sendMessage(
          userId,
          NOTIFICATIONS.REPLACEMENT_FOUND_ADDED(addReplacementUser),
          getUnsubscribeKeyboard(),
        );
      } else {
        await sendMessage(
          userId,
          NOTIFICATIONS.ERROR_ADDED_REPLACEMENT(resultAddReplecement.message),
          getUnsubscribeKeyboard(),
        );
      }
    } else {
      await sendMessage(
        userId,
        NOTIFICATIONS.ERROR,
        getUnsubscribeKeyboard(),
      );
    }
    userStates.delete(userId);
  } catch (error) {
    await sendMessage(
      userId,
      NOTIFICATIONS.TECHNICAL_ERROR,
      getUnsubscribeKeyboard(),
    );
  }
}

module.exports = {
  addReplacement,
};

const { userKeyboards, getCancelKeyboard } = require("../../../../keyboards/index");
const { cleanText, isValidWbId } = require("../../../../utils/index");
const { updateUserWbId } = require("../../../../services/index");
const { userStates } = require("../../../../state/stateManager");
const { sendMessage } = require("../../../../config/vkApi");
const { NOTIFICATIONS, COMMANDS } = require("../../../../constants/index");

async function waitingChangeWbId(userId, text) {
  const clearText = cleanText(text);
  if (clearText === COMMANDS.COMMON.CANCELLATION.TEXT) {
    userStates.delete(userId);
    await sendMessage(
      userId,
      NOTIFICATIONS.OPERATION_CANCELLED,
      userKeyboards.editProfile(),
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

  const response = await updateUserWbId(userId, parseInt(text));

  if (response.success) {
    userStates.delete(userId);
    await sendMessage(
      userId,
      NOTIFICATIONS.CHANGE_WB_ID_SUCCESSFULLY(text),
      userKeyboards.editProfile(),
    );
  } else {
    await sendMessage(userId, "⏳", { buttons: [], one_time: false });
    await sendMessage(
      userId,
      NOTIFICATIONS.TECHNICAL_ERROR,
      getCancelKeyboard(),
    );
    return;
  }
}

module.exports = {
  waitingChangeWbId,
};

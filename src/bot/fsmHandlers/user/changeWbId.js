const { getEditProfileKeyboard, getCancelKeyboard } = require('../../../keyboards/keyboards');
const { cleanText } = require('../../../utils/helpers');
const { updateUserWbId } = require('../../../services/userService');
const { userStates } = require('../../../state/stateManager');
const { sendMessage } = require('../../../config/vkApi');
const { OPERATION_CANCELLED, NOTIFICATIONS, COMMANDS } = require('../../../constants/index');

async function changeWbId(userId, text) {
  const clearText = cleanText(text);
  if (clearText === COMMANDS.CANCELLATION) {
    userStates.delete(userId);
    await sendMessage(userId, OPERATION_CANCELLED, getEditProfileKeyboard());
    return;
  } else {
    if (!/^\d+$/.test(text)) {
      await sendMessage(userId, "⏳", { buttons: [], one_time: false });
      await sendMessage(
        userId,
        NOTIFICATIONS.WARNING_ID_ONLY_NUMBERS,
        getCancelKeyboard(),
      );
      return;
    }

    const response = await updateUserWbId(userId, parseInt(text));

    if (response.success) {
      userStates.delete(userId);
      await sendMessage(
        userId,
       NOTIFICATIONS.CHANGE_WB_ID(text),
        getEditProfileKeyboard(),
      );
    } else {
      await sendMessage(userId, "⏳", { buttons: [], one_time: false });
      await sendMessage(
        userId,
        NOTIFICATIONS.CHECK_CORRECTNESS(response.message),
        getCancelKeyboard(),
      );
      return;
    }
  }
}

module.exports = {
  changeWbId,
};

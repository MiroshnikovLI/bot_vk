const { userStates } = require('../../../../state/stateManager');
const { cleanText } = require('../../../../utils/index');
const { sendMessage } = require('../../../../config/vkApi');
const { NOTIFICATIONS } = require('../../../../constants/index');
const { COMMANDS } = require('../../../../constants/index');
const { getCancelKeyboard, adminKeyboards } = require('../../../../keyboards/index');
const { deleteWorkChat } = require('../../../../services/index');

async function waitingIdDeleteChatLink(userId, text) {
  const clearText = cleanText(text);

  if (clearText === COMMANDS.COMMON.CANCELLATION.TEXT) {
    userStates.delete(userId);
    await sendMessage(userId, NOTIFICATIONS.OPERATION_CANCELLED, adminKeyboards.settingsListChats());
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

  const result = await deleteWorkChat(text);

  if (result.success) {
    await sendMessage(userId, result.message, adminKeyboards.settingsListChats());
  } else {
    await sendMessage(userId, NOTIFICATIONS.ERROR, adminKeyboards.settingsListChats());
  }
  userStates.delete(userId);
}

module.exports = {
  waitingIdDeleteChatLink
}
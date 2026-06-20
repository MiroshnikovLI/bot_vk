const { userStates } = require('../../../state/stateManager');
const { cleanText } = require('../../../utils/helpers');
const { sendMessage } = require('../../../config/vkApi');
const { NOTIFICATIONS, OPERATION_CANCELLED } = require('../../../constants/message');
const { COMMANDS } = require('../../../constants/commands');
const { getCancelKeyboard, getSettingsListChats } = require('../../../keyboards/keyboards');
const { deleteWorkChat } = require('../../../services/listChatsService');

async function waitingIdDeleteChatLink(userId, text) {
  const clearText = cleanText(text);

  if (clearText === COMMANDS.CANCELLATION) {
    userStates.delete(userId);
    await sendMessage(userId, OPERATION_CANCELLED, getSettingsListChats());
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
    await sendMessage(userId, result.message, getSettingsListChats());
  } else {
    await sendMessage(userId, NOTIFICATIONS.ERROR, getSettingsListChats());
  }
  userStates.delete(userId);
}

module.exports = {
  waitingIdDeleteChatLink
}
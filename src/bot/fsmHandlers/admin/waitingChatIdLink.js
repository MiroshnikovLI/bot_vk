const { sendMessage } = require("../../../config/vkApi");
const {
  NOTIFICATIONS,
  COMMANDS,
  OPERATION_CANCELLED,
} = require("../../../constants");
const {
  getCancelKeyboard,
  getSettingsListChats,
} = require("../../../keyboards/keyboards");
const { userStates } = require("../../../state/stateManager");
const { cleanText } = require("../../../utils/helpers");

async function waitingChatIdLink(userId, text) {
  const clearText = cleanText(text);
  const state = userStates.get(userId);

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

  const chatId = Number(clearText);
  if (chatId >= 2000000000 && !isNaN(chatId)) {
    userStates.set(userId, "waitingDescriptionLink", {
      chat: {
        chat_name: state.chat.chat_name,
        chat_link: state.chat.chat_link,
        chat_id: chatId,
      },
    });
    await sendMessage(
      userId,
      NOTIFICATIONS.WAITING_NEW_VALUE("description"),
      getCancelKeyboard(),
    );
    return;
  } else {
    await sendMessage(
      userId,
      NOTIFICATIONS.FORMAT_CHAT_ID,
      getCancelKeyboard(),
    );
  }
}

module.exports = {
  waitingChatIdLink,
};

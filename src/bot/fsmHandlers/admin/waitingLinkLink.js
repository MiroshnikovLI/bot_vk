const { sendMessage } = require("../../../config/vkApi");
const { cleanText, isValidVkMeLink } = require("../../../utils/helpers");
const { userStates } = require("../../../state/stateManager");
const {
  COMMANDS,
  OPERATION_CANCELLED,
  NOTIFICATIONS,
} = require("../../../constants/index");
const { getCancelKeyboard, getSettingsListChats } = require("../../../keyboards/keyboards");
const { updateWorkChat } = require('../../../services/listChatsService');

async function waitingLinkLink(userId, text) {
  const clearText = cleanText(text);
  const state = userStates.get(userId);
  if (clearText === COMMANDS.CANCELLATION) {
    userStates.delete(userId);
    await sendMessage(userId, OPERATION_CANCELLED, getSettingsListChats());
    return;
  }

  if (isValidVkMeLink(text)) {
  if (state.key === 'link') {
    const chat = {
      id: state.chat.id,
      chat_link: text,
      chat_name: state.chat.chat_name,
      description: state.chat.description
    }

    const result = await updateWorkChat(chat.id, chat.chat_name, text, chat.description);
    if (result.success) {
      userStates.delete(userId);
      await sendMessage(userId, NOTIFICATIONS.LINK_SUCCESSFULLY(chat), getSettingsListChats());
      return;
    } else {
      userStates.delete(userId);
      await sendMessage(userId, NOTIFICATIONS.ERROR, getSettingsListChats());
    }
  }

    userStates.set(userId, "waitingChatIdLink", {
      chat: {
        chat_name: state.chat.chat_name,
        chat_link: text,
      }
    });
    await sendMessage(
      userId,
      NOTIFICATIONS.WAITING_NEW_VALUE("id"),
      getCancelKeyboard(),
    );
    return;
  } else {
    await sendMessage(
      userId,
      NOTIFICATIONS.ERROR_LINK_CHAT,
      getCancelKeyboard(),
    );
  }
}

module.exports = {
  waitingLinkLink,
};

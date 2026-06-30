const { sendMessage } = require("../../../../config/vkApi");
const { cleanText, isValidVkMeLink } = require("../../../../utils/index");
const { userStates } = require("../../../../state/stateManager");
const {
  COMMANDS,
  NOTIFICATIONS,
  STATES,
} = require("../../../../constants/index");
const {
  getCancelKeyboard,
  adminKeyboards,
} = require("../../../../keyboards/index");
const { updateWorkChat } = require("../../../../services/index");

async function waitingLinkLink(userId, text) {
  const clearText = cleanText(text);
  const state = userStates.get(userId);
  if (clearText === COMMANDS.COMMON.CANCELLATION.TEXT) {
    userStates.delete(userId);
    await sendMessage(
      userId,
      NOTIFICATIONS.OPERATION_CANCELLED,
      adminKeyboards.settingsListChats(),
    );
    return;
  }

  if (isValidVkMeLink(text)) {
    if (state.key === "link") {
      const chat = {
        id: state.chat.id,
        chat_link: text,
        chat_name: state.chat.chat_name,
        description: state.chat.description,
      };

      const result = await updateWorkChat(
        chat.id,
        chat.chat_name,
        text,
        chat.description,
      );
      if (result.success) {
        userStates.delete(userId);
        await sendMessage(
          userId,
          NOTIFICATIONS.LINK_SUCCESSFULLY_EDIT(chat),
          adminKeyboards.settingsListChats(),
        );
        return;
      } else {
        userStates.delete(userId);
        await sendMessage(
          userId,
          NOTIFICATIONS.ERROR,
          adminKeyboards.settingsListChats(),
        );
      }
    }

    userStates.set(userId, STATES.WAITING_CHAT_ID_LINK, {
      chat: {
        chat_name: state.chat.chat_name,
        chat_link: text,
      },
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

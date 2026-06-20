const { sendMessage } = require('../../../config/vkApi');
const { cleanText } = require('../../../utils/helpers');
const { userStates } = require('../../../state/stateManager');
const { COMMANDS, NOTIFICATIONS, OPERATION_CANCELLED } = require('../../../constants/index');
const { getCancelKeyboard, getSettingsListChats } = require('../../../keyboards/keyboards');
const { updateWorkChat } = require('../../../services/listChatsService');

async function waitingNameLink(userId, text) {
  const clearText = cleanText(text);
  const state = userStates.get(userId);

  if (clearText === COMMANDS.CANCELLATION) {
    userStates.delete(userId);
    await sendMessage(userId, OPERATION_CANCELLED, getSettingsListChats());
    return;
  }

  if (state.key === 'name') {
    const chat = {
      id: state.chat.id,
      chat_link: state.chat.chat_link,
      chat_name: text,
      description: state.chat.description
    }

    const result = await updateWorkChat(chat.id, text, chat.chat_link, chat.description);
    if (result.success) {
      userStates.delete(userId);
      await sendMessage(userId, NOTIFICATIONS.LINK_SUCCESSFULLY(chat), getSettingsListChats());
      return;
    } else {
      userStates.delete(userId);
      await sendMessage(userId, NOTIFICATIONS.ERROR, getSettingsListChats());
    }
  }

  userStates.set(userId, 'waitingLinkLink', {chat: { chat_name: text }});
  await sendMessage(userId, NOTIFICATIONS.WAITING_NEW_VALUE('link'), getCancelKeyboard());
}

module.exports = {
  waitingNameLink
}
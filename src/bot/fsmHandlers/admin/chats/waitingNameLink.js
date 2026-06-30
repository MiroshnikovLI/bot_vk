const { sendMessage } = require('../../../../config/vkApi');
const { cleanText } = require('../../../../utils/index');
const { userStates } = require('../../../../state/stateManager');
const { COMMANDS, NOTIFICATIONS, STATES } = require('../../../../constants/index');
const { getCancelKeyboard, adminKeyboards } = require('../../../../keyboards/index');
const { updateWorkChat } = require('../../../../services/index');

async function waitingNameLink(userId, text) {
  const clearText = cleanText(text);
  const state = userStates.get(userId);

  if (clearText === COMMANDS.COMMON.CANCELLATION.TEXT) {
    userStates.delete(userId);
    await sendMessage(userId, NOTIFICATIONS.OPERATION_CANCELLED, adminKeyboards.settingsListChats());
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
      await sendMessage(userId, NOTIFICATIONS.LINK_SUCCESSFULLY_EDIT(chat), adminKeyboards.settingsListChats());
      return;
    } else {
      userStates.delete(userId);
      await sendMessage(userId, NOTIFICATIONS.ERROR, adminKeyboards.settingsListChats());
    }
  }

  userStates.set(userId, STATES.WAITING_LINK_LINK, {chat: { chat_name: text }});
  await sendMessage(userId, NOTIFICATIONS.WAITING_NEW_VALUE('link'), getCancelKeyboard());
}

module.exports = {
  waitingNameLink
}
const { sendMessage } = require('../../../../config/vkApi');
const { cleanText, isValidVkMeLink } = require('../../../../utils/index');
const { userStates } = require('../../../../state/stateManager');
const { COMMANDS, NOTIFICATIONS } = require('../../../../constants/index');
const { getCancelKeyboard, adminKeyboards } = require('../../../../keyboards/index');
const { addWorkChat, updateWorkChat } = require('../../../../services/index');

async function waitingDescriptionLink(userId, text) {
  const clearText = cleanText(text);
  const state = userStates.get(userId);
  if (clearText === COMMANDS.COMMON.CANCELLATION.TEXT) {
    userStates.delete(userId);
    await sendMessage(userId, NOTIFICATIONS.OPERATION_CANCELLED, adminKeyboards.settingsListChats());
    return;
  }

  let result;

  if (state.key === 'description') {
    const rest = await updateWorkChat(state.chat.id, state.chat.chat_name, state.chat.chat_link, text);
    result = rest;
  } else {
    const rest = await addWorkChat(state.chat.chat_name, state.chat.chat_link, text, state.chat.chat_id);
    result = rest;
  }

  if (result.success) {
    await sendMessage(userId, NOTIFICATIONS.LINK_SUCCESSFULLY_EDIT(result.data), adminKeyboards.settingsListChats());
  } else {
    await sendMessage(userId, NOTIFICATIONS.ERROR, adminKeyboards.settingsListChats());
  }
  userStates.delete(userId);
}

module.exports = {
  waitingDescriptionLink
}
const { sendMessage } = require('../../../config/vkApi');
const { cleanText, isValidVkMeLink } = require('../../../utils/helpers');
const { userStates } = require('../../../state/stateManager');
const { COMMANDS, OPERATION_CANCELLED, NOTIFICATIONS } = require('../../../constants/index');
const { getCancelKeyboard, getSettingsListChats } = require('../../../keyboards/keyboards');
const { addWorkChat, updateWorkChat } = require('../../../services/index');

async function waitingDescriptionLink(userId, text) {
  const clearText = cleanText(text);
  const state = userStates.get(userId);
  if (clearText === COMMANDS.CANCELLATION) {
    userStates.delete(userId);
    await sendMessage(userId, OPERATION_CANCELLED, getSettingsListChats());
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
    await sendMessage(userId, NOTIFICATIONS.LINK_SUCCESSFULLY(result.data), getSettingsListChats());
  } else {
    await sendMessage(userId, NOTIFICATIONS.ERROR, getSettingsListChats());
  }
  userStates.delete(userId);
}

module.exports = {
  waitingDescriptionLink
}
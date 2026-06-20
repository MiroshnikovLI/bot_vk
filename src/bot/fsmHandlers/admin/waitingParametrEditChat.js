const { sendMessage } = require('../../../config/vkApi');
const { getCancelKeyboard, getWaitingParameterKeyboard, getSettingsListChats } = require('../../../keyboards/keyboards');
const { cleanText } = require('../../../utils/helpers');
const { userStates } = require('../../../state/stateManager');
const { COMMANDS } = require('../../../constants');
const { EDIT_LINK_CHATS, NOTIFICATIONS, OPERATION_CANCELLED } = require('../../../constants/message');

async function waitingParametrEditChat(userId, text) {
  const clearText = cleanText(text);
  const state = userStates.get(userId);

  if (clearText === COMMANDS.CANCELLATION) {
    userStates.delete(userId);
    await sendMessage(userId, OPERATION_CANCELLED, getSettingsListChats());
    return;
  }

  if (clearText === COMMANDS.EDIT_NAME_LINK) {
    userStates.set(userId, 'waitingNameLink', {key: 'name', chat: state.chat});
    await sendMessage(userId, NOTIFICATIONS.WAITING_NEW_VALUE('name'), getCancelKeyboard());
  } else if (clearText === COMMANDS.EDIT_LINK_LINK) {
    userStates.set(userId, 'waitingLinkLink', {key: 'link', chat: state.chat});
    await sendMessage(userId, NOTIFICATIONS.WAITING_NEW_VALUE('link'), getCancelKeyboard());
  } else if (clearText === COMMANDS.EDIT_DESCRIPTION_LINK) {
    userStates.set(userId, 'waitingDescriptionLink', {key: 'description', chat: state.chat});
    await sendMessage(userId, NOTIFICATIONS.WAITING_NEW_VALUE('description'), getCancelKeyboard());
  } else {
    await sendMessage(userId, EDIT_LINK_CHATS, getWaitingParameterKeyboard());
  }

}

module.exports = {
  waitingParametrEditChat
}
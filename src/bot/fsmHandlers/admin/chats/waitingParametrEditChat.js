const { sendMessage } = require('../../../../config/vkApi');
const { getCancelKeyboard, adminKeyboards } = require('../../../../keyboards/index');
const { cleanText } = require('../../../../utils/index');
const { userStates } = require('../../../../state/stateManager');
const { COMMANDS } = require('../../../../constants');
const { NOTIFICATIONS, STATES } = require('../../../../constants/index');

async function waitingParametrEditChat(userId, text) {
  const clearText = cleanText(text);
  const state = userStates.get(userId);

  if (clearText === COMMANDS.COMMON.CANCELLATION.TEXT) {
    userStates.delete(userId);
    await sendMessage(userId, NOTIFICATIONS.OPERATION_CANCELLED, adminKeyboards.settingsListChats());
    return;
  }

  if (clearText === COMMANDS.ADMIN.LIST_EDIT.EDIT_NAME_LINK.TEXT) {
    userStates.set(userId, STATES.WAITING_NAME_LINK, {key: 'name', chat: state.chat});
    await sendMessage(userId, NOTIFICATIONS.WAITING_NEW_VALUE('name'), getCancelKeyboard());
  } else if (clearText === COMMANDS.ADMIN.LIST_EDIT.EDIT_LINK_LINK.TEXT) {
    userStates.set(userId, STATES.WAITING_LINK_LINK, {key: 'link', chat: state.chat});
    await sendMessage(userId, NOTIFICATIONS.WAITING_NEW_VALUE('link'), getCancelKeyboard());
  } else if (clearText === COMMANDS.ADMIN.LIST_EDIT.EDIT_DESCRIPTION_LINK.TEXT) {
    userStates.set(userId, STATES.WAITING_DESCRIPTION_LINK, {key: 'description', chat: state.chat});
    await sendMessage(userId, NOTIFICATIONS.WAITING_NEW_VALUE('description'), getCancelKeyboard());
  } else {
    await sendMessage(userId, NOTIFICATIONS.EDIT_LINK_CHATS, adminKeyboards.waitingParameter());
  }

}

module.exports = {
  waitingParametrEditChat
}
const { sendMessage } = require('../../../config/vkApi');
const { NOTIFICATIONS, STATES } = require('../../../constants/index');
const { adminKeyboards, getCancelKeyboard } = require('../../../keyboards/index');
const { getWorkChats } = require('../../../services/index');
const { userStates } = require('../../../state/stateManager');

async function handlerEditListChats(userId) {
  const chats = await getWorkChats();

  if (chats.message === "Список чатов пока не загружен") {
    await sendMessage(userId, `${chats.message}`, adminKeyboards.settingsListChats());
  } else if (chats.message === "Успешно получин список чатов") {
    userStates.set(userId, STATES.WAITING_ID_WORK_CHATS, {chats: chats.data});
    await sendMessage(userId, `${NOTIFICATIONS.WAITING_ID_WORK_CHATS(chats, 'edit')}`, getCancelKeyboard());
    return;
  } else {
    await sendMessage(userId, NOTIFICATIONS.ERROR, adminKeyboards.settingsListChats());
    return;
  }
}

module.exports = {
  handlerEditListChats
}
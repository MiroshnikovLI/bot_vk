const { sendMessage } = require('../../config/vkApi');
const { NOTIFICATIONS } = require('../../constants');
const { getSettingsListChats, getCancelKeyboard } = require('../../keyboards/keyboards');
const { getWorkChats } = require('../../services/index');
const { userStates } = require('../../state/stateManager');

async function handleEditListChats(userId) {
  const chats = await getWorkChats();

  if (chats.message === "Список чатов пока не загружен") {
    await sendMessage(userId, `${chats.message}`, getSettingsListChats());
  } else if (chats.message === "Успешно получин список чатов") {
    const massChats = []
    let i = 1;

    chats.data.forEach(p => {
      massChats.push(`${i}) ID: ${p.id}\n Название ссылки: ${p.chat_name} \n Ссылка: ${p.chat_link}\n Описание: ${p.description}\n\n`)
    })

    userStates.set(userId, 'waitingIdWorkChats', {chats: chats.data});
    await sendMessage(userId, `${NOTIFICATIONS.WAITING_ID_WORK_CHATS}\n ${massChats}`, getCancelKeyboard());
    return;
  } else {
    await sendMessage(userId, NOTIFICATIONS.ERROR, getSettingsListChats());
    return;
  }
}

module.exports = {
  handleEditListChats
}
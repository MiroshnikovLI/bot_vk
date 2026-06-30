const { cleanText } = require('../../../../utils/index');
const { COMMANDS, NOTIFICATIONS } = require('../../../../constants/index');
const { sendMessage } = require('../../../../config/vkApi');
const { getCancelKeyboard, adminKeyboards } = require('../../../../keyboards/index');
const { userStates } = require('../../../../state/stateManager');

async function waitingIdWorkChats(userId, text) {
  const clearText = cleanText(text);
  const state = userStates.get(userId);

  if (clearText === COMMANDS.COMMON.CANCELLATION.TEXT) {
    userStates.delete(userId);
    await sendMessage(userId, NOTIFICATIONS.OPERATION_CANCELLED, adminKeyboards.settingsListChats());
    return;
  }

  if (!/^\d+$/.test(clearText)) {
    await sendMessage(userId, "⏳", { buttons: [], one_time: false });
    await sendMessage(
      userId,
      NOTIFICATIONS.WARNING_ID_ONLY_NUMBERS,
      getCancelKeyboard(),
    );
    return;
  }

  const chat = state.chats.find(p => p.id === Number(text));

  if (chat) {
    userStates.set(userId, 'waitingParametrEditChat', {chat: chat});
    const message = `Выберите что будете редактировать\n\n Название: ${chat.chat_name}\n Ссылку: ${chat.chat_link}\n Описание: ${chat.description} `;
    await sendMessage(userId, message, adminKeyboards.waitingParameter());
    return
  } else if (!chat) {
    await sendMessage(userId, `Чат с ID ${text} не найден`);
  } else  {
    userStates.delete(userId);
    await sendMessage(userId, NOTIFICATIONS.ERROR, adminKeyboards.waitingParameter());
  }
}

module.exports = {
  waitingIdWorkChats
}
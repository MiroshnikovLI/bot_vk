const { userStates } = require("../../state/stateManager");
const { sendMessage } = require("../../config/vkApi");
const { NOTIFICATIONS } = require("../../constants");
const { getCancelKeyboard, getSettingsListChats } = require("../../keyboards/keyboards");
const { getWorkChats } = require('../../services/listChatsService');

async function handleDeletedChatLink(userId) {
  const chats = await getWorkChats();

  if (chats.message === "Список чатов пока не загружен") {
    await sendMessage(userId, `${chats.message}`, getSettingsListChats());
  } else if (chats.message === "Успешно получин список чатов") {
    const massChats = [];
    let i = 1;

    chats.data.forEach((p) => {
      massChats.push(
        `${i}) ID: ${p.id}\n Название ссылки: ${p.chat_name} \n Ссылка: ${p.chat_link}\n Описание: ${p.description}\n\n`,
      );
    });
    userStates.set(userId, "waitingIdDeleteChatLink");
    await sendMessage(
      userId,
      `${massChats}`,
      getCancelKeyboard(),
    );
  }
}

module.exports = {
  handleDeletedChatLink,
};

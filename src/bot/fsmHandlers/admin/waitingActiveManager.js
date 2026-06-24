const { userStates } = require("../../../state/stateManager");
const { sendMessage } = require("../../../config/vkApi");
const { cleanText } = require("../../../utils/helpers");
const { COMMANDS } = require("../../../constants/commands");
const {
  OPERATION_CANCELLED,
  MANAGER_STATUS,
  NOTIFICATIONS,
} = require("../../../constants/message");
const { getManagerMenuKeyboard } = require("../../../keyboards/keyboards");
const {
  setActiveUser,
  deleteUserFromChat,
} = require("../../../services/userService");
const { getWorkChats } = require("../../../services");

async function waitingActiveManager(userId, text) {
  const clearText = cleanText(text);
  const state = userStates.get(userId);
  const resultChats = await getWorkChats();
  const status = state.status === 'restore' ? true : false;
  let user = [];
  let chats = [];
  const messageDeleteChats = [];
  const messageDeleteUser = [];

  if (clearText === COMMANDS.CANCELLATION) {
    userStates.delete(userId);
    await sendMessage(userId, OPERATION_CANCELLED, getManagerMenuKeyboard());
    return;
  }
  user = state.user.find((e) => e.id === Number(clearText));

  if (!resultChats.success) {
    chats = `Ошибка подключение к Базе Данных`;
  } else {
    if (resultChats.message === "Список чатов пока не загружен") {
      messageDeleteChats.push(resultChats.message);
    } else {
      chats = resultChats.data.rows;
      const deleteFromChat = await deleteUserFromChat(
        clearText,
        resultChats.data,
      );
      let i = 1;
      deleteFromChat.map((e) => {
        messageDeleteChats.push(`\n${i}) ${e.message}`);
        i++;
      });
    }
  }

  const userStatus = await setActiveUser(user.id, status);

  if (userStatus.success) {
    let message;
    if (status) {
      message = `${MANAGER_STATUS(status, userStatus.data)}\n\n`
    } else {
      message = `${MANAGER_STATUS(status, userStatus.data, `Удален с чатов: ${messageDeleteChats}`)}\n\n`;
    }
    userStates.delete(userId);
    await sendMessage(userId, message, getManagerMenuKeyboard());
  } else {
    await sendMessage(userId, NOTIFICATIONS.ERROR, getManagerMenuKeyboard());
  }
  userStates.delete(userId);
}

module.exports = {
  waitingActiveManager,
};

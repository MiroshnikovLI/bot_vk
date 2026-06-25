const { userStates } = require("../../../state/stateManager");
const { sendMessage } = require("../../../config/vkApi");
const { cleanText } = require("../../../utils/helpers");
const { COMMANDS } = require("../../../constants/commands");
const {
  OPERATION_CANCELLED,
  MANAGER_STATUS,
  NOTIFICATIONS,
  DEACTIVE_USER,
} = require("../../../constants/message");
const { getManagerMenuKeyboard, getPrivateKeyboard } = require("../../../keyboards/keyboards");
const {
  setActiveUser,
  deleteUserFromChat,
  isUserAdmin
} = require("../../../services/userService");
const { getWorkChats } = require("../../../services");

async function waitingActiveManager(userId, text) {
  const clearText = cleanText(text);
  const state = userStates.get(userId);
  const resultChats = await getWorkChats();
  const status = state.status === 'restore' ? true : false;
  let user = [];
  const messageDeleteChats = [];

  if (clearText === COMMANDS.CANCELLATION) {
    userStates.delete(userId);
    await sendMessage(userId, OPERATION_CANCELLED, getManagerMenuKeyboard());
    return;
  }
  user = state.user.find((e) => e.id === Number(clearText));

  if (!resultChats.success) {
    messageDeleteChats.push(`Ошибка подключение к Базе Данных`);
  } else {
    if (resultChats.message === "Список чатов пока не загружен") {
      messageDeleteChats.push(resultChats.message);
    } else {
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

  if (Number(user.vk_id) === Number(userId) && !status) {
    await sendMessage(userId, `Вы не можете удалить себя`, getManagerMenuKeyboard());
    return;
  }

  if (await isUserAdmin(user.vk_id) && !status) {
    await sendMessage(userId, `Вы не можете удалить администратора`, getManagerMenuKeyboard());
    return;
  }

  const userStatus = await setActiveUser(user.id, status);

  if (userStatus.success) {
    let message;
    if (status) {
      message = `${MANAGER_STATUS(status, userStatus.data)}\n\n`
    } else {
      message = `${MANAGER_STATUS(status, userStatus.data, `Удален с чатов: ${messageDeleteChats}`)}\n\n`;
    }
    const keyboards = status ? await getPrivateKeyboard(user.vk_id) : { buttons: [], one_time: false };
    await sendMessage(user.vk_id, DEACTIVE_USER(status), keyboards)
    await sendMessage(userId, message, getManagerMenuKeyboard());
  } else {
    await sendMessage(userId, NOTIFICATIONS.ERROR, getManagerMenuKeyboard());
  }
  userStates.delete(userId);
}

module.exports = {
  waitingActiveManager,
};

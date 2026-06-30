const { userStates } = require("../../../../state/stateManager");
const { sendMessage } = require("../../../../config/vkApi");
const { cleanText } = require("../../../../utils/index");
const { NOTIFICATIONS, STATES, COMMANDS } = require("../../../../constants/index");
const { adminKeyboards, userKeyboards } = require("../../../../keyboards/index");
const { setActiveUser, deleteUserFromChat, isUserAdmin, getWorkChats } = require("../../../../services/index");

async function waitingActiveManager(userId, text) {
  const clearText = cleanText(text);
  const state = userStates.get(userId);
  const resultChats = await getWorkChats();
  const statesDelete = () => userStates.delete(userId)
  const status = state.status === 'restore' ? true : false;
  let user = [];
  const messageDeleteChats = [];
  
  if (clearText === COMMANDS.COMMON.CANCELLATION.TEXT) {
    statesDelete();
    await sendMessage(userId, NOTIFICATIONS.OPERATION_CANCELLED, adminKeyboards.managerMenu());
    return;
  }
  user = state.user.find((e) => e.id === Number(clearText));

  if (user.is_active && status) {
    statesDelete();
    await sendMessage(userId, NOTIFICATIONS.STATUS_MANAGER(user), adminKeyboards.managerMenu());
    return;
  }

  if (!user.is_active && !status) {
    statesDelete();
    await sendMessage(userId, NOTIFICATIONS.STATUS_MANAGER(user), adminKeyboards.managerMenu());
    return;
  }
  
  if (Number(user.vk_id) === Number(userId) && !status) {
    statesDelete();
    await sendMessage(userId, NOTIFICATIONS.DELETE_YOURSSELF, adminKeyboards.managerMenu());
    return;
  }
  
  if (await isUserAdmin(user.vk_id) && !status) {
    statesDelete();
    await sendMessage(userId, NOTIFICATIONS.DELETE_ADMIN, adminKeyboards.managerMenu());
    return;
  }
  
  if (!resultChats.success) {
    messageDeleteChats.push(`Ошибка подключение к Базе Данных`);
  } else {
    if (resultChats.message === "Список чатов пока не загружен") {
      messageDeleteChats.push(resultChats.message);
    } else {
      const deleteFromChat = await deleteUserFromChat(
        user.vk_id,
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
      message = `${NOTIFICATIONS.STATUS_MANAGER(userStatus.data, `restore`)}\n\n`
    } else {
      message = `${NOTIFICATIONS.STATUS_MANAGER(userStatus.data, `deactive`, `Удален с чатов: ${messageDeleteChats}`)}\n\n`;
    }
    const keyboards = status ? userKeyboards.main() : { buttons: [], one_time: false };
    await sendMessage(user.vk_id, NOTIFICATIONS.DEACTIVE_USER(status), keyboards)
    await sendMessage(userId, message, adminKeyboards.managerMenu());
  } else {
    await sendMessage(userId, NOTIFICATIONS.ERROR, adminKeyboards.managerMenu());
  }
  statesDelete();
}

module.exports = {
  waitingActiveManager,
};

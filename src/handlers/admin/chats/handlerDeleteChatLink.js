const { userStates } = require("../../../state/stateManager");
const { sendMessage } = require("../../../config/vkApi");
const { NOTIFICATIONS, STATES } = require("../../../constants/index");
const { getCancelKeyboard, adminKeyboards } = require("../../../keyboards/index");
const { getWorkChats } = require('../../../services/index');

async function handlerDeleteChatLink(userId) {
  const chats = await getWorkChats();

  if (chats.message === "Список чатов пока не загружен") {
    await sendMessage(userId, `${chats.message}`, adminKeyboards.settingsListChats());
  } else if (chats.message === "Успешно получин список чатов") {
    userStates.set(userId, STATES.WAITING_ID_DELETECHAT_LINK);
    await sendMessage(
      userId,
      `${NOTIFICATIONS.WAITING_ID_WORK_CHATS(chats, 'delete')}`,
      getCancelKeyboard(),
    );
  }
}

module.exports = {
  handlerDeleteChatLink,
};

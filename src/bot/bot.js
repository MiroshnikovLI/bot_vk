const { query } = require("../config/database");
const { userKeyboards } = require("../keyboards/index");
const { isUserAdmin, getUserVkId, startUser, createShiftReport } = require("../services/index");
const { cleanText, findAdminKeyByPartialMatch } = require("../utils/index");
const { handleTextInput } = require("./fsmHandler");
const { sendMessage, startLongPoll } = require("../config/vkApi");
const { commandHandlers } = require("../handlers/commandHandlers");
const { chatMessageListener } = require("./listeners/chatMessageListener");
const { userStates } = require("../state/stateManager");
const { NOTIFICATIONS, STATES } = require("../constants/index");
const { ADMIN } = require('../constants/commands/admin');
const { reminderTask } = require("../scheduler/reminder");
require("dotenv").config();

// ============================================================
// ОБРАБОТЧИК СОБЫТИЙ LONG POLL
// ============================================================
async function handleUpdate(update) {
  // Проверка на новое сообщение
  if (update.type !== "message_new") return;

  const message = update.object.message;
  const {
    peer_id: peerId,
    from_id: senderId,
    text,
    out,
    conversation_message_id: cmid,
    payload
  } = message;

  // Игнорируем свои сообщения
  if (out === 1) return;

  const isGroupChat = peerId > 2000000000;

  if (Number(peerId) === Number(process.env.VK_CHAT_ID)) {
    await chatMessageListener(message);
    return;
  }

  // ⚠️ Если это беседа — игнорируем
  if (isGroupChat) {
    return; // Ничего не делаем
  }

  // ========== ТОЛЬКО ЛИЧНЫЕ СООБЩЕНИЯ ==========
  const state = userStates.get(senderId);

  if (state) {
    await handleTextInput(
      senderId,
      text,
      payload,
      false,
      null,
      createShiftReport,
      sendMessage,
    );
    return;
  }

  const user = await getUserVkId(peerId);
  
  if (!user) {
    const start = await startUser(peerId);
    if (!start.success) {
      await sendMessage(peerId, NOTIFICATIONS.TECHNICAL_ERROR, {
        buttons: [],
        one_time: false,
      });
      return;
    }
    userStates.set(peerId, STATES.WAITING_FULL_NAME);
    await sendMessage(peerId, NOTIFICATIONS.START_REGISTRATION, {
      buttons: [],
      one_time: false,
    });
    return;
  }

  if (!user.full_name || !user.wb_id || !user.phone) {
    if (!user.full_name) {
      userStates.set(peerId, STATES.WAITING_FULL_NAME);
      await sendMessage(peerId, NOTIFICATIONS.PROFILE_NOT_FILLED(`name`), {buttons: [], one_time: false});
      return;
    }
    if (!user.wb_id) {
      userStates.set(peerId, STATES.WAITING_WB_ID);
      await sendMessage(peerId, NOTIFICATIONS.PROFILE_NOT_FILLED(`wbId`), {buttons: [], one_time: false});
      return;
    }
    if (!user.phone) {
      userStates.set(peerId, STATES.WAITING_PHONE);
      await sendMessage(peerId, NOTIFICATIONS.PROFILE_NOT_FILLED(`phone`), {buttons: [], one_time: false});
      return;
    }
  }
  
  if (!user.is_active) {
    return await sendMessage(peerId, NOTIFICATIONS.DEACTIVE_USER(), {
      buttons: [],
      one_time: false,
    });
  }
  
  let clearText = cleanText(text);
  const isAdmin = await isUserAdmin(peerId);

  if (payload) {
    try {
      const data = JSON.parse(payload);
      if (data.command) {
        clearText = data.command
      }
    } catch {
      await sendMessage(peerId, NOTIFICATIONS.TECHNICAL_ERROR, userKeyboards.main(isAdmin));
      return;
    }
  }

  if (findAdminKeyByPartialMatch(clearText, ADMIN)) {
    if(!isAdmin) {
      await sendMessage(peerId, NOTIFICATIONS.NO_ACCESS_RIGHTS, userKeyboards.main());
      return;
    }
  }

  const handler = commandHandlers[clearText];

  if (handler) {
    await handler(senderId, payload);
    return;
  } else {
    await sendMessage(
      senderId,
      NOTIFICATIONS.UNKNOWN_COMMAND,
      userKeyboards.main(isAdmin),
    );
  }
}

// ============================================================
// 5. ЗАПУСК БОТА
// ============================================================

async function startBot() {
  try {
    await query("SELECT 1");

    if (!process.env.VK_GROUP_TOKEN) {
      throw new Error("VK_GROUP_TOKEN не указан в .env");
    }
    if (!process.env.VK_GROUP_ID) {
      throw new Error("VK_GROUP_ID не указан в .env");
    }
    
    await startLongPoll(handleUpdate);
  } catch (err) {
    console.error("❌ Ошибка запуска бота:", err.message);
    process.exit(1);
  }
}

startBot();
reminderTask();

setInterval(() => {
  userStates.clearExpired();
}, 600000);
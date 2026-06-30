const { query } = require("../config/database");
const { userKeyboards, getAdminKeyboards } = require("../keyboards/index");
const { isUserAdmin, getUserVkId, startUser, createShiftReport } = require("../services/index");
const { cleanText, findAdminKeyByPartialMatch } = require("../utils/index");
const { handleTextInput } = require("./fsmHandler");
const { sendMessage, startLongPoll } = require("../config/vkApi");
const { commandHandlers } = require("../handlers/commandHandlers");
const { chatMessageListener } = require("./listeners/chatMessageListener");
const { userStates } = require("../state/stateManager");
const { NOTIFICATIONS, STATES } = require("../constants/index");
const { ADMIN } = require('../constants/commands/admin');
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
    date,
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

  let clearText = cleanText(text);
  const isAdmin = await isUserAdmin(peerId);
  const userActive = await getUserVkId(peerId);

  if (!userActive) {
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

  if (!userActive.is_active) {
    return await sendMessage(peerId, NOTIFICATIONS.DEACTIVE_USER(), {
      buttons: [],
      one_time: false,
    });
  }
  
  if (payload) {
    try {
      const data = JSON.parse(payload)
      clearText = data.command
    } catch {
      await sendMessage(peerId, NOTIFICATIONS.TECHNICAL_ERROR, userKeyboards.main(isAdmin));
      return;
    }
  }

  const handler = commandHandlers[clearText];

  if (findAdminKeyByPartialMatch(clearText, ADMIN)) {
    if(!isAdmin) {
      await sendMessage(peerId, NOTIFICATIONS.NO_ACCESS_RIGHTS, userKeyboards.main());
      return;
    }
  }

  if (handler) {
    await handler(senderId);
    return;
  }

  // Если команда не найдена — обрабатываем текстовый ввод или fallback
  const state = userStates.get(senderId);

  if (state) {
    // Пользователь в процессе диалога (ждёт ввод WB ID, ФИО и т.д.)
    await handleTextInput(
      senderId,
      text,
      false,
      null,
      createShiftReport,
      sendMessage,
    );
  } else {
    // Нет активного диалога и команда не распознана
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

setInterval(() => {
  userStates.clearExpired();
}, 600000);

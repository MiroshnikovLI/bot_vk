const { query } = require("../config/database");
const {
  getPrivateKeyboard,
  getUnsubscribeKeyboard,
  getEditProfileKeyboard,
  getPvzKeyboard,
  getCancelKeyboard,
  getReplacementKeyboard,
} = require("../keyboards/keyboards");
const {
  isProfileComplete,
  getUserId,
  isUserAdmin,
  getOrCreateUser,
} = require("../services/userService");
const {
  getUserPvzs,
  getAllPvzs,
  addPvzToDb,
  getUserReplacements,
} = require("../services/pvzService");
const {
  hasUserReportedToday,
  addShiftReport,
} = require("../services/reportService");
const { cleanText } = require("../utils/helpers");
const { logAction } = require("../utils/logger");
const { handleTextInput } = require("./fsmHandler");
const {
  sendMessage,
  startLongPoll,
  getUserInfo,
  editMessage,
} = require("../config/vkApi");
const { commandHandlers } = require("../handlers/commandHandlers");
const { createShiftReport } = require("../handlers/handleChatReport");
const { chatMessageListener } = require("./listeners/chatMessageListener");
const { userStates } = require("../state/stateManager");
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

  const cleanTexts = cleanText(text);
  const isAdmin = await isUserAdmin(peerId);

  const handler = commandHandlers[cleanTexts];
  if (handler) {
    await handler(senderId, isAdmin);
    return; // ← не идём дальше
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
      "❌ Я не понял ваш запрос.\n\n" +
        "🔍 Доступные команды:\n" +
        "• 📋 Мои данные\n" +
        "• ✏️ Изменить данные\n" +
        "• 🏪 Настройки отписки\n" +
        "• 🌅 Открытие ПВЗ\n" +
        "• 🌙 Закрытие ПВЗ\n\n" +
        "Или воспользуйтесь кнопками меню.",
      await getPrivateKeyboard(),
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
  console.log("🧹 Очистка старых состояний выполнена");
}, 600000);

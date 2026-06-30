const { userKeyboards } = require("../../../../keyboards/index");
const { updateUserPhone } = require("../../../../services/index");
const { cleanText, normalizePhone } = require("../../../../utils/index");
const { userStates } = require("../../../../state/stateManager");
const { sendMessage } = require("../../../../config/vkApi");
const { NOTIFICATIONS, COMMANDS } = require("../../../../constants/index");

async function waitingChangePhone(userId, text) {
  const clearText = cleanText(text);
  if (clearText === COMMANDS.COMMON.CANCELLATION.TEXT) {
    userStates.delete(userId);
    await sendMessage(userId, NOTIFICATIONS.OPERATION_CANCELLED, userKeyboards.editProfile());
    return;
  }

  if (!/^(\+7|\+8|7|8)?\s*\(?\d{3}\)?\s*\d{3}[\s-]?\d{2}[\s-]?\d{2}$/.test(text)) {
    await sendMessage(
      userId,
      "Неверный формат телефона\n Введите в формате:\n +7 999 123-45-67\n 8 999 123-45-67\n 89991234567\n 79991234567\n 9991234567",
    );
    return;
  }

  const phone = normalizePhone(text);

  const result = await updateUserPhone(userId, phone);

  if (result.success) {
    await sendMessage(userId, NOTIFICATIONS.CHANGE_PHONE_SUCCESSFULLY(phone), userKeyboards.editProfile());
  } else {
    await sendMessage(
      userId,
      NOTIFICATIONS.ERROR,
      userKeyboards.main(),
    );
  }
  userStates.delete(userId);
}

module.exports = {
  waitingChangePhone,
};

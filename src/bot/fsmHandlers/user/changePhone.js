const {
  getEditProfileKeyboard,
  getPrivateKeyboard,
} = require("../../../keyboards/keyboards");
const { updateUserPhone } = require("../../../services/userService");
const { cleanText, normalizePhone } = require("../../../utils/helpers");
const { userStates } = require("../../../state/stateManager");
const { sendMessage } = require("../../../config/vkApi");
const {
  OPERATION_CANCELLED,
  NOTIFICATIONS,
  COMMANDS,
} = require("../../../constants/index");

async function changePhone(userId, text) {
  const clearText = cleanText(text);
  if (clearText === COMMANDS.CANCELLATION) {
    userStates.delete(userId);
    await sendMessage(userId, OPERATION_CANCELLED, getEditProfileKeyboard());
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
    await sendMessage(userId, NOTIFICATIONS.PHONE_SUCCESSFULLY(phone), getEditProfileKeyboard());
  } else {
    await sendMessage(
      userId,
      NOTIFICATIONS.ERROR,
      await getPrivateKeyboard(userId),
    );
  }
  userStates.delete(userId);
}

module.exports = {
  changePhone,
};

const { userKeyboards, getCancelKeyboard } = require("../../../../keyboards/index");
const { updateUserPhone } = require("../../../../services/index");
const { cleanText, normalizePhone, isValidPhoneNumber } = require("../../../../utils/index");
const { userStates } = require("../../../../state/stateManager");
const { sendMessage } = require("../../../../config/vkApi");
const { NOTIFICATIONS, COMMANDS } = require("../../../../constants/index");

async function waitingChangePhone(userId, text) {
  const clearText = cleanText(text);
  const validNumber = isValidPhoneNumber(clearText);

  if (clearText === COMMANDS.COMMON.CANCELLATION.TEXT) {
    userStates.delete(userId);
    await sendMessage(userId, NOTIFICATIONS.OPERATION_CANCELLED, userKeyboards.editProfile());
    return;
  }

  if (!validNumber.success) {
    return await sendMessage(userId, validNumber.message, getCancelKeyboard());
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

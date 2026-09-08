const { sendMessage } = require('../../../../config/vkApi');
const { userStates } = require('../../../../state/stateManager');
const { cleanText, isValidPhoneNumber, normalizePhone } = require('../../../../utils/index');
const { NOTIFICATIONS } = require('../../../../constants/index');
const { userKeyboards } = require('../../../../keyboards/index');
const { getUserVkId, updateUserPhone } = require('../../../../services');

async function waitingPhone(userId, text) {
  const clearText = cleanText(text);
  const validNumber = isValidPhoneNumber(clearText);
  const user = await getUserVkId(userId);
  const emptyKeyboard = { buttons: [], one_time: false };

  if (!validNumber.success) {
    return await sendMessage(userId, validNumber.message, emptyKeyboard);
  }

  const phone = normalizePhone(text);

  const result = await updateUserPhone(userId, phone);

  if (result.success) {
    await sendMessage(userId, NOTIFICATIONS.PROFILE_COMPLETED_SUCCESSFULLY(user.full_name, user.wb_id, phone), userKeyboards.main());
  } else {
    await sendMessage(
      userId,
      NOTIFICATIONS.ERROR,
      emptyKeyboard,
    );
  }
  userStates.delete(userId);
}

module.exports = { waitingPhone }
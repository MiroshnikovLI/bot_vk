const { userKeyboards, getCancelKeyboard } = require('../../../../keyboards/index');
const { updateUserFullName } = require('../../../../services/index');
const { cleanText, validateFullName } = require('../../../../utils/index');
const { userStates } = require('../../../../state/stateManager');
const { sendMessage } = require('../../../../config/vkApi');
const { NOTIFICATIONS, COMMANDS, STATES } = require('../../../../constants/index');

async function waitingChangeName(userId, text) {
  const clearText = cleanText(text);
  const validName = validateFullName(text);

  if (clearText === COMMANDS.COMMON.CANCELLATION.TEXT) {
    userStates.delete(userId);
    await sendMessage(userId, NOTIFICATIONS.OPERATION_CANCELLED, userKeyboards.editProfile());
    return;
  }

  if (!validName.success) {
    await sendMessage(userId, validName.message, getCancelKeyboard());
    return;
  }

  const changeName = await updateUserFullName(userId, text);
  if (changeName.success) {
    await sendMessage(
      userId,
      NOTIFICATIONS.CHANGE_NAME_SUCCESSFULLY(text),
      userKeyboards.editProfile(),
    );
  } else {
    await sendMessage(userId, NOTIFICATIONS.ERROR, userKeyboards.editProfile())
  }
  userStates.delete(userId);
}

module.exports = {
  waitingChangeName
}
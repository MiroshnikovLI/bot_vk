const { userKeyboards } = require('../../../../keyboards/index');
const { updateUserFullName } = require('../../../../services/index');
const { cleanText } = require('../../../../utils/index');
const { userStates } = require('../../../../state/stateManager');
const { sendMessage } = require('../../../../config/vkApi');
const { NOTIFICATIONS, COMMANDS } = require('../../../../constants/index');

async function waitingChangeName(userId, text) {
  const clearText = cleanText(text);
  if (clearText === COMMANDS.COMMON.CANCELLATION.TEXT) {
    userStates.delete(userId);
    await sendMessage(userId, NOTIFICATIONS.OPERATION_CANCELLED, userKeyboards.editProfile());
    return;
  } else {
    await updateUserFullName(userId, text);
    userStates.delete(userId);
    await sendMessage(
      userId,
      NOTIFICATIONS.CHANGE_NAME_SUCCESSFULLY(text),
      userKeyboards.editProfile(),
    );
  }
}

module.exports = {
  waitingChangeName
}
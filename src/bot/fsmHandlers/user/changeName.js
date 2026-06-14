const { getEditProfileKeyboard } = require('../../../keyboards/keyboards');
const { updateUserFullName } = require('../../../services/userService');
const { cleanText } = require('../../../utils/helpers');
const { userStates } = require('../../../state/stateManager');
const { sendMessage } = require('../../../config/vkApi');
const { OPERATION_CANCELLED, NOTIFICATIONS, COMMANDS } = require('../../../constants/index');

async function changeName(userId, text) {
  const cleanTextName = cleanText(text);
  if (cleanTextName === COMMANDS.CANCELLATION) {
    userStates.delete(userId);
    await sendMessage(userId, OPERATION_CANCELLED, getEditProfileKeyboard());
  } else {
    await updateUserFullName(userId, text);
    userStates.delete(userId);
    await sendMessage(
      userId,
      NOTIFICATIONS.CHANGE_NAME(text),
      getEditProfileKeyboard(),
    );
  }
}

module.exports = {
  changeName
}
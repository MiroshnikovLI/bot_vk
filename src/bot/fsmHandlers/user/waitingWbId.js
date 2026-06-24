const { getCancelKeyboard, getPrivateKeyboard} = require('../../../keyboards/keyboards');
const { updateUserWbId } = require('../../../services/userService');
const { userStates } = require('../../../state/stateManager');
const { sendMessage } = require('../../../config/vkApi');
const { NOTIFICATIONS } = require('../../../constants/index');
const { COMMANDS } = require('../../../constants/commands');
const { OPERATION_CANCELLED } = require('../../../constants/message');
const { cleanText } = require('../../../utils/helpers');

async function waitingWbId(userId, text) {
  const clearText = cleanText(text);
  const state = userStates.get(userId);

  if (clearText === COMMANDS.CANCELLATION) {
    userStates.delete(userId);
    await sendMessage(userId, OPERATION_CANCELLED, await getPrivateKeyboard(userId));
    return;
  }

  if (!/^\d+$/.test(text)) {
    await sendMessage(
      userId,
      NOTIFICATIONS.WARNING_ID_ONLY_NUMBERS,
      getCancelKeyboard(),
    );
    return true;
  }
  await updateUserWbId(userId, parseInt(text));
  userStates.delete(userId);
  await sendMessage(
    userId,
    NOTIFICATIONS.PROFILE_COMPLETED_SUCCESSFULLY(state.full_name, text),
    await getPrivateKeyboard(userId),
  );
}

module.exports = { waitingWbId }
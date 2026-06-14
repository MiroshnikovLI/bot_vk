const { getCancelKeyboard, getPrivateKeyboard} = require('../../../keyboards/keyboards');
const { updateUserWbId } = require('../../../services/userService');
const { userStates } = require('../../../state/stateManager');
const { sendMessage } = require('../../../config/vkApi');
const { NOTIFICATIONS } = require('../../../constants/index');

async function waitingWbId(userId, text) {
  const state = userStates.get(userId);
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
    NOTIFICATIONS.PROFILE_COMPLETED_SUCCESSFULLY(state.tempData_full_name, text),
    await getPrivateKeyboard(userId),
  );
}

module.exports = { waitingWbId }
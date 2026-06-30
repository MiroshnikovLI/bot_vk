const { getCancelKeyboard, userKeyboards } = require('../../../../keyboards/index');
const { updateUserWbId } = require('../../../../services/index');
const { userStates } = require('../../../../state/stateManager');
const { sendMessage } = require('../../../../config/vkApi');
const { NOTIFICATIONS } = require('../../../../constants/index');
const { COMMANDS } = require('../../../../constants/index');
const { cleanText, isValidWbId } = require('../../../../utils/index');

async function waitingWbId(userId, text) {
  const clearText = cleanText(text);
  const state = userStates.get(userId);

  const validWb = isValidWbId(clearText);

  if (!validWb.success) {
    await sendMessage(userId, validWb.message);
    return;
  }

  await updateUserWbId(userId, parseInt(text));
  userStates.delete(userId);
  await sendMessage(
    userId,
    NOTIFICATIONS.PROFILE_COMPLETED_SUCCESSFULLY(state.full_name, text),
    userKeyboards.main(),
  );
}

module.exports = { waitingWbId }
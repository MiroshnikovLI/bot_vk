const { sendMessage } = require('../../../../config/vkApi');
const { NOTIFICATIONS, COMMANDS, STATES } = require('../../../../constants/index');
const { userKeyboards, getCancelKeyboard } = require('../../../../keyboards/index');
const { cleanText } = require('../../../../utils/index');
const { isUserAdmin } = require('../../../../services/index');
const { userStates } = require('../../../../state/stateManager');

async function waitingFullNameReplacement(userId, text) {
  const clearText = cleanText(text);
  const isAdmin = isUserAdmin(userId);
  const state = userStates.get(userId);
  const pvz = state.pvz;
  const user = state.user;
  const wbId = state.wbId;
  const reportType = state.reportType;

  if (clearText === COMMANDS.COMMON.CANCELLATION.TEXT) {
    userStates.delete(userId);
    await sendMessage(userId, NOTIFICATIONS.OPERATION_CANCELLED, userKeyboards.main(isAdmin));
    return;
  }

  userStates.set(userId, STATES.WAITING_NUMBER_REPLECEMENT, {pvz, user, reportType, wbId, fullName: text});
  await sendMessage(userId, NOTIFICATIONS.WAITING_NUMBER_REPLACAMENT, getCancelKeyboard())
}

module.exports = {
  waitingFullNameReplacement
}
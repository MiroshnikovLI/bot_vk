const { sendMessage } = require('../../../../config/vkApi');
const { NOTIFICATIONS, COMMANDS, STATES } = require('../../../../constants/index');
const { userKeyboards, getCancelKeyboard } = require('../../../../keyboards/index');
const { cleanText, isValidWbId } = require('../../../../utils/index');
const { isUserAdmin, getUserWbId } = require('../../../../services/index');
const { userStates } = require('../../../../state/stateManager');

async function waitingWbIdReplacement(userId, text) {
  const clearText = cleanText(text);
  const validWbId = isValidWbId(clearText);
  const isAdmin = await isUserAdmin(userId);
  const userWbId = await getUserWbId(clearText);
  const state = userStates.get(userId);
  const pvz = state.pvz;
  const user = state.user;
  const reportType = state.reportType;
  
  if (clearText === COMMANDS.COMMON.CANCELLATION.TEXT) {
    userStates.delete(userId);
    await sendMessage(userId, NOTIFICATIONS.OPERATION_CANCELLED, userKeyboards.main(isAdmin));
    return;
  }

  if (!validWbId.success) {
    return await sendMessage(userId, validWbId.message, getCancelKeyboard());
  }

  if (userWbId) {
    userStates.set(userId, STATES.WAITING_RATE_PVZ_IN_CHAT, {pvz, user, reportType, replecament: userWbId });
    await sendMessage(userId, NOTIFICATIONS.CHOOSE_RATE_PVZ, userKeyboards.ratePvz(pvz.rate));
    return;
  }

  userStates.set(userId, STATES.WAITING_FULL_NAME_REPLACEMENT, {pvz, user, reportType, wbId: clearText});
  await sendMessage(userId, NOTIFICATIONS.WAITING_FULL_NAME_REPLACEMENT, getCancelKeyboard());
}

module.exports = {
  waitingWbIdReplacement
}
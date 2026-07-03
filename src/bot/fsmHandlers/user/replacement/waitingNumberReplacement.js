const { sendMessage } = require('../../../../config/vkApi');
const { NOTIFICATIONS, COMMANDS, STATES } = require('../../../../constants/index');
const { userKeyboards, getCancelKeyboard } = require('../../../../keyboards/index');
const { cleanText, formatPhone, isValidPhoneNumber } = require('../../../../utils/index');
const { isUserAdmin, createdReplacement } = require('../../../../services/index');
const { userStates } = require('../../../../state/stateManager');

async function waitingNumberReplacement(userId, text) {
  const clearText = cleanText(text);
  const isAdmin = await isUserAdmin(userId);
  const validNumber = isValidPhoneNumber(clearText);
  const state = userStates.get(userId);
  const pvz = state.pvz;
  const user = state.user;
  const wbId = state.wbId;
  const reportType = state.reportType;
  const fullName = state.fullName;

  if (clearText === COMMANDS.COMMON.CANCELLATION.TEXT) {
    userStates.delete(userId);
    await sendMessage(userId, NOTIFICATIONS.OPERATION_CANCELLED, userKeyboards.main(isAdmin));
    return;
  }

  if (!validNumber.success) {
    return await sendMessage(userId, validNumber.message, getCancelKeyboard());
  }

  const createReplacement = await createdReplacement(wbId, fullName, clearText);

  if (createReplacement.success) {
    userStates.set(userId, STATES.WAITING_RATE_PVZ_IN_CHAT, {pvz, user, reportType, replecament: createReplacement.data});
    await sendMessage(userId, NOTIFICATIONS.CHOOSE_RATE_PVZ(pvz, createReplacement.data), userKeyboards.ratePvz(pvz.rate));
    return;
  } else {
    userStates.delete(userId);
    await sendMessage(userId, NOTIFICATIONS.TECHNICAL_ERROR, userKeyboards.main(isAdmin));
    return;
  }
}

module.exports = {
  waitingNumberReplacement
}
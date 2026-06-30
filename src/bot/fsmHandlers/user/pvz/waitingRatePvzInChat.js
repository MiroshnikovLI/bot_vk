const { userStates } = require('../../../../state/stateManager');
const { parseRating, cleanText } = require('../../../../utils/index');
const { sendMessage } = require('../../../../config/vkApi');
const { userKeyboards, getCancelKeyboard } = require('../../../../keyboards/index');
const { NOTIFICATIONS, COMMANDS } = require('../../../../constants/index');
const { updatePvzRating, isUserAdmin, createShiftReport } = require('../../../../services/index');

async function waitingRatePvzInChat(userId, text) {
  const clearText = cleanText(text);
  const state = userStates.get(userId);
  const isAdmin = await isUserAdmin(userId);
  const user = state.user;
  const replecament = state.replecament;
  const reportType = state.reportType;
  const pvz = state.pvz;

  if (clearText === COMMANDS.COMMON.CANCELLATION.TEXT) {
    userStates.delete(userId);
    await sendMessage(userId, NOTIFICATIONS.OPERATION_CANCELLED, userKeyboards.main(isAdmin));
    return;
  }
  
  if (!/^\d+$/.test(clearText)) {
    await sendMessage(
      userId,
      NOTIFICATIONS.WARNING_RATE_ONLY_NUMBERS,
      getCancelKeyboard(),
    );
    return true;
  }

  const rate = parseRating(text);

  if (rate !== pvz.rate) {
    try {
      await updatePvzRating(rate, pvz.pvz_id);
    } catch {
      userStates.delete(userId);
      await sendMessage(userId, NOTIFICATIONS.ERROR, userKeyboards.main(isAdmin));
      return;
    }
  }

  if (rate.success) {
    await createShiftReport(
      userId,
      user,
      pvz,
      replecament,
      reportType,
      rate
    );
  } else {
    await sendMessage(userId, NOTIFICATIONS.ERROR);
  }
}

module.exports = {
  waitingRatePvzInChat
}
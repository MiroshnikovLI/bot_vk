const { userStates } = require('../../../state/stateManager');
const { parseRating, cleanText } = require('../../../utils/helpers');
const { sendMessage } = require('../../../config/vkApi');
const { getPrivateKeyboard, getCancelKeyboard } = require('../../../keyboards/keyboards');
const { createShiftReport } = require('../../../handlers/handleChatReport');
const { NOTIFICATIONS } = require('../../../constants');
const { COMMANDS } = require('../../../constants/index');
const { updatePvzRating } = require('../../../services/pvzService');

async function waitingRatePvzInChat(userId, text) {
  const clearText = cleanText(text);
  const state = userStates.get(userId);
  const user = state.user;
  const replecament = state.replecament;
  const reportType = state.reportType;
  const pvz = state.pvz;

  if (clearText === COMMANDS.CANCELLATION) {
    userStates.delete(userId);
    await sendMessage(userId, OPERATION_CANCELLED, await getPrivateKeyboard(userId));
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
      await sendMessage(userId, NOTIFICATIONS.ERROR, await getPrivateKeyboard(userId));
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
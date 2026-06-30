const { cleanText, parseAddress } = require("../../../../utils/index");
const { getCancelKeyboard, adminKeyboards } = require("../../../../keyboards/index");
const { userStates } = require("../../../../state/stateManager");
const { sendMessage } = require("../../../../config/vkApi");
const { NOTIFICATIONS, COMMANDS, STATES } = require("../../../../constants/index");
  
async function waitingPvzAdress(userId, text) {
  const clearText = cleanText(text );
  const state = userStates.get(userId)

  if (clearText === COMMANDS.COMMON.CANCELLATION.TEXT) {
    userStates.delete(userId);
    await sendMessage(userId, NOTIFICATIONS.OPERATION_CANCELLED, adminKeyboards.pvzMenu());
    return;
  }

  const address = parseAddress(text);
  userStates.set(userId, STATES.WAITING_WORK_TIME, {pvz_id: state.pvz_id, address: address});

  await sendMessage(userId, NOTIFICATIONS.WAITING_WORK_TIME, getCancelKeyboard());
}

module.exports = {
  waitingPvzAdress
}
const { cleanText, parseAddress } = require("../../../utils/helpers");
const { getCancelKeyboard, getAdminKeyboard } = require("../../../keyboards/keyboards");
const { userStates } = require("../../../state/stateManager");
const { sendMessage } = require("../../../config/vkApi");
const { NOTIFICATIONS, OPERATION_CANCELLED, COMMANDS } = require("../../../constants/index");
  
async function adminWaitingPvzAdress(userId, text) {
  const clearText = cleanText(text );
  const state = userStates.get(userId)

  if (clearText === COMMANDS.CANCELLATION) {
    userStates.delete(userId);
    await sendMessage(userId, OPERATION_CANCELLED, getAdminKeyboard());
    return;
  }

  const address = parseAddress(text);
  userStates.set(userId, 'adminWaitindWorkTime', {pvz_id: state.pvz_id, address: address});

  await sendMessage(userId, NOTIFICATIONS.ADMIN_WAITING_WORK_TIME, getCancelKeyboard());
}

module.exports = {
  adminWaitingPvzAdress
}
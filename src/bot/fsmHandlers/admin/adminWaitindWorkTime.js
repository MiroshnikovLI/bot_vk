const { cleanText, parseScheduleTime } = require("../../../utils/helpers");
const {
  getAdminKeyboard,
  getWaitingСonfirmationKeyboard,
} = require("../../../keyboards/keyboards");
const { userStates } = require("../../../state/stateManager");
const { sendMessage } = require("../../../config/vkApi");
const { NOTIFICATIONS, OPERATION_CANCELLED, COMMANDS } = require("../../../constants/index");

async function adminWaitindWorkTime(userId, text) {
  const clearText = cleanText(text);
  const state = userStates.get(userId);

  if (clearText === COMMANDS.CANCELLATION) {
    userStates.delete(userId);
    sendMessage(userId, OPERATION_CANCELLED, getAdminKeyboard());
    return;
  }
  const timeWork = parseScheduleTime(text);

  userStates.set(userId, 'adminWaitingСonfirmation', {
    pvz_id: state.pvz_id,
    address: state.address,
    timeWork: timeWork
  })
  const message = NOTIFICATIONS.ADMIN_WAITING_CONFIRMATION(
    state.pvz_id,
    state.address,
    timeWork,
  );
  await sendMessage(userId, message, getWaitingСonfirmationKeyboard());
}

module.exports = {
  adminWaitindWorkTime,
};

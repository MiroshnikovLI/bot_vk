const { cleanText, parseScheduleTime } = require("../../../../utils/index");
const { adminKeyboards, getCancelKeyboard } = require("../../../../keyboards/index");
const { userStates } = require("../../../../state/stateManager");
const { sendMessage } = require("../../../../config/vkApi");
const { NOTIFICATIONS, COMMANDS, STATES } = require("../../../../constants/index");

async function waitingWorkTime(userId, text) {
  const clearText = cleanText(text);
  const state = userStates.get(userId);

  if (clearText === COMMANDS.COMMON.CANCELLATION.TEXT) {
    userStates.delete(userId);
    await sendMessage(userId, NOTIFICATIONS.OPERATION_CANCELLED, adminKeyboards.pvzMenu());
    return;
  }
  const timeWork = parseScheduleTime(text);

  if (!timeWork) {
    await sendMessage(userId, "⏳", { buttons: [], one_time: false });
    await sendMessage(userId, NOTIFICATIONS.WORK_TIME_FORMAT, getCancelKeyboard());
    return
  }

  userStates.set(userId, STATES.WAITING_СONFIRMATION, {
    pvz_id: state.pvz_id,
    address: state.address,
    timeWork: timeWork
  })
  const message = NOTIFICATIONS.ADMIN_WAITING_CONFIRMATION(
    state.pvz_id,
    state.address,
    timeWork,
  );
  await sendMessage(userId, message, adminKeyboards.waitingСonfirmation());
}

module.exports = {
  waitingWorkTime,
};

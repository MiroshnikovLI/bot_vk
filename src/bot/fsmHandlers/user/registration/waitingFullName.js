const { query } = require("../../../../config/database");
const { userStates } = require("../../../../state/stateManager");
const { sendMessage } = require("../../../../config/vkApi");
const { NOTIFICATIONS, STATES } = require("../../../../constants/index");
const { userKeyboards } = require("../../../../keyboards");
const { updateUserFullName, getUserVkId } = require("../../../../services");
const { validateFullName } = require('../../../../utils/index');

async function waitingFullName(userId, text) {
  const name = await updateUserFullName(userId, text);
  const validName = validateFullName(text);
  const emptyKeyboard = { buttons: [], one_time: false };
  const user = await getUserVkId(userId);

  if (!validName.success) {
    await sendMessage(userId, validName.message, emptyKeyboard);
    return;
  }

  if (!user.wb_id) {
    userStates.set(userId, STATES.WAITING_WB_ID);
    await sendMessage(userId, NOTIFICATIONS.NAME_SUCCESSFULLY_WAITING_WB_ID(text), emptyKeyboard);
    return;
  } else if (!user.phone) {
    userStates.set(userId, STATES.WAITING_PHONE);
    await sendMessage(userId, NOTIFICATIONS.NAME_SUCCESSFULLY_WAITING_PHONE(text, user.wb_id), emptyKeyboard);
    return
  } else {
    if (name.success) {
      await sendMessage(userId, NOTIFICATIONS.PROFILE_COMPLETED_SUCCESSFULLY(text, user.wb_id, user.phone), userKeyboards.main());
    } else {
      await sendMessage(userId, NOTIFICATIONS.ERROR, emptyKeyboard)
    }
    userStates.delete(userId);
    return;
  }
}

module.exports = { waitingFullName };

const { query } = require("../../../../config/database");
const { userStates } = require("../../../../state/stateManager");
const { sendMessage } = require("../../../../config/vkApi");
const { NOTIFICATIONS, STATES } = require("../../../../constants/index");
const { userKeyboards } = require("../../../../keyboards");
const { updateUserFullName } = require("../../../../services");
const { validateFullName } = require('../../../../utils/index');

async function waitingFullName(userId, text) {
  const state = userStates.get(userId);
  const name = await updateUserFullName(userId, text);
  const validName = validateFullName(text);

  if (!validName.success) {
    await sendMessage(userId, validName.message, {buttons: [], one_time: false});
    return;
  }

  if (!state.userWbId) {
    if (name.success) {
      await sendMessage(userId, NOTIFICATIONS.CHANGE_NAME_SUCCESSFULLY(text), userKeyboards.main());
    } else {
      await sendMessage(userId, NOTIFICATIONS.ERROR, {buttons: [], one_time: false})
    }
    userStates.delete(userId);
    return;
  }
  userStates.set(userId, STATES.WAITING_WB_ID, { full_name: text });
  await sendMessage(userId, NOTIFICATIONS.NAME_SUCCESSFULLY_WAITING_WB_ID(text));
}

module.exports = { waitingFullName };

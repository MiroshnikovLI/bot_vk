const { sendMessage } = require('../../../../config/vkApi');
const { userStates } = require('../../../../state/stateManager');
const { cleanText } = require('../../../../utils/index');
const { findManager } = require('../../../../services/index');
const { COMMANDS, NOTIFICATIONS, STATES } = require('../../../../constants/index');
const { adminKeyboards, getCancelKeyboard } = require('../../../../keyboards/index');

async function waitingInfoManager(userId, text) {
  const clearText = cleanText(text);
  const state = userStates.get(userId);

  if (clearText === COMMANDS.COMMON.CANCELLATION.TEXT) {
    userStates.delete(userId);
    await sendMessage(userId, NOTIFICATIONS.OPERATION_CANCELLED, adminKeyboards.managerMenu());
    return;
  }

  let result;

  if (/^\d+$/.test(clearText)) {
    const rest = await findManager(clearText, 'id');
    if (!rest.data) {
      await sendMessage(userId, NOTIFICATIONS.NOT_FIND_MANAGER(clearText, 'id'), getCancelKeyboard());
      return;
    } else {
      result = rest
    }
  } else {
    const rest = await findManager(clearText, 'name');
    if (!rest.data) {
      await sendMessage(userId, NOTIFICATIONS.NOT_FIND_MANAGER(clearText, 'name'), getCancelKeyboard());
      return;
    } else {
      result = rest
    }
  }

  if (state.status === 'restore') {
    userStates.set(userId, STATES.WAITING_ACTIVE_MANAGER, {user: result.data, status: "restore"});
    await sendMessage(userId, NOTIFICATIONS.MANAGER_INFO(result.data, 'restore'), getCancelKeyboard());
    return;  
  }
  
  if (state.status === 'deactive') {
    userStates.set(userId, STATES.WAITING_ACTIVE_MANAGER, {user: result.data, status: "deactive"});
    await sendMessage(userId, NOTIFICATIONS.MANAGER_INFO(result.data, 'deactive'), getCancelKeyboard());
    return;  
  }

  userStates.delete(userId);
  await sendMessage(userId, NOTIFICATIONS.MANAGER_INFO(result.data, 'info'), adminKeyboards.managerMenu());
}

module.exports = {
  waitingInfoManager
}
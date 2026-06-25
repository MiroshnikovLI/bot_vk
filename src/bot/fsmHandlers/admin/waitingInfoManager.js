const { sendMessage } = require('../../../config/vkApi');
const { userStates } = require('../../../state/stateManager');
const { cleanText } = require('../../../utils/helpers');
const { findManager } = require('../../../services/userService');
const { COMMANDS, NOTIFICATIONS, OPERATION_CANCELLED } = require('../../../constants');
const { getManagerMenuKeyboard, getCancelKeyboard } = require('../../../keyboards/keyboards');
const { MANAGER_INFO } = require('../../../constants/message');

async function waitingInfoManager(userId, text) {
  const clearText = cleanText(text);
  const state = userStates.get(userId);

  if (clearText === COMMANDS.CANCELLATION) {
    userStates.delete(userId);
    await sendMessage(userId, OPERATION_CANCELLED, getManagerMenuKeyboard());
    return;
  }

  let result;

  if (/^\d+$/.test(clearText)) {
    const rest = await findManager(clearText, 'id');
    if (rest.length === 0) {
      await sendMessage(userId, NOTIFICATIONS.NOT_FIND_MANAGER(clearText, 'id'), getCancelKeyboard());
      return;
    } else {
    result = rest
    }
  } else {
    const rest = await findManager(clearText, 'name');
    if (rest.length === 0) {
      await sendMessage(userId, NOTIFICATIONS.NOT_FIND_MANAGER(clearText, 'name'), getCancelKeyboard());
      return;
    } else {
      result = rest
    }
  } 

  if (state.status === 'restore') {
    userStates.set(userId, 'waitingActiveManager', {user: result, status: "restore"});
    await sendMessage(userId, MANAGER_INFO('restore', result), getCancelKeyboard());
    return;  
  }
  
  if (state.status === 'deactive') {
    userStates.set(userId, 'waitingActiveManager', {user: result, status: "deactive"});
    await sendMessage(userId, MANAGER_INFO('deactive', result), getCancelKeyboard());
    return;  
  }

  userStates.delete(userId);
  await sendMessage(userId, MANAGER_INFO('info', result), getManagerMenuKeyboard());
}

module.exports = {
  waitingInfoManager
}
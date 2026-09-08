const { createSafeHandlers } = require('../utils/index');
const { userStates } = require('../state/stateManager');
const {
  // Пользователь
  waitingFullName,
  waitingWbId,
  waitingPhone,
  waitingChangeName,
  waitingSelectingPvzInChat,
  waitingSelectingReplacementInChat,
  waitingSelectingPvzToAdd,
  waitingAddReplacement,
  waitingDeleteReplacement,
  waitingWorkTime,
  waitingRatePvzInChat,
  waitingChangePhone,
  waitingSelectingPvzForRemoval,
  waitingFullNameReplacement,
  waitingWbIdReplacement,
  waitingNumberReplacement,
  
  // Админ
  waitingPvzId,
  waitingActivePvzId,
  waitingPvzAdress,
  waitingСonfirmation,
  waitingParametrEditChat,
  waitingIdWorkChats,
  waitingNameLink,
  waitingLinkLink,
  waitingDescriptionLink,
  waitingIdDeleteChatLink,
  waitingChatIdLink,
  waitingInfoManager,
  waitingActiveManager,
} = require("./fsmHandlers/index");

const rawHandlers = {
  // Пользователь
  waitingFullName,
  waitingWbId,
  waitingPhone,
  waitingChangeName,
  waitingSelectingPvzInChat,
  waitingSelectingReplacementInChat,
  waitingSelectingPvzToAdd,
  waitingAddReplacement,
  waitingDeleteReplacement,
  waitingWorkTime,
  waitingRatePvzInChat,
  waitingChangePhone,
  waitingSelectingPvzForRemoval,
  waitingFullNameReplacement,
  waitingWbIdReplacement,
  waitingNumberReplacement,
  
  // Админ
  waitingPvzId,
  waitingActivePvzId,
  waitingPvzAdress,
  waitingСonfirmation,
  waitingParametrEditChat,
  waitingIdWorkChats,
  waitingNameLink,
  waitingLinkLink,
  waitingDescriptionLink,
  waitingIdDeleteChatLink,
  waitingChatIdLink,
  waitingInfoManager,
  waitingActiveManager,
};

const safeHandlers = createSafeHandlers(rawHandlers);

async function handleTextInput(userId, text, payload, ...args) {
  const state = userStates.get(userId);
  if (!state) return false;

  const handler = safeHandlers[state.state];
  
  if (handler) {
    handler(userId, text, payload, ...args)
  } else {
    userStates.delete(userId);
    return false
  }

  return true;
}

module.exports = { handleTextInput };

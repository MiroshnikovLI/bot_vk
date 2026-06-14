const { createSafeHandlers } = require('../utils/safeHandler');
const { userStates } = require('../state/stateManager');
const {
  waitingFullName,
  waitingWbId,
  changeName,
  changeWbId,
  selectingPvzInChat,
  selectingReplacementInChat,
  selectingPvzToAdd,
  selectingPvzForRemoval,
  addReplacement,
  deletedReplacement,
  adminWaitingPvzId,
  adminWaitingDeletePvzId,
  adminWaitingPvzAdress,
  adminWaitindWorkTime,
  adminWaitingСonfirmation,
  waitingRatePvzInChat,
} = require("./fsmHandlers/index");

const rawHandlers = {
  waitingFullName,
  waitingWbId,
  changeName,
  changeWbId,
  selectingPvzInChat,
  selectingReplacementInChat,
  selectingPvzToAdd,
  selectingPvzForRemoval,
  addReplacement,
  deletedReplacement,
  adminWaitingPvzId,
  adminWaitingDeletePvzId,
  adminWaitingPvzAdress,
  adminWaitindWorkTime,
  adminWaitingСonfirmation,
  waitingRatePvzInChat,
};

const safeHandlers = createSafeHandlers(rawHandlers);

async function handleTextInput(userId, text, ...args) {
  const state = userStates.get(userId);
  if (!state) return false;

  const handler = safeHandlers[state.state];

  if (handler) {
    handler(userId, text, ...args)
  } else {
    userStates.delete(userId);
    return false
  }

  return true;
}

module.exports = { handleTextInput };

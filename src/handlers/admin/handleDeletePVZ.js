const { userStates } = require('../../state/stateManager');
const { sendMessage } = require('../../config/vkApi');
const { getPrivateKeyboard, getCancelKeyboard } = require('../../keyboards/keyboards');
const { NO_ACCESS_RIGHTS, WAITING_ID_PVZ_TO_DELETE } = require('../../constants/message');

async function handleDeletePVZ(userId, isAdmin) {
  if(!isAdmin) {
    await sendMessage(userId, NO_ACCESS_RIGHTS, await getPrivateKeyboard(userId));
    return;
  }

  userStates.set(userId, 'adminWaitingDeletePvzId');
  await sendMessage(userId, WAITING_ID_PVZ_TO_DELETE, getCancelKeyboard())
}

module.exports = {
  handleDeletePVZ
}
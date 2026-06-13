const { sendMessage } = require("../../config/vkApi");
const { userStates } = require("../../state/stateManager");
const { getCancelKeyboard, getPrivateKeyboard } = require("../../keyboards/keyboards");
const { NO_ACCESS_RIGHTS, ADD_PVZ_TO_DB } = require('../../constants/message');

async function handleAddPVZ(userId, isAdmin) {
  if (!isAdmin) {
    await sendMessage(userId, NO_ACCESS_RIGHTS, await getPrivateKeyboard(userId));
    return;
  }
  userStates.set(userId, "adminWaitingPvzId", { isAdmin: isAdmin });
  await sendMessage(userId, ADD_PVZ_TO_DB, getCancelKeyboard());
}

module.exports = {
  handleAddPVZ,
};

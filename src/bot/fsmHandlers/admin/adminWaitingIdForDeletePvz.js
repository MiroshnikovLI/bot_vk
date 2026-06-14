const { userStates } = require("../../../state/stateManager");
const { sendMessage } = require("../../../config/vkApi");
const { cleanText } = require("../../../utils/helpers");
const { getAdminKeyboard, getCancelKeyboard } = require('../../../keyboards/keyboards');
const { getAllPvzs, deactivePvzFromDb } = require('../../../services/pvzService');
const { NOTIFICATIONS, COMMANDS } = require("../../../constants/index");

async function adminWaitingDeletePvzId(userId, text) {
  const clearText = cleanText(text);

  if(clearText === COMMANDS.CANCELLATION) {
    userStates.delete(userId);
    await sendMessage(
      userId,
      NOTIFICATIONS.OPERATION_CANCELLED,
      getAdminKeyboard(),
    );
    return;
  }

  if (!/^\d+$/.test(clearText)) {
    await sendMessage(
      userId,
      NOTIFICATIONS.WARNING_ID_ONLY_NUMBERS,
      getCancelKeyboard(),
    );
    return;
  }

  const pvz = await getAllPvzs();

  if(!pvz.success) {
    await sendMessage(
      userId,
      NOTIFICATIONS.NO_RECEIVE_PVZ,
      getAdminKeyboard(),
    );
    return;
  }

  const deletePvz = pvz.data.find(p => Number(p.pvz_id) === Number(clearText));

  const result = await deactivePvzFromDb(deletePvz.pvz_id);

  if (result.success) {
    userStates.delete(userId)
    await sendMessage(
      userId,
      NOTIFICATIONS.DELETED_SUCCESSFULLY(clearText),
      getAdminKeyboard(),
    );
    return;
  } else {
        await sendMessage(
      userId,
      NOTIFICATIONS.ERROR_DELETED,
      getAdminKeyboard(),
    );
    return;
  }
}

module.exports = {
  adminWaitingDeletePvzId,
};

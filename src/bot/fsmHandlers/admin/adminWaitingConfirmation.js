const { cleanText, parseScheduleTime } = require("../../../utils/helpers");
const {
  getCancelKeyboard,
  getAdminKeyboard,
  getWaitingСonfirmationKeyboard,
} = require("../../../keyboards/keyboards");
const { userStates } = require("../../../state/stateManager");
const { sendMessage } = require("../../../config/vkApi");
const { NOTIFICATIONS, COMMANDS } = require("../../../constants/index");
const { addPvzToDb } = require('../../../services/pvzService');

async function adminWaitingСonfirmation(userId, text) {
  const clearText = cleanText(text);
  const state = userStates.get(userId);
  const newPvz = {
      id: state.pvz_id,
      address: `${state.address.city}, ${state.address.street}, ${state.address.house}`,
      open_time: state.timeWork.open,
      close_time: state.timeWork.close,
    }
  
  if (clearText === COMMANDS.CANCELLATION) {
    userStates.delete(userId);
    await sendMessage(userId, OPERATION_CANCELLED, getAdminKeyboard());
    return;
  }

  if (clearText === COMMANDS.YES_DATA_IS_CORRECT) {

    const result = await addPvzToDb(
      newPvz.id,
      newPvz.address,
      newPvz.open_time,
      newPvz.close_time,
    );
    if (result.success) {
      userStates.delete(userId);
      await sendMessage(
        userId,
        NOTIFICATIONS.PVZ_ADDED(newPvz),
        getAdminKeyboard(),
      );
      return;
    } else {
      await sendMessage(userId, "⏳", { buttons: [], one_time: false });
      await sendMessage(
        userId,
        NOTIFICATIONS.ERROR,
        getAdminKeyboard(),
      );
      return;
    }
    return;
  } else if (clearText === COMMANDS.EDIT) { 
    userStates.delete(userId);
    userStates.set(userId, "adminWaitingPvzId", {});
    await sendMessage(userId, NOTIFICATIONS.WAITING_PVZ_ID, getCancelKeyboard());
  }
}

module.exports = {
  adminWaitingСonfirmation
}
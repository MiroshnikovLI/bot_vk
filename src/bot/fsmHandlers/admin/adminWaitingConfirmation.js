const { cleanText, parseScheduleTime } = require("../../../utils/helpers");
const {
  getCancelKeyboard,
  getAdminKeyboard,
  getWaitingСonfirmationKeyboard,
} = require("../../../keyboards/keyboards");
const { userStates } = require("../../../state/stateManager");
const { sendMessage } = require("../../../config/vkApi");
const { NOTIFICATIONS, COMMANDS, OPERATION_CANCELLED } = require("../../../constants/index");
const { addPvzToDb } = require('../../../services/pvzService');

async function adminWaitingСonfirmation(userId, text) {
  const clearText = cleanText(text);
  const state = userStates.get(userId);
  const newPvz = {
      id: state.pvz_id,
      address: `${state.address.city}, ${state.address.street}, ${state.address.house}`,
      city: state.address.city,
      street: state.address.street,
      house: state.address.house,
      streetNormalized: state.address.streetNormalized,
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
      newPvz.city,
      newPvz.street,
      newPvz.house,
      newPvz.streetNormalized,
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
      console.log(result.message, 'error')
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
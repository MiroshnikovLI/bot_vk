const { cleanText } = require("../../../../utils/index");
const { getCancelKeyboard, adminKeyboards } = require("../../../../keyboards/index");
const { userStates } = require("../../../../state/stateManager");
const { sendMessage } = require("../../../../config/vkApi");
const { NOTIFICATIONS, COMMANDS, STATES } = require("../../../../constants/index");
const { addPvzToDb } = require('../../../../services/index');

async function waitingСonfirmation(userId, text) {
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
  
  if (clearText === COMMANDS.COMMON.CANCELLATION.TEXT) {
    userStates.delete(userId);
    await sendMessage(userId, NOTIFICATIONS.OPERATION_CANCELLED, adminKeyboards.pvzMenu());
    return;
  }

  if (clearText === COMMANDS.ADMIN.YES_DATA_IS_CORRECT.TEXT) {
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
        adminKeyboards.pvzMenu(),
      );
      return;
    } else {
      await sendMessage(userId, "⏳", { buttons: [], one_time: false });
      await sendMessage(
        userId,
        NOTIFICATIONS.ERROR,
        adminKeyboards.pvzMenu(),
      );
      return;
    }
    return;
  } else if (clearText === COMMANDS.ADMIN.EDIT.TEXT) { 
    userStates.delete(userId);
    userStates.set(userId, STATES.WAITING_PVZ_ID, {});
    await sendMessage(userId, NOTIFICATIONS.WAITING_PVZ_ID, getCancelKeyboard());
  }
}

module.exports = {
  waitingСonfirmation
}
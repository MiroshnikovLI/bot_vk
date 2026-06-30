const { userStates } = require("../../../../state/stateManager");
const { sendMessage } = require("../../../../config/vkApi");
const { cleanText } = require("../../../../utils/index");
const { adminKeyboards, getCancelKeyboard } = require('../../../../keyboards/index');
const { getAllPvzs, setActivePvzFromDb } = require('../../../../services/index');
const { NOTIFICATIONS, COMMANDS } = require("../../../../constants/index");

async function waitingActivePvzId(userId, text) {
  const clearText = cleanText(text);
  const state = userStates.get(userId);
  const status = state.status === 'restore' ? true : false;
  let result;

  if(clearText === COMMANDS.COMMON.CANCELLATION.TEXT) {
    userStates.delete(userId);
    await sendMessage(
      userId,
      NOTIFICATIONS.OPERATION_CANCELLED,
      adminKeyboards.pvzMenu(),
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

  if (!pvz.success) {
    await sendMessage(
      userId,
      NOTIFICATIONS.NO_RECEIVE_PVZ,
      adminKeyboards.pvzMenu(),
    );
    return;
  }

  const selectPvz = pvz.data.find(p => Number(p.pvz_id) === Number(clearText));

  if (!selectPvz) {
    await sendMessage(
      userId,
      NOTIFICATIONS.NOT_FOUND_OR_DEACTIVATED_EARLIER,
      adminKeyboards.pvzMenu(),
    );
    return;
  }

  if (state.status === 'restore') {
    if (selectPvz.is_active) {
      userStates.delete(userId);
      await sendMessage(userId, NOTIFICATIONS.STATUS_PVZ(selectPvz), adminKeyboards.pvzMenu());
      return;
    }
    const rest = await setActivePvzFromDb(selectPvz.pvz_id, true);
    result = rest;
  } else {
    if (!selectPvz.is_active) {
      userStates.delete(userId);
      await sendMessage(userId, NOTIFICATIONS.STATUS_PVZ(selectPvz), adminKeyboards.pvzMenu());
      return;
    }
    const rest = await setActivePvzFromDb(selectPvz.pvz_id, false);
    result = rest;
  }

  if (result.success) {
    await sendMessage(
      userId,
      NOTIFICATIONS.SET_ACTIVE_PVZ_SUCCESSFULLY(result.data, status),
      adminKeyboards.pvzMenu(),
    );
    return;
  } else {
    await sendMessage(
      userId,
      NOTIFICATIONS.ERROR_ACTIVE_PVZ(status),
      adminKeyboards.pvzMenu(),
    );
    return;
  }
  userStates.delete(userId);
}

module.exports = {
  waitingActivePvzId,
};

const { cleanText, isValidWbId } = require("../../../../utils/index");
const {
  getAllUsers,
  getUserReplacements,
  isUserAdmin,
  createShiftReport,
  findManager,
  getUserVkId,
} = require("../../../../services/index");
const {
  userKeyboards,
  getCancelKeyboard,
  createParameterKeyboard,
} = require("../../../../keyboards/index");
const { userStates } = require("../../../../state/stateManager");
const { sendMessage } = require("../../../../config/vkApi");
const {
  NOTIFICATIONS,
  COMMANDS,
  STATES,
} = require("../../../../constants/index");

async function waitingSelectingReplacementInChat(userId, text, payload) {
  const state = userStates.get(userId);
  const clearText = cleanText(text);
  const massUsers = await getAllUsers();
  const user = await getUserVkId(userId);
  const isAdmin = await isUserAdmin(userId);
  const pvz = state.pvz;
  const reportType = state.reportType;
  const fixedReplacement = state.fixedReplacement;
  const validWdId = isValidWbId(clearText);
  const numberOnly = () => /^\d+$/.test(clearText);
  let result = [];

  if (clearText === COMMANDS.COMMON.CANCELLATION.TEXT) {
    userStates.delete(userId);
    await sendMessage(
      userId,
      NOTIFICATIONS.OPERATION_CANCELLED,
      userKeyboards.main(isAdmin),
    );
    return;
  }

  if (payload) {
    try {
      const data = JSON.parse(payload);
      if (pvz && createShiftReport) {
        userStates.set(userId, STATES.WAITING_RATE_PVZ_IN_CHAT, {pvz, user, fixedReplacement, reportType, replecament: data.replacement});
        await sendMessage(
          userId,
          NOTIFICATIONS.CHOOSE_RATE_PVZ(pvz, data.replacement),
          userKeyboards.ratePvz(pvz.rate),
        );
        return;
      }
    } catch {
      await sendMessage(
        userId,
        NOTIFICATIONS.TECHNICAL_ERROR,
        userKeyboards.main(isAdmin),
      );
      return;
    }
  }

  if (state.replecament) {
    const message = [];
    state.replecament.forEach((e) => {
      message.push(`${NOTIFICATIONS.DATA_REPLACEMENT(e)}`);
    });
    if (!numberOnly()) {
      await sendMessage(
        userId,
        `${NOTIFICATIONS.ERROR_ID_USER} + ${message}`,
        getCancelKeyboard(),
      );
      return;
    }
    const userReplecament = state.replecament.find(
      (p) => Number(p.id) === Number(text),
    );
    if (!userReplecament) {
      await sendMessage(
        userId,
        `${NOTIFICATIONS.USER_ID_NOT_FOUND(clearText)} ${message}`,
        getCancelKeyboard(),
      );
      return;
    }

    if (pvz && createShiftReport) {
      userStates.set(userId, STATES.WAITING_RATE_PVZ_IN_CHAT, {pvz, user, fixedReplacement, reportType, replecament: userReplecament});
      await sendMessage(
        userId,
        NOTIFICATIONS.CHOOSE_RATE_PVZ(pvz, userReplecament),
        userKeyboards.ratePvz(pvz.rate),
      );
      return;
    }
    await sendMessage(
      userId,
      NOTIFICATIONS.DATA_REPLACEMENT(userReplecament),
      getCancelKeyboard(),
    );
    return;
  }

  if (state.resultNotFind) {
    if (clearText === COMMANDS.COMMON.ENTER_MANUALLY.TEXT) {
      userStates.set(userId, STATES.WAITING_WB_ID_REPLECEMENT, {pvz, user, reportType});
      await sendMessage(userId, NOTIFICATIONS.WAITING_WB_ID_REPLECEMENT, getCancelKeyboard());
      return;
    } else if (clearText === COMMANDS.COMMON.RETURN_SEARCH.TEXT) {
      userStates.set(userId, STATES.WAITING_SELECTING_REPLACEMENT_IN_CHAT, {pvz, user, reportType, fixedReplacement});
      await sendMessage(userId, NOTIFICATIONS.SHIFT_CLOSED(state.pvz.pvz_id, state.pvz.address), userKeyboards.replacement(state.fixedReplacement));
      return;
    }
  }

  if (numberOnly()) {
    const rest = await findManager(clearText, "id");
    result = rest;
  } else {
    const rest = await findManager(text, "name");
    result = rest;
  }

  if (result.success) {
    if (result.message === "Пользователь не найден") {
      const commands = [
        COMMANDS.COMMON.ENTER_MANUALLY.TEXT,
        COMMANDS.COMMON.RETURN_SEARCH.TEXT,
      ];
      userStates.set(userId, STATES.WAITING_SELECTING_REPLACEMENT_IN_CHAT, {
        pvz, user, fixedReplacement, reportType,
        replecament: result.data,
        resultNotFind: true,
      });
      await sendMessage(
        userId,
        NOTIFICATIONS.USER_NOT_FOUND(clearText),
        createParameterKeyboard(commands),
      );
      return;
    }
    if (result.data.length > 1) {
      userStates.set(userId, STATES.WAITING_SELECTING_REPLACEMENT_IN_CHAT, {pvz, user, reportType, fixedReplacement, replecament: result.data});
      const message = [
        `Введите ID пользователя который завтра выходит в смену`,
      ];
      result.data.forEach((e) => {
        message.push(`${NOTIFICATIONS.DATA_REPLACEMENT(e)}`);
      });
      await sendMessage(userId, `${message}`, getCancelKeyboard());
      return;
    } else {
      if (pvz && createShiftReport) {
        userStates.set(userId, STATES.WAITING_RATE_PVZ_IN_CHAT, {pvz, user, reportType, fixedReplacement, replecament: result.data[0]});
        await sendMessage(
          userId,
          NOTIFICATIONS.CHOOSE_RATE_PVZ(pvz, result.data[0]),
          userKeyboards.ratePvz(pvz.rate),
        );
        return;
      }
    }
  }

  userStates.delete(userId);
  await sendMessage(
    userId,
    NOTIFICATIONS.TECHNICAL_ERROR,
    userKeyboards.main(isAdmin),
  );
  return;
}

module.exports = {
  waitingSelectingReplacementInChat,
};

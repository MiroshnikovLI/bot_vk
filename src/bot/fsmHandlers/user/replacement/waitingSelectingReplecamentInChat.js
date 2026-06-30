const { cleanText, extractIdAndName } = require("../../../../utils/index");
const { getAllUsers, getUserReplacements, isUserAdmin, createShiftReport } = require("../../../../services/index");
const { userKeyboards } = require("../../../../keyboards/index");
const { userStates } = require('../../../../state/stateManager');
const { sendMessage } = require('../../../../config/vkApi');
const { NOTIFICATIONS, COMMANDS, STATES } = require('../../../../constants/index');

async function waitingSelectingReplacementInChat(
  userId,
  text,
) {
  const state = userStates.get(userId);
  const clearText = cleanText(text);
  const massUsers = await getAllUsers();
  const chatUsers = massUsers.data.find((p) => Number(p.vk_id) === userId);
  const userReplecament = await getUserReplacements(chatUsers.id);
  const isAdmin = await isUserAdmin(userId);
  const selectPvz = state.pvz;
  const { id, name } = extractIdAndName(text);
  
  const selectedReplecament = massUsers.data.find((p) => {
    if (name === "") {
      return Number(p.wb_id) === Number(id);
    }
    return (
      Number(p.wb_id) === Number(id) ||
      p.full_name.toLowerCase().includes(name.toLowerCase())
    );
  });

  if (clearText === COMMANDS.COMMON.CANCELLATION.TEXT) {
    userStates.delete(userId);
    await sendMessage(userId, NOTIFICATIONS.OPERATION_CANCELLED, userKeyboards.main(isAdmin));
    return;
  }
  if(!selectedReplecament) {
    await sendMessage(
      userId,
      NOTIFICATIONS.USER_NOT_FOUND(clearText),
      userKeyboards.replacement(userReplecament, state.reportType),
    );
    return;
  }
  if (selectPvz && createShiftReport) {
    userStates.set(userId, STATES.WAITING_RATE_PVZ_IN_CHAT, { pvz: selectPvz, user: chatUsers, replecament: selectedReplecament, reportType: state.reportType});
    await sendMessage(userId, NOTIFICATIONS.CHOOSE_RATE_PVZ, userKeyboards.ratePvz(selectPvz.rate));
    return;
  } else {
    await sendMessage(
      userId,
      NOTIFICATIONS.CHOOSE_REPLACEMENT,
      userKeyboards.replacement(userReplecament, state.reportType),
    );
  }
}

module.exports = {
  waitingSelectingReplacementInChat,
};

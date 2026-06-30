const { cleanText } = require("../../../../utils/index");
const { getUserPvzs, getUserReplacements, getUserVkId, isUserAdmin, createShiftReport } = require("../../../../services/index");
const { getCancelKeyboard, userKeyboards } = require("../../../../keyboards/index");
const { userStates } = require('../../../../state/stateManager');
const { sendMessage } = require('../../../../config/vkApi');
const { NOTIFICATIONS, COMMANDS } = require('../../../../constants/index');

async function waitingSelectingPvzInChat(
  userId,
  text,
) {
  const state = userStates.get(userId);
  const clearText = cleanText(text);
  const chatUser = await getUserVkId(userId);
  const chatPvzs = await getUserPvzs(chatUser.id);
  const chatReplecament = await getUserReplacements(chatUser.id);
  const isAdmin = await isUserAdmin(userId);
  const selectedPvz = chatPvzs.find(
    (p) => p.pvz_id === text.trim() || text.includes(p.pvz_id),
  );

  if (clearText === COMMANDS.COMMON.CANCELLATION.TEXT) {
    userStates.delete(userId);
    await sendMessage(userId, NOTIFICATIONS.OPERATION_CANCELLED, userKeyboards.main(isAdmin));
    return;
  } else {
    if (selectedPvz && createShiftReport) {
      if (state.reportType === "open") {
        await createShiftReport(
          userId,
          chatUser,
          selectedPvz,
          "selectedReplecament",
          state.reportType,
        );
      }
    } else {
      await sendMessage(userId, NOTIFICATIONS.PVZ_NOT_FOUND_SEARCH(clearText), { buttons: [], one_time: false });
      await sendMessage(
        userId,
        NOTIFICATIONS.CHOOSE_PVZ,
        userKeyboards.pvz(chatPvzs, state.reportType),
      );
    }
  }
}

module.exports = {
  waitingSelectingPvzInChat,
};

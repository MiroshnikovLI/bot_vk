const { cleanText } = require("../../../utils/helpers");
const { getUserVkId } = require("../../../services/userService");
const { getUserPvzs, getUserReplacements } = require("../../../services/pvzService");
const {
  getPrivateKeyboard,
  getCancelKeyboard,
  getReplacementKeyboard,
  getPvzKeyboard,
} = require("../../../keyboards/keyboards");
const { userStates } = require('../../../state/stateManager');
const { sendMessage } = require('../../../config/vkApi');
const { OPERATION_CANCELLED, NOTIFICATIONS, COMMANDS } = require('../../../constants/index');
const { createShiftReport } = require('../../../handlers/handleChatReport');

async function selectingPvzInChat(
  userId,
  text,
) {
  const state = userStates.get(userId);
  const clearText = cleanText(text);
  const chatUser = await getUserVkId(userId);
  const chatPvzs = await getUserPvzs(chatUser.id);
  const chatReplecament = await getUserReplacements(chatUser.id);
  const selectedPvz = chatPvzs.find(
    (p) => p.pvz_id === text.trim() || text.includes(p.pvz_id),
  );

  if (clearText === COMMANDS.CANCELLATION) {
    userStates.delete(userId);
    await sendMessage(userId, OPERATION_CANCELLED, await getPrivateKeyboard(userId));
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
        getPvzKeyboard(chatPvzs, state.reportType),
      );
    }
  }
}

module.exports = {
  selectingPvzInChat,
};

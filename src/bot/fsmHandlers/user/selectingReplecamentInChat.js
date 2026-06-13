const { cleanText, extractIdAndName } = require("../../../utils/helpers");
const { getAllUsers } = require("../../../services/userService");
const { getUserReplacements } = require("../../../services/pvzService");
const {
  getPrivateKeyboard,
  getReplacementKeyboard,
} = require("../../../keyboards/keyboards");
const { userStates } = require('../../../state/stateManager');
const { sendMessage } = require('../../../config/vkApi');
const { createShiftReport } = require('../../../handlers/handleChatReport');
const { OPERATION_CANCELLED, NOTIFICATIONS, COMMANDS } = require('../../../constants/index');

async function selectingReplacementInChat(
  userId,
  text,
) {
  const state = userStates.get(userId);
  const clearText = cleanText(text);
  const massUsers = await getAllUsers();
  const chatUsers = massUsers.data.find((p) => Number(p.vk_id) === userId);
  const userReplecament = await getUserReplacements(chatUsers.id);
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

  if (clearText === COMMANDS.CANCELLATION) {
    userStates.delete(userId);
    await sendMessage(userId, OPERATION_CANCELLED, await getPrivateKeyboard(userId));
    return;
  }
  if(!selectedReplecament) {
    await sendMessage(
      userId,
      NOTIFICATIONS.USER_NOT_FOUND(clearText),
      getReplacementKeyboard(userReplecament, state.reportType),
    );
    return;
  }
  if (selectPvz && createShiftReport) {
    await createShiftReport(
      userId,
      chatUsers,
      selectPvz,
      selectedReplecament,
      state.reportType,
    );
  } else {
    await sendMessage(
      userId,
      NOTIFICATIONS.CHOSE_REPLECAMENT,
      getReplacementKeyboard(userReplecament, state.reportType),
    );
  }
}

module.exports = {
  selectingReplacementInChat,
};

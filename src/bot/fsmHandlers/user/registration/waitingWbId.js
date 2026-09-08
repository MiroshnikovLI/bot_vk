const {
  userKeyboards,
  createParameterKeyboard,
} = require("../../../../keyboards/index");
const {
  updateUserWbId,
  addReplacementDb,
} = require("../../../../services/index");
const { userStates } = require("../../../../state/stateManager");
const { sendMessage } = require("../../../../config/vkApi");
const { NOTIFICATIONS, STATES } = require("../../../../constants/index");
const { COMMANDS } = require("../../../../constants/index");
const { cleanText, isValidWbId } = require("../../../../utils/index");
const {
  deleteIncompleteUser,
  updateVkIdByWbId,
  getUserVkId,
} = require("../../../../services/user/userService");

async function waitingWbId(userId, text) {
  const clearText = cleanText(text);
  const state = userStates.get(userId);
  const deleteStates = () => userStates.delete(userId);
  const emptyKeyboard = { buttons: [], one_time: false };
  const user = await getUserVkId(userId);
  
  const validWb = isValidWbId(clearText);

  if (state.choice) {
    if (clearText === COMMANDS.COMMON.YES.TEXT) {
      const deleteIncomplete = await deleteIncompleteUser(userId);

      if (!deleteIncomplete.success) {
        await sendMessage(userId, NOTIFICATIONS.TECHNICAL_ERROR, emptyKeyboard);
        return;
      }

      const updateUser = await updateVkIdByWbId(userId, state.wbId);
      const replacement = await addReplacementDb(updateUser.data.id);

      if (updateUser.success && replacement.success) {
        deleteStates();
        await sendMessage(
          userId,
          NOTIFICATIONS.DATA_SUCCESSFULLY_TRANSFERRED,
          userKeyboards.main(),
        );
        return;
      } else {
        deleteStates();
        await sendMessage(userId, NOTIFICATIONS.TECHNICAL_ERROR, emptyKeyboard);
        return;
      }
    }

    if (clearText === COMMANDS.COMMON.NO.TEXT) {
      userStates.set(userId, STATES.WAITING_WB_ID)
      await sendMessage(userId, NOTIFICATIONS.WAITING_WB_ID, emptyKeyboard);
      return;
    }
    await sendMessage(userId, NOTIFICATIONS.INVALID_YES_NO_RESPONSE, createParameterKeyboard([COMMANDS.COMMON.YES, COMMANDS.COMMON.NO], false));
    return;
  }

  if (!validWb.success) {
    await sendMessage(userId, validWb.message, emptyKeyboard);
    return;
  }

  const wbId = await updateUserWbId(userId, text);
  if (wbId.success) {
    if (!user.phone) {
      userStates.set(userId, STATES.WAITING_PHONE);
      await sendMessage(userId, NOTIFICATIONS.WB_ID_SWCCESSFULLY_WAITING_PHONE(user.full_name, text), emptyKeyboard);
      return;
    }
    deleteStates();
    await sendMessage(
      userId,
      NOTIFICATIONS.PROFILE_COMPLETED_SUCCESSFULLY(user.full_name, text, user.phone),
      userKeyboards.main(),
    );
  } else {
    if (wbId.message === "Этот WB ID уже используется сменщиком") {
      userStates.set(userId, STATES.WAITING_WB_ID, {
        choice: true,
        wbId: text,
      });
      await sendMessage(
        userId,
        NOTIFICATIONS.WB_ID_USER_REPLACEMENT(text, wbId.data),
        createParameterKeyboard([COMMANDS.COMMON.YES, COMMANDS.COMMON.NO], false),
      );
      return;
    }
    await sendMessage(
      userId,
      NOTIFICATIONS.WB_ID_USER_USER(text),
      emptyKeyboard,
    );
  }
}

module.exports = { waitingWbId };

const { getUserVkId, getUserReplacements, getUserPvzs, hasUserReportedToday, isUserAdmin, createShiftReport } = require("../../../services/index");
const { sendMessage } = require("../../../config/vkApi");
const { userStates } = require("../../../state/stateManager");
const { NOTIFICATIONS, STATES } = require("../../../constants/index");
const { userKeyboards } = require("../../../keyboards/index");

async function handlerChatReport(userId, reportType) {
  const user = await getUserVkId(userId);
  const shiftsReport = await hasUserReportedToday(user.id);
  const pvzs = await getUserPvzs(user.id);
  const replecament = await getUserReplacements(user.id);
  const isAdmin = await isUserAdmin(userId);
  const pvzOpen = pvzs.find((p) => p.id === shiftsReport.data?.pvz_id);

  if (!user || !user.full_name || !user.wb_id) {
    await sendMessage(
      userId,
      NOTIFICATIONS.PROFILE_NOT_FILLED,
      userKeyboards.editProfile(),
    );
    return;
  }

  if (pvzs.length === 0) {
    await sendMessage(userId, NOTIFICATIONS.NO_PVZ, userKeyboards.unsubscribe());
    return;
  }

  if (shiftsReport.message === "Все отчёты закрыты") {
    await sendMessage(
      userId,
      NOTIFICATIONS.GOOD_WORK,
      userKeyboards.main(isAdmin),
    );
    return;
  }

  if (reportType === "close") {
    if (!pvzOpen) {
      await sendMessage(
        userId,
        NOTIFICATIONS.NO_OPEN_SHIFTS,
        userKeyboards.main(isAdmin),
      );
      return;
    }

    userStates.set(userId, STATES.WAITING_SELECTING_REPLACEMENT_IN_CHAT, {
      pvz: pvzOpen,
      reportType,
      userId,
    });
    await sendMessage(
      userId,
      NOTIFICATIONS.SHIFT_CLOSED(pvzOpen.pvz_id, pvzOpen.address),
      userKeyboards.replacement(replecament, reportType),
    );
    return;
  }

  if (reportType === "open") {
    if (pvzOpen && shiftsReport.message === "Есть открытый отчёт") {
      await sendMessage(
        userId,
        NOTIFICATIONS.OPEN_SHIFT_EXISTS(pvzOpen.pvz_id, pvzOpen.address),
        userKeyboards.main(isAdmin),
      );
      return;
    }
    if (pvzs.length === 1) {
      await createShiftReport(userId, user, pvzs[0], replecament, reportType);
      return;
    } else {
      userStates.set(userId, STATES.WAITING_SELECTING_PVZ_IN_CHAT, {
        reportType,
        userId,
      });
      await sendMessage(
        userId,
        NOTIFICATIONS.CHOOSE_PVZ,
        userKeyboards.pvz(pvzs, reportType),
      );
      return;
    }
  }
}

module.exports = {
  handlerChatReport,
};

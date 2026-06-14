const { getUserVkId } = require("../services/userService");
const {
  getUserReplacements,
  getUserPvzs,
} = require("../services/pvzService");
const {
  hasUserReportedToday,
  addShiftReport,
} = require("../services/reportService");
const { sendMessage } = require("../config/vkApi");
const {
  getEditProfileKeyboard,
  getUnsubscribeKeyboard,
  getPrivateKeyboard,
  getReplacementKeyboard,
  getPvzKeyboard,
} = require("../keyboards/keyboards");
const { logAction } = require("../utils/logger");
const { userStates } = require("../state/stateManager");
const { NOTIFICATIONS } = require("../constants/message");
require("dotenv").config();

async function handleChatReport(userId, reportType) {
  const user = await getUserVkId(userId);
  const shiftsReport = await hasUserReportedToday(user.id);
  const pvzs = await getUserPvzs(user.id);
  const replecament = await getUserReplacements(user.id);
  const pvzOpen = pvzs.find((p) => p.id === shiftsReport.data?.pvz_id);

  if (!user || !user.full_name || !user.wb_id) {
    await sendMessage(
      userId,
      NOTIFICATIONS.PROFILE_NOT_FILLED,
      getEditProfileKeyboard(),
    );
    return;
  }

  if (pvzs.length === 0) {
    await sendMessage(userId, NOTIFICATIONS.NO_PVZ, getUnsubscribeKeyboard());
    return;
  }

  if (shiftsReport.message === "Все отчёты закрыты") {
    await sendMessage(
      userId,
      NOTIFICATIONS.GOOD_WORK,
      await getPrivateKeyboard(userId),
    );
    return;
  }

  if (reportType === "close") {
    if (!pvzOpen) {
      await sendMessage(
        userId,
        NOTIFICATIONS.NO_OPEN_SHIFTS,
        await getPrivateKeyboard(userId),
      );
      return;
    }

    userStates.set(userId, "selectingReplacementInChat", {
      pvz: pvzOpen,
      reportType,
      userId,
    });
    await sendMessage(
      userId,
      NOTIFICATIONS.SHIFT_CLOSED(pvzOpen.pvz_id, pvzOpen.address),
      getReplacementKeyboard(replecament, reportType),
    );
    return;
  }

  if (reportType === "open") {
    if (pvzOpen && shiftsReport.message === "Есть открытый отчёт") {
      await sendMessage(
        userId,
        NOTIFICATIONS.OPEN_SHIFT_EXISTS(pvzOpen.pvz_id, pvzOpen.address),
        await getPrivateKeyboard(userId),
      );
      return;
    }
    if (pvzs.length === 1) {
      await createShiftReport(userId, user, pvzs[0], replecament, reportType);
      return;
    } else {
      userStates.set(userId, "selectingPvzInChat", {
        reportType,
        userId,
      });
      await sendMessage(
        userId,
        NOTIFICATIONS.CHOOSE_PVZ,
        getPvzKeyboard(pvzs, reportType),
      );
      return;
    }
  }
}

async function createShiftReport(userId, user, pvz, replecament, reportType, rate) {
  const reportText = await NOTIFICATIONS.REPORT_TEXT(
    pvz,
    user,
    replecament,
    reportType,
    rate
  );

  const result = await addShiftReport(
    pvz.id,
    user.id,
    user.wb_id,
    user.full_name,
    reportType,
    reportText
  );

  await sendMessage(process.env.VK_CHAT_ID, `${reportText}`);
  await sendMessage(
    userId,
    reportType === "open"
      ? `✅ Смена открыта ${pvz.pvz_id}. Отчет отправлен`
      : `✅ Смена закрыта ${pvz.pvz_id}. Отчет отправлен`,
    await getPrivateKeyboard(userId),
  );
  await logAction(
    "report",
    user.id,
    `Создан отчет ${reportType} для ПВЗ ${pvz.pvz_id}`,
  );
  userStates.delete(userId);
}

module.exports = {
  handleChatReport,
  createShiftReport,
};

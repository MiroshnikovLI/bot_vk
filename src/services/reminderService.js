const { getThereIsNoReport } = require('../services/reportService');
const { getUserVkId } = require('./userService');
const { NOTIFICATIONS } = require('../constants/message');

async function handleToRemind (userId, reportType) {
  const report = await getThereIsNoReport(reportType);
  const user = await getUserVkId(userId);

  if (report.success) {
    const reportMessage = await NOTIFICATIONS.REMIND_SHIFT(
      report.data,
      reportType,
      user,
    );
    return { success: true, message: reportMessage };
  }

  return { success: false, message: "Все пункты отписались" };
};

module.exports = {
  handleToRemind
}
const { getThereIsNoReport } = require('../report/reportService');
const { getUserVkId } = require('../user/userService');
const { NOTIFICATIONS } = require('../../constants/index');

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
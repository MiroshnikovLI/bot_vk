const { sendMessage } = require('../../../config/vkApi');
const { NOTIFICATIONS } = require('../../../constants/index');
const { adminKeyboards } = require('../../../keyboards/index');
const { getAllPvzs, getAllTheReportsForToday, getAllUsers } = require('../../../services/index');

async function handlerPvzClosureReport(userId) {
  const report = await getAllTheReportsForToday('close');
  const LIST_PVZ = await getAllPvzs();
  const listUsers = await getAllUsers();

  if(report.success) {
    const reportMessage = await NOTIFICATIONS.SHIFT_REPORT(LIST_PVZ.data, listUsers.data, report.data);
    await sendMessage(userId, reportMessage, adminKeyboards.unsubscriptions())
  } else {
    await sendMessage(userId, NOTIFICATIONS.NO_REPORT_TO_DAY, adminKeyboards.unsubscriptions())
  }
}

module.exports = {
  handlerPvzClosureReport
}
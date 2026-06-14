const { sendMessage } = require('../../config/vkApi');
const { NO_ACCESS_RIGHTS, NOTIFICATIONS } = require('../../constants/message');
const { getPrivateKeyboard, getUnsubscriptionsKeyboard } = require('../../keyboards/keyboards');
const { getAllPvzs } = require('../../services/pvzService');
const { getAllTheReportsForToday } = require('../../services/reportService');
const { getAllUsers } = require('../../services/userService');

async function handlePVZClosureReport(userId, isAdmin) {
  if(!isAdmin) {
    sendMessage(userId, NO_ACCESS_RIGHTS, await getPrivateKeyboard(userId));
  }

  const report = await getAllTheReportsForToday('close');
  const LIST_PVZ = await getAllPvzs();
  const listUsers = await getAllUsers();

  if(report.success) {
    const reportMessage = await NOTIFICATIONS.SHIFT_REPORT(LIST_PVZ.data, listUsers.data, report.data);
    await sendMessage(userId, reportMessage, getUnsubscriptionsKeyboard())
  } else {
    await sendMessage(userId, NOTIFICATIONS.NO_REPORT_TO_DAY, getUnsubscriptionsKeyboard())
  }
}

module.exports = {
  handlePVZClosureReport
}
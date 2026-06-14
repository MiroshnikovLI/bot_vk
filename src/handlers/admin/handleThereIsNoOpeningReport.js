const { sendMessage } = require('../../config/vkApi');
const { NO_ACCESS_RIGHTS, NOTIFICATIONS } = require('../../constants/message');
const { getPrivateKeyboard, getUnsubscriptionsKeyboard } = require('../../keyboards/keyboards');
const { getThereIsNoReport } = require('../../services/reportService');

async function handleThereIsNoOpeningReport(userId, isAdmin) {
  if(!isAdmin) {
    await sendMessage(userId, NO_ACCESS_RIGHTS, await getPrivateKeyboard(userId));
  }

  const report = await getThereIsNoReport('open');

  if(report.success) {
    const reportMessage = await NOTIFICATIONS.NO_REPORT(report.data, 'open')
    await sendMessage(userId, reportMessage, getUnsubscriptionsKeyboard())
  } else {
    await sendMessage(userId, NOTIFICATIONS.PVZ_ALL_UNSUBSCRIBED, getUnsubscriptionsKeyboard())
  }
}

module.exports = {
  handleThereIsNoOpeningReport
}
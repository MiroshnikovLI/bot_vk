const { sendMessage } = require('../../../config/vkApi');
const { NOTIFICATIONS } = require('../../../constants/index');
const { adminKeyboards } = require('../../../keyboards/index');
const { getThereIsNoReport } = require('../../../services/index');

async function handlerThereIsNoOpeningReport(userId) {
  const report = await getThereIsNoReport('open');

  if(report.success) {
    const reportMessage = await NOTIFICATIONS.NO_REPORT(report.data, 'open')
    await sendMessage(userId, reportMessage, adminKeyboards.unsubscriptions())
  } else {
    await sendMessage(userId, NOTIFICATIONS.PVZ_ALL_UNSUBSCRIBED, adminKeyboards.unsubscriptions())
  }
}

module.exports = {
  handlerThereIsNoOpeningReport
}
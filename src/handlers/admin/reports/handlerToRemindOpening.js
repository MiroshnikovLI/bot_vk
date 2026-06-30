const { sendMessage } = require('../../../config/vkApi');
const { NOTIFICATIONS } = require('../../../constants/index');
const { handleToRemind, getUserVkId } = require('../../../services/index');
const { adminKeyboards } = require('../../../keyboards/index');

async function handlerToRemindOpening(userId) {
  const report = await handleToRemind(userId, 'open');

  if (report.success) {
    await sendMessage(process.env.VK_CHAT_ID, `${report.message}`)
    await sendMessage(userId, NOTIFICATIONS.REPORT_SENT)
  } else {
    await sendMessage(userId, `${report.message}`, adminKeyboards.unsubscriptions())
  }
}

module.exports = {
  handlerToRemindOpening
}
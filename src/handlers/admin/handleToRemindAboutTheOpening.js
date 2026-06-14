const { sendMessage } = require('../../config/vkApi');
const { NO_ACCESS_RIGHTS, NOTIFICATIONS } = require('../../constants/message');
const { handleToRemind } = require('../../services/reminderService');
const { getPrivateKeyboard, getUnsubscriptionsKeyboard } = require('../../keyboards/keyboards');
const { getUserVkId } = require('../../services/userService');
require("dotenv").config();

async function handleToRemindAboutTheOpening(userId, isAdmin) {
  if(!isAdmin) {
    sendMessage(userId, NO_ACCESS_RIGHTS, await getPrivateKeyboard(userId));
  }

  const report = await handleToRemind(userId, 'open');

  if (report.success) {
    await sendMessage(process.env.VK_CHAT_ID, `${report.message}`)
    await sendMessage(userId, NOTIFICATIONS.REPORT_SENT)
  } else {
    await sendMessage(userId, `${report.message}`, getUnsubscriptionsKeyboard())
  }
}

module.exports = {
  handleToRemindAboutTheOpening
}
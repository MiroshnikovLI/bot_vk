const { sendMessage } = require('../../config/vkApi');
const { getUnsubscribeKeyboard } = require('../../keyboards/keyboards');
const { UNSUBSCRIBE_SETTINGS } = require('../../constants/message');

async function handleUnsubscribeSettings(userId) {
  await sendMessage(userId, UNSUBSCRIBE_SETTINGS, getUnsubscribeKeyboard());
}


module.exports = {
  handleUnsubscribeSettings
}
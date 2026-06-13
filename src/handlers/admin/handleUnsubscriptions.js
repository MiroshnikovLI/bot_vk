const { getUnsubscriptionsKeyboard } = require('../../keyboards/keyboards');
const { sendMessage } = require('../../config/vkApi');
const { NO_ACCESS_RIGHTS, UNSUBSCRIBE_MENU } = require('../../constants/message');

async function handleUnsubscriptions(userId, isAdmin) {
  if (!isAdmin) {
    await sendMessage(userId, NO_ACCESS_RIGHTS, await getPrivateKeyboard(userId));
    return;
  }

  await sendMessage(userId, UNSUBSCRIBE_MENU, getUnsubscriptionsKeyboard());
}

module.exports = {
  handleUnsubscriptions
}
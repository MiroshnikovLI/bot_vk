const { getUserVkId } = require('../services/userService');
const { sendMessage } = require('../config/vkApi');
const { START, MY_DATA } = require('../constants/index');
const { userStates } = require('../state/stateManager');

async function handleStart(userId) {
  const user = await getUserVkId(userId);
  if (!user) {
    userStates.set(userId, "waitingFullName");
    await sendMessage(userId, START,);
    return;
  }

  await sendMessage(userId, MY_DATA(user, {}, {}));
}

module.exports = { handleStart }
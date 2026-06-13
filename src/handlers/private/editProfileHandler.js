const { getEditProfileKeyboard } = require('../../keyboards/keyboards');
const { sendMessage } = require('../../config/vkApi');
const { CHANGE_DATA } = require('../../constants/message');

async function editProfileHandler(userId) {
  await sendMessage(userId, CHANGE_DATA, getEditProfileKeyboard());
}

module.exports = {
  editProfileHandler
}
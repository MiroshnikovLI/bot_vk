const { buildKeyboard } = require('../buildKeyboard/buildKeyboard');
const { getAdminKeyboards } = require('../common/common');
const { USER } = require('../../constants/commands/user');
const { COMMON } = require('../../constants/commands/common');
const { ratePvz } = require('./ratePvz');
const { replacement } = require('./replecament');
const { pvz } = require('./pvz');

function editProfile() {
  return buildKeyboard(USER.EDIT_PROFILE);
}

function settings() {
  return buildKeyboard(USER.SETTINGS);
}

function unsubscribe() {
  return buildKeyboard(USER.UNSUBSCRIBE);
}

function main(isAdmin = false) {
  const mainMass = {...USER.USER_HOME, LIST_CHATS: COMMON.LIST_CHATS};
  const keyboard = buildKeyboard(mainMass);

  if (isAdmin) {
    keyboard.buttons.push(...getAdminKeyboards().buttons)
  }

  return keyboard
}

const userKeyboards = {
  main,
  editProfile,
  ratePvz,
  replacement,
  unsubscribe,
  pvz,
  settings,
}

module.exports = { userKeyboards };
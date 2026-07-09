const { ADMIN } = require('../../constants/commands/admin');
const { buildKeyboard } = require('../buildKeyboard/buildKeyboard');
const { COMMON } = require('../../constants/commands/common');

function adminMenu() {
  return buildKeyboard(ADMIN.ADMIN_HOME)
}

function managerMenu() { 
  return buildKeyboard(ADMIN.MANAGER_MENU, 1)
}

function pvzMenu() {
  return buildKeyboard(ADMIN.PVZ_MENU)
}

function settingsListChats() {
  const massListChats = {...ADMIN.LIST_CHATS_MENU, LIST_CHATS: COMMON.LIST_CHATS}
  return buildKeyboard(massListChats)
}

function unsubscriptions() {
  return buildKeyboard(ADMIN.UNSUBSCRIPTIONS_MENU)
}

function waitingParameter() {
  return buildKeyboard(ADMIN.LIST_EDIT, 1)
}

const adminKeyboards = {
  managerMenu,
  waitingParameter,
  settingsListChats,
  unsubscriptions,
  pvzMenu,
  adminMenu,
}

module.exports = { adminKeyboards }
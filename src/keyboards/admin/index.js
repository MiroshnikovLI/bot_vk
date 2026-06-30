const { managerMenu } = require('./managerMenu');
const { waitingParameter } = require('./waitingParameter');
const { settingsListChats } = require('./settingsListChats');
const { waitingСonfirmation } = require('./waitingConfirmation');
const { unsubscriptions } = require('./unsubscriptions');
const { pvzMenu } = require('./pvzMenu');
const { adminMenu } = require('./adminMenu');

const adminKeyboards = {
  managerMenu,
  waitingParameter,
  settingsListChats,
  waitingСonfirmation,
  unsubscriptions,
  pvzMenu,
  adminMenu,
}

module.exports = { adminKeyboards }
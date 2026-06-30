const { adminKeyboards}  = require('./admin/index');
const { userKeyboards } = require('./user/index');
const { getCancelKeyboard } = require('./common');
const { getAdminKeyboards } = require('./common');
const { getBackKeyboards } = require('./common');

module.exports = {
  adminKeyboards,
  userKeyboards,
  getCancelKeyboard,
  getAdminKeyboards,
  getBackKeyboards
};

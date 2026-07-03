const { adminKeyboards } = require("./admin/index");
const { userKeyboards } = require("./user/index");
const {
  getCancelKeyboard,
  getAdminKeyboards,
  getBackKeyboards,
  createParameterKeyboard,
} = require("./common/common");

module.exports = {
  adminKeyboards,
  userKeyboards,
  getCancelKeyboard,
  getAdminKeyboards,
  getBackKeyboards,
  createParameterKeyboard,
};

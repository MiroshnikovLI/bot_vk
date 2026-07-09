const { adminKeyboards } = require("./admin/index");
const { userKeyboards } = require("./user/index");
const {
  getCancelKeyboard,
  getAdminKeyboards,
  createParameterKeyboard,
} = require("./common/common");

module.exports = {
  adminKeyboards,
  userKeyboards,
  getCancelKeyboard,
  getAdminKeyboards,
  createParameterKeyboard,
};

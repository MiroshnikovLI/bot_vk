const { COMMON } = require('./common');
const { ADMIN } = require('./admin');
const { ERROR } = require('./error');
const { PVZ } = require('./pvz');
const { USER } = require('./user');

const NOTIFICATIONS = {
  ...COMMON,
  ...ADMIN,
  ...ERROR,
  ...PVZ,
  ...USER,
}

module.exports = {
  NOTIFICATIONS
}
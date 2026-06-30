const { ADMIN } = require('./admin');
const { USER } = require('./user');
const { COMMON } = require('./common')

const COMMANDS = {
  ADMIN,
  USER,
  COMMON
}

module.exports = { COMMANDS };
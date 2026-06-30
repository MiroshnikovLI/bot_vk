const { main } = require('./main');
const { editProfile } = require('./editProfile');
const { ratePvz } = require('./ratePvz');
const { replacement } = require('./replecament');
const { unsubscribe } = require('./unsubscribe');
const { pvz } = require('./pvz');
const { settings } = require('./settings');

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
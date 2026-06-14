const { waitingWbId } = require('./user/waitingWbId');
const { waitingFullName } = require('./user/waitingFullName');
const { changeName } = require('./user/changeName');
const { changeWbId } = require('./user/changeWbId');
const { selectingPvzInChat } = require('./user/selectingPvzInChat');
const { selectingReplacementInChat } = require('./user/selectingReplecamentInChat');
const { selectingPvzToAdd } = require('./user/selectingPvzToAdd');
const { selectingPvzForRemoval } = require('./user/selectingPvzForRemoval');
const { addReplacement } = require('./user/addReplacement');
const { deletedReplacement } = require('./user/deletedReplacement');
const { adminWaitingPvzId } = require('./admin/adminWaitingPvzId');
const { adminWaitingDeletePvzId } = require('./admin/adminWaitingIdForDeletePvz');
const { adminWaitingPvzAdress } = require('./admin/adminWaitingPvzAdress');
const { adminWaitindWorkTime } = require('./admin/adminWaitindWorkTime');
const { adminWaitingСonfirmation } = require('./admin/adminWaitingConfirmation');
const { waitingRatePvzInChat } = require('./user/waitingRatePvzInChat');

module.exports = {
  waitingWbId,
  waitingFullName,
  changeName,
  changeWbId,
  selectingPvzInChat,
  selectingReplacementInChat,
  selectingPvzToAdd,
  selectingPvzForRemoval,
  addReplacement,
  deletedReplacement,
  adminWaitingPvzId,
  adminWaitingDeletePvzId,
  adminWaitingPvzAdress,
  adminWaitindWorkTime,
  adminWaitingСonfirmation,
  waitingRatePvzInChat
}
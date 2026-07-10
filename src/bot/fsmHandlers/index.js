// Пользователь
const { waitingWbId } = require('./user/registration/waitingWbId');
const { waitingFullName } = require('./user/registration/waitingFullName');
const { waitingChangeName } = require('./user/edit/waitingChangeName');
const { waitingSelectingPvzInChat } = require('./user/pvz/waitingSelectingPvzInChat');
const { waitingSelectingReplacementInChat } = require('./user/replacement/waitingSelectingReplecamentInChat');
const { waitingSelectingPvzToAdd } = require('./user/pvz/waitingSelectingPvzToAdd');
const { waitingSelectingPvzForRemoval } = require('./user/pvz/waitingSelectingPvzForRemoval');
const { waitingAddReplacement } = require('./user/replacement/waitingAddReplacement');
const { waitingDeleteReplacement } = require('./user/replacement/waitingDeleteReplacement');
const { waitingChangePhone } = require('./user/edit/waitingChangePhone');
const { waitingRatePvzInChat } = require('./user/pvz/waitingRatePvzInChat');
const { waitingWbIdReplacement } = require('./user/replacement/waitingWbIdReplacement');
const { waitingFullNameReplacement } = require('./user/replacement/waitingFullNameReplacement');
const { waitingNumberReplacement } = require('./user/replacement/waitingNumberReplacement');

// Админ
const { waitingPvzId } = require('./admin/pvz/waitingPvzId');
const { waitingActivePvzId } = require('./admin/pvz/waitingActivePvzId');
const { waitingPvzAdress } = require('./admin/pvz/waitingPvzAdress');
const { waitingWorkTime } = require('./admin/pvz/waitingWorkTime');
const { waitingСonfirmation } = require('./admin/pvz/waitingConfirmation');
const { waitingIdWorkChats } = require('./admin/chats/waitingIdWorkChats');
const { waitingParametrEditChat } = require('./admin/chats/waitingParametrEditChat');
const { waitingNameLink } = require('./admin/chats/waitingNameLink');
const { waitingLinkLink } = require('./admin/chats/waitingLinkLink');
const { waitingDescriptionLink } = require('./admin/chats/waitingDescriptionLink');
const { waitingIdDeleteChatLink } = require('./admin/chats/waitingIdDeleteChatLink');
const { waitingChatIdLink } = require('./admin/chats/waitingChatIdLink');
const { waitingInfoManager } = require('./admin/manager/waitingInfoManager');
const { waitingActiveManager } = require('./admin/manager/waitingActiveManager');

module.exports = {
  // Пользователь
  waitingWbId,
  waitingFullName,
  waitingChangeName,
  waitingSelectingPvzInChat,
  waitingSelectingReplacementInChat,
  waitingSelectingPvzToAdd,
  waitingSelectingPvzForRemoval,
  waitingAddReplacement,
  waitingDeleteReplacement,
  waitingChangePhone,
  waitingRatePvzInChat,
  waitingWbIdReplacement,
  waitingFullNameReplacement,
  waitingNumberReplacement,

  // Админ
  waitingPvzId,
  waitingActivePvzId,
  waitingPvzAdress,
  waitingWorkTime,
  waitingСonfirmation,
  waitingIdWorkChats,
  waitingParametrEditChat,
  waitingNameLink,
  waitingLinkLink,
  waitingDescriptionLink,
  waitingIdDeleteChatLink,
  waitingChatIdLink,
  waitingInfoManager,
  waitingActiveManager,
}
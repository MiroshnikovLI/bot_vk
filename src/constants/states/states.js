const STATES = {

  /** Админ */
  // Чаты
  WAITING_CHAT_ID_LINK: "waitingChatIdLink",
  WAITING_DESCRIPTION_LINK: "waitingDescriptionLink",
  WAITING_ID_DELETECHAT_LINK: "waitingIdDeleteChatLink",
  WAITING_ID_WORK_CHATS: "waitingIdWorkChats",
  WAITING_LINK_LINK: "waitingLinkLink",
  WAITING_NAME_LINK: "waitingNameLink",
  WAITING_PARAMETR_EDIT_CHAT: "waitingParametrEditChat",

  // Менеджер
  WAITING_ACTIVE_MANAGER: "waitingActiveManager",
  WAITING_INFO_MANAGER: "waitingInfoManager",

  // ПВЗ
  WAITING_WORK_TIME: "waitingWorkTime",
  WAITING_СONFIRMATION: "waitingСonfirmation",
  WAITING_ACTIVE_PVZ_ID: "waitingActivePvzId",
  WAITING_PVZ_ADRESS: "waitingPvzAdress",
  WAITING_PVZ_ID: "waitingPvzId",

  /** Пользователь */

  // Регистрация
  WAITING_FULL_NAME: "waitingFullName",
  WAITING_WB_ID: "waitingWbId",

  // Редактирование
  WAITING_CHANGE_NAME: "waitingChangeName",
  WAITING_CHANGE_PHONE: "waitingChangePhone",
  WAITING_CHANGE_WB_ID: "waitingChangeWbId",

  // ПВЗ
  WAITING_RATE_PVZ_IN_CHAT: "waitingRatePvzInChat",
  WAITING_SELECTING_PVZ_FOR_REMOVAL: "waitingSelectingPvzForRemoval",
  WAITING_SELECTING_PVZ_IN_CHAT: "waitingSelectingPvzInChat",
  WAITING_SELECTING_PVZ_TO_ADD: "waitingSelectingPvzToAdd",

  // Сменщик
  WAITING_ADD_REPLACEMENT: "waitingAddReplacement",
  WAITING_DELETE_REPLACEMENT: "waitingDeleteReplacement",
  WAITING_SELECTING_REPLACEMENT_IN_CHAT: "waitingSelectingReplacementInChat",
}

module.exports = {
  STATES
}
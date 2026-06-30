const { COMMANDS } = require('../constants/index');
/** Пользователь */ 
const {
  // Редактирование
  handlerChangeName,
  handlerChangePhone,
  handlerChangeWBId,

  // Меню
  handlerUnsubscribeMenu,
  handlerEditMenu,
  handlerSettingMenu,

  // ПВЗ
  handlerAddPvzForRequest,
  handlerDeletePvzForRequest,

  // Сменщики
  handlerAddReplacement,
  handlerDeleteReplacement,

  // Отчеты
  handlerChatReport,

  // Общии
  handlerMyData,
} = require('./user/index');

/** Админ */ 
const {
  // Чаты
  handlerAddListChat,
  handlerDeleteChatLink,
  handlerEditListChats,

  // Менеджеры
  handlerDeleteManager,
  handlerRequestDataManager,
  handlerRestoreManager,

  // Меню
  handlerAdminMenu,
  handlerListСhatsMenu,
  handlerManagerMenu,
  handlerPvzMenu,
  handlerUnsubscriptionsMenu,

  // ПВЗ
  handlerActivePvz,
  handlerAddPVZ,
  handlerDeletePvz,
  handlerListPvz,

  // Отчеты
  handlerPvzClosureReport,
  handlerPvzOpeningReport,
  handlerThereIsNoClosesReport,
  handlerThereIsNoOpeningReport,
  handlerToRemindCloses,
  handlerToRemindOpening,
} = require('./admin/index');

/** Общие */ 
const {
  handlerListChats,
  handlerMain
} = require('./common/index');

const commandHandlers = {
  // Пользователь
  [COMMANDS.USER.USER_HOME.MY_DATA.TEXT]: (senderId) => handlerMyData(senderId),
  [COMMANDS.USER.USER_HOME.OPEN_PVZ.TEXT]: (senderId) => handlerChatReport(senderId, "open"),
  [COMMANDS.USER.USER_HOME.CLOSE_PVZ.TEXT]: (senderId) => handlerChatReport(senderId, "close"),
  [COMMANDS.USER.USER_HOME.SETTINGS_MENU.TEXT]: (senderId) => handlerSettingMenu(senderId),
  [COMMANDS.USER.SETTINGS.EDIT_PROFILE_MENU.TEXT]: (senderId) => handlerEditMenu(senderId),
  [COMMANDS.USER.SETTINGS.UNSUBSCRIBE_MENU.TEXT]: (senderId) => handlerUnsubscribeMenu(senderId),
  [COMMANDS.USER.EDIT_PROFILE.CHANGE_NAME.TEXT]: (senderId) => handlerChangeName(senderId),
  [COMMANDS.USER.EDIT_PROFILE.CHANGE_WB_ID.TEXT]: (senderId) => handlerChangeWBId(senderId),
  [COMMANDS.USER.EDIT_PROFILE.CHANGE_PHONE.TEXT]: (senderId) => handlerChangePhone(senderId),
  [COMMANDS.USER.UNSUBSCRIBE.ADD_PVZ.TEXT]: (senderId) => handlerAddPvzForRequest(senderId),
  [COMMANDS.USER.UNSUBSCRIBE.DELETE_PVZ.TEXT]: (senderId) => handlerDeletePvzForRequest(senderId),
  [COMMANDS.USER.UNSUBSCRIBE.ADD_REPLACEMENT.TEXT]: (senderId) => handlerAddReplacement(senderId),
  [COMMANDS.USER.UNSUBSCRIBE.DELETE_REPLACEMENT.TEXT]: (senderId) => handlerDeleteReplacement(senderId),
  
  // Админ
  [COMMANDS.ADMIN.ADMIN_MENU.TEXT]: (senderId) => handlerAdminMenu(senderId),
  [COMMANDS.ADMIN.ADMIN_HOME.UNSUBSCRIPTIONS_MENU.TEXT]: (senderId) => handlerUnsubscriptionsMenu(senderId),
  [COMMANDS.ADMIN.ADMIN_HOME.LIST_CHATS_MENU.TEXT]: (senderId) => handlerListСhatsMenu(senderId),
  [COMMANDS.ADMIN.ADMIN_HOME.PVZ_MENU.TEXT]: (senderId) => handlerPvzMenu(senderId),
  [COMMANDS.ADMIN.ADMIN_HOME.MANAGER_MENU.TEXT]: (senderId) => handlerManagerMenu(senderId),
  [COMMANDS.ADMIN.PVZ_MENU.ADD_PVZ_TO_DB.TEXT]: (senderId) => handlerAddPVZ(senderId),
  [COMMANDS.ADMIN.PVZ_MENU.DELETE_PVZ_FROM_DB.TEXT]: (senderId) => handlerDeletePvz(senderId),
  [COMMANDS.ADMIN.PVZ_MENU.ACTIVE_PVZ_FROM_DB.TEXT]: (senderId) => handlerActivePvz(senderId),
  [COMMANDS.ADMIN.PVZ_MENU.LIST_PVZ.TEXT]: (senderId) => handlerListPvz(senderId),
  [COMMANDS.ADMIN.UNSUBSCRIPTIONS_MENU.REPORT_OPENING.TEXT]: (senderId) => handlerPvzOpeningReport(senderId),
  [COMMANDS.ADMIN.UNSUBSCRIPTIONS_MENU.REPORT_CLOSING.TEXT]: (senderId) => handlerPvzClosureReport(senderId),
  [COMMANDS.ADMIN.UNSUBSCRIPTIONS_MENU.MISSING_OPENING.TEXT]: (senderId) => handlerThereIsNoOpeningReport(senderId),
  [COMMANDS.ADMIN.UNSUBSCRIPTIONS_MENU.MISSING_CLOSING.TEXT]: (senderId) => handlerThereIsNoClosesReport(senderId),
  [COMMANDS.ADMIN.UNSUBSCRIPTIONS_MENU.REMIND_OPENING.TEXT]: (senderId) => handlerToRemindOpening(senderId),
  [COMMANDS.ADMIN.UNSUBSCRIPTIONS_MENU.REMIND_CLOSING.TEXT]: (senderId) => handlerToRemindCloses(senderId),
  [COMMANDS.ADMIN.LIST_CHATS_MENU.EDIT_LIST_CHATS.TEXT]: (senderId) => handlerEditListChats(senderId),
  [COMMANDS.ADMIN.LIST_CHATS_MENU.ADD_LIST_CHATS.TEXT]: (senderId) => handlerAddListChat(senderId),
  [COMMANDS.ADMIN.LIST_CHATS_MENU.DELETE_CHATS.TEXT]: (senderId) => handlerDeleteChatLink(senderId),
  [COMMANDS.ADMIN.MANAGER_MENU.REQUEST_DATA_MANAGER.TEXT]: (senderId) => handlerRequestDataManager(senderId),
  [COMMANDS.ADMIN.MANAGER_MENU.DELETE_MANAGER.TEXT]: (senderId) => handlerDeleteManager(senderId),
  [COMMANDS.ADMIN.MANAGER_MENU.RESTORE_MANAGER.TEXT]: (senderId) => handlerRestoreManager(senderId),
  
  // Общие
  [COMMANDS.COMMON.LIST_CHATS.TEXT]: (senderId) => handlerListChats(senderId),
  [COMMANDS.COMMON.MAIN.TEXT]: (senderId) => handlerMain(senderId)
};

module.exports = { commandHandlers };

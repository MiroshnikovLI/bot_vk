// Чаты
const { handlerAddListChat } = require('./chats/handlerAddListChat');
const { handlerDeleteChatLink } = require('./chats/handlerDeleteChatLink');
const { handlerEditListChats } = require('./chats/handlerEditListChats');

// Менеджер
const { handlerDeleteManager } = require('./manager/handlerDeleteManager');
const { handlerRequestDataManager } = require('./manager/handlerRequestDataManager');
const { handlerRestoreManager } = require('./manager/handlerRestoreManager');

// Меню
const { handlerAdminMenu } = require('./menu/handlerAdminMenu');
const { handlerListСhatsMenu } = require('./menu/handlerListСhatsMenu');
const { handlerManagerMenu } = require('./menu/handlerManagerMenu');
const { handlerPvzMenu } = require('./menu/handlerPvzMenu');
const { handlerUnsubscriptionsMenu } = require('./menu/handlerUnsubscriptionsMenu');

// ПВЗ
const { handlerActivePvz } = require('./pvz/handlerActivePvz');
const { handlerAddPvz } = require('./pvz/handlerAddPvz');
const { handlerDeletePvz } = require('./pvz/handlerDeletePvz');
const { handlerListPvz } = require('./pvz/handlerListPvz');

// Отчеты
const { handlerPvzClosureReport } = require('./reports/handlerPvzClosureReport');
const { handlerPvzOpeningReport } = require('./reports/handlerPvzOpeningReport');
const { handlerThereIsNoClosesReport } = require('./reports/handlerThereIsNoClosesReport');
const { handlerThereIsNoOpeningReport } = require('./reports/handlerThereIsNoOpeningReport');
const { handlerToRemindCloses } = require('./reports/handlerToRemindCloses');
const { handlerToRemindOpening } = require('./reports/handlerToRemindOpening');

module.exports = {
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
  handlerAddPvz,
  handlerDeletePvz,
  handlerListPvz,

  // Отчеты
  handlerPvzClosureReport,
  handlerPvzOpeningReport,
  handlerThereIsNoClosesReport,
  handlerThereIsNoOpeningReport,
  handlerToRemindCloses,
  handlerToRemindOpening,

}

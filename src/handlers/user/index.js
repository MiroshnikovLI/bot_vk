// Редактирование
const { handlerChangeName } = require('./change/handlerChangeName');
const { handlerChangePhone } = require('./change/handlerChangePhone');
const { handlerChangeWBId } = require('./change/handlerChangeWBId');
// Меню
const { handlerUnsubscribeMenu } = require('./menu/handlerUnsubscribeMenu');
const { handlerEditMenu } = require('./menu/handlerEditMenu');
const { handlerSettingMenu } = require('./menu/handlerSettingMenu');

// ПВЗ
const { handlerAddPVZForRequest } = require('./pvz/handlerAddPVZForRequest');
const { handlerDeletePvzForRequest } = require('./pvz/handlerDeletePvzForRequest');

// Сменщики
const { handlerAddReplacement } = require('./replacement/handlerAddReplacement');
const { handlerDeleteReplacement } = require('./replacement/handlerDeleteReplacement');

// Отчеты
const { handlerChatReport } = require('./reports/handlerChatReport');

// Общии
const { handlerMyData } = require('./handlerMyData');

module.exports = {
  // Редактирование
  handlerChangeName,
  handlerChangePhone,
  handlerChangeWBId,

  // Меню
  handlerUnsubscribeMenu,
  handlerEditMenu,
  handlerSettingMenu,

  // ПВЗ
  handlerAddPVZForRequest,
  handlerDeletePvzForRequest,

  // Сменщики
  handlerAddReplacement,
  handlerDeleteReplacement,

  // Отчеты
  handlerChatReport,

  // Общии
  handlerMyData,
}
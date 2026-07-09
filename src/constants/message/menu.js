const { USER } = require('../commands/user');
const { ADMIN } = require('../commands/admin');
const { createMenuDescription } = require('../../utils/createMenuDescription/createMenuDescription');

const MAIN_MENU = (isAdmin) => {
  const admin = isAdmin ? `\n• 🛡️ Админ - меню управления администраторов` : ``;
  
  const message = []

    `🏠 **ГЛАВНАЯ СТРАНИЦА**\n\n` +
    `• 📋 Мои данные - посмотреть свои данные\n` +
    `• 🔧 Настройки - ПВЗ, отписок, редактирование профиля\n` +
    `• 📋 Рабочие чаты - получить список рабочих чатов\n` +
    `• 🌅 Открытие ПВЗ - создать и отправить отчет об открытии смены\n` +
    `• 🌙 Закрытие ПВЗ - создать и отправить отчет о закрытии смены`;
  
  return message + admin;
};

const SETTINGS_MENU = 
  `☰ **МЕНЮ НАСТРОЙКИ**\n\n` +
  `• ☰ МЕНЮ ОТПИСКИ - добавить/удалить пвз/сменщика\n`+
  `• ✏️ РЕДАКТИРОВАНИЕ ПРОФИЛЯ - изменить ФИО, WB ID, номер телефона \n`

const EDIT_MENU =
  `✏️ **МЕНЮ РЕДАКТИРОВАНИЯ ПРОФИЛЯ**\n\n` +
  `• ✏️ Изменить ФИО - обновить ФИО\n` +
  `• 🆔 Изменить WB ID - обновить ID\n` +
  `• 📱 Изменить номер телефона - обновить номер телефона\n`;

const UNSUBSCRIBE_MENU =
  `🏪 **МЕНЮ ОТПИСКИ**\n\n` +
  `• ➕ Добавить ПВЗ - для отписок\n` +
  `• 🗑️ Удалить ПВЗ - из отписок\n` +
  `• ➕ Добавить сменщика - для отписок\n` +
  `• 🗑️ Удалить сменщика - из отписок\n` +
  `• 🔙 Назад - вернуться\n`;

  
const ADMIN_MENU = () => {
  return createMenuDescription(ADMIN.ADMIN_HOME)
};
  
const UNSUBSCRIBE_MENU_ADMIN = () => {
  return createMenuDescription(ADMIN.UNSUBSCRIPTIONS_MENU)
}

const PVZ_MENU = () => {
  return createMenuDescription(ADMIN.PVZ_MENU)
}

const MANAGER_MENU = () => {
  return createMenuDescription(ADMIN.MANAGER_MENU)
}

const LIST_CHATS_MENU = () => {
  const mass = {...ADMIN.LIST_CHATS_MENU};
  return createMenuDescription(mass)
}

module.exports = {
  ADMIN_MENU,
  PVZ_MENU,
  UNSUBSCRIBE_MENU_ADMIN,
  MANAGER_MENU,
  LIST_CHATS_MENU,
  UNSUBSCRIBE_MENU,
  EDIT_MENU,
  MAIN_MENU,
  SETTINGS_MENU
}

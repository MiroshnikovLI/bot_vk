const { USER } = require("./user");

const ADMIN = {

  ADMIN_MENU: {
    TEXT: "админ",
  },

  // Админ-панель
  ADMIN_HOME: {
    PVZ_MENU: { TEXT: "меню пвз" },
    UNSUBSCRIPTIONS_MENU: { TEXT: "отчеты отписок" },
    MANAGER_MENU: { TEXT: "меню менеджеров" },
    LIST_CHATS_MENU: { TEXT: "меню списка чатов" },
    get PARENTS() { return USER.USER_MENU.TEXT },
  },

  // Меню пунктов выдачи (под меню)
  PVZ_MENU: {
    ADD_PVZ_TO_DB: { TEXT: "добавить пункт выдачи" },
    DELETE_PVZ_FROM_DB: { TEXT: "удалить пункт выдачи" },
    ACTIVE_PVZ_FROM_DB: { TEXT: "восстановить пункт выдачи" },
    LIST_PVZ: { TEXT: "список пвз" },
    get PARENTS() { return ADMIN.ADMIN_MENU.TEXT; },
  },

  // Настройки рабочих чатов (под меню)
  LIST_CHATS_MENU: {
    EDIT_LIST_CHATS: { TEXT: "редактировать список" },
    ADD_LIST_CHATS: { TEXT: "добавить чат" },
    DELETE_CHATS: { TEXT: "удалить чат" },
    get PARENTS() { return ADMIN.ADMIN_MENU.TEXT; },
  },

  // Меню менеджера (под меню)
  MANAGER_MENU: {
    REQUEST_DATA_MANAGER: { TEXT: "запросить данные менеджера" },
    DELETE_MANAGER: { TEXT: "удалить менеджера" },
    RESTORE_MANAGER: { TEXT: "восстановить менеджера" },
    get PARENTS() { return ADMIN.ADMIN_MENU.TEXT; },
  },

  // Редактор чатов (под меню)
  LIST_EDIT: {
    EDIT_NAME_LINK: { TEXT: "изменить название" },
    EDIT_LINK_LINK: { TEXT: "изменить ссылку" },
    EDIT_DESCRIPTION_LINK: { TEXT: "изменить описание" },
    get PARENTS() { return ADMIN.LIST_CHATS_MENU.EDIT_LIST_CHATS.TEXT }
  },

  // Админ: отчёты (под меню)
  UNSUBSCRIPTIONS_MENU: {
    REPORT_OPENING: { TEXT: "отчет об открытии пвз" },
    REPORT_CLOSING: { TEXT: "отчет о закрытии пвз" },
    MISSING_OPENING: { TEXT: "нет отчета открытии" },
    MISSING_CLOSING: { TEXT: "нет отчета закрытии" },
    REMIND_OPENING: { TEXT: "напомнить об открытии" },
    REMIND_CLOSING: { TEXT: "напомнить о закрытии" },
    get PARENTS() { return ADMIN.ADMIN_MENU.TEXT; },
  },

  // Подтверждение
  YES_DATA_IS_CORRECT: {
    TEXT: "да данные верны",
  },
  EDIT: {
    TEXT: "изменить",
  }
}

module.exports = { ADMIN };
const { USER } = require("./user");

const ADMIN = {
  ADMIN_MENU: {
    TEXT: "админ панель",
    ICON: "🛡️",
    DESCRIPTION: "меню управления администраторов",
    COLOR: "secondary",
  },

  // Админ-панель
  ADMIN_HOME: {
    PVZ_MENU: {
      TEXT: "меню пвз",
      ICON: "☰",
      DESCRIPTION: "просмотр списка пвз, добавление/удаление пвз",
    },
    UNSUBSCRIPTIONS_MENU: {
      TEXT: "отчеты отписок",
      ICON: "☰",
      DESCRIPTION:
        "просмотр отчетов, создание отчетов, напоминание об отписках",
      },
    MANAGER_MENU: {
      TEXT: "меню менеджеров",
      ICON: "☰",
      DESCRIPTION: "просмотр/удаление/восстановление данных менеджера",
    },
    LIST_CHATS_MENU: {
      TEXT: "меню списка чатов",
      ICON: "☰",
      DESCRIPTION: "просмотр/редактирование/удаление ссылок чатов",
    },
    get PARENTS() {
      return USER.USER_MENU.TEXT;
    },
    get NAME() {
      return `${ADMIN.ADMIN_MENU.ICON ? ADMIN.ADMIN_MENU.ICON : "" }  **${ADMIN.ADMIN_MENU.TEXT}**`
    },
  },

  // Меню пунктов выдачи (под меню)
  PVZ_MENU: {
    ADD_PVZ_TO_DB: {
      TEXT: "добавить пункт выдачи",
      ICON: "➕",
      DESCRIPTION: "добавить новый пункт выдачи в базу",
      COLOR: "positive",
    },
    DELETE_PVZ_FROM_DB: {
      TEXT: "удалить пункт выдачи",
      ICON: "🗑️",
      DESCRIPTION: "удалить пункт выдачи из базы",
      COLOR: "negative",
    },
    ACTIVE_PVZ_FROM_DB: {
      TEXT: "восстановить пункт выдачи",
      ICON: "🔄",
      DESCRIPTION: "восстановить пункт выдачи",
      COLOR: "positive",
    },
    LIST_PVZ: { TEXT: "список пвз", ICON: "📋", DESCRIPTION: "просмотр всех ПВЗ" },
    get PARENTS() {
      return ADMIN.ADMIN_MENU.TEXT;
    },
    get NAME () {
      return `${ADMIN.ADMIN_HOME.PVZ_MENU.ICON ? ADMIN.ADMIN_HOME.PVZ_MENU.ICON : ""} **${ADMIN.ADMIN_HOME.PVZ_MENU.TEXT}**`
    }
  },

  // Настройки рабочих чатов (под меню)
  LIST_CHATS_MENU: {
    EDIT_LIST_CHATS: {
      TEXT: "редактировать список",
      ICON: "✏️",
      DESCRIPTION: "отредактировать уже созданный список чатов",
    },
    ADD_LIST_CHATS: {
      TEXT: "добавить чат",
      ICON: "➕",
      DESCRIPTION: "добавить новый чат в список",
      COLOR: "positive",
    },
    DELETE_CHATS: {
      TEXT: "удалить чат",
      ICON: "🗑️",
      DESCRIPTION: "удалить чат из списка",
      COLOR: "negative",
    },
    get PARENTS() {
      return ADMIN.ADMIN_MENU.TEXT;
    },
    get NAME () {
      return `${ADMIN.ADMIN_HOME.LIST_CHATS_MENU.ICON ? ADMIN.ADMIN_HOME.LIST_CHATS_MENU.ICON : ""} **${ADMIN.ADMIN_HOME.LIST_CHATS_MENU.TEXT}**`
    }
  },

  // Меню менеджера (под меню)
  MANAGER_MENU: {
    REQUEST_DATA_MANAGER: {
      TEXT: "запросить данные менеджера",
      ICON: "🔍",
      DESCRIPTION: "из базы данных",
    },
    DELETE_MANAGER: {
      TEXT: "удалить менеджера",
      ICON: "🗑️",
      DESCRIPTION: "удалить учетную запись менеджера и из рабочих чатов",
      COLOR: "negative",
    },
    RESTORE_MANAGER: {
      TEXT: "восстановить менеджера",
      ICON: "🔄",
      DESCRIPTION: "восстановить менеджера без добавления в рабочие чаты",
      COLOR: "positive",
    },
    get PARENTS() {
      return ADMIN.ADMIN_MENU.TEXT;
    },
    get NAME () {
      return `${ADMIN.ADMIN_HOME.MANAGER_MENU.ICON ? ADMIN.ADMIN_HOME.MANAGER_MENU.ICON : ''} **${ADMIN.ADMIN_HOME.MANAGER_MENU.TEXT}**`
    }
  },

  // Редактор чатов (под меню)
  LIST_EDIT: {
    EDIT_NAME_LINK: { TEXT: "изменить название", ICON: "✏️" },
    EDIT_LINK_LINK: { TEXT: "изменить ссылку", ICON: "✏️" },
    EDIT_DESCRIPTION_LINK: { TEXT: "изменить описание", ICON: "✏️" },
    get PARENTS() {
      return ADMIN.LIST_CHATS_MENU.EDIT_LIST_CHATS.TEXT;
    },
  },

  // Админ: отчёты (под меню)
  UNSUBSCRIPTIONS_MENU: {
    REPORT_OPENING: {
      TEXT: "отчет об открытии пвз",
      ICON: "📊",
      DESCRIPTION: "отчет об открытии ПВЗ",
    },
    REPORT_CLOSING: {
      TEXT: "отчет о закрытии пвз",
      ICON: "📊",
      DESCRIPTION: "отчет о закрытии ПВЗ",
    },
    MISSING_OPENING: {
      TEXT: "нет отчета об открытии",
      ICON: "❌",
      DESCRIPTION: "отчет: какие пункты еще не отчитались об открытии ПВЗ",
      COLOR: "negative",
    },
    MISSING_CLOSING: {
      TEXT: "нет отчета о закрытии",
      ICON: "❌",
      DESCRIPTION: "отчет: какие пункты еще не отчитались о закрытии ПВЗ",
      COLOR: "negative",
    },
    REMIND_OPENING: {
      TEXT: "напомнить об открытии",
      ICON: "🔔",
      DESCRIPTION: "отправить отчет в чат с ПВЗ, которые еще не отчитались об открытии",
    },
    REMIND_CLOSING: {
      TEXT: "напомнить о закрытии",
      ICON: "🔔",
      DESCRIPTION: "отправить отчет в чат с ПВЗ, которые еще не отчитались о закрытии",
    },
    get PARENTS() {
      return ADMIN.ADMIN_MENU.TEXT;
    },
    get NAME() {
      return `${ADMIN.ADMIN_HOME.UNSUBSCRIPTIONS_MENU.ICON ? ADMIN.ADMIN_HOME.UNSUBSCRIPTIONS_MENU.ICON : ""} **${ADMIN.ADMIN_HOME.UNSUBSCRIPTIONS_MENU.TEXT}**`
    }
  },

  // Подтверждение
  YES_DATA_IS_CORRECT: {
    TEXT: "да данные верны",
    ICON: "✅",
  },
  EDIT: {
    TEXT: "изменить",
    ICON: "✏️",
  },
};

module.exports = { ADMIN };

const USER = {
  USER_MENU: { TEXT: "главная", ICON: "🏠" },

  // Главная страница
  USER_HOME: {
    MY_DATA: {
      TEXT: "мои данные",
      ICON: "📋",
      DESCRIPTION: "посмотреть свои данные",
    },
    SETTINGS_MENU: {
      TEXT: "настройки",
      ICON: "🔧",
      DESCRIPTION: "ПВЗ, отписок, редактирование профиля",
    },
    OPEN_PVZ: {
      TEXT: "открытие пвз",
      ICON: "🌅",
      DESCRIPTION: "создать и отправить отчет об открытии смены",
      COLOR: "positive",
    },
    CLOSE_PVZ: {
      TEXT: "закрытие пвз",
      ICON: "🌙",
      DESCRIPTION: "создать и отправить отчет о закрытии смены",
      COLOR: "primary",
    },
    get NAME() {
      return `${USER.USER_MENU.ICON ? USER.USER_MENU.ICON : ""} **${USER.USER_MENU.TEXT}**`;
    },
  },

  // Меню настроек
  SETTINGS: {
    EDIT_PROFILE_MENU: {
      TEXT: "редактировать профиль",
      ICON: "✏️",
      DESCRIPTION: "добавить/удалить пвз/сменщика",
    },
    UNSUBSCRIBE_MENU: {
      TEXT: "меню отписок",
      ICON: "☰",
      DESCRIPTION: "изменить ФИО, WB ID, номер телефона",
    },
    get PARENTS() {
      return USER.USER_MENU.TEXT;
    },
    get NAME() {
      return `${USER.USER_HOME.SETTINGS_MENU.ICON ? USER.USER_HOME.SETTINGS_MENU.ICON : ""} **${USER.USER_HOME.SETTINGS_MENU.TEXT}**`;
    },
  },

  // Настройки редактирования профиля (под меню)
  EDIT_PROFILE: {
    CHANGE_NAME: {
      TEXT: "изменить фио",
      ICON: "✏️",
      DESCRIPTION: "обновить ФИО",
    },
    CHANGE_WB_ID: {
      TEXT: "изменить wb id",
      ICON: "🆔",
      DESCRIPTION: "обновить WB ID",
    },
    CHANGE_PHONE: {
      TEXT: "изменить телефон",
      ICON: "📱",
      DESCRIPTION: "обновить номер телефона",
    },
    get PARENTS() {
      return USER.USER_HOME.SETTINGS_MENU.TEXT;
    },
    get NAME() {
      return `${USER.USER_HOME.SETTINGS_MENU.ICON ? USER.USER_HOME.SETTINGS_MENU.ICON : ""} **${USER.USER_HOME.SETTINGS_MENU.TEXT}**`;
    },
  },

  // Настройки редактирования отписок (под меню)
  UNSUBSCRIBE: {
    ADD_PVZ: { TEXT: "добавить пвз", ICON: "➕", DESCRIPTION: "для отписок" },
    DELETE_PVZ: { TEXT: "удалить пвз", ICON: "🗑️", DESCRIPTION: "из отписок" },
    ADD_REPLACEMENT: { TEXT: "добавить сменщика", ICON: "➕", DESCRIPTION: "для отписок" },
    DELETE_REPLACEMENT: { TEXT: "удалить сменщика", ICON: "🗑️", DESCRIPTION: "из отписок" },
    get PARENTS() {
      return USER.USER_HOME.SETTINGS_MENU.TEXT;
    },
    get NAME() {
      return `${USER.SETTINGS.UNSUBSCRIBE_MENU.ICON ? USER.SETTINGS.UNSUBSCRIBE_MENU.ICON : ""} **${USER.SETTINGS.UNSUBSCRIBE_MENU.TEXT}**`
    }
  },
};

module.exports = { USER };

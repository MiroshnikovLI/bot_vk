const USER = {
  USER_MENU: { TEXT: "главная", ICON: "🏠"},

  // Главная страница
  USER_HOME: {
    MY_DATA:  { TEXT: "мои данные", ICON: "📋" },
    SETTINGS_MENU: { TEXT: "настройки", ICON: "🔧" },
    OPEN_PVZ: { 
      TEXT: "открытие пвз", 
      ICON: "🌅",
      COLOR: "positive"
    },
    CLOSE_PVZ: { 
      TEXT: "закрытие пвз",
      ICON: "🌙",
      COLOR: "primary"
    },
  },

  // Меню настроек
  SETTINGS: {
    EDIT_PROFILE_MENU: { TEXT: "редактировать профиль", ICON: "✏️" },
    UNSUBSCRIBE_MENU: { TEXT: "меню отписок", ICON: "☰" },
    get PARENTS () { return USER.USER_MENU.TEXT }
  },

  // Настройки редактирования профиля (под меню)
  EDIT_PROFILE: {
    CHANGE_NAME: { TEXT: "изменить фио", ICON: "✏️" },
    CHANGE_WB_ID: { TEXT: "изменить wb id", ICON: "🆔" },
    CHANGE_PHONE: { TEXT: "изменить телефон", ICON: "📱" },
    get PARENTS () { return USER.USER_HOME.SETTINGS_MENU.TEXT } 
  },

  // Настройки редактирования отписок (под меню)
  UNSUBSCRIBE: {
    ADD_PVZ: { TEXT: "добавить пвз", ICON: "➕" },
    DELETE_PVZ: { TEXT: "удалить пвз", ICON: "🗑️" },
    ADD_REPLACEMENT: { TEXT: "добавить сменщика", ICON: "➕" },
    DELETE_REPLACEMENT: { TEXT: "удалить сменщика", ICON: "🗑️" },
    get PARENTS () { return USER.USER_HOME.SETTINGS_MENU.TEXT }
  }
}

module.exports = { USER };
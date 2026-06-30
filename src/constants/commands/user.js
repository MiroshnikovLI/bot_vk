const USER = {
  USER_MENU: { TEXT: "главная"},

  // Главная страница
  USER_HOME: {
    MY_DATA:  { TEXT: "мои данные" },
    SETTINGS_MENU: { TEXT: "настройки" },
    OPEN_PVZ: { TEXT: "открытие пвз" },
    CLOSE_PVZ: { TEXT: "закрытие пвз" },
  },

  // Меню настроек
  SETTINGS: {
    EDIT_PROFILE_MENU: { TEXT: "редактировать профиль" },
    UNSUBSCRIBE_MENU: { TEXT: "меню отписок" },
    get PARENTS () { return USER.USER_MENU.TEXT }
  },

  // Настройки редактирования профиля (под меню)
  EDIT_PROFILE: {
    CHANGE_NAME: { TEXT: "изменить фио" },
    CHANGE_WB_ID: { TEXT: "изменить wb id" },
    CHANGE_PHONE: { TEXT: "изменить телефон" },
    get PARENTS () { return USER.USER_HOME.SETTINGS_MENU.TEXT } 
  },

  // Настройки редактирования отписок (под меню)
  UNSUBSCRIBE: {
    ADD_PVZ: { TEXT: "добавить пвз" },
    DELETE_PVZ: { TEXT: "удалить пвз" },
    ADD_REPLACEMENT: { TEXT: "добавить сменщика" },
    DELETE_REPLACEMENT: { TEXT: "удалить сменщика" },
    get PARENTS () { return USER.USER_HOME.SETTINGS_MENU.TEXT }
  }
}

module.exports = { USER };
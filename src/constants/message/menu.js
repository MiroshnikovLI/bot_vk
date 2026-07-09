const { createMenuDescription } = require('../../utils/createMenuDescription/createMenuDescription');
const { ADMIN } = require('../commands/admin');
const { COMMON } = require('../commands/common');
const { USER } = require('../commands/user');

const MAIN_MENU = (isAdmin) => {
  const mass = {...USER.USER_HOME, LIST_CHATS: COMMON.LIST_CHATS}
  if (isAdmin) {
    mass.ADMIN = ADMIN.ADMIN_MENU;
  }
  const message = createMenuDescription(mass)
  
  return message;
};

const SETTINGS_MENU = () => {
  return createMenuDescription(USER.SETTINGS)
};

const EDIT_MENU = () => {
  return createMenuDescription(USER.EDIT_PROFILE)
}

const UNSUBSCRIBE_MENU = () => {
  return createMenuDescription(USER.UNSUBSCRIBE)
}

const ADMIN_MENU = () => {
  return createMenuDescription(ADMIN.ADMIN_HOME)
};
  
const UNSUBSCRIBE_MENU_ADMIN = () => {
  return createMenuDescription(ADMIN.UNSUBSCRIPTIONS_MENU)
}

const PVZ_MENU = () =>  {
  return createMenuDescription(ADMIN.PVZ_MENU)
}

const MANAGER_MENU = () => {
  return createMenuDescription(ADMIN.MANAGER_MENU)
}

const LIST_CHATS_MENU = () => {
  return createMenuDescription(ADMIN.LIST_CHATS_MENU)
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
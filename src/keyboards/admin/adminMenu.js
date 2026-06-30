const { COMMANDS } = require('../../constants/index');
const { getBackKeyboards } = require('../common');

function adminMenu() {
  const buttons = [
      [
        {
          action: {
            type: `text`,
            label: `☰ ${COMMANDS.ADMIN.ADMIN_HOME.UNSUBSCRIPTIONS_MENU.TEXT.toUpperCase()}`,
          },
          color: `secondary`,
        },
        {
          action: {
            type: `text`,
            label: `☰ ${COMMANDS.ADMIN.ADMIN_HOME.PVZ_MENU.TEXT.toUpperCase()}`,
          },
          color: `secondary`,
        },
      ],
      [
        {
          action: {
            type: "text",
            label: `☰ ${COMMANDS.ADMIN.ADMIN_HOME.MANAGER_MENU.TEXT.toUpperCase()}`,
          },
          color: `secondary`,
        },
      ],
      [
        {
          action: {
            type: `text`,
            label: `🔧 ${COMMANDS.ADMIN.ADMIN_HOME.LIST_CHATS_MENU.TEXT.toUpperCase()}`,
          },
          color: `secondary`,
        },
      ]
    ]

  buttons.push(...getBackKeyboards(`${COMMANDS.ADMIN.ADMIN_HOME.PARENTS}`).buttons);
  return { 
    buttons,
    one_time: false,
  };
}

module.exports = {
  adminMenu
}
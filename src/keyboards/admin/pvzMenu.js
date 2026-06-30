const { COMMANDS } = require("../../constants/index");
const { getBackKeyboards } = require("../common");

function pvzMenu() {
  const buttons = [
    [
      {
        action: {
          type: `text`,
          label: `➕ ${COMMANDS.ADMIN.PVZ_MENU.ADD_PVZ_TO_DB.TEXT.toUpperCase()}`,
        },
        color: `positive`,
      },
      {
        action: {
          type: `text`,
          label: `🗑️ ${COMMANDS.ADMIN.PVZ_MENU.DELETE_PVZ_FROM_DB.TEXT.toUpperCase()}`,
        },
        color: `negative`,
      },
    ],
    [
      {
        action: {
          type: `text`,
          label: `➕ ${COMMANDS.ADMIN.PVZ_MENU.ACTIVE_PVZ_FROM_DB.TEXT.toUpperCase()}`
        }
      }
    ],
    [
      {
        action: {
          type: `text`,
          label: `📋 ${COMMANDS.ADMIN.PVZ_MENU.LIST_PVZ.TEXT.toUpperCase()}`,
        },
        color: `primary`,
      },
    ],
  ];

  buttons.push(...getBackKeyboards(`${COMMANDS.ADMIN.PVZ_MENU.PARENTS}`).buttons);
  return {
    buttons,
    one_time: false,
  };
}

module.exports = {
  pvzMenu,
};

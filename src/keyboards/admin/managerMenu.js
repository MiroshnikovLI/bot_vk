const { COMMANDS } = require("../../constants/index");
const { getBackKeyboards } = require("../common");

function managerMenu() {
  const buttons = [
    [
      {
        action: {
          type: `text`,
          label: `👤 ${COMMANDS.ADMIN.MANAGER_MENU.REQUEST_DATA_MANAGER.TEXT.toUpperCase()}`,
        },
        color: `primary`,
      },
    ],
    [
      {
        action: {
          type: `text`,
          label: `🗑️ ${COMMANDS.ADMIN.MANAGER_MENU.DELETE_MANAGER.TEXT.toUpperCase()}`,
        },
        color: `primary`,
      },
    ],
    [
      {
        action: {
          type: `text`,
          label: `➕ ${COMMANDS.ADMIN.MANAGER_MENU.RESTORE_MANAGER.TEXT.toUpperCase()}`,
        },
        color: `primary`,
      },
    ],
  ];

  buttons.push(...getBackKeyboards(`${COMMANDS.ADMIN.MANAGER_MENU.PARENTS}`).buttons);
  return {
    buttons,
    one_time: false,
  };
}

module.exports = {
  managerMenu,
};

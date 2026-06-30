const { COMMANDS } = require("../../constants/index");
const { getAdminKeyboards } = require("../common");
const { isUserAdmin } = require("../../services/index");

function main(isAdmin = false) {
  const buttons = [
    [
      {
        action: {
          type: `text`,
          label: `📋 ${COMMANDS.USER.USER_HOME.MY_DATA.TEXT.toUpperCase()}`,
        },
        color: `secondary`,
      },
      {
        action: {
          type: `text`,
          label: `✏️ ${COMMANDS.USER.USER_HOME.SETTINGS_MENU.TEXT.toUpperCase()}`,
        },
        color: `secondary`,
      },
    ],
    [
      {
        action: {
          type: `text`,
          label: `📋 ${COMMANDS.COMMON.LIST_CHATS.TEXT.toUpperCase()}`,
        },
        color: `secondary`,
      },
    ],
    [
      {
        action: {
          type: `text`,
          label: `🌅 ${COMMANDS.USER.USER_HOME.OPEN_PVZ.TEXT.toUpperCase()}`,
        },
        color: `positive`,
      },
      {
        action: {
          type: `text`,
          label: `🌙 ${COMMANDS.USER.USER_HOME.CLOSE_PVZ.TEXT.toUpperCase()}`,
        },
        color: `primary`,
      },
    ],
  ];

  if (isAdmin) {
    buttons.push(...getAdminKeyboards().buttons)
  }

  return {
    buttons,
    one_time: false,
  };
}

module.exports = { main };

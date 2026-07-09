const { COMMANDS } = require("../../constants/index");

function getCancelKeyboard() {
  return {
    buttons: [
      [
        {
          action: {
            type: `text`,
            label: `${COMMANDS.COMMON.CANCELLATION.ICON ? COMMANDS.COMMON.CANCELLATION.ICON : ""} ${COMMANDS.COMMON.CANCELLATION.TEXT.toUpperCase()}`,
          },
          color: `${COMMANDS.COMMON.CANCELLATION.COLOR ? COMMANDS.COMMON.CANCELLATION.COLOR : "negative"}`,
        },
      ],
    ],
    one_time: false,
  };
}

function getAdminKeyboards() {
  return {
    buttons: [[      {
        action: {
          type: `text`,
          label: `${COMMANDS.ADMIN.ADMIN_MENU.ICON ? COMMANDS.ADMIN.ADMIN_MENU.ICON : ""} ${COMMANDS.ADMIN.ADMIN_MENU.TEXT.toUpperCase()}`,
        },
        color: `${COMMANDS.ADMIN.ADMIN_MENU.COLOR ? COMMANDS.ADMIN.ADMIN_MENU.COLOR : "secondary"}`,
      },
    ],
  ],
    one_time: false,
  
  };
}

function createParameterKeyboard(parametr) {
  const buttons = parametr.map((e) => [
    {
      action: {
        type: `text`,
        label: `${e.ICON ? e.ICON : ""} ${e.TEXT.toUpperCase()}`,
      },
      color: `${e.COLOR ? e.COLOR : "secondary"}`,
    },
  ]);
  buttons.push(...getCancelKeyboard().buttons);
  return { buttons, one_time: true };
}

module.exports = {
  getCancelKeyboard,
  getAdminKeyboards,
  createParameterKeyboard,
};

const { COMMANDS } = require("../../constants/index");

function getBackKeyboards(command) {
  return {
    buttons: [
      [
        {
          action: {
            type: `text`,
            label: `${COMMANDS.COMMON.BACK.ICON ? COMMANDS.COMMON.BACK.ICON : ""} ${COMMANDS.COMMON.BACK.TEXT.toUpperCase()}`,
            payload: JSON.stringify({
              command: `${command}`
            })
          },
          color: `${COMMANDS.COMMON.BACK.COLOR ? COMMANDS.COMMON.BACK.COLOR : "secondary"}`,
        },
      ],
    ],
    one_time: false,
  };
}

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

function createParameterKeyboard(parametr, showCancle = true) {
  const buttons = parametr.map((e) => [
    {
      action: {
        type: `text`,
        label: `${e.ICON ? e.ICON : ""} ${e.TEXT.toUpperCase()}`,
      },
      color: `${e.COLOR ? e.COLOR : "secondary"}`,
    },
  ]);
  if (showCancle) {
    buttons.push(...getCancelKeyboard().buttons);
  }
  return { buttons, one_time: true };
}

module.exports = {
  getCancelKeyboard,
  getAdminKeyboards,
  getBackKeyboards,
  createParameterKeyboard,
};

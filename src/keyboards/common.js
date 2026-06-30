const { COMMANDS } = require("../constants/index");

function getCancelKeyboard() {
  return {
    buttons: [
      [
        {
          action: {
            type: `text`,
            label: `❌ ${COMMANDS.COMMON.CANCELLATION.TEXT.toUpperCase()}`,
          },
          color: `negative`,
        },
      ],
    ],
    one_time: false,
  };
}

function getBackKeyboards(command) {
  return {
    buttons: [
      [
        {
          action: {
            type: `text`,
            label: `🔙 ${COMMANDS.COMMON.BACK.TEXT.toUpperCase()}`,
            payload: JSON.stringify({
              command: `${command}`
            })
          },
          color: `primary`,
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
          label: `🛡️ ${COMMANDS.ADMIN.ADMIN_MENU.TEXT.toUpperCase()}`,
        },
        color: `primary`,
      },
    ],
  ],
    one_time: false,
  
  };
}

module.exports = {
  getCancelKeyboard,
  getBackKeyboards,
  getAdminKeyboards,
};

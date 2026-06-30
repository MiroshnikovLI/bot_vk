const { COMMANDS } = require("../../constants/index");
const { getBackKeyboards } = require("../common");

function waitingParameter() {
  const buttons = [
    [
      {
        action: {
          type: `text`,
          label: `✏️ ${COMMANDS.ADMIN.LIST_EDIT.EDIT_NAME_LINK.TEXT.toUpperCase()}`,
        },
        color: `primary`,
      },
    ],
    [
      {
        action: {
          type: `text`,
          label: `✏️ ${COMMANDS.ADMIN.LIST_EDIT.EDIT_LINK_LINK.TEXT.toUpperCase()}`,
        },
        color: `primary`,
      },
    ],
    [
      {
        action: {
          type: `text`,
          label: `✏️ ${COMMANDS.ADMIN.LIST_EDIT.EDIT_DESCRIPTION_LINK.TEXT.toUpperCase()}`,
        },
        color: `primary`,
      },
    ]
  ]

  buttons.push(...getBackKeyboards(`${COMMANDS.ADMIN.LIST_EDIT.PARENTS}`).buttons)
  return {
    buttons,
    one_time: false,
  };
}

module.exports = {
  waitingParameter,
};

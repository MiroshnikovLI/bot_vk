const { COMMANDS } = require("../../constants/index");
const { getCancelKeyboard } = require("../common/common");

function waitingСonfirmation() {
  const buttons = [
    [
      {
        action: {
          type: `text`,
          label: `✅ ${COMMANDS.ADMIN.YES_DATA_IS_CORRECT.TEXT.toUpperCase()}`,
        },
        color: `positive`,
      },
    ],
    [
      {
        action: { type: `text`, label: `✏️ ${COMMANDS.ADMIN.EDIT.TEXT.toUpperCase()}` },
        color: `secondary`,
      },
    ],
  ]
  buttons.push(...getCancelKeyboard(COMMANDS.ADMIN.ADMIN_MENU.TEXT).buttons);
  return {
    buttons,
    one_time: false,
  };
}

module.exports = {
  waitingСonfirmation,
};

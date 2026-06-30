const { COMMANDS } = require('../../constants/index');
const { getBackKeyboards } = require('../common');

function unsubscribe() {
  const buttons = [
    [
      {
        action: {
          type: `text`,
          label: `➕ ${COMMANDS.USER.UNSUBSCRIBE.ADD_PVZ.TEXT.toUpperCase()}`,
        },
        color: `secondary`,
      },
      {
        action: {
          type: `text`,
          label: `🗑️ ${COMMANDS.USER.UNSUBSCRIBE.DELETE_PVZ.TEXT.toUpperCase()}`,
        },
        color: `negative`,
      },
    ],
    [
      {
        action: {
          type: `text`,
          label: `➕ ${COMMANDS.USER.UNSUBSCRIBE.ADD_REPLACEMENT.TEXT.toUpperCase()}`,
        },
        color: `secondary`,
      },
      {
        action: {
          type: `text`,
          label: `🗑️ ${COMMANDS.USER.UNSUBSCRIBE.DELETE_REPLACEMENT.TEXT.toUpperCase()}`,
        },
        color: `negative`,
      },
    ]
  ]
  buttons.push(...getBackKeyboards(`${COMMANDS.USER.UNSUBSCRIBE.PARENTS}`).buttons);
  return {
    buttons,
    one_time: false,
  };
}

module.exports = { unsubscribe };
const { COMMANDS } = require('../../constants/index');
const { getBackKeyboards } = require('../common');

function unsubscriptions() {
  const buttons = [
      [
        {
          action: {
            type: `text`,
            label: `📊 ${COMMANDS.ADMIN.UNSUBSCRIPTIONS_MENU.REPORT_OPENING.TEXT.toUpperCase()}`,
          },
          color: `positive`,
        },
        {
          action: {
            type: `text`,
            label: `📊 ${COMMANDS.ADMIN.UNSUBSCRIPTIONS_MENU.REPORT_CLOSING.TEXT.toUpperCase()}`,
          },
          color: `positive`,
        },
      ],
      [
        {
          action: {
            type: `text`,
            label: `❌ ${COMMANDS.ADMIN.UNSUBSCRIPTIONS_MENU.MISSING_OPENING.TEXT.toUpperCase()}`,
          },
          color: `negative`,
        },
        {
          action: {
            type: `text`,
            label: `❌ ${COMMANDS.ADMIN.UNSUBSCRIPTIONS_MENU.MISSING_CLOSING.TEXT.toUpperCase()}`,
          },
          color: `negative`,
        },
      ],
      [
        {
          action: {
            type: `text`,
            label: `🔔 ${COMMANDS.ADMIN.UNSUBSCRIPTIONS_MENU.REMIND_OPENING.TEXT.toUpperCase()}`,
          },
          color: `primary`,
        },
        {
          action: {
            type: `text`,
            label: `🔔 ${COMMANDS.ADMIN.UNSUBSCRIPTIONS_MENU.REMIND_CLOSING.TEXT.toUpperCase()}`,
          },
          color: `primary`,
        },
      ],
    ]

  buttons.push(...getBackKeyboards(`${COMMANDS.ADMIN.UNSUBSCRIPTIONS_MENU.PARENTS}`).buttons);
  return {
    buttons,
    one_time: false,
  };
}

module.exports = {
  unsubscriptions
}
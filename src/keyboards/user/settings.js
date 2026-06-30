const { COMMANDS } = require('../../constants/index');
const { getBackKeyboards } = require('../common')

function settings() {
  const buttons = [
    [
      {
        action: {
          type: `text`,
          label: `✏️ ${COMMANDS.USER.SETTINGS.EDIT_PROFILE_MENU.TEXT.toUpperCase()}`
        },
        color: 'primary'
      },
      {
        action: {
          type: `text`,
          label: `☰ ${COMMANDS.USER.SETTINGS.UNSUBSCRIBE_MENU.TEXT.toUpperCase()}`,
        },
        color:  `primary`
      }
    ]
  ]

  buttons.push(...getBackKeyboards(`${COMMANDS.USER.SETTINGS.PARENTS}`).buttons)
  return {
    buttons,
    one_time: false
  }
}

module.exports = {
  settings
}
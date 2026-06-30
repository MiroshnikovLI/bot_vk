const { COMMANDS } = require('../../constants/index');
const { getBackKeyboards } = require('../common');

function editProfile() {
  const buttons = [
    [
      {
        action: {
          type: `text`,
          label: `✏️ ${COMMANDS.USER.EDIT_PROFILE.CHANGE_NAME.TEXT.toUpperCase()}`,
        },
        color: `secondary`,
      },
      {
        action: {
          type: `text`,
          label: `✏️ ${COMMANDS.USER.EDIT_PROFILE.CHANGE_WB_ID.TEXT.toUpperCase()}`,
        },
        color: `secondary`,
      },
    ],
    [
      {
        action: {
          type: `text`,
          label: `✏️ ${COMMANDS.USER.EDIT_PROFILE.CHANGE_PHONE.TEXT.toUpperCase()}`,
        },
        color: `secondary`,
      },
    ],
  ]
  buttons.push(...getBackKeyboards(`${COMMANDS.USER.EDIT_PROFILE.PARENTS}`).buttons);
  return {
    buttons,
    one_time: false,
  };
}

module.exports = { editProfile };
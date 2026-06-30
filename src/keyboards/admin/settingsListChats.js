const { COMMANDS } = require('../../constants/index');
const { getBackKeyboards } = require('../common');

function settingsListChats() {
  const buttons = [
      [
        {
          action: {
            type: `text`,
            label: `📋 ${COMMANDS.COMMON.LIST_CHATS.TEXT.toUpperCase()}`,
          },
          color: `secondary`,
        },
        {
          action: {
            type: `text`,
            label: `✏️ ${COMMANDS.ADMIN.LIST_CHATS_MENU.EDIT_LIST_CHATS.TEXT.toUpperCase()}`,
          },
          color: `secondary`,
        },
      ],
      [
        {
          action: {
            type: `text`,
            label: `➕ ${COMMANDS.ADMIN.LIST_CHATS_MENU.ADD_LIST_CHATS.TEXT.toUpperCase()}`,
          },
          color: `secondary`,
        },
        {
          action: {
            type: `text`,
            label: `🗑️ ${COMMANDS.ADMIN.LIST_CHATS_MENU.DELETE_CHATS.TEXT.toUpperCase()}`,
          },
        },
      ]
    ]

  buttons.push(...getBackKeyboards(`${COMMANDS.ADMIN.LIST_CHATS_MENU.PARENTS}`).buttons);
  return {
    buttons,
    one_time: false
  };
}

module.exports = {
  settingsListChats
}
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

function buildKeyboard(
  mass,
  columns = 2
) {
  const buttons = []

  Object.values(mass).forEach(e => {
    if (e.TEXT) {
        buttons.push({
        action: {
          type: `text`,
          label: `${e.ICON ? e.ICON : ''} ${e.TEXT.toUpperCase()}`
        },
        color: `${e.COLOR ? e.COLOR : 'secondary'}`
      })
    }
  })

  const keyboard = [];

  for (let i = 0; i < buttons.length; i += columns) {
    keyboard.push(buttons.slice(i, i + columns));
  }

  if (mass.PARENTS) {
    keyboard.push(...getBackKeyboards(mass.PARENTS).buttons)
  }

  return {
    buttons: keyboard,
    one_time: false
  }
}

module.exports = {
  buildKeyboard
}
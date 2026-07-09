const { getBackKeyboards } = require('../common/common')

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
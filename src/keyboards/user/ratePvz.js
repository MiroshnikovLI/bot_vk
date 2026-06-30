const { getCancelKeyboard } = require('../common');

function ratePvz(rate) {
  const buttons = [
    [
      {
        action: { type: `text`, label: `⭐ 5.00` },
        color: `primary`,
      },
      {
        action: { type: `text`, label: `⭐ 4.99` },
        color: `primary`,
      },
      {
        action: { type: `text`, label: `⭐ ${rate}` },
        color: `primary`,
      },
    ],
  ];
  buttons.push(...getCancelKeyboard().buttons);
  return { buttons, one_time: false };
}

module.exports = { ratePvz };
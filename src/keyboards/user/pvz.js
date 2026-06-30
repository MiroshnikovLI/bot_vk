const { getCancelKeyboard } = require('../common');

function pvz(pvzs, reportType) {
  const buttons = pvzs.map((pvz) => [
    {
      action: {
        type: `text`,
        label: `🏪 ${pvz.pvz_id} - ${pvz.address
          .replace(
            /^(Москва, г\. Москва|Москва, Москва|Москва, г Москва,)[,\s]*/i,
            ``,
          )
          .replace(/\s+/g, ` `)
          .trim()
          .substring(0, 25)
          .toUpperCase()}`,
      },
      color: `primary`,
    },
  ]);
  buttons.push(...getCancelKeyboard().buttons);
  return { buttons, one_time: true };
}

module.exports = { pvz };
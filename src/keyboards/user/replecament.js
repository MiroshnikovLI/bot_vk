const { getCancelKeyboard } = require('../common');

function replacement(replecament, reportType) {
  const buttons = replecament.map((user) => [
    {
      action: {
        type: `text`,
        label: `🏪 ${user.wb_id} - ${user.full_name.substring(0, 30).toUpperCase()}`,
      },
      color: `primary`,
    },
  ]);
  buttons.push(...getCancelKeyboard().buttons);
  return { buttons, one_time: true };
}

module.exports = { replacement };
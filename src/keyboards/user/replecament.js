const { getCancelKeyboard } = require('../common/common');

function replacement(replecament) {
  const buttons = replecament.map((user) => [
    {
      action: {
        type: `text`,
        label: `🏪 ${user.wb_id} - ${user.full_name.substring(0, 30).toUpperCase()}`,
        payload: JSON.stringify({
          replacement: user
        })
      },
      color: `primary`,
    },
  ]);
  buttons.push(...getCancelKeyboard().buttons);
  return { buttons, one_time: false };
}

module.exports = { replacement };
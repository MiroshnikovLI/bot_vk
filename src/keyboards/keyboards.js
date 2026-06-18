const { isUserAdmin } = require(`../services/userService`);
const { COMMANDS } = require(`../constants/index`);

// Клавиатура для ЛИЧНЫХ СООБЩЕНИЙ (настройки профиля)
async function getPrivateKeyboard(userId) {
  const isAdmin = await isUserAdmin(userId);
  const buttons = [
      [
        {
          action: { type: `text`, label: `📋 ${COMMANDS.MY_DATA.toUpperCase()}` },
          color: `secondary`,
        },
        {
          action: { type: `text`, label: `✏️ ${COMMANDS.EDIT_DATA.toUpperCase()}` },
          color: `secondary`,
        },
      ],
      [
        {
          action: { type: `text`, label: `🏪 ${COMMANDS.UNSUBSCRIBE_SETTINGS.toUpperCase()}` },
          color: `secondary`,
        },
      ],
      [
        {
          action: { type: `text`, label: `🌅 ${COMMANDS.OPEN_PVZ.toUpperCase()}` },
          color: `positive`,
        },
        {
          action: { type: `text`, label: `🌙 ${COMMANDS.CLOSE_PVZ.toUpperCase()}` },
          color: `primary`,
        },
      ],
  ]
  if (isAdmin) {
    buttons.push([
      {
        action: { type: `text`, label: `🛡️ ${COMMANDS.ADMIN.toUpperCase()}`},
        color: `secondary`,
      }
    ]);
  }

  const result = {
    buttons,
    one_time: false,
  }
  return result
}

// Клавиатура настроек отписки
function getUnsubscribeKeyboard() {
  return {
    buttons: [
      [
        {
          action: { type: `text`, label: `➕ ${COMMANDS.ADD_PVZ.toUpperCase()}` },
          color: `secondary`,
        },
        {
          action: { type: `text`, label: `🗑️ ${COMMANDS.DELETE_PVZ.toUpperCase()}` },
          color: `negative`,
        },
      ],
      [
        {
          action: { type: `text`, label: `➕ ${COMMANDS.ADD_REPLACEMENT.toUpperCase()}` },
          color: `secondary`,
        },
        {
          action: { type: `text`, label: `🗑️ ${COMMANDS.DELETE_REPLACEMENT.toUpperCase()}` },
          color: `negative`,
        },
      ],
      [{ action: { type: `text`, label: `🔙 ${COMMANDS.BACK.toUpperCase()}` }, color: `primary` }],
    ],
    one_time: false,
  };
}

// Клавиатура изменения данных
function getEditProfileKeyboard() {
  return {
    buttons: [
      [
        {
          action: { type: `text`, label: `✏️ ${COMMANDS.CHANGE_NAME.toUpperCase()}` },
          color: `secondary`,
        },
        {
          action: { type: `text`, label: `✏️ ${COMMANDS.CHANGE_WB_ID.toUpperCase()}` },
          color: `secondary`,
        },
      ],
      [
        {
          action: { type: `text`, label: `✏️ ${COMMANDS.CHANGE_PHONE.toUpperCase()}`},
          color: `secondary`
        }
      ],
      [{ action: { type: `text`, label: `🔙 ${COMMANDS.BACK.toUpperCase()}` }, color: `primary` }],
    ],
    one_time: false,
  };
}

// Клавиатура для отмены
function getCancelKeyboard() {
  return {
    buttons: [
      [{ action: { type: `text`, label: `❌ ${COMMANDS.CANCELLATION.toUpperCase()}` }, color: `negative` }],
    ],
    one_time: false,
  };
}

// Клавиатура выбора ПВЗ
function getPvzKeyboard(pvzs, reportType) {
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
          .substring(0, 25).toUpperCase()}`,
      },
      color: `primary`,
    },
  ]);
  buttons.push(...getCancelKeyboard().buttons);
  return { buttons, one_time: true };
}

// Клавиатура выбора сменщика
function getReplacementKeyboard(replecament, reportType) {
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

// Клавиатура для админа (добавляем в конце файла)
function getAdminKeyboard() {
  return {
    buttons: [
      [
        {
          action: { type: `text`, label: `➕ ${COMMANDS.ADD_PVZ_TO_DB.toUpperCase()}` },
          color: `positive`,
        },
        {
          action: { type: `text`, label: `🗑️ ${COMMANDS.DELETE_PVZ_FROM_DB.toUpperCase()}` },
          color: `negative`,
        },
      ],
      [{ action: { type: `text`, label: `📋 ${COMMANDS.LIST_PVZ.toUpperCase()}` }, color: `primary` }],
      [{ action: { type: `text`, label: `☰ ${COMMANDS.UNSUBSCRIPTIONS_MENU.toUpperCase()}` }, color: `primary` }],
      [{ action: { type: `text`, label: `🔙 ${COMMANDS.BACK.toUpperCase()}` }, color: `primary` }],
    ],
    one_time: false,
  };
}

function getUnsubscriptionsKeyboard() {
  return {
    buttons: [
      [
        {
          action: { type: `text`, label: `📊 ${COMMANDS.REPORT_OPENING.toUpperCase()}` },
          color: `positive`,
        },
        {
          action: { type: `text`, label: `📊 ${COMMANDS.REPORT_CLOSING.toUpperCase()}` },
          color: `positive`,
        },
      ],
      [
        {
          action: { type: `text`, label: `❌ ${COMMANDS.MISSING_OPENING.toUpperCase()}` },
          color: `negative`,
        },
        {
          action: { type: `text`, label: `❌ ${COMMANDS.MISSING_CLOSING.toUpperCase()}` },
          color: `negative`,
        },
      ],
      [
        {
          action: { type: `text`, label: `🔔 ${COMMANDS.REMIND_OPENING.toUpperCase()}` },
          color: `primary`,
        },
        {
          action: { type: `text`, label: `🔔 ${COMMANDS.REMIND_CLOSING.toUpperCase()}` },
          color: `primary`,
        },
      ],
      [
        {
          action: { type: `text`, label: `🔙 ${COMMANDS.BACK_TO_ADMIN.toUpperCase()}` },
          color: `primary`,
        },
      ],
    ],
    one_time: false,
  };
}

function getWaitingСonfirmationKeyboard() {
  const buttons = [
    [
      {
        action: { type: `text`, label: `✅ ${COMMANDS.YES_DATA_IS_CORRECT.toUpperCase()}`},
        color: `positive`,
      },
    ],
    [
      {
        action: { type: `text`, label: `✏️ ${COMMANDS.EDIT.toUpperCase()}`},
        color: `secondary`,
      }
    ]
  ]
  buttons.push(...getCancelKeyboard().buttons);
  return { buttons, one_time: false }
}

function getRatePvzKeyboard(rate) {
  const buttons = [
    [
      {
        action: { type: `text`, label: `⭐ 5.00`},
        color: `primary`,
      },
      {
        action: { type: `text`, label: `⭐ 4.99`},
        color: `primary`,
      },
      {
        action: { type: `text`, label: `⭐ ${rate}`},
        color: `primary`
      },
    ],
  ]
  buttons.push(...getCancelKeyboard().buttons);
  return { buttons, one_time: false}
}

module.exports = {
  getPrivateKeyboard,
  getUnsubscribeKeyboard,
  getEditProfileKeyboard,
  getCancelKeyboard,
  getPvzKeyboard,
  getReplacementKeyboard,
  getAdminKeyboard,
  getUnsubscriptionsKeyboard,
  getWaitingСonfirmationKeyboard,
  getRatePvzKeyboard
};

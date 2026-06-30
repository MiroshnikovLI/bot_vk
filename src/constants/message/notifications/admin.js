const { formatDate, formatPhone } = require("../../../utils/helpers/helpers");

const ADMIN = {
  // Чаты
  LINK_SUCCESSFULLY: (link) =>
    `Ссылка успешно добавлена: [${link.chat_link}|${link.chat_name}]\n${link.description}`,
  LINK_SUCCESSFULLY_EDIT: (link) =>
    `Изменения успешно сохранены [${link.chat_link}|${link.chat_name}]\n${link.description}`,
  WAITING_ID_WORK_CHATS: (chats, value) => {
    const message = value === 'edit' ? "Введите ID чата для редактирования:" : "Введите ID чата для удаления:";
    const massChats = [];
    let i = 1;
    chats.data.forEach((p) => {
      massChats.push(
        `\n\n${i}) ID: ${p.id}\n Название ссылки: ${p.chat_name} \n Ссылка: ${p.chat_link}\n Описание: ${p.description}`,
      );
    });
    return `${message} ${massChats}`
  },
  FORMAT_CHAT_ID:
    `ID должен:\n` +
    `• Быть числом\n` +
    `• Начинаться с 20000000...\n` +
    `• Например: 2000000038\n\n` +
    `🔍 **Как найти ID вашего чата:**\n` +
    `1. Откройте беседу в ВК (веб-версия)\n` +
    `2. Скопируйте адресную строку\n` +
    `3. Найдите число после "sel=c"\n` +
    `   Например: vk.com/im?sel=c2000000038\n` +
    `⚠️ ID беседы всегда начинается с 20000000...\n ` +
    `Если ID < 2000000000 — это личный диалог.\n`,
  EDIT_LINK_CHATS:
    `Выберите один из вариантов\n` +
    `✏️ Изменить название - изменить название ссылки, которую видит пользователь\n` +
    `✏️ Изменить ссылку - заменить ссылку на чат\n` +
    `✏️ Изменить описание - изменить описание ссылки в списке чатов`,
  WAITING_NEW_VALUE: (value) => {
    if (value === "name") {
      return `Введите название ссылки:`;
    } else if (value === "link") {
      return `Введите ссылку на чат:`;
    } else if (value === "description") {
      return `Введите описание ссылки:`;
    } else if (value === "id") {
      return `Введите ID чата в формате 2000...... \n Изменить его нельзя.`;
    }
  },
  ERROR_LINK_CHAT: "Введите ссылку в формате:  https://vk.me/join/",

  // ПВЗ
  ADD_PVZ_TO_DB:
    "🏪 **ДОБАВЛЕНИЕ НОВОГО ПВЗ**\n\nВведите ID пункта выдачи Wildberries (только цифры):\n\nИли введите 'отмена' для выхода.",
  WAITING_ID_PVZ_TO_SET_ACTIVE: (status) => {
    let message;
    if (status) {
      message = "восстановления";
    } else {
      message = "удаления";
    }
    return `Введи ID (только цифры) пункта выдачи для ${message}`;
  },
  WAITING_ADDRESS_PVZ:
    "🏪 Введите адрес ПВЗ.\n Например: \n 1) ул. Аэродромная, 18\n 2) Авиационная улица, 74к4\n 3) Хорошёвское шоссе 25Ак1",
  WAITING_WORK_TIME:
    "⏰ Введите время работы пункта в формате 24 часа.\n Например: 9-22 или 08:00-22:00",
  WORK_TIME_FORMAT: "Введите время в формате 9-22 или 08:00-22:00",
  ADMIN_WAITING_CONFIRMATION: (pvz_id, address, timeWork) =>
    `Проверьте правильность введённых данных:\n\n 1) ID ПВЗ: ${pvz_id}\n 2) Адрес: ${address.city}, ${address.street}, ${address.house}\n 3) Время работы: ${timeWork.open} : ${timeWork.close} `,
  LIST_PVZ: (pvz) => {
    let message = "📋 **СПИСОК ПВЗ**\n\n";
    pvz.forEach((p) => {
      message += `🏪 ${p.pvz_id}\n📍 ${p.address}\n⏰ ${p.open_time || "-"} - ${p.close_time || "-"}\n ⚡ Активен ли ПВЗ: ${p.is_active ? "Да" : "Нет"}\n\n`;
    });
    return message;
  },
  STATUS_PVZ: (pvz) => {
    let message;
    if (pvz.is_active) {
      message = "уже активный";
    } else {
      message = "уже деактивированный";
    }

    return `ПВЗ ${pvz.pvz_id} - ${pvz.address} ${message}`;
  },
  SET_ACTIVE_PVZ_SUCCESSFULLY: (pvz, status) => {
    let message;
    if (status) {
      message = "был успешно восстановлен.";
    } else {
      message = `был успешно удален из базы`;
    }
    return `ПВЗ ${pvz.pvz_id} - ${pvz.address} ${message}`;
  },
  NO_RECEIVE_PVZ: "❌ Не удалось получить список ПВЗ.\n\nПопробуйте позже",
  NOT_FOUND_OR_DEACTIVATED_EARLIER: `⚠️ ПВЗ не найден.`,
  WAITING_PVZ_ID: "🆔 Введите ID ПВЗ (только цифры)",
  PVZ_DEACTIVE: (pvz) =>
    `ПВЗ ${pvz.pvz_id} - ${pvz.address} был деактивирован.\nДля восстановления используйте функцию "Востановить пункт выдачи"`,

  // Информация о менеджере
  WAITING_IFO_MANAGER: `Введите VK ID, WB ID или Фамилию менеджера:`,
  NOT_FIND_MANAGER: (text, value) =>
    `Менеджер ${value === "name" ? `с фамилией ${text} не найден` : `с ID ${text} не найден`}`,
  DATA_MANAGER: (user) => {
    const full_name = user.full_name
      ? `[id${user.vk_id}|${user.full_name}]`
      : "❌ не указано";
    return (
      `\n\n🆔 ID: ${user.id}\n` +
      `👤 ФИО:  ${full_name}\n` +
      `🆔 WB ID: ${user.wb_id || "❌ не указан"}\n` +
      `🆔 VK ID: ${user.vk_id}\n` +
      `📱 Телефон: ${user.phone ? formatPhone(user.phone) : "Не указан"}\n` +
      `🔑 Доступ: ${user.role === "manager" ? "Менеджер" : "Админ"}\n` +
      `⚡ Активен ли профиль: ${user.is_active ? "Да" : "Нет"}\n` +
      `📅 Дата регистрации: ${formatDate(user.created_at)}`
    );
  },
  MANAGER_INFO: (status, massManager) => {
    let sts;
    const massInfoManager = [];
    if (status === "restore") {
      sts = `Введите ID менеджера, которого хотите восстановить:`;
    } else if (status === "deactive") {
      sts = `Введите ID менеджера, которого хотите удалить:`;
    } else {
      sts = `Информация найдена:`;
    }
    massManager.map((e) => massInfoManager.push(ADMIN.DATA_MANAGER(e)));
    return `${sts} ${massInfoManager}`;
  },
  STATUS_MANAGER: (user, status) => {
    let message;

    if (status === 'restore') {
      message = 'успешно восстановлен.'
    } else if (status === 'deactive') {
      message = 'успешно удален.'
    } else {
      message = user.is_active ? 'уже активный' : 'уже деактивированный';
    }

    return `Пользователь ${user.full_name} ${message}`;
  },


  // Отчеты
  NO_REPORT_TO_DAY: "Нет отчетов за сегодня",
  PVZ_ALL_UNSUBSCRIBED: "Все пункты отписались",
  SHIFT_REPORT: (pvzs, users, reports, reportType) => {
    const reportMessage = [];
    reports.forEach((report) => {
      const pvz = pvzs.find((p) => p.id === report.pvz_id);
      const user = users.find((p) => p.id === report.user_id);
      if (pvz && user) {
        const message =
          report.report_type === "open"
            ? `1) ${pvz.pvz_id} - ${pvz.address}\n` +
              `2) Отчёт об открытии отправлен в ${report.report_time.split(".")[0]}\n` +
              `3) Менеджер в смене:  [id${user.vk_id}|${user.full_name}] ${user.wb_id}\n\n`
            : `1) ${pvz.pvz_id} - ${pvz.address}\n` +
              `2) Отчёт о закрытии отправлен в ${report.report_time.split(".")[0]}\n` +
              `3) Смену отработал: [id${user.vk_id}|${user.full_name}] ${user.wb_id}\n\n`;
        reportMessage.push(message);
      }
    });
    return (
      `📋 **ОТЧЁТЫ ОБ ОТКРЫТИИ**\n\n${reportMessage.join("")}` +
      `Всего ПВЗ: ${pvzs.length}\n` +
      `Отписалось: ${reportMessage.length}\n` +
      `Осталось: ${pvzs.length - reportMessage.length}`
    );
  },
  NO_REPORT: (pvzList, reportType) => {
    const reportMessage = [];
    let count = 1;
    pvzList.forEach((p) => {
      (reportMessage.push(`${count}) ${p.pvz_id} - ${p.address}\n`), count++);
    });

    return (
      `📋 **ПУНКТЫ, КОТОРЫЕ ЕЩЁ НЕ ПРИСЛАЛИ ОТЧЁТ ${reportType === "open" ? "ОБ ОТКРЫТИИ ПВЗ" : "О ЗАКРЫТИИ ПВЗ"}**\n\n${reportMessage.join("")}` +
      `Всего не отписалось: ${reportMessage.length}`
    );
  },
  REMIND_SHIFT: (pvzList, reportType, user) => {
    const reportMessage = [];
    let count = 1;
    pvzList.forEach((p) => {
      (reportMessage.push(`${count}) ${p.pvz_id} - ${p.address}\n`), count++);
    });

    return (
      `📋 **ПУНКТЫ, КОТОРЫЕ ЕЩЁ НЕ ПРИСЛАЛИ ОТЧЁТ ${reportType === "open" ? "ОБ ОТКРЫТИИ ПВЗ" : "О ЗАКРЫТИИ ПВЗ"}**\n\n${reportMessage.join("")}\n\n` +
      `Всего не отписалось: ${reportMessage.length}\n` +
      `Старший менеджер: ${user.full_name}`
    );
  },
};

module.exports = {
  ADMIN,
};

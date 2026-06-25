const { getWorkChats } = require('../services/index');
const { formatPhone, formatDate } = require('../utils/helpers');

const START = "👋 Добро пожаловать! Давайте настроим ваш профиль.\n\n📝 Введите ваше ФИО полностью:";

const ADMIN_MENU =
  `🛡️ **АДМИН-ПАНЕЛЬ**\n\n` +
  `☰ Меню пвз - просмотр списка пвз, добавление/удаление пвз\n` +
  `☰ Меню отписок - просмотр отчетов, создание отчетов, напоминание об отписках\n` +
  `☰ Меню менеджеров - просмотр данных/отчетов менеджера\n` +
  `🔙 Назад - вернуться в предыдущее меню`;

const SETTINGS_LIST_CHATS = `🔧 **НАСТРОЙКИ СПИСКА РАБОЧИХ ЧАТОВ**\n\n` +
  `📋 Рабочие чаты - получить список рабочих чатов\n` +
  `✏️ Редактировать список - отредактировать уже созданный список чатов\n` +
  `➕ Добавить чат - добавить новый чат в список\n` + 
  `🗑️ Удалить чат - удалить чат из списка`;

const EDIT_LINK_CHATS = `Выберите один из вариантов\n` +
  `✏️ Изменить название - изменить название ссылки которую видит пользователь\n` +
  `✏️ Изменить ссылку - заменить ссылку на чат\n` + 
  `✏️ Изменить описание - изменить описание ссылки в списке чатов`;

const PVZ_MENU = 
  `➕ Добавить ПВЗ - добавить новый пункт выдачи в базу\n` +
  `❌ Удалить пункт выдачи - удалить пункт выдачи из базы\n` +
  `📋 Список ПВЗ - просмотр всех ПВЗ\n`;

const MY_DATA = (user, pvz_list, replacementList) =>
  `📋 **ВАШ ПРОФИЛЬ**\n\n` +
  `👤 ФИО: ${user.full_name || "❌ не указано"}\n` +
  `🆔 WB ID: ${user.wb_id || "❌ не указан"}\n` +
  `📱 Телефон: ${user.phone ? formatPhone(user.phone) : 'Не указан'}\n\n` +
  `🏪 Закрепленные ПВЗ:\n` +
  `${pvz_list}\n\n` +
  `👤 Закрепленные сменщики:\n` +
  `${replacementList}\n\n`;

const DATA_MANAGER = (user) => {
  const full_name = user.full_name ? `[id${user.vk_id}|${user.full_name}]` : "❌ не указано";
  return `\n\n🆔 ID: ${user.id}\n` +
  `👤 ФИО:  ${full_name}\n` +
  `🆔 WB ID: ${user.wb_id || "❌ не указан"}\n` +
  `🆔 VK ID: ${user.vk_id}\n` +
  `📱 Телефон: ${user.phone ? formatPhone(user.phone) : 'Не указан'}\n` +
  `🔑 Доступ: ${user.role === "manager" ? 'Менеджер' : 'Админ'}\n` +
  `⚡ Активен ли профиль: ${user.is_active ? 'Да' : 'Нет'}\n` +
  `📅 Дата регистрации: ${formatDate(user.created_at)}`;
}

const DEACTIVE_USER = (status = false) => status ? `Ваш профиль был восстановлен. Вам снова доступны все функции бота.` : `Ваш профиль был удален. Для восстановления обратитесь к администрации.`;

const CHANGE_DATA =
  `✏️ **Изменение данных**\n\n` +
  `• ✏️ Изменить ФИО - обновить ФИО\n` +
  `• ✏️ Изменить WB ID - обновить ID сотрудника\n`;

const CHANGE_NAME = "✏️ Введите ваше новое ФИО полностью:";

const CHANGE_PHONE = "✏️ Введите номер телефона:"

const CHANGE_WB_ID = "🆖 Введите ваш новый WB ID (только цифры):";

const OPERATION_CANCELLED = "❌ Операция отменена"

const UNSUBSCRIBE_SETTINGS =
  `🏪 **НАСТРОЙКИ ОТПИСКИ**\n\n` +
  `• ➕ Добавить ПВЗ - для отписок\n` +
  `• 🗑️ Удалить ПВЗ - из отписок\n` +
  `• ➕ Добавить сменщика - для отписок\n` +
  `• 🗑️ Удалить сменщика - из отписок\n` +
  `• 🔙 Назад - вернуться\n`;

const ADD_PVZ_FOR_REQUEST =
  "🏪 **ДОБАВЛЕНИЕ ПВЗ ДЛЯ ОТПИСОК**\n\nВведите ID пункта выдачи Wildberries:\n\nИли введите 'Отмена' для выхода.";

const DELETE_PVZ_FOR_REQUEST =
  "🗑️ **УДАЛЕНИЕ ПВЗ ИЗ ОТПИСОК**\n• Введите ID пункта выдачи Wildberries для удаления из отписок\n• Или введите 'Отмена' для выхода.";

const ADD_REPLECAMENT =
  "➕ **ДОБАВИТЬ СМЕНЩИКА ДЛЯ ОТПИСОК**\n\n•" +
  " Введите WB ID сменщика (только цифры)\n•" +
  " WB ID можно найти в отписках или спросить лично\n•" +
  " Или введите 'Отмена' для выхода.";

const DELETED_A_REPLACEMENT =
  "🗑️ **УДАЛИТЬ СМЕНЩИКА ИЗ ОТПИСОК**\n\n• Введите WB ID сменщика (только цифры)\n• Можно найти в отписках или спросить лично\n• Или введите 'Отмена' для выхода.";

const NO_ACCESS_RIGHTS = "❌ Нет прав доступа.";

const MANAGER_INFO = (status, massManager) => {
  let sts;
  const massInfoManager = [];
  if (status === 'restore') {
    sts = `Введите ID менеджера которого хотите восстановить:`
  } else if (status === 'deactive') {
    sts = `Введите ID менеджера которого, хотите удалить:`
  } else {
    sts = `Информация найдена:`
  }

  massManager.map((e) => massInfoManager.push(DATA_MANAGER(e)));

  return `${sts} ${massInfoManager}`
};

const MANAGER_STATUS = (status, manager, chats = false) => {
  let sts;
  const massInfoManager = DATA_MANAGER(manager);
  
  if (status) {
    sts = `Менеджер восстановлен` 
  } else {
    sts = `Менеджер удален`
  }

  return `${sts} ${massInfoManager}\n\n ${chats ? chats : ''}`
}

const NOTIFICATIONS = {
  START_REGISTRATION: "Здравствуйте! Для использования бота нужно зарегистрироваться. Пожалуйста, введите ваше ФИО.",
  WAITING_IFO_MANAGER: `Введите VK ID, WB ID или Фамилию менеджера:`,
  NOT_FIND_MANAGER: (text, value) => `Менеджер ${ value === 'name' ? `с фамилией ${text} не найден` : `с ID ${text} не найден`}`, 
  FORMAT_CHAT_ID: `ID должен:\n` + 
    `• Быть числом\n` +
    `• Начинаться с 20000000...\n`+
    `• Например: 2000000038\n\n` +

    `🔍 **Как найти ID вашего чата:**\n` +
    `1. Откройте беседу в ВК (веб-версия)\n` +
    `2. Скопируйте адресную строку\n`+
    `3. Найдите число после "sel=c"\n` +
    `   Например: vk.com/im?sel=c2000000038\n` +

    `⚠️ ID беседы всегда начинается с 20000000...\n `+ 
    `Если ID < 2000000000 — это личный диалог.\n`,
  WAITING_NEW_VALUE: (value) =>  {
    if (value === 'name') {
      return `Введите название ссылки:`;
    } else if (value === 'link') {
      return `Введите ссылку на чат:`;
    } else if (value === 'description') {
      return `Введите описание ссылки:`
    } else if (value === 'id') {
      return `Введите ID чата в формате 2000...... \n Изменить его нельзя.`
    }
     
  },
  PHONE_SUCCESSFULLY: (phone) => `✅ Номер успешно изменен ${formatPhone(phone)}`,
  LINK_SUCCESSFULLY: (link) => `Ссылка успешно добавлена: [${link.chat_link}|${link.chat_name}]\n ${link.description}`,
  ERROR_LINK_CHAT: "Введите ссылку в формате:  https://vk.me/join/",
  WAITING_ID_WORK_CHATS: 'Введите ID чата для редактирования:',
  NO_REPORT_TO_DAY: 'Нет отчетов за сегодня',
  PVZ_ALL_UNSUBSCRIBED: 'Все пункты отписались',
  REPORT_SENT: 'Отчет отправлен в чат',
  PROFILE_NOT_FILLED: "⚠️ Ваш профиль не заполнен. Пожалуйста, заполните данные.",
  NO_PVZ: "⚠️ У вас не закреплено ни одного ПВЗ. Пожалуйста, заполните данные.",
  NAME_SUCCESSFULLY_WAITING_WB_ID: (text) => `✅ ФИО сохранено: ${text}\n\n🔢 Теперь введите ваш WB ID (цифры):`,
  PROFILE_COMPLETED_SUCCESSFULLY: (name, text) => `✅ Профиль успешно настроен!\n\nВаши данные:\n👤 ФИО: ${name}\n🆔 WB ID: ${text}\n\nТеперь вы можете отправлять отчеты в беседе.`,
  GOOD_WORK: "✅ Вы сегодня хорошо потрудились. Приходите завтра.",
  NO_OPEN_SHIFTS: "✅ У вас нет открытых смен.",
  NO_PVZ_LIST: "📋 Список ПВЗ пуст.",
  CHOOSE_PVZ: "🏪 Выберите ПВЗ:",
  CHOOSE_REPLACEMENT: "👤 Пожалуйста, выберите сменщика",
  CHOOSE_RATE_PVZ: "Введите рейтинг ПВЗ в формате: 5 4,99 4.99",
  WAITING_PVZ_ID: "🆔 Введите ID ПВЗ (только цифры)",
  WAITING_ADDRESS_PVZ: "🏪 Введите адрес ПВЗ.\n Например: \n 1) ул. Аэродромная, 18\n 2) Авиационная улица, 74к4\n 3) Хорошёвское шоссе 25Ак1",
  ADMIN_WAITING_WORK_TIME: "⏰ Введите время работы пункта в формате 24 часа.\n Например: 9-22 или 08:00-22:00",
  ERROR: "❌ Ошибка операции попробуйте еще раз.",
  TECHNICAL_ERROR: "Техническая ошибка. Обратитесь к администратору.",
  WARNING_ID_ONLY_NUMBERS: "❌ ID должен содержать только цифры.\n\nПопробуйте еще раз:",
  WARNING_RATE_ONLY_NUMBERS: "❌ Введите рейтинг в формате (только цифры): 5.00 5,00 5",
  NO_RECEIVE_PVZ: "❌ Не удалось получить список ПВЗ.\n\nПопробуйте позже",
  DELETED_SUCCESSFULLY: (text) => `ПВЗ ${text} был успешно удален из базы`,
  ERROR_DELETED: `Ошибка при удалении. Попробуйте позже`,
  PVZ_ADDED: (pvz) => `✅ ПВЗ ${pvz.id} - ${pvz.address} успешно добавлен.`,
  PVZ_ALREADY_ADDED: (pvz) => `ПВЗ ${pvz.pvz_id} - ${pvz.address} уже добавлен.`,
  PVZ_NOT_FOUND: (pvz) => `❌ ПВЗ с кодом "${pvz}" не найден.`,
  PVZ_NOT_FOUND_SEARCH: (pvz) => `ПВЗ ${pvz} не найден. Пожалуйста выберите из списка`,
  PVZ_NOT_FOUND_PINNED: (pvz) => `❌ ПВЗ ${pvz.pvz_id} - ${pvz.address}\n Не был найден в закрепленных`,
  PVZ_SUCCESSFULLY_DELETED: (pvz) => `✅ Успешно удалено из отписок\n 📍ПВЗ ${pvz.pvz_id} - ${pvz.address}\n`,
  USER_NOT_FOUND: (user) => `❌ Пользователь с WB ID: ${user} не найден`,
  REPLACEMENT_ALREADY_ADDED: (user) => `✅ Сменщик уже добавлен.\n• ${user.full_name}`,
  REPLACEMENT_FOUND_ADDED: (user) => `✅ Сменщик успешно добавлен.\n• ${user.full_name}`,
  REPLACEMENT_FOUND_DELETED: (text) => `✅ Сменщик успешно удален из отписок.\n• ${text}`,
  REPLACEMENT_NOT_FOUND: (text) => `❌ Сменщик ${text} не найден.\n`,
  ERROR_ADDED_REPLACEMENT: (message) => `${message}\n❌ Не удалось добавить сменщика\n• Повторите операцию позже.`,
  ADMIN_WAITING_CONFIRMATION: (pvz_id, address, timeWork) => `Проверьте правильность введённых данных:\n\n 1) ID ПВЗ: ${pvz_id}\n 2) Адрес: ${address.city}, ${address.street}, ${address.house}\n 3) Время работы: ${timeWork.open} : ${timeWork.close} `,
  LIST_PVZ: (pvz) => {
    let message = "📋 **СПИСОК ПВЗ**\n\n";
    pvz.forEach((p) => {
      message += `🏪 ${p.pvz_id}\n📍 ${p.address}\n⏰ ${p.open_time || "-"} - ${p.close_time || "-"}\n\n`;
    });
    return message;
  },
  SHIFT_CLOSED: (pvzId, address) =>
    `Закрытие смены ${pvzId} - ${address}\n\n🏪 Выберите сменщика:`,
  OPEN_SHIFT_EXISTS: (pvzId, address) =>
    `✅ У вас есть открытая смена ${pvzId} - ${address}`,
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
  REPORT_TEXT: async (pvz, user, replecament, reportType, rate) => {
    const replecamentText =
      replecament.length === 0
        ? ""
        : `7. Завтра в смене: [id${replecament.vk_id}|${replecament.full_name}] ${replecament.wb_id}`;

    const reportText =
      reportType === "open"
        ? `1. ${pvz.pvz_id} #${pvz.address}\n2. В смене: [id${user.vk_id}|${user.full_name}] ${user.wb_id}\n`
        : `1. ${pvz.pvz_id} #${pvz.address}\n` +
          `2. Реестр курьеров: Закрыт\n` +
          `3. Вывеска: Горит\n` +
          `4. Непринятых ШК: 0\n` +
          `5. В смене: [id${user.vk_id}|${user.full_name}] ${user.wb_id}\n` +
          `6. Рейтинг ПВЗ: ${rate.value}\n` +
          `${replecamentText}`;

    return reportText;
  },
  CHANGE_NAME: (text) => `✅ ФИО изменено на: ${text}`,
  CHANGE_WB_ID: (text) => `✅ WB ID изменен на: ${text}`,
  CHECK_CORRECTNESS: (text) => `${text}\n Проверьте правильность введенного WB ID`,
};

const ADD_PVZ_TO_DB =
  "🏪 **ДОБАВЛЕНИЕ НОВОГО ПВЗ**\n\nВведите ID пункта выдачи Wildberries (только цифры):\n\nИли введите 'отмена' для выхода.";

const WAITING_ID_PVZ_TO_DELETE =
  "Введи ID (только цифры) пункта выдачи для удаления";

const UNSUBSCRIBE_MENU =
  `☰ **МЕНЮ ОТПИСОК**\n\n` +
  "• 📊 Открытие ПВЗ - отчет об открытии ПВЗ\n" +
  "• 📊 Закрытие ПВЗ - отчет о закрытии ПВЗ\n" +
  "• ❌ Нет отчета открытия - отчет: какие пункты еще не отчитались об открытии ПВЗ\n" +
  "• ❌ Нет отчета закрытия - отчет: какие пункты еще не отчитались о закрытии ПВЗ\n" +
  "• 🔔 Напомнить об открытии - отправить отчет в чат с ПВЗ, которые еще не отчитались об открытии\n" +
  "• 🔔 Напомнить о закрытии - отправить отчет в чат с ПВЗ, которые еще не отчитались о закрытии\n";

const MENU_MANAGER = 
  `☰ **МЕНЮ МЕНЕДЖЕРОВ**\n\n` +
  `• 🔍 Запросить данные менеджера - из базы данных\n` +
  `• 🗑️ Удалить менеджера - удалить учетную запись менеджера и из рабочих чатов`;

module.exports = {
  START,
  ADMIN_MENU,
  MY_DATA,
  CHANGE_DATA,
  CHANGE_NAME,
  CHANGE_WB_ID,
  UNSUBSCRIBE_SETTINGS,
  ADD_PVZ_FOR_REQUEST,
  DELETE_PVZ_FOR_REQUEST,
  ADD_REPLECAMENT,
  DELETED_A_REPLACEMENT,
  NO_ACCESS_RIGHTS,
  NOTIFICATIONS,
  ADD_PVZ_TO_DB,
  WAITING_ID_PVZ_TO_DELETE,
  UNSUBSCRIBE_MENU,
  OPERATION_CANCELLED,
  CHANGE_PHONE,
  PVZ_MENU,
  SETTINGS_LIST_CHATS,
  EDIT_LINK_CHATS,
  DATA_MANAGER,
  MENU_MANAGER,
  DEACTIVE_USER,
  MANAGER_INFO,
  MANAGER_STATUS
};

const { formatPhone } = require('../../../utils/helpers/helpers');

const USER = {
  // Профиль
  NAME_SUCCESSFULLY_WAITING_WB_ID: (text) => `✅ ФИО сохранено: ${text}\n\n🔢 Теперь введите ваш WB ID (цифры):`,
  NAME_SUCCESSFULLY_WAITING_PHONE: (text, wbId) => `✅ ФИО сохранено: ${text}\n\n✅ WB ID: ${wbId}\n\n📱 Теперь введите ваш номер телефона:`,
  WB_ID_SWCCESSFULLY_WAITING_PHONE: (name, wbId) => `✅ ФИО: ${name}\n\n✅ WB ID сохранён: ${wbId}\n\n📱 Теперь введите ваш номер телефона:`,
  PROFILE_COMPLETED_SUCCESSFULLY: (name, wbId, phone) => 
    `✅ Профиль успешно настроен!\n\n` +
    `Ваши данные:\n` +
    `👤 ФИО: ${name}\n` +
    `🆔 WB ID: ${wbId}\n` +
    `📱 Телефон: ${phone}\n\n` +
    `Теперь вы можете отправлять отчеты в беседе.`,
  PROFILE_NOT_FILLED:
    "⚠️ Ваш профиль не заполнен. Пожалуйста, заполните данные.",
  CHANGE_PHONE: "✏️ Введите номер телефона:",
  NUMBER_NOT_VALID: "Неверный формат телефона\nВведите в формате:\n+7 999 123-45-67\n8 999 123-45-67\n89991234567\n79991234567\n9991234567",
  CHANGE_PHONE_SUCCESSFULLY: (phone) => `✅ Номер успешно изменен ${formatPhone(phone)}`,
  CHANGE_NAME: "✏️ Введите ваше ФИО полностью:",
  NAME_NOT_VALID: `В ФИО можно использовать только русские буквы, пробелы, дефис и точку.\n\n` +
    `Например:\n\n` +
    `📌 Иванов Иван Иванович\n` +
    `📌 Салтыков-Щедрин\n` +
    `📌 Анна-Мария\n` +
    `Пожалуйста, введите ФИО заново.`,
  PROFILE_NOT_FILLED: (text) => {
    let message;
    if (text === 'name') {
      message = USER.CHANGE_NAME
    } else if (text === 'wbId') {
      message = USER.WAITING_WB_ID
    } else {
      message = USER.CHANGE_PHONE
    }
    return `Ваш профиль полностью не заполнен пожалуйста ${message}`

  },
  CHANGE_NAME_SUCCESSFULLY: (text) => `✅ ФИО изменено на: ${text}`,
  WAITING_WB_ID: "🆖 Введите ваш WB ID (только цифры):",
  WB_ID_USER_REPLACEMENT: (wbId, user) => `⚠️ **WB ID ${wbId} уже используется**\n\n` +
    `Этот WB ID привязан к профилю сменщика ${user.full_name}.\n\n` +
    `🔹 **Если это ваш WB ID** — вы можете занять этот профиль. Все данные (ФИО, телефон) будут перенесены на ваш аккаунт.\n` +
    `🔹 **Если это не ваш WB ID** — проверьте правильность ввода.\n\n` +
    `Хотите использовать этот профиль? \n\n` +
    `✅ **Да** — перенести данные \n` +
    `❌ **Нет** — ввести другой WB ID`,
  INVALID_YES_NO_RESPONSE: `❌ **Я не понял ваш ответ.**\n\n` +
    `Пожалуйста, выберите один из вариантов:\n\n` +
    `✅ **Да** — перенести данные \n` +
    `❌ **Нет** — ввести другой WB ID\n` +
    `Или нажмите на кнопку ниже.`,
  WB_ID_USER_USER: (wbId) => `⚠️ **WB ID ${wbId} уже используется другим пользователем**\n\n` + 
    `Если это ваш WB ID обратитесь к администратору`,
  CHECK_CORRECTNESS: (text) => `${text}\n Проверьте правильность введенного WB ID`,
  MY_DATA: (user, pvz_list, replacementList) => { return `📋 **ВАШ ПРОФИЛЬ**\n\n` +
      `👤 ФИО: ${user.full_name || "❌ не указано"}\n` +
      `🆔 VK ID: ${user.vk_id || "❌ не указан"}\n` +
      `🆔 WB ID: ${user.wb_id || "❌ не указан"}\n` +
      `📱 Телефон: ${user.phone ? formatPhone(user.phone) : 'Не указан'}\n\n` +
      `🏪 Закрепленные ПВЗ:\n` +
      `${pvz_list}\n\n` +
      `👤 Закрепленные сменщики:\n` +
      `${replacementList}\n\n`
    },
  DATA_SUCCESSFULLY_TRANSFERRED: `✅ Данные успешно перенесены в новый профиль.\n\n` +
    `🔍 Пожалуйста, проверьте правильность перенесённых данных в разделе «Мои данные».\n\n`,
  DEACTIVE_USER: (status = false) => 
    status ? 
      `Ваш профиль был восстановлен. Вам снова доступны все функции бота.` : 
      `Ваш профиль был удален. Для восстановления обратитесь к администрации.`,

  // ПВЗ
  WARNING_RATE_ONLY_NUMBERS: "❌ Введите рейтинг в формате (только цифры): 5.00 5,00 5",
  ADD_PVZ_FOR_REQUEST:
  "🏪 **ДОБАВЛЕНИЕ ПВЗ ДЛЯ ОТПИСОК**\n\nВведите ID пункта выдачи Wildberries:\n\nИли введите 'Отмена' для выхода.",
  DELETE_PVZ_FOR_REQUEST:
  "🗑️ **УДАЛЕНИЕ ПВЗ ИЗ ОТПИСОК**\n• Введите ID пункта выдачи Wildberries для удаления из отписок\n• Или введите 'Отмена' для выхода.",
  OPEN_SHIFT_FOR_DELETE: 'У вас есть открытая смена в ПВЗ.\nУдалить из закрепленных можно только после закрытия смены',
  NO_PVZ: "⚠️ У вас не закреплено ни одного ПВЗ. Пожалуйста, заполните данные.",
  NO_PVZ_LIST: "📋 Список ПВЗ пуст.",
  CHOOSE_PVZ: "🏪 Выберите ПВЗ:",
  CHOOSE_RATE_PVZ: (pvz, user) => `Закрытие смены ${pvz.pvz_id} - ${pvz.address}\n` +
    `Завтра в смене: ${user.vk_id ? `[id${user.vk_id}|${user.full_name}]` : `${user.full_name}`} ${user.wb_id}\n\n` +
    "Введите рейтинг ПВЗ в формате: 5 4,99 4.99", 
  PVZ_NOT_FOUND: (pvz) => `❌ ПВЗ с кодом "${pvz}" не найден.`,
  PVZ_NOT_FOUND_SEARCH: (pvz) => `ПВЗ ${pvz} не найден. Пожалуйста выберите из списка`,
  PVZ_NOT_FOUND_PINNED: (pvz) => `❌ ПВЗ ${pvz.pvz_id} - ${pvz.address}\n Не был найден в закрепленных`,
  PVZ_SUCCESSFULLY_DELETED: (pvz) => `✅ Успешно удалено из отписок\n📍 ПВЗ ${pvz.pvz_id} - ${pvz.address}\n`,

  // Сменщики
  ADD_REPLACEMENT: "➕ **ДОБАВИТЬ СМЕНЩИКА ДЛЯ ОТПИСОК**\n\n•" +
  " Введите WB ID сменщика (только цифры)\n•" +
  " WB ID можно найти в отписках или спросить лично\n•" +
  " Или введите 'Отмена' для выхода.",
  DELETED_A_REPLACEMENT:
  "🗑️ **УДАЛИТЬ СМЕНЩИКА ИЗ ОТПИСОК**\n\n• Введите WB ID сменщика (только цифры)\n• Или введите 'Отмена' для выхода.",
  CHOOSE_REPLACEMENT: "👤 Пожалуйста, выберите сменщика",
  WAITING_WB_ID_REPLACEMENT: "Введите WB ID сменщика.\n Можно найти в отписках или спросить лично\n",
  WAITING_FULL_NAME_REPLACEMENT: "Введите ФИО сменщика.",
  WAITING_NUMBER_REPLACAMENT: "Введите номер телефона сменщика:",
  REPLACEMENT_ALREADY_ADDED: (user) => `✅ Сменщик уже добавлен.\n• ${user.full_name}`,
  REPLACEMENT_FOUND_ADDED: (user) => `✅ Сменщик успешно добавлен.\n• ${user.full_name}`,
  REPLACEMENT_FOUND_DELETED: (text) => `✅ Сменщик успешно удален из отписок.\n• ${text}`,
  REPLACEMENT_NOT_FOUND: (text) => `❌ Сменщик ${text} не найден.\n`,
  ERROR_ADDED_REPLACEMENT: (message) => `${message}\n❌ Не удалось добавить сменщика\n• Повторите операцию позже.`,
  DATA_REPLACEMENT: (user) => {
    const full_name = user.full_name
      ? `[id${user.vk_id}|${user.full_name}]`
      : "❌ не указано";
    return (
      `\n\n1) 🆔 ID: ${user.id}\n` +
      `2) 👤 ФИО:  ${full_name}\n` +
      `3) 🆔 WB ID: ${user.wb_id || "❌ не указан"}\n` +
      `4) 🆔 VK ID: ${user.vk_id || "❌ не указан"}`
    );
  },

  // Отчеты
  GOOD_WORK: "✅ Вы сегодня хорошо потрудились. Приходите завтра.",
  NO_OPEN_SHIFTS: "✅ У вас нет открытых смен.",
  SHIFT_CLOSED: (pvzId, address) =>
    `Закрытие смены ${pvzId} - ${address}\n\n🏪 Выберите сменщика:\n\nВведите WB ID, VK ID или Фамилию сменщика.`,
  OPEN_SHIFT_EXISTS: (pvzId, address) =>
    `✅ У вас есть открытая смена ${pvzId} - ${address}`,
  REPORT_TEXT: (pvz, user, replacement, reportType, rate) => {
    const replacementText =
      replacement.length === 0
        ? ""
        : `7. Завтра в смене: ${ replacement.vk_id ? `[id${replacement.vk_id}|${replacement.full_name}]` : `${replacement.full_name}`} ${replacement.wb_id}`;

    const reportText =
      reportType === "open"
        ? `1. ${pvz.pvz_id} #${pvz.address}\n2. В смене: [id${user.vk_id}|${user.full_name}] ${user.wb_id}\n`
        : `1. ${pvz.pvz_id} #${pvz.address}\n` +
          `2. Реестр курьеров: Закрыт\n` +
          `3. Вывеска: Горит\n` +
          `4. Непринятых ШК: 0\n` +
          `5. В смене: [id${user.vk_id}|${user.full_name}] ${user.wb_id}\n` +
          `6. Рейтинг ПВЗ: ${rate.value}\n` +
          `${replacementText}`;

    return reportText;
  },
}

module.exports = {
  USER
}
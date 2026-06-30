const { formatPhone } = require('../../../utils/helpers/helpers');

const USER = {
  // Профиль
  NAME_SUCCESSFULLY_WAITING_WB_ID: (text) => `✅ ФИО сохранено: ${text}\n\n🔢 Теперь введите ваш WB ID (цифры):`,
  PROFILE_COMPLETED_SUCCESSFULLY: (name, text) => `✅ Профиль успешно настроен!\n\nВаши данные:\n👤 ФИО: ${name}\n🆔 WB ID: ${text}\n\nТеперь вы можете отправлять отчеты в беседе.`,
  PROFILE_NOT_FILLED:
    "⚠️ Ваш профиль не заполнен. Пожалуйста, заполните данные.",
  CHANGE_PHONE: "✏️ Введите номер телефона:",
  CHANGE_PHONE_SUCCESSFULLY: (phone) => `✅ Номер успешно изменен ${formatPhone(phone)}`,
  CHANGE_NAME: "✏️ Введите ваше ФИО полностью:",
  CHANGE_NAME_SUCCESSFULLY: (text) => `✅ ФИО изменено на: ${text}`,
  CHANGE_WB_ID: "🆖 Введите ваш WB ID (только цифры):",
  CHANGE_WB_ID_SUCCESSFULLY: (text) => `✅ WB ID изменен на: ${text}`,
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
  CHOOSE_RATE_PVZ: "Введите рейтинг ПВЗ в формате: 5 4,99 4.99",
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
  "🗑️ **УДАЛИТЬ СМЕНЩИКА ИЗ ОТПИСОК**\n\n• Введите WB ID сменщика (только цифры)\n• Можно найти в отписках или спросить лично\n• Или введите 'Отмена' для выхода.",
  CHOOSE_REPLACEMENT: "👤 Пожалуйста, выберите сменщика",
  REPLACEMENT_ALREADY_ADDED: (user) => `✅ Сменщик уже добавлен.\n• ${user.full_name}`,
  REPLACEMENT_FOUND_ADDED: (user) => `✅ Сменщик успешно добавлен.\n• ${user.full_name}`,
  REPLACEMENT_FOUND_DELETED: (text) => `✅ Сменщик успешно удален из отписок.\n• ${text}`,
  REPLACEMENT_NOT_FOUND: (text) => `❌ Сменщик ${text} не найден.\n`,
  ERROR_ADDED_REPLACEMENT: (message) => `${message}\n❌ Не удалось добавить сменщика\n• Повторите операцию позже.`,

  // Отчеты
  GOOD_WORK: "✅ Вы сегодня хорошо потрудились. Приходите завтра.",
  NO_OPEN_SHIFTS: "✅ У вас нет открытых смен.",
  SHIFT_CLOSED: (pvzId, address) =>
    `Закрытие смены ${pvzId} - ${address}\n\n🏪 Выберите сменщика:`,
  OPEN_SHIFT_EXISTS: (pvzId, address) =>
    `✅ У вас есть открытая смена ${pvzId} - ${address}`,
  REPORT_TEXT: (pvz, user, replacement, reportType, rate) => {
    const replacementText =
      replacement.length === 0
        ? ""
        : `7. Завтра в смене: [id${replacement.vk_id}|${replacement.full_name}] ${replacement.wb_id}`;

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
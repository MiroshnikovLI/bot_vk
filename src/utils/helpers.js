const { query } = require("../config/database");
const { getUserVkId } = require("../services/userService");

// Функция извлекает время открытия и закрытия из строки расписания
function parseScheduleTime(scheduleString) {
  if (!scheduleString) return { open: null, close: null };
  
  // Пробуем найти время в формате ЧЧ:ММ
  let times = scheduleString.match(/(\d{1,2}:\d{2})/g);
  
  // Если не нашли, пробуем формат ЧЧ-ЧЧ (например, "9-22")
  if (!times || times.length < 2) {
    const rangeMatch = scheduleString.match(/(\d{1,2})\s*[-–—]\s*(\d{1,2})/);
    if (rangeMatch) {
      const openHour = rangeMatch[1].padStart(2, '0');
      const closeHour = rangeMatch[2].padStart(2, '0');
      return {
        open: `${openHour}:00`,
        close: `${closeHour}:00`
      };
    }
  }
  
  // Если нашли время в формате ЧЧ:ММ
  if (times && times.length >= 2) {
    return {
      open: times[0],
      close: times[1]
    };
  }
  
  return { open: null, close: null };
}

// Очищает текст от лишних симвалов
function cleanText(text) {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, "") // оставляет буквы, цифры, пробелы
    .replace(/\s+/g, " ") // заменяет несколько пробелов одним
    .trim(); // убирает пробелы в начале и конце
}

// Извлекает из предложение ID и ФИО
function extractIdAndName(text) {
  // Извлекаем ID (первая группа цифр)
  const idMatch = text.match(/\d+/);
  const id = idMatch ? idMatch[0] : null;

  // Извлекаем ФИО (убираем ID и лишние символы)
  let name = text
    .replace(/\d+/g, "") // убираем цифры
    .replace(/[^\w\sа-яё]/gi, "") // убираем спецсимволы
    .trim(); // убираем лишние пробелы

  return { id, name };
}

function normalizeYo(text) {
  return text.toLowerCase().replace(/ё/g, 'е');
}

function parseAddress(fullAddress) {
  const address = normalizeYo(fullAddress.toLowerCase());
  
  // Извлекаем улицу: убираем город в начале
  let street = address
    .replace(/^(москва,?\s*г\.?\s*москва|москва,?\s*москва|москва|г\.?\s*москва)[,\s]*/i, '')
    .trim();
  
  // Извлекаем номер дома (более точное выражение)
  // Ищем в конце строки: цифры + буквы + цифры + буквы и т.д.
  const houseMatch = address.match(/(\d+[а-я]?\d*[а-я]?\d*(?:[\/\-]\d+[а-я]?)?)\s*$/i);
  let house = '';
  
  if (houseMatch) {
    const fullHouse = houseMatch[1];
    // Разделяем номер дома и строение/корпус
    const matchParts = fullHouse.match(/^(\d+[а-я]?)(?:[\/\-]?(\d+[а-я]?))?/i);
    if (matchParts) {
      house = matchParts[1] || '';
    }
    
    // Убираем номер дома из строки улицы
    street = street.replace(new RegExp(`${fullHouse.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`), '');
  }
  
  // Убираем лишние запятые и пробелы
  street = street.replace(/[,\s]+$/, '').trim();
  
  // Нормализованное название улицы (без "улица", "шоссе" и т.д.)
  let streetNormalized = street
    .replace(/^(ул\.?|улица|ш\.?|шоссе|пр\.?|проспект|бульвар\.?|бульв)\s*/i, '')
    .trim();
  
  // Если нормализованная улица пустая, используем оригинал
  if (!streetNormalized) streetNormalized = street;
  
  return {
    city: 'москва',
    street: street,
    house: house,
    streetNormalized: streetNormalized
  };
}

async function determineReportTypeWithChecks(pvzId, user, timestamp) {
  const reportDate = new Date(timestamp * 1000);
  const hours = reportDate.getHours();
  
  // Определяем целевой день для отчёта
  let targetDate = new Date(reportDate);
  if (hours >= 0 && hours < 6) {
    targetDate.setDate(targetDate.getDate() - 1);
  }
  const dateStr = targetDate.toISOString().split('T')[0];
  
  // 1. Проверяем отчёт об открытии
  const openReport = await query(`
    SELECT id, created_at FROM shift_reports 
    WHERE pvz_id = $1 
      AND user_id = $2 
      AND report_type = 'open'
      AND DATE(created_at) = $3
  `, [pvzId, user.id, dateStr]);
  
  // 2. Проверяем отчёт о закрытии
  const closeReport = await query(`
    SELECT id, created_at FROM shift_reports 
    WHERE pvz_id = $1 
      AND user_id = $2 
      AND report_type = 'close'
      AND DATE(created_at) = $3
  `, [pvzId, user.id, dateStr]);
  
  // 3. Если нет ни одного отчёта — это открытие
  if (openReport.rows.length === 0 && closeReport.rows.length === 0) {
    return { type: 'open', date: dateStr, needConfirmation: false };
  }
  
  // 4. Если есть открытие, но нет закрытия — это закрытие
  if (openReport.rows.length > 0 && closeReport.rows.length === 0) {
    return { type: 'close', date: dateStr, needConfirmation: false };
  }
  
  // 5. Если есть оба отчёта — нужно уточнить (возможно, переотправка)
  if (openReport.rows.length > 0 && closeReport.rows.length > 0) {
    return { 
      type: null, 
      date: dateStr, 
      needConfirmation: true, 
      message: "За сегодня уже есть оба отчёта. Вы хотите переотправить?" 
    };
  }
  
  return { type: null, date: dateStr, needConfirmation: true };
}

module.exports = {
  parseScheduleTime,
  cleanText,
  extractIdAndName,
  parseAddress,
  normalizeYo,
  determineReportTypeWithChecks,
};

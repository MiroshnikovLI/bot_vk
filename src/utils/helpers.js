const { query } = require("../config/database");

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

function formatPhone(phone) {
  if (!phone) return 'не указан';
  
  // Убираем все лишние символы
  const cleaned = String(phone).replace(/\D/g, '');
  
  // Проверяем длину (должно быть 11 цифр для российского номера)
  if (cleaned.length === 11) {
    return `+${cleaned[0]} ${cleaned.slice(1, 4)} ${cleaned.slice(4, 7)}-${cleaned.slice(7, 9)}-${cleaned.slice(9, 11)}`;
  }
  
  // Если номер короче/длиннее — возвращаем как есть
  return phone;
}

function normalizePhone(phone) {
  // Убираем все пробелы, скобки, дефисы
  const cleaned = String(phone).replace(/[\s\-\(\)]/g, '');
  
  // Если начинается с 8 → +7
  if (cleaned.startsWith('8')) {
    return '+7' + cleaned.slice(1);
  }

  // Если начинается с +8 → +7
  if (cleaned.startsWith('+8')) {
    return '+7' + cleaned.slice(2);
  }
  
  // Если начинается с 7 (без +) → +7
  if (cleaned.startsWith('7')) {
    return '+' + cleaned;
  }
  
  // Если уже +7
  if (cleaned.startsWith('+7')) {
    return cleaned;
  }

  if (cleaned.startsWith('9')) {
    return '+7' + cleaned;
  }
  
  return cleaned;
}

function parseAddress(fullAddress) {
  const address = normalizeYo(fullAddress.toLowerCase().trim());
  
  // 1. Извлекаем город (если есть)
  let city = 'москва';
  let addressWithoutCity = address
    .replace(/^(москва,?\s*г\.?\s*москва|москва,?\s*москва|москва|г\.?\s*москва|г\.\s*москва|город\s*москва)[,\s]*/i, '')
    .trim();
  
  // 2. Извлекаем улицу (всё до номера дома)
  // Ищем номер дома в конце строки
  const houseRegex = /(\d+[а-я]?\d*[а-я]?\d*(?:[\/\-\.]\d+[а-я]?[к]?\d*[с]?\d*)?)\s*$/i;
  const houseMatch = addressWithoutCity.match(houseRegex);
  
  let house = '';
  let street = addressWithoutCity;
  
  if (houseMatch) {
    house = houseMatch[1];
    // Убираем номер дома из строки улицы
    street = addressWithoutCity.replace(new RegExp(`${house.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`), '').trim();
  }
  
  // 3. Убираем лишние запятые и пробелы в конце улицы
  street = street.replace(/[,\s]+$/, '').trim();
  
  // 4. Формируем нормализованное название (без "улица", "шоссе" и т.д.)
  let streetNormalized = street
    .replace(/^(ул\.?|улица|ш\.?|шоссе|пр\.?|проспект|бульвар\.?|бульв|пер\.?|переулок|пл\.?|площадь|наб\.?|набережная)\s*/i, '')
    .trim();
  
  // Если нормализованная улица пустая, используем оригинал
  if (!streetNormalized) streetNormalized = street;
  
  // 5. Дополнительно: нормализуем номер дома
  // "71к1" -> "71к1", "71/4" -> "71/4", "81/2с6" -> "81/2с6"
  let houseNormalized = house;
  
  // 6. Возвращаем результат
  return {
    city: city,
    street: street,
    house: house,
    houseNormalized: houseNormalized,
    streetNormalized: streetNormalized,
    fullAddress: fullAddress,
    // Для удобства: полный адрес в формате "улица, дом"
    full: `${street}, ${house}`.replace(/^,\s*/, '')
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

function parseRating(value) {
  // Приводим к строке и заменяем запятую на точку
  const str = String(value).trim().replace(/^⭐\s*/, '').replace(',', '.');
  
  // Проверяем формат
  const regex = /^(?:[0-4](?:\.\d{1,2})?|5(?:\.0{1,2})?)$/;
  
  if (!regex.test(str)) {
    return { success: false, error: "Неверный формат рейтинга" };
  }
  
  // Преобразуем в число
  const rating = parseFloat(str);
  
  // Округляем до 2 знаков
  return { 
    success: true, 
    value: Math.round(rating * 100) / 100,
    original: str
  };
}

module.exports = {
  parseScheduleTime,
  cleanText,
  extractIdAndName,
  parseAddress,
  normalizeYo,
  determineReportTypeWithChecks,
  parseRating,
  normalizePhone,
  formatPhone,
};

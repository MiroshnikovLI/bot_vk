const { Pool } = require('pg');
require('dotenv').config();

// Подключение к PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,           // 🔧 ИСПРАВЛЕНО: обычно порт 5432
  database: process.env.DB_NAME || "wb_bot",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD
});

// SQL запросы для создание таблиц
const createTableSQL = `
-- 1. Пользователи(менеджеры)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  vk_id BIGINT UNIQUE NOT NULL,                     -- ID менеджера в вк
  wb_id INTEGER UNIQUE,                             -- ID менеджера в системе WB
  full_name VARCHAR(255) NOT NULL,                  -- Полное имя менеджера
  phone VARCHAR(20),                                -- Телефон менеджера (опционально)
  role VARCHAR(50) DEFAULT 'manager',               -- 'admin', 'manager', 'viewer'
  is_active BOOLEAN DEFAULT TRUE,                   -- 'Активен ли менеджер'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Пункты выдачи (ПВЗ)
CREATE TABLE IF NOT EXISTS pvz (
  id SERIAL PRIMARY KEY,
  pvz_id VARCHAR(50) UNIQUE NOT NULL,                -- ID ПВЗ
  address VARCHAR(500) NOT NULL,                     -- Адрес ПВЗ
  city VARCHAR(100),                                 -- Город
  street VARCHAR(200),                               -- Улица
  house VARCHAR(50),                                 -- Номер дома
  street_normalized VARCHAR(200),                    -- Нормализованная улица (для поиска)
  open_time TIME DEFAULT '08:00',                    -- Время открытия ПВЗ
  close_time TIME DEFAULT '21:00',                   -- Время закрытия ПВЗ
  rate NUMERIC(3,2) DEFAULT 5.00,                    -- Рейтинг ПВЗ (0.00 - 5.00)
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Связь менеджера с ПВЗ (для постоянных менеджеров)
CREATE TABLE IF NOT EXISTS pvz_manager (
  id SERIAL PRIMARY KEY,
  pvz_id INTEGER NOT NULL REFERENCES pvz(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  notes TEXT,
  is_active BOOLEAN DEFAULT TRUE,  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(pvz_id, user_id)
);

-- 4. Смены (кто в какой день работает)
CREATE TABLE IF NOT EXISTS shifts (
  id SERIAL PRIMARY KEY,
  pvz_id INTEGER NOT NULL REFERENCES pvz(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  shift_date DATE NOT NULL,
  shift_type VARCHAR(10) CHECK (shift_type IN ('open', 'close', 'full')),
  status VARCHAR(20) DEFAULT 'scheduled',
  confirmed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(pvz_id, shift_date, shift_type),
  UNIQUE(user_id, shift_date) 
);

-- 5. Отчеты об открытии/закрытии
CREATE TABLE IF NOT EXISTS shift_reports (
  id SERIAL PRIMARY KEY,
  pvz_id INTEGER NOT NULL REFERENCES pvz(id),
  user_id INTEGER NOT NULL REFERENCES users(id),
  wb_id INTEGER,
  employee_name VARCHAR(250),
  report_type VARCHAR(10) CHECK (report_type IN ('open', 'close')),
  report_text TEXT NOT NULL,
  report_time TIME,
  is_ontime BOOLEAN DEFAULT TRUE,
  published_wall_id INTEGER,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Напоминания (логи отправленных уведомлений)
CREATE TABLE IF NOT EXISTS reminders (
  id SERIAL PRIMARY KEY,
  pvz_id INTEGER NOT NULL REFERENCES pvz(id),
  user_id INTEGER NOT NULL REFERENCES users(id),
  reminder_type VARCHAR(20) CHECK (reminder_type IN ('open', 'close', 'missed', 'warning')),
  message TEXT,
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_read BOOLEAN DEFAULT FALSE
);

-- 7. Настройки бота
CREATE TABLE IF NOT EXISTS bot_settings (
  id SERIAL PRIMARY KEY,
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT NOT NULL,
  admin_vk_ids BIGINT[] DEFAULT '{}',
  description TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Задачи для рассылок 
CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  target_pvz INTEGER[] DEFAULT '{}',
  target_managers INTEGER[] DEFAULT '{}',
  report_destination VARCHAR(20) CHECK (report_destination IN ('wall', 'dm_admin')),
  status VARCHAR(20) DEFAULT 'pending',
  created_by INTEGER REFERENCES users(id),
  sent_at TIMESTAMP,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. Ответы на задачи
CREATE TABLE IF NOT EXISTS task_responses (
  id SERIAL PRIMARY KEY,
  task_id INTEGER NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id),
  pvz_id INTEGER NOT NULL REFERENCES pvz(id),
  response_text TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. Логи бота
CREATE TABLE IF NOT EXISTS bot_logs (
  id SERIAL PRIMARY KEY,
  log_type VARCHAR(50),
  target_id BIGINT,
  message TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 11. Отсутствие и подмены
CREATE TABLE IF NOT EXISTS absences (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  pvz_id INTEGER NOT NULL REFERENCES pvz(id),
  absences_date DATE NOT NULL,
  shift_type VARCHAR(10) CHECK (shift_type IN ('open', 'close', 'full')),
  substitute_id INTEGER REFERENCES users(id),
  reason TEXT,
  approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- 12. Таблица сменщиков (для отписок)
CREATE TABLE IF NOT EXISTS shift_substitutes (
  id SERIAL PRIMARY KEY,
  main_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,  -- основной менеджер
  replacement_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- сменщик
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Один и тот же сменщик не может быть дважды привязан к одному менеджеру
  UNIQUE(main_user_id, replacement_user_id)
);

--13. Таблица с ссылками на рабочие чаты
CREATE TABLE IF NOT EXISTS work_chats (
  id SERIAL PRIMARY KEY,
  chat_name VARCHAR(255) NOT NULL,         -- Название чата
  chat_link VARCHAR(255),                  -- Ссылка на чат
  is_active BOOLEAN DEFAULT TRUE,          -- Активен ли чат
  description TEXT,                        -- Описание/примечания
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

// SQL для индексов 
const createIndexesSQL = `
CREATE INDEX IF NOT EXISTS idx_users_vk_id ON users(vk_id);
CREATE INDEX IF NOT EXISTS idx_users_wb_id ON users(wb_id);
CREATE INDEX IF NOT EXISTS idx_pvz_id ON pvz(id);
CREATE INDEX IF NOT EXISTS idx_pvz_managers_pvz ON pvz_manager(pvz_id);
CREATE INDEX IF NOT EXISTS idx_shift_date ON shifts(shift_date);
CREATE INDEX IF NOT EXISTS idx_shift_pvz_date ON shifts(pvz_id, shift_date);
CREATE INDEX IF NOT EXISTS idx_reports_pvz ON shift_reports(pvz_id);
CREATE INDEX IF NOT EXISTS idx_reports_user ON shift_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_reports_date ON shift_reports(created_at);
CREATE INDEX IF NOT EXISTS idx_reports_type_date ON shift_reports(report_type, created_at);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_absences_date ON absences(absences_date);
CREATE INDEX IF NOT EXISTS idx_substitutes_main ON shift_substitutes(main_user_id);
CREATE INDEX IF NOT EXISTS idx_substitutes_sub ON shift_substitutes(replacement_user_id);
`;

// SQL для начальных настроек
const insertDefaultSettingsSQL = `
INSERT INTO bot_settings (key, value, description) VALUES
('reminder_before_open_minutes', '60', 'За сколько минут до открытия напоминать менеджеру'),
('reminder_after_close_minutes', '15', 'Через сколько минут после закрытия напомнить'),
('max_reminder_count', '3', 'Сколько раз напомнить менеджеру'),
('reminder_interval_minutes', '10', 'Интервал между напоминаниями'),
('open_time', '08:00', 'Время открытия ПВЗ'),
('close_time', '21:00', 'Время закрытия ПВЗ'),
('report_deadline_after_open', '15', 'Через сколько минут после открытия считается опозданием'),
('report_deadline_after_close', '15', 'Через сколько минут после закрытия считается опозданием'),
('report_chat_id', '', 'ID чата для публикации отчетов (если пусто = стена)'),
('wall_comments_enabled', 'true', 'Включить комментарии к постам на стене'),
('weekly_report_day', '6', 'День недели для отправки еженедельного отчета (1-7, 1=ПН)'),
('auto_assign_shifts', 'true', 'Автоматически назначать смены на основании отписки'),
('admin_vk_ids', '{1105208474, 52356640, 175869561, 698234173, 701341248, 366402660}', 'Список ВК ID администраторов (массив BIGINT)'),
('timezone', 'Europe/Moscow', 'Часовой пояс для расчетов')
ON CONFLICT (key) DO UPDATE SET 
  value = EXCLUDED.value,
  description = EXCLUDED.description,
  updated_at = CURRENT_TIMESTAMP;
`;

// Представление: активные смены на сегодня
const createViewsSQL = `
CREATE OR REPLACE VIEW today_shifts AS 
SELECT
  s.id,
  s.pvz_id,
  p.pvz_id as pvz_code,
  p.address as pvz_address,
  s.user_id,
  u.full_name as manager_name,
  u.wb_id,
  s.shift_date,
  s.shift_type,
  s.status,
  CASE
    WHEN s.shift_type = 'open' THEN p.open_time
    WHEN s.shift_type = 'close' THEN p.close_time
    ELSE p.open_time
  END as shift_time,
  sr.id as report_id,
  sr.report_type,
  sr.created_at as reported_at,
  CASE
    WHEN sr.id IS NOT NULL THEN true
    ELSE false
  END as has_reported
FROM shifts s
JOIN pvz p ON s.pvz_id = p.id
JOIN users u ON s.user_id = u.id
LEFT JOIN shift_reports sr ON sr.pvz_id = s.pvz_id
  AND sr.user_id = s.user_id
  AND sr.report_type = s.shift_type
  AND DATE(sr.created_at) = s.shift_date
WHERE s.shift_date = CURRENT_DATE;
`;

// Основная функция инициализации
async function initDatabase() {
  const client = await pool.connect();

  try {
    console.log('🚀 Начинаем инициализацию базы данных');

    await client.query('BEGIN');

    console.log('📦 Создание таблиц...');
    await client.query(createTableSQL);

    console.log('🔍 Создание индексов...');
    await client.query(createIndexesSQL);

    console.log('👁️ Создание представлений...');
    await client.query(createViewsSQL);

    console.log('⚙️ Добавление настроек по умолчанию...');
    await client.query(insertDefaultSettingsSQL);

    await client.query('COMMIT');
    console.log('✅ База данных успешно инициализирована');

    // Вывод списка таблиц
    const tables = await client.query(`
      SELECT tablename
      FROM pg_tables
      WHERE schemaname = 'public'
      ORDER BY tablename;
    `);

    if (tables.rows.length > 0) {
      console.log('📋 Созданные таблицы:');
      tables.rows.forEach(row => console.log(`   - ${row.tablename}`));
    }

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Ошибка инициализации базы данных:', error.message);
    throw error;
  } finally {
    client.release();
  }
}

// Функция для полной очистки и пересоздания БД
async function resetDatabase() {
  const client = await pool.connect();

  try {
    console.warn('⚠️  ВНИМАНИЕ! Будет выполнена полная очистка базы данных!');
    
    const confirm = process.argv.includes('--force');
    if (!confirm) {
      console.log('ℹ️  Операция отменена. Используйте --force для подтверждения.');
      return;
    }

    await client.query('BEGIN');

    const tables = await client.query(`
      SELECT tablename
      FROM pg_tables
      WHERE schemaname = 'public';
    `);

    for (const row of tables.rows) {
      await client.query(`DROP TABLE IF EXISTS ${row.tablename} CASCADE;`);
      console.log(`   Удалена таблица: ${row.tablename}`);
    }

    await client.query('COMMIT');
    console.log('✅ База данных очищена');

    // Пересоздание
    await initDatabase();

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Ошибка при сбросе базы данных:', error.message);
  } finally {
    client.release();
  }
}

// Проверка соединения
async function testConnection() {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Соединение с базой данных установлено:', result.rows[0].now);
    return true;
  } catch (error) {
    console.error('❌ Ошибка подключения к базе данных:', error.message);
    return false;
  }
}

module.exports = {
  initDatabase,
  resetDatabase,
  testConnection,
  pool
};

// Запуск при прямом вызове
if (require.main === module) {
  const command = process.argv[2];

  (async () => {
    try {
      const connected = await testConnection();
      if (!connected) process.exit(1);

      if (command === 'reset') {
        await resetDatabase();
      } else {
        await initDatabase();
      }
    } catch (err) {
      console.error('❌ Критическая ошибка:', err.message);
      process.exit(1);
    } finally {
      await pool.end();
      console.log('🔌 Соединение с базой данных закрыто');
    }
  })();
}
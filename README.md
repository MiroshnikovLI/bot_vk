
# <h1>WB PZV Manager Bot</h1>

Бот для автоматизации работы менеджеров пунктов выдачи Wildberries: контроль отчетности, управление сменами, рассылка задач и аналитика.

## 📄 Лицензия

Это частный проект. Все права защищены.  
Автор: @MiroshnikovLI © 2025

📋 Оглавление

1) [Возможности](#opportunities)

2) [Технологии](#technologies)

3) [Архитектура](#architecture)

4) [База данных](#database)

5) [Структура проекта](#project-structure)

6) [Установка и запуск](#installation-and-launch)

7) [API эндпоинты](#API-Endpoints(main))

8) [Планы развития](#development-plans)

<h2 id="opportunities">Возможности</h2>

<h3>Основной функционал бота</h3>

| Модуль | Описание |
| -------| ---------|
| Управление ПВЗ | Сохранение списка ПВЗ с адресами и закрепленными менеджерами |
| Отчеты о сменах |	Автоматическое создание и публикация отчетов об открытии/закрытии на стену сообщества | 
| Планирование смен |	Формирование списков смен на следующий день на основе отчетов |
| Контроль отписок |	Автоматические напоминания менеджерам о необходимости отписаться (настраиваемое время и интервалы) |
| Отчет о неотписавшихся | Кнопка для генерации сообщения с упоминанием всех ПВЗ и менеджеров, не сдавших отчет |
| Рассылка задач | Отправка задач выбранным ПВЗ со сбором отчета для руководства |
| Шаблоны отписок |	Кнопки с шаблонами, где менеджер заполняет данные по форме |



<h2 id="technologies">🛠 Технологии</h2>

| Компонент |	Технология |	Обоснование |
| ----------| -----------| -------------|
| Язык | JavaScript (Node.js) |	Единый язык для бота и веб-панели |
| Бот |	vk-io / node-vk-bot-sdk |	Легковесные библиотеки для VK API |
| Веб-панель |	React + Express.js |	Современный UI и легкий бэкенд |
| База данных |	PostgreSQL |	Надежность, индексы, связи между таблицами |
| Фоновые задачи | node-cron | Планировщик для проверок отписок |
| Процесс-менеджер |	PM2 |	Автоматический перезапуск |




<h2 id="architecture">🏗 Архитектура</h2>

<img src="https://sun9-41.userapi.com/s/v1/ig2/uyxvUtdfAmOuotLyqSsHW7XUOb7eXZ90UqCbYfp9DcSESV00KVCn8MecCJgF5mmEYRMJVswXQQh9vXIyVMemgjEl.jpg?quality=95&as=32x34,48x51,72x77,108x115,160x171,240x256,360x384,480x512,540x576,600x640&from=bu&u=ZkeMQgnU9BRophAM3dLbYsvmDEaBZ5oj0kbxFVC5xlU&cs=600x0"/>



<h2 id="database">База данных</h2>

<h4>Схема таблиц</h4> 

```

-- Пользователи (менеджеры)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    vk_id BIGINT UNIQUE NOT NULL,
    wb_id INTEGER UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(50) DEFAULT 'manager',  -- 'manager', 'admin', 'viewer'
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Пункты выдачи
CREATE TABLE pvz (
    id SERIAL PRIMARY KEY,
    id_pvz VARCHAR(50) UNIQUE NOT NULL,
    address VARCHAR(500) NOT NULL,
    open_time TIME DEFAULT '08:00',
    close_time TIME DEFAULT '21:00',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Связь менеджеров с ПВЗ
CREATE TABLE pvz_managers (
    id SERIAL PRIMARY KEY,
    pvz_id INTEGER REFERENCES pvz(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(pvz_id, user_id)
);

-- Плановые смены (на следующий день)
CREATE TABLE planned_shifts (
    id SERIAL PRIMARY KEY,
    pvz_id INTEGER REFERENCES pvz(id),
    user_id INTEGER REFERENCES users(id),
    shift_date DATE NOT NULL,
    shift_type VARCHAR(10) CHECK (shift_type IN ('open', 'close')),
    confirmed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(pvz_id, shift_date, shift_type),
    UNIQUE(user_id, shift_date)
);

-- Отчеты об открытии/закрытии
CREATE TABLE shift_reports (
    id SERIAL PRIMARY KEY,
    pvz_id INTEGER REFERENCES pvz(id),
    user_id INTEGER REFERENCES users(id),
    wb_id INTEGER,
    employee_name VARCHAR(250),
    report_type VARCHAR(10) CHECK (report_type IN ('open', 'close')),
    shift_people VARCHAR(500),           -- ФИО + ID сотрудника в смене
    report_text TEXT,                     -- полный текст отчета
    report_time TIME,
    is_ontime BOOLEAN DEFAULT TRUE,
    published_wall_id INTEGER,                        -- ID поста на стене
    published_at TIMESTAMP,                           -- Время публикации
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    --Индексы для быстрого поиска
    CONSTRAINT fk_pvz FOREIGN KEY (pvz_id) REFERENCES pvz(id),
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Настройки бота
CREATE TABLE bot_settings (
    id SERIAL PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT,
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Задачи для рассылки
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    target_pvz INTEGER[] DEFAULT '{}',    -- массив ID ПВЗ (пусто = все)
    target_managers INTEGER[] DEFAULT'{}',
    report_destination VARCHAR(20) CHECK (report_destination IN ('wall', 'dm_admin')),
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'sent', 'completed'
    created_by INTEGER REFERENCES users(id),
    sent_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Ответы на задачи (от менеджеров)
CREATE TABLE task_responses (
    id SERIAL PRIMARY KEY,
    task_id INTEGER REFERENCES tasks(id),
    user_id INTEGER REFERENCES users(id),
    pvz_id INTEGER REFERENCES pvz(id),
    response_text TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Логи сообщений бота
CREATE TABLE bot_logs (
    id SERIAL PRIMARY KEY,
    log_type VARCHAR(50),  -- 'report', 'reminder', 'task', 'error'
    target_id BIGINT,      -- user_id или chat_id
    message TEXT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
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

-- Индексы для скорости
CREATE INDEX idx_reports_pvz ON shift_reports(pvz_id);
CREATE INDEX idx_reports_date ON shift_reports(created_at);
CREATE INDEX idx_shifts_date ON planned_shifts(shift_date);
CREATE INDEX idx_tasks_status ON tasks(status);

```

<h4>Настройки по умолчанию (bot_settings)</h4>

```

INSERT INTO bot_settings (key, value, description) VALUES
('reminder_before_open_minutes', '60', 'За сколько минут до открытия напоминать'),
('reminder_after_close_minutes', '30', 'Через сколько минут после закрытия напоминать'),
('max_reminders_count', '4', 'Сколько раз напоминать'),
('reminder_interval_minutes', '10', 'Интервал между напоминаниями'),
('open_time', '08:00', 'Время открытия ПВЗ'),
('close_time', '21:00', 'Время закрытия ПВЗ'),
('admin_vk_ids', '[]', 'Список VK ID администраторов (JSON)');

```



<h4 id="project-structure">📁 Структура проекта</h4>

```

wb-pvz-bot/
│
├── bot/                          # ВК Бот
│   ├── index.js                  # Точка входа (Long Poll)
│   ├── handlers/
│   │   ├── openShift.js          # Обработка отчета об открытии
│   │   ├── closeShift.js         # Обработка отчета о закрытии
│   │   ├── myData.js             # Просмотр своих данных
│   │   ├── missingReport.js      # Отчет о неотписавшихся
│   │   └── taskResponse.js       # Ответ на задачу
│   ├── keyboards/
│   │   └── index.js              # Клавиатуры (открытие/закрытие/назад)
│   └── utils/
│       ├── vkApi.js              # Обертки над VK API
│       ├── reportFormatter.js    # Форматирование отчетов
│       └── reminders.js          # Логика напоминаний
│
├── panel/                        # Веб-панель (React)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout/
│   │   │   ├── PVZList/
│   │   │   ├── ManagersList/
│   │   │   ├── ReportsTable/
│   │   │   ├── TasksCreator/
│   │   │   └── SettingsForm/
│   │   ├── pages/
│   │   │   ├── Dashboard.js      # Главная со статистикой
│   │   │   ├── PVZPage.js        # Управление ПВЗ
│   │   │   ├── ReportsPage.js    # Просмотр отчетов
│   │   │   ├── TasksPage.js      # Управление задачами
│   │   │   └── SettingsPage.js   # Настройки бота
│   │   ├── services/
│   │   │   └── api.js            # API клиент
│   │   └── App.js
│   └── package.json
│
├── server/                       # Бэкенд API
│   ├── index.js                  # Express сервер
│   ├── routes/
│   │   ├── pvz.js                # CRUD ПВЗ
│   │   ├── users.js              # CRUD менеджеров
│   │   ├── reports.js            # Получение отчетов
│   │   ├── tasks.js              # Создание/получение задач
│   │   └── settings.js           # Настройки бота
│   ├── middleware/
│   │   ├── auth.js               # Проверка прав админа
│   │   └── validation.js
│   └── controllers/              # Логика эндпоинтов
│
├── database/
│   ├── init.sql                  # SQL схема
│   ├── migrations/               # Миграции
│   └── connection.js             # Пул соединений
│
├── scheduler/                    # Планировщик задач
│   ├── index.js                  # Инициализация cron
│   ├── shiftReminders.js         # Напоминания о сменах
│   ├── dailySchedule.js          # Публикация смен на завтра
│   └── taskScheduler.js          # Отправка задач
│
├── shared/
│   ├── constants.js              # Константы
│   └── utils.js                  # Общие утилиты
│
├── .env
├── .env.example
├── package.json
├── README.md
└── docker-compose.yml            # Для локальной разработки

```



<h3 id="installation-and-launch">🔧 Установка и запуск</h3>

<h4>Требования</h4>

```
- Node.js 18+

- PostgreSQL 14+

- VK Community (с доступом к API)
```
Шаг 1: Клонирование
```
git clone https://github.com/MiroshnikovLI/bot_vk.git
cd wb-pvz-bot
```

Шаг 2: Настройка окружения
```
cp .env.example .env
```
Заполните .env:
```
# VK
VK_GROUP_TOKEN=your_group_token_here
VK_GROUP_ID=123456789
VK_CONFIRMATION_CODE=your_code

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=wb_pvz_bot
DB_USER=postgres
DB_PASSWORD=your_password

# Server
API_PORT=3001
API_SECRET_KEY=your_secret_key

# Panel
PANEL_PORT=3000
```
Шаг 3: База данных

```
# Создание БД
createdb wb_pvz_bot

# Инициализация схемы
psql -d wb_pvz_bot -f database/init.sql
```

Шаг 4: Установка зависимостей и запуск
```
# Установка
npm install

# Сборка React панели
cd panel && npm install && npm run build && cd ..

# Запуск всех сервисов через PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

ecosystem.config.js
```
module.exports = {
  apps: [
    {
      name: 'vk-bot',
      script: './src/bot/index.js',
      watch: false,
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'api-server',
      script: './src/server/index.js',
      watch: false,
      env: {
        PORT: 3001
      }
    },
    {
      name: 'scheduler',
      script: './src/scheduler/index.js',
      watch: false
    }
  ]
};
```

<h3 id="API-Endpoints(main)">🔌 API Эндпоинты (основные)</h3>

| Метод   |	Эндпоинт              |	Описание                        |
|---------|-----------------------|---------------------------------|
| GET     |	/api/pvz	            | Получить все ПВЗ с менеджерами  |
| POST    |	/api/pvz	            | Добавить ПВЗ                    |
| PUT	    | /api/pvz/:id          |	Обновить ПВЗ                    |
| DELETE  |	/api/pvz/:id          | Удалить ПВЗ                     |
| GET	    | /api/users	          | Получить всех менеджеров        |
| POST	  | /api/users	          | Добавить менеджера              |
| GET	    | /api/reports	        | Получить отчеты (с фильтрацией) |
| GET	    | /api/reports/missing  | Получить список неотписавшихся  |
| GET	    | /api/tasks            |	Получить задачи                 |
| POST    | /api/tasks            | Создать задачу                  |
| GET	    | /api/settings         | Получить настройки              |
| PUT	    | /api/settings         | Обновить настройки              |


<h3 id="development-plans">🗺 Планы развития</h3>

MVP (первый релиз)
```
Базовая структура проекта

Регистрация менеджеров через бота

Кнопки "Открытие" и "Закрытие" с заполнением данных

Сохранение отчетов в БД

Публикация отчетов на стену

Простая веб-панель (просмотр отчетов)
```

Версия 1.0
```
Напоминания о сменах (планировщик)

Кнопка "Кто не отписался"

Управление ПВЗ и менеджерами через панель

Настройки времени и интервалов через панель
```

Версия 2.0
```
Планирование смен на следующий день

Рассылка задач менеджерам

Сбор отчетов по задачам
```

Версия 3.0
```
AI-помощник для ответов на частые вопросы

Вложение изображений в ответы
```
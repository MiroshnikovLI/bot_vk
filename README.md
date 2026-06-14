
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
| Бот | VK API (Long Poll) | Нативная работа через HTTPS-запросы |
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
    role VARCHAR(50) DEFAULT 'manager',  -- 'manager', 'admin', 'viewer'
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Пункты выдачи
CREATE TABLE pvz (
    id SERIAL PRIMARY KEY,
    pvz_id VARCHAR(50) UNIQUE NOT NULL,
    address VARCHAR(500) NOT NULL,
    city VARCHAR(100),
    street VARCHAR(200),
    house VARCHAR(50),
    street_normalized VARCHAR(200),
    open_time TIME DEFAULT '08:00',
    close_time TIME DEFAULT '21:00',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Связь менеджеров с ПВЗ
CREATE TABLE pvz_manager (
    id SERIAL PRIMARY KEY,
    pvz_id INTEGER REFERENCES pvz(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT TRUE,
    UNIQUE(pvz_id, user_id)
);

-- Отчеты об открытии/закрытии
CREATE TABLE shift_reports (
    id SERIAL PRIMARY KEY,
    pvz_id INTEGER REFERENCES pvz(id),
    user_id INTEGER REFERENCES users(id),
    wb_id INTEGER,
    employee_name VARCHAR(250),
    report_type VARCHAR(10) CHECK (report_type IN ('open', 'close')),
    report_text TEXT NOT NULL,
    report_time TIME,
    is_ontime BOOLEAN DEFAULT TRUE,
    published_wall_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица сменщиков
CREATE TABLE shift_substitutes (
    id SERIAL PRIMARY KEY,
    main_user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    substitute_user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(main_user_id, substitute_user_id)
);

-- Настройки бота
CREATE TABLE bot_settings (
    id SERIAL PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT NOT NULL,
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ... и другие таблицы (задачи, логи, заявки и т.д.)

-- Индексы для скорости
CREATE INDEX idx_reports_pvz ON shift_reports(pvz_id);
CREATE INDEX idx_reports_date ON shift_reports(created_at);
CREATE INDEX idx_shifts_date ON shifts(shift_date);
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

bot_vk/
├── src/                # Исходный код
|   ├── bot/
│   |   └── bot.js      # Точка входа бота (Long Poll)
│   ├── config/         # Конфигурация (БД, VK API)
│   ├── constants/      # Тексты сообщений и команды
│   ├── database/
│   │   └── init.js     # Скрипт инициализации БД
│   ├── fsm/            # Машина состояний (FSM)
│   ├── handlers/       # Обработчики команд
│   │ ├── admin/        # Админ-команды
│   │ ├── private/      # Личные команды пользователя
│   │ └── chat/         # Обработка сообщений из чата
│   ├── keyboards/      # Генерация клавиатур
│   ├── listeners/      # Слушатели событий
│   ├── services/       # Бизнес-логика и работа с БД
│   ├── state/          # Управление состояниями пользователей
│   └── utils/          # Вспомогательные функции
├── panel/              # React-панель управления
├── server/             # Express API сервер
├── scheduler/          # Планировщик задач (cron)
├── .env.example        # Пример файла окружения
├── ecosystem.config.js # Конфигурация PM2
└── package.json

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
VK_GROUP_ID=your_group_id
VK_CHAT_ID=idChat          # ID чата для отчетов

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=wb_pvz
DB_USER=postgres
DB_PASSWORD=your_postgres_password

# Server (опционально)
API_PORT=3001
```
Шаг 3: База данных

```
# Создание БД
sudo -u postgres psql -c "CREATE DATABASE wb_pvz OWNER postgres;"

# Инициализация схемы (из корня проекта!)
cd ~/bot_vk
node src/database/init.js
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
      script: './src/bot/bot.js',
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


MVP (текущая версия)
```
Базовая структура проекта

Регистрация менеджеров

Отправка отчётов об открытии/закрытии

Сохранение отчётов в БД

Админ-панель и управление ПВЗ
```
Версия 1.0
```
Напоминания о сменах (планировщик)

Кнопка "Кто не отписался" (готово?)

Управление ПВЗ и менеджерами через веб-панель
```
Версия 2.0
```
Планирование смен на следующий день

Рассылка задач менеджерам

Сбор отчётов по задачам
```
Версия 3.0
```
AI-помощник для ответов на частые вопросы

Вложение изображений в ответы
```
📄 Лицензия
Это частный проект. Все права защищены.
Автор: @MiroshnikovLI © 2025–2026
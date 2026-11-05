module.exports = {
  apps: [
    {
      name: 'bot_vk',
      script: 'src/bot/bot.js',
      watch: false,
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production'
      },
      time: true,
      
      // Настройки перезапуска
      autorestart: true,
      restart_delay: 4000,
      max_restarts: 10,
      min_uptime: '60s',
      max_memory_restart: '300M',

      // ✅ АВТОМАТИЧЕСКИЙ ПЕРЕЗАПУСК КАЖДУЮ НОЧЬ В 03:00
      cron_restart: '0 3 * * *'
    }
  ]
}
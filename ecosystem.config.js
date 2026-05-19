module.exports = {
  apps: [
    {
      name: 'bot_vk',
      scripts: 'src/bot/index.js',
      watch: false,
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: 'logs/bot-error.log',
      out_file: 'logs/bot-out.log',
      log_file: 'logs/bot-combined.log',
      time: true
    },
    {
      name: 'bot_api',
      scripts: 'src/server/index.js',
      watch: false,
      instances: 1,
      exec_mode: 'forck',
      env: {
        NODE_ENV: 'productions',
        PORT: 3001
      },
      error_file: 'logs/api-error.log',
      out_file: 'logs/api-out.log',
      time: true
    },
    {
      name: 'bot_sheduler',
      scripts: 'src/sheduler/index.js',
      watch: false,
      instances: 1,
      exec_mode: 'forck',
      env: {
        NODE_ENV: 'productions'
      },
      error_file: 'logs/sheduler-error.log',
      out_file: 'logs/sheduler-out.log',
      time: true
    }
  ]
}
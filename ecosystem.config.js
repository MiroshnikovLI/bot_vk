module.exports = {
  apps: [
    {
      name: 'bot_vk',
      script: 'src/bot/index.js',          
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
      script: 'src/server/index.js',        
      watch: false,
      instances: 1,
      exec_mode: 'fork',                    
      env: {
        NODE_ENV: 'production',              
        PORT: 21254
      },
      error_file: 'logs/api-error.log',
      out_file: 'logs/api-out.log',
      time: true
    },
    {
      name: 'bot_scheduler',                
      script: 'src/scheduler/index.js',      
      watch: false,
      instances: 1,
      exec_mode: 'fork',                    
      env: {
        NODE_ENV: 'production'              
      },
      error_file: 'logs/scheduler-error.log',
      out_file: 'logs/scheduler-out.log',
      time: true
    }
  ]
}
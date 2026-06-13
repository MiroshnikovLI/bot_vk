const { query } = require('../config/database');

// Логирование
async function logAction(logType, targetId, message) {
  await query(
    `INSERT INTO bot_logs (log_type, target_id, message, created_at)
     VALUES ($1, $2, $3, NOW())`,
    [logType, String(targetId), message],
  );
}

module.exports = {
  logAction
}
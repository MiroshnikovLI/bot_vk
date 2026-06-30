const ERROR = {
  ERROR: "❌ Ошибка операции попробуйте еще раз.",
  TECHNICAL_ERROR: "❌ Техническая ошибка. Обратитесь к администратору.",
  NO_ACCESS_RIGHTS: "❌ Нет прав доступа.",
  ERROR_ACTIVE_PVZ: (status) => `❌ Ошибка при ${status ? 'восстановлении' : 'удалении'}. Попробуйте позже`,
  DELETE_ADMIN: `Вы не можете удалить администратора`,
};

module.exports = {
  ERROR
}
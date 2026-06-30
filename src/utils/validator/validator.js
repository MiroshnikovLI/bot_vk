const { NOTIFICATIONS } = require('../../constants/index')

function isValidVkMeLink(link) {
  if (!link || typeof link !== 'string') return false;
  
  // Проверяем, что ссылка начинается с https://vk.me/join/
  const trimmed = link.trim();
  
  // Основное регулярное выражение
  const regex = /^https:\/\/vk\.me\/join\/[a-zA-Z0-9_\-/]+={0,2}$/;
  
  return regex.test(trimmed);
}

function isValidWbId(wbId) {
  let errorMessage;
  if (!/^\d+$/.test(wbId)) {
    errorMessage = NOTIFICATIONS.WARNING_ID_ONLY_NUMBERS
    return {
      success: false,
      message: errorMessage
    }
  }

  if (wbId.length < 6 || wbId.length > 10) {
    errorMessage = NOTIFICATIONS.WB_ID_LENGTH
    return {
      success: false,
      message: errorMessage
    }
  }

  return {
    success: true,
    message: `WB ID корректный`
  }
}

module.exports = {
  isValidVkMeLink,
  isValidWbId
}
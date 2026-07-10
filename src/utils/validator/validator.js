const { NOTIFICATIONS } = require('../../constants/index')

function isValidVkMeLink(link) {
  if (!link || typeof link !== 'string') return false;
  
  // Проверяем, что ссылка начинается с https://vk.me/join/
  const trimmed = link.trim();
  
  // Основное регулярное выражение
  const regex = /^https:\/\/vk\.me\/join\/[a-zA-Z0-9_\-/]+={0,2}$/;
  
  if (regex.test(trimmed)) {
    return {
      success: true,
      message: NOTIFICATIONS.VERIFICATION_COMPLETED
    }
  }

  return {
    success: false,
    message: NOTIFICATIONS.ERROR_LINK_CHAT
  }
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
    message: NOTIFICATIONS.VERIFICATION_COMPLETED
  }
}

function isValidPhoneNumber(number) {
  if (!/^(\+7|\+8|7|8)?\s*\(?\d{3}\)?\s*\d{3}[\s-]?\d{2}[\s-]?\d{2}$/.test(number)) {
    return {
      success: false,
      message: NOTIFICATIONS.NUMBER_NOT_VALID
    }
  }

  return {
    success: true,
    message: NOTIFICATIONS.VERIFICATION_COMPLETED
  }
}

function validateFullName(name) {
  if (!/^[а-яА-ЯёЁ\s-.]{2,100}$/.test(name)) {
    return {
      success: false,
      message: NOTIFICATIONS.NAME_NOT_VALID
    }
  }

  return {
    success: true,
    message: NOTIFICATIONS.VERIFICATION_COMPLETED
  }
}

module.exports = {
  isValidVkMeLink,
  isValidWbId,
  isValidPhoneNumber,
  validateFullName
}
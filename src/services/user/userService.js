const { query } = require("../../config/database");
const { deleteUserFromChatQuery } = require('../../config/vkApi');
const { addReplacementDb } = require('../pvz/pvzService');

async function startUser(vkId) {
  try {
    const name = `user${Date.now()}`
    const result = await query(
      `INSERT INTO users (vk_id, full_name, created_at, updated_at)
      VALUES ($1, $2, NOW(), NOW())
      RETURNING *`,
      [vkId, name]
    );

    const rest = await addReplacementDb(result.rows[0].id, result.rows[0].id);
    return { success: true, message: "Пользователь добавлен в базу"}
  } catch (error) {
    return { success: false, message: error.message }
  }
}

async function getAllUsers() {
  try {
    const result = await query(`
      SELECT * FROM users
      `)
    
    return { success: true, data: result.rows }
  } catch (error) {
    return {success: false, error: error.message}
  }
}

async function getUserVkId(vkId) {
  const result = await query("SELECT * FROM users WHERE vk_id = $1", [vkId]);
  return result.rows[0] || null;
}

async function getUserWbId(wbId) {
  const result = await query("SELECT * FROM users WHERE wb_id = $1", [wbId]);
  return result.rows[0] || null;
}

async function getUserId(id) {
  const result = await query("SELECT * FROM users WHERE id = $1", [id]);
  return result.rows[0] || null;
}

async function getOrCreateUser(vkId, fullName = null) {
  let user = await getUserVkId(vkId);
  if (!user) {
    const name = fullName || `user${vkId}`;
    const result = await query(
      `INSERT INTO users (vk_id, full_name, role, created_at, updated_at)
       VALUES ($1, $2, 'manager', NOW(), NOW())
       RETURNING *`,
      [vkId, name]
    );
    user = result.rows[0];
  }
  return user;
}

async function updateUserFullName(vkId, fullName) {
  await query(`UPDATE users SET full_name = $1, updated_at = NOW() WHERE vk_id = $2`, [fullName, vkId]);
}

async function updateUserPhone(vkId, phone) {
  try {
    const result = await query(`UPDATE users SET phone = $1, updated_at = NOW() WHERE vk_id = $2 RETURNING *`, [phone, vkId]);

    if (result.rows.length === 0) {
      return { success: false, message: 'Не удалось изменить номер.'};
    }

    return { success: true, message: "Номер успешно изменен", data: result.rows[0].phone }
  } catch (error) {
    return { success: false, message: error.message }
  }
}

async function updateUserWbId(vkId, wbId) {
  try {
    const result = await query(
      `UPDATE users SET wb_id = $1, updated_at = NOW() WHERE vk_id = $2 RETURNING id, wb_id, full_name`,
      [wbId, vkId]
    );
    if (result.rows.length === 0) {
      return { success: false, message: "Пользователь не найден" };
    }
    return { success: true, message: 'Данные успешно изменены', data: result.rows[0] };
  } catch (error) {
    if (error.code === '23505') {
      return { success: false, message: "WB ID уже используется другим пользователем" };
    }
    return { success: false, message: error.message };
  }
}

async function getAllReplacements(userId) {
  const result = await query(`SELECT * FROM shift_substitutes WHERE main_user_id = $1`, [userId]);
  return result.rows;
}

async function isProfileComplete(userId) {
  const user = await getUserVkId(userId);
  if (!user) return false;
  return !!(user.full_name && user.wb_id);
}

async function getSetting(key) {
  const result = await query("SELECT value FROM bot_settings WHERE key = $1", [key]);
  return result.rows[0]?.value || null;
}

async function isUserAdmin(vkId) {
  const adminsStr = await getSetting("admin_vk_ids");
  if (!adminsStr) return false;
  let adminIds = [];
  try {
    adminIds = JSON.parse(adminsStr);
  } catch (e) {
    const numbers = adminsStr.match(/\d+/g);
    if (numbers) adminIds = numbers.map(Number);
  }
  const numericVkId = typeof vkId === "string" ? parseInt(vkId, 10) : vkId;
  return adminIds.includes(numericVkId) ? true : false ;
}

async function findManager(searchValue, searchType = 'auto') {
  // Если searchValue null или undefined — сразу возвращаем пустой массив
  if (!searchValue) return [];
  
  let querySQL, params;
  
  if (searchType === 'id') {
    // Поиск по ID (точное совпадение)
    querySQL = `
      SELECT * FROM users 
      WHERE vk_id = $1 OR wb_id = $1
    `;
    params = [searchValue];
  } else if (searchType === 'name') {
    // Поиск по имени (частичное совпадение)
    querySQL = `
      SELECT * FROM users 
      WHERE full_name ILIKE $1
    `;
    params = [`%${searchValue}%`];
  } else {
    // Автоматический поиск (по ID или имени)
    querySQL = `
      SELECT * FROM users 
      WHERE vk_id = $1 
         OR wb_id = $1 
         OR full_name ILIKE $2
    `;
    params = [searchValue, `%${searchValue}%`];
  }
  
  const result = await query(querySQL, params);
  return result.rows;
}

async function setActiveUser(userId, bool) {
  try {
    const result = await query(
      `UPDATE users SET is_active = $1 WHERE id = $2
        RETURNING *
      `, [bool, userId])
    
    return { success: true, message: "Операция прошла успешно", data: result.rows[0]};
  } catch (error) {
    return {success: false, message: error.message}
  }
}

async function deleteUserFromChat(userId, chats) {
  const promises = chats.map(async (chat) => {
    const res = await deleteUserFromChatQuery(userId, chat.chat_id);
    const errorCode = res.message != 1 && res.message.replace(/\D/g, '');
    
    if (errorCode === '935') {
      return {
        success: false,
        message: `❌ Пользователя нет в чате ${chat.chat_name}`
      };
    }
    if (res.success) {
      return {
        success: true,
        message: `✅ Пользователь удалён из чата ${chat.chat_name}`
      };
    }
    return {
      success: false,
      message: `❌ Бот может удалять только из чатов сообщества: ${chat.chat_name}`
    };
  });
  
  const result = await Promise.all(promises);
  return result;
}

module.exports = {
  startUser,
  getAllUsers,
  getUserVkId,
  getUserWbId,
  getUserId,
  getOrCreateUser,
  updateUserFullName,
  updateUserWbId,
  getAllReplacements,
  isProfileComplete,
  getSetting,
  isUserAdmin,
  updateUserPhone,
  findManager,
  setActiveUser,
  deleteUserFromChat
};
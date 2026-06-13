const { query } = require("../config/database");

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

async function updateUserWbId(vkId, wbId) {
  try {
    const result = await query(
      `UPDATE users SET wb_id = $1, updated_at = NOW() WHERE vk_id = $2 RETURNING id, wb_id, full_name`,
      [wbId, vkId]
    );
    if (result.rows.length === 0) {
      return { success: false, error: "Пользователь не найден" };
    }
    return { success: true, data: result.rows[0] };
  } catch (error) {
    if (error.code === '23505') {
      return { success: false, error: "WB ID уже используется другим пользователем" };
    }
    return { success: false, error: error.message };
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

module.exports = {
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
  isUserAdmin
};
const { query } = require("../config/database");

async function getWorkChats() {
  try {
    const result = await query(`
      SELECT * FROM work_chats
      `)

    if (result.rows.length === 0) {
      return { success: true, message: "Список чатов пока не загружен"}
    }

    return { success: true, message: "Успешно получин список чатов", data: result.rows}
  } catch (error) {
    return { success: false, message: error.message}
  }
}

async function addWorkChat(name, link, description) {
  try {
    const result = await query(`
      INSERT INTO work_chats (chat_name, chat_link, is_active, description, created_at) 
        VALUES ($1, $2, true, $3, NOW())
        RETURNING *
      `, [name, link, description]);
    return {success: true, message: 'Данные успешно добавлены', data: result.rows[0]}
  } catch (error) {
    return {success: false, message: error.message}
  }
}

async function deleteWorkChat(id) {
  try {
    const result = await query(`
      DELETE FROM work_chats WHERE id = $1
        RETURNING *
      `, [id]);

    if (result.rows.length === 0) {
      return {success: true, message: "Запись не найдена"}
    }

    return {success: true, message: "Запись успешно удалена"}
  } catch (error) {
    return {success: false, message: error.message}
  }
}

async function updateWorkChat(id, name, link, description) {
  try {
    const result = await query(`
      UPDATE work_chats SET chat_name = $1, chat_link = $2, description = $3 WHERE id = $4
        RETURNING *
      `, [name, link, description, id]);
    
      if (result.rows.length === 0) {
        return {success: true, message: 'Запись не найдена'}
      };

    return { success: true, message: "Запись успешно обновлена", data: result.rows[0]}
  } catch (error) {
    return { success: false, message: error.message }
  }
}

module.exports = {
  getWorkChats,
  addWorkChat,
  deleteWorkChat,
  updateWorkChat,
}
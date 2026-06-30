const { query } = require("../../config/database");

async function getWorkChats() {
  try {
    const result = await query(`
      SELECT * FROM work_chats ORDER BY id ASC
      `)

    if (result.rows.length === 0) {
      return { success: true, message: "Список чатов пока не загружен"}
    }

    return { success: true, message: "Успешно получин список чатов", data: result.rows}
  } catch (error) {
    return { success: false, message: error.message}
  }
}

async function addWorkChat(name, link, description, chatId) {
  try {
    const result = await query(`
      INSERT INTO work_chats (chat_name, chat_link, chat_id, is_active, description, created_at) 
        VALUES ($1, $2, $3, true, $4, NOW())
        RETURNING *
      `, [name, link, chatId, description]);
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

async function listChats () {
  const chats = await getWorkChats();
  const massChats = [];
  
  if (!chats.success) return `Ошибка при получение данных!`

  if (chats.message === "Список чатов пока не загружен") {
    return `Список чатов пока не загружен`
  } else {
    let i = 1
    
    chats.data.forEach(p => {
      massChats.push(`\n\n${i})` + `[${p.chat_link}| ${p.chat_name}]` + `\n` + `${p.description}`)
      i++
    })
  }
  return `📋 Список рабочих чатов ${massChats}`
}

module.exports = {
  getWorkChats,
  addWorkChat,
  deleteWorkChat,
  updateWorkChat,
  listChats,
}
const { error } = require("node:console");
const { query } = require("../config/database");
const { parseScheduleTime, parseAddress } = require("../utils/helpers");
require('dotenv').config();

async function getAllPvzs() {
  try {
    const result = await query(
      `SELECT * FROM pvz WHERE is_active = true ORDER BY pvz_id `,
    );

    if (result.rows.length === 0) {
      return { success: false, message: "Список ПВЗ пуст" };
    }
    return { success: true, data: result.rows };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

async function getPvzByCode(code) {
  const result = await query(
    "SELECT * FROM pvz WHERE pvz_id = $1 AND is_active = true",
    [code],
  );
  return result.rows[0] || null;
}

async function getUserPvzs(userId) {
  const result = await query(
    `SELECT p.* FROM pvz p
     JOIN pvz_manager pm ON p.id = pm.pvz_id
     WHERE pm.user_id = $1 AND pm.is_active = true` ,
    [userId],
  );
  return result.rows;
}

async function getUserReplacements(userId) {
  const result = await query(
    `SELECT u.* FROM users u
     JOIN shift_substitutes ss ON u.id = ss.replacement_user_id
     WHERE ss.main_user_id = $1`,
    [userId],
  );
  return result.rows;
}

async function addPvzToDb(pvzId, address, openTime, closeTime) {
  try {
    const { city, street, house, streetNormalized } =
      await parseAddress(address);
    const result = await query(
      `INSERT INTO pvz (pvz_id, address, city, street, house, street_normalized, open_time, close_time, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
     ON CONFLICT (pvz_id) DO UPDATE SET
       address = EXCLUDED.address,
       city = EXCLUDED.city,
       street = EXCLUDED.street,
       house = EXCLUDED.house,
       street_normalized = EXCLUDED.street_normalized,
       open_time = EXCLUDED.open_time,
       close_time = EXCLUDED.close_time,
       updated_at = NOW()
     RETURNING *`,
      [
        pvzId,
        address,
        city,
        street,
        house,
        streetNormalized,
        openTime,
        closeTime,
      ],
    );

    if (!result.rows[0].is_active) {
      await query(
        `UPDATE pvz SET is_active = $1 WHERE pvz_id = $2
      RETURNING *`,
        [true, pvzId],
      );
    }

    return {
      success: true,
      message: "ПВЗ успешно добавлен в базу",
      data: result.rows,
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

async function deactivePvzFromDb(pvzId) {
  try {
    const result = await query(
      `UPDATE pvz SET is_active = $1 WHERE pvz_id = $2
      RETURNING *`,
      [false, pvzId],
    );

    if (result.rows.length === 0) {
      return {
        success: false,
        message: "ПВЗ не найден в базе",
        pvz: result.rows[0],
      };
    }

    await query(`DELETE FROM pvz_manager WHERE pvz_id = $1`, [
      result.rows[0].id,
    ]);

    return { success: true, message: "ПВЗ был удален с активных" };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

async function linkUserToPvz(userId, pvzId) {
  try {
    await query(
      `INSERT INTO pvz_manager (pvz_id, user_id, notes, is_active, created_at, updated_at)
       VALUES ($1, $2, '', true, NOW(), NOW())
       RETURNING *`,
      [pvzId, userId],
    );
    return { success: true, message: "Запись успешно добавлена" };
  } catch (error) {
    if (error.code === "23505") {
      return { success: false, message: "ПВЗ уже привязан" };
    }
    return { success: false, message: error.message };
  }
}

async function removeUserFromPvz(userId, pvzId) {
  try {
    const result = await query(
      `DELETE FROM pvz_manager WHERE user_id = $1 AND pvz_id = $2 RETURNING *`,
      [userId, pvzId],
    );
    if (result.rows.length === 0) {
      return {
        success: false,
        error: "Связь между пользователем и ПВЗ не найдена",
      };
    }
    return { success: true, message: "OK" };
  } catch (error) {
    console.error("Ошибка удаления связи:", error);
    return { success: false, error: error.message };
  }
}

async function addReplacementDb(userId, replacementId) {
  try {
    const result = await query(
      `INSERT INTO shift_substitutes (main_user_id, replacement_user_id, created_at, updated_at)
       VALUES ($1, $2, NOW(), NOW()) 
       RETURNING *`,
      [userId, replacementId],
    );
    if (result.rows.length === 0) {
      return { success: false, message: "Не удалось привязать сменщика" };
    }
    return { success: true, message: "Сменщик привязан" };
  } catch (error) {
    if (error.code === "23505") {
      return { success: false, message: "Сменщик уже привязан" };
    }
    return { success: false, message: error.message };
  }
}

async function deleteReplacement(userId, replacementId) {
  try {
    const result = await query(
      `DELETE FROM shift_substitutes WHERE main_user_id = $1 AND replacement_user_id = $2 RETURNING *`,
      [userId, replacementId],
    );
    if (result.rows.length === 0) {
      return { success: false, message: "Сменщик не найден" };
    }
    return { success: true, message: "Сменщик удален" };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

async function updatePvzRating(rate, pvzId) {
  try {
    const result = await query(`
      UPDATE pvz SET rate = $1, updated_at = NOW() WHERE pvz_id = $2 RETURNING *
      `, [rate.value, pvzId]);

    if (result.rows.length === 0) {
      return { success: false, message: "Не удалось найти ПВЗ"};
    }

    return { success: true, message: "Рейтинг установлен"}
  } catch (error) {
    return error.message
  }
}

module.exports = {
  getAllPvzs,
  getPvzByCode,
  getUserPvzs,
  addPvzToDb,
  linkUserToPvz,
  removeUserFromPvz,
  addReplacementDb,
  deleteReplacement,
  getUserReplacements,
  deactivePvzFromDb,
  updatePvzRating,
};

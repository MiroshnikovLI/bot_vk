const { query } = require("../../config/database");
const { isUserAdmin } = require('../user/userService');
const { sendMessage } = require('../../config/vkApi');
const { userStates } = require('../../state/stateManager');
const { NOTIFICATIONS } = require('../../constants/index');

async function getThereIsNoReport(reportType) {
  try {
    const result = await query(
      `
      SELECT p.* FROM pvz p
      WHERE p.is_active = true 
      AND NOT EXISTS (
        SELECT 1 FROM shift_reports sr 
        WHERE sr.pvz_id = p.id 
          AND sr.report_type = $1
          AND DATE(sr.created_at) = CURRENT_DATE
      )
    `,
      [reportType],
    );

    if (result.rows.length === 0) {
      return { success: false, message: "Все пункты отписались" };
    }

    return {
      success: true,
      message: "Пункты которые еще не отписались",
      data: result.rows,
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

async function getAllTheReportsForToday(reportType) {
  try {
    const result = await query(
      `
      SELECT * FROM shift_reports WHERE report_type = $1 AND DATE(created_at) = CURRENT_DATE ORDER BY id ASC`,
      [reportType],
    );

    if (result.rows.length === 0) {
      return { success: false, message: "Сегодня еще никто не отчитывался" };
    }

    return { success: true, message: "Отчеты", data: result.rows };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

async function hasUserReportedToday(userId) {
  try {
    const result = await query(
      `SELECT * FROM shift_reports 
       WHERE user_id = $1 AND DATE(created_at) = CURRENT_DATE`,
      [userId],
    );

    const reports = result.rows;

    if (reports.length === 0) {
      return { success: true, hasOpen: false, message: "Нет отчётов сегодня" };
    }

    const lastReport = result.rows[result.rows.length - 1];
    const hasOpen = reports.some((r) => r.report_type === "open");
    const hasClose = reports.some((r) => r.report_type === "close");

    // Есть open, но нет close → отчёт об открытии ещё не закрыт
    if (hasOpen && !hasClose) {
      return {
        success: true,
        hasOpen: true,
        message: "Есть открытый отчёт",
        data: lastReport,
      };
    }

    return { success: true, hasOpen: false, message: "Все отчёты закрыты" };
  } catch (error) {
    return { success: false, hasOpen: false, message: error.message };
  }
}

async function addShiftReport(
  pvzId,
  userId,
  wbId,
  fullName,
  reportType,
  reportText,
) {
  try {
    const result = await query(
      `INSERT INTO shift_reports (pvz_id, user_id, wb_id, employee_name, report_type, report_text, report_time, is_ontime, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, NOW(), true, NOW()) 
     RETURNING *`,
      [pvzId, userId, wbId, fullName, reportType, reportText],
    );

    if (result.rows.length === 0) {
      return { success: false, message: "Не удалось создать запись" };
    }

    return { success: true, message: "Запись создана", data: result.rows[0] };
  } catch (error) {
    if (error.code === "23505") {
      // Находим существующий отчёт
      const existingReport = await query(
        `SELECT * FROM shift_reports 
       WHERE user_id = $1 
         AND pvz_id = $2 
         AND DATE(created_at) = CURRENT_DATE 
         AND report_type = $3 
       LIMIT 1`,
        [userId, pvzId, reportType],
      );

      if (existingReport.rows.length > 0) {
        const report = existingReport.rows[0];
        return {
          success: false,
          message: `Вы уже отправляли отчёт ${report.report_type === "open" ? "открытии" : "закрытии"} сегодня в ${new Date(report.created_at).toLocaleTimeString()}`,
          existingReport: report,
        };
      }

      return { success: false, message: "Отчёт уже существует" };
    }

    return { success: false, message: error.message };
  }
}

async function createShiftReport(userId, user, pvz, replecament, reportType, rate) {
  const userKeyboards = require('../keyboards/user/main');
  const isAdmin = await isUserAdmin(userId);
  const reportText = await NOTIFICATIONS.REPORT_TEXT(
    pvz,
    user,
    replecament,
    reportType,
    rate
  );

  const result = await addShiftReport(
    pvz.id,
    user.id,
    user.wb_id,
    user.full_name,
    reportType,
    reportText
  );

  await sendMessage(process.env.VK_CHAT_ID, `${reportText}`);
  await sendMessage(
    userId,
    reportType === "open"
      ? `✅ Смена открыта ${pvz.pvz_id}. Отчет отправлен`
      : `✅ Смена закрыта ${pvz.pvz_id}. Отчет отправлен`,
    userKeyboards.main(isAdmin),
  );
  userStates.delete(userId);
}

module.exports = {
  getThereIsNoReport,
  getAllTheReportsForToday,
  hasUserReportedToday,
  addShiftReport,
  createShiftReport,
};

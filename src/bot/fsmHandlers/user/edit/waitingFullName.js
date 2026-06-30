const { query } = require("../../../../config/database");
const { userStates } = require("../../../../state/stateManager");
const { sendMessage } = require("../../../../config/vkApi");
const { NOTIFICATIONS, STATES } = require("../../../../constants/index");

async function waitingFullName(userId, text) {
  await query(
    `INSERT INTO users (vk_id, full_name, role, created_at, updated_at)
     VALUES ($1, $2, 'manager', NOW(), NOW())
     ON CONFLICT (vk_id) DO UPDATE SET full_name = $2, updated_at = NOW()`,
    [userId, text],
  );
  userStates.set(userId, STATES.WAITING_WB_ID, { full_name: text });
  await sendMessage(userId, NOTIFICATIONS.NAME_SUCCESSFULLY_WAITING_WB_ID(text));
}

module.exports = { waitingFullName };

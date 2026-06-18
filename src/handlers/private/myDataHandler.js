const { userStates } = require('../../state/stateManager');
const { getUserVkId, getAllReplacements, getUserId } = require('../../services/userService');
const { getUserPvzs } = require('../../services/pvzService');
const { getPrivateKeyboard } = require('../../keyboards/keyboards');
const { sendMessage } = require('../../config/vkApi');
const { MY_DATA } = require('../../constants/message');
 
async function myDataHandler(userId) {
  const user = await getUserVkId(userId);
  if (!user) {
    userStates.set(userId, "waitingFullName");
    await sendMessage(
      userId,
      "👋 Добро пожаловать! Давайте настроим ваш профиль.\n\n📝 Введите ваше ФИО полностью:",
    );
    return;
  }
  const pvz = await getUserPvzs(user.id);
  const replacement = await getAllReplacements(user.id);
  const pvzList =
    pvz.length > 0
      ? pvz.map((p) => ` • ${p.pvz_id} - ${p.address}`).join("\n")
      : "• Не закреплено ни одного ПВЗ";
  const replacementList =
    replacement.length > 0
      ? (
          await Promise.all(
            replacement.map(async (p) => {
              const user = await getUserId(p.replacement_user_id);
              return ` • [id${user.vk_id}|${user.wb_id}] - [id${user.vk_id}|${user.full_name}]`;
            }),
          )
        ).join("\n")
      : "• Не закреплено ни одного сменщика";
  let message = MY_DATA(user, pvzList, replacementList)
  if (!user.full_name || !user.wb_id) {
    message += `⚠️ **Профиль не заполнен!**\nНажмите "✏️ Изменить ФИО" или "✏️ Изменить WB ID".`;
  }
  await sendMessage(userId, message, await getPrivateKeyboard(userId));
}

module.exports = {
  myDataHandler
}
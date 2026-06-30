const { userStates } = require('../../state/stateManager');
const { getUserVkId, getAllReplacements, getUserId, getUserPvzs, isUserAdmin } = require('../../services/index');
const { userKeyboards } = require('../../keyboards/index');
const { sendMessage } = require('../../config/vkApi');
const { NOTIFICATIONS } = require('../../constants/index');
 
async function handlerMyData(userId) {
  const user = await getUserVkId(userId);
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
  let message = NOTIFICATIONS.MY_DATA(user, pvzList, replacementList)
  if (!user.full_name || !user.wb_id) {
    message += NOTIFICATIONS.PROFILE_NOT_FILLED;
  }

  const isAdmin = await isUserAdmin(userId);

  if (isAdmin) {
    return await sendMessage(userId, message, userKeyboards.main(isAdmin));
  }

  await sendMessage(userId, message, userKeyboards.main());
}

module.exports = {
  handlerMyData
}
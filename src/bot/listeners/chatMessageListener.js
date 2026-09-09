const { getAllActivePvzs, addShiftReport, getUserVkId, getOrCreateUser } = require("../../services/index");
const { determineReportTypeWithChecks } = require("../../utils/index");
const { NOTIFICATIONS } = require("../../constants/index");
const { getUserInfo } = require("../../config/vkApi");
require("dotenv").config();

async function chatMessageListener(context) {
  const { text, from_id: senderId, isOutbox, date } = context;
  
  if (isOutbox || !text?.trim()) return;
  
  // 1. Получаем или создаём пользователя
  let user = await getUserVkId(senderId);

  if (process.env.VK_ID_ZRR.includes(user.vk_id)) return;
  
  if (!user) {
    const userInfo = await getUserInfo(senderId);
    if (!userInfo) return;
    
    user = await getOrCreateUser(senderId, `${userInfo.last_name} ${userInfo.first_name}`);
    if (!user) return;
  }
  
  // 2. Получаем список ПВЗ
  const pvzsResult = await getAllActivePvzs();
  if (!pvzsResult.success || pvzsResult.data.length === 0) return;
  
  const pvzs = pvzsResult.data;
  
  // 3. Определяем ПВЗ по ID
  let selectedPvz = pvzs.find(p => text.replace(/[,;.#-]/g, ' ').includes(p.pvz_id));

  // 4. Если ПВЗ не найден — выходим
  if (!selectedPvz) return;
  
  // 5. Определяем тип отчёта
  const reportTypeResult = await determineReportTypeWithChecks(
    selectedPvz.id,
    user,
    date,
  );
  
  if (!reportTypeResult.type) return;
  
  await addShiftReport(
    selectedPvz.id,
    user.id,
    user.wb_id,
    user.full_name,
    reportTypeResult.type,
    text,
  );
}

module.exports = {
  chatMessageListener,
};
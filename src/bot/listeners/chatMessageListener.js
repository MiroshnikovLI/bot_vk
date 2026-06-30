const { getAllActivePvzs, addShiftReport, getUserVkId, getOrCreateUser } = require("../../services/index");
const { normalizeYo, determineReportTypeWithChecks } = require("../../utils/index");
const { NOTIFICATIONS } = require("../../constants/index");
const { getUserInfo } = require("../../config/vkApi");

async function chatMessageListener(context) {
  const { text, from_id: senderId, isOutbox, date } = context;
  
  if (isOutbox || !text?.trim()) return;
  
  // 1. Получаем или создаём пользователя
  let user = await getUserVkId(senderId);
  
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
  let selectedPvz = pvzs.find(p => text.includes(p.pvz_id));
  
  // 4. Если не нашли по ID — ищем по улице и дому
  if (!selectedPvz) {
    const streetMatches = pvzs.filter(p => 
      normalizeYo(text).toLowerCase().includes(p.street_normalized?.toLowerCase())
    );
    
    if (streetMatches.length === 1) {
      selectedPvz = streetMatches[0];
    } else if (streetMatches.length > 1) {
      // Если несколько улиц — уточняем по дому
      selectedPvz = streetMatches.find(p => 
        text.toLowerCase().includes(p.house?.toLowerCase())
      );
    }
  }
  
  // 5. Если ПВЗ не найден — выходим
  if (!selectedPvz) return;
  
  // 6. Определяем тип отчёта
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

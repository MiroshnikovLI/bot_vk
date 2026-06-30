const PVZ = {
  PVZ_ADDED: (pvz) => `✅ ПВЗ ${pvz.id} - ${pvz.address} успешно добавлен.`,
  PVZ_ALREADY_ADDED: (pvz) => `ПВЗ ${pvz.pvz_id} - ${pvz.address} уже добавлен.`,
};

module.exports = {
  PVZ
}
let uniqueBaseId = `id-${Date.now()}`;
let uuidCount = 0;

export function _TESTING_ONLY_normalize_keys() {
  uniqueBaseId = 'id';
  uuidCount = 0;
}

export function generateKey() {
  return `${uniqueBaseId}-${uuidCount++}`;
}

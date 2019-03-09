let uniqueBaseId: string = `id-${Date.now()}`;
let uuidCount: number = 0;

export function _TESTING_ONLY_normalize_keys(): void {
  uniqueBaseId = `id`;
  uuidCount = 0;
}

export function generateKey(): string {
  return `${uniqueBaseId}-${uuidCount++}`;
}

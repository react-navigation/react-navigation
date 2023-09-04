/**
 * Compare two records with primitive values as the content.
 */
export function isRecordEqual(a: Record<string, any>, b: Record<string, any>) {
  if (a === b) {
    return true;
  }

  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);

  if (aKeys.length !== bKeys.length) {
    return false;
  }

  return aKeys.every((key) => a[key] === b[key]);
}

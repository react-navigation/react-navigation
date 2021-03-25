/**
 * Compare two arrays with primitive values as the content.
 * We need to make sure that both values and order match.
 */
export default function isArrayEqual(a: any[], b: any[]) {
  return a.length === b.length && a.every((it, index) => it === b[index]);
}

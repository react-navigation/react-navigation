export default function findLastIndex<T>(
  array: T[],
  callback: (value: T) => boolean
) {
  for (var i = array.length - 1; i >= 0; i--) {
    if (callback(array[i])) {
      return i;
    }
  }

  return -1;
}

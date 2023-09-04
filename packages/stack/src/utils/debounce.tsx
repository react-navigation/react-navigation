export function debounce<T extends (...args: any[]) => void>(
  func: T,
  duration: number
): T {
  let timeout: NodeJS.Timeout | number | undefined;

  return function (this: any, ...args) {
    if (!timeout) {
      func.apply(this, args);

      timeout = setTimeout(() => {
        timeout = undefined;
      }, duration);
    }
  } as T;
}

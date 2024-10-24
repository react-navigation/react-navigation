export function debounce<T extends (...args: any[]) => void>(
  func: T,
  duration: number
): T {
  let timeout: NodeJS.Timeout;

  return function (this: unknown, ...args) {
    clearTimeout(timeout);

    timeout = setTimeout(() => {
      func.apply(this, args);
    }, duration);
  } as T;
}

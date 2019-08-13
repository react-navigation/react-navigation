declare module 'use-subscription' {
  export function useSubscription<T>(options: {
    getCurrentValue: () => T;
    subscribe: (callback: (value: T) => void) => () => void;
  }): T;
}

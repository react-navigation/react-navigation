import * as React from 'react';

type Thenable<T> = { then(cb: (result: T) => void): void };

export default function useThenable<T>(create: () => Thenable<T>) {
  const [promise] = React.useState(create);

  // Check if our thenable is synchronous
  let resolved = false;
  let value: T | undefined;

  promise.then((result) => {
    resolved = true;
    value = result;
  });

  const [state, setState] = React.useState<[boolean, T | undefined]>([
    resolved,
    value,
  ]);

  React.useEffect(() => {
    let cancelled = false;

    const resolve = async () => {
      let result;

      try {
        result = await promise;
      } finally {
        if (!cancelled) {
          setState([true, result]);
        }
      }
    };

    if (!resolved) {
      resolve();
    }

    return () => {
      cancelled = true;
    };
  }, [promise, resolved]);

  return state;
}

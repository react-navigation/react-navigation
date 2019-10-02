import * as React from 'react';

export default function useThenable<T>(
  create: () => {
    then(success: (result: T) => void, error?: (error: any) => void): void;
  }
) {
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

    if (!resolved) {
      promise.then(
        (result) => {
          if (!cancelled) {
            setState([true, result]);
          }
        },
        (error) => {
          if (!cancelled) {
            console.error(error);
            setState([true, undefined]);
          }
        }
      );
    }

    return () => {
      cancelled = true;
    };
  }, [promise, resolved]);

  return state;
}

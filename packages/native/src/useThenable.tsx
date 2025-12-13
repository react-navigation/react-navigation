import * as React from 'react';

export type Thenable<T> = {
  then(onfulfilled?: (value: T) => unknown): PromiseLike<unknown>;
};

export function useThenable<T>(create: () => Thenable<T> | undefined) {
  const [promise] = React.useState(create);

  let initialState: [boolean, T | undefined] = [false, undefined];

  if (promise == null) {
    initialState = [true, undefined];
  } else {
    // Check if our thenable is synchronous
    // eslint-disable-next-line promise/catch-or-return, promise/always-return
    promise.then((result) => {
      initialState = [true, result];
    });
  }

  const [state, setState] = React.useState(initialState);
  const [resolved] = state;

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

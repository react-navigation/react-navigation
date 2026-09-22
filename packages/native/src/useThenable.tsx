import * as React from 'react';

export type Thenable<T> = {
  then(onfulfilled?: (value: T) => unknown): PromiseLike<unknown>;
};

export function useThenable<T>(create: () => Thenable<T> | T | undefined) {
  const [value] = React.useState(create);

  let initialState: [boolean, T | undefined] = [false, undefined];

  if (value == null) {
    initialState = [true, undefined];
  } else if (typeof value === 'object' && 'then' in value) {
    // Check if our thenable is synchronous
    // eslint-disable-next-line promise/catch-or-return, promise/always-return
    value.then((result) => {
      initialState = [true, result];
    });
  } else {
    initialState = [true, value];
  }

  const [state, setState] = React.useState(initialState);
  const [resolved] = state;

  React.useEffect(() => {
    let cancelled = false;

    const resolve = async () => {
      let result;

      try {
        result = await value;
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
  }, [value, resolved]);

  return state;
}

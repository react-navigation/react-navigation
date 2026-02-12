import * as React from 'react';

export type Thenable<T> = {
  then(
    onfulfilled?: ((value: T) => unknown) | null,
    onrejected?: ((reason: unknown) => unknown) | null
  ): PromiseLike<unknown>;
};

type ThenableState<T> =
  | {
      status: 'pending';
      promise: Promise<T | undefined>;
    }
  | {
      status: 'resolved';
      value: T | undefined;
    };

function createThenableState<T>(
  thenable: Thenable<T> | undefined
): ThenableState<T> {
  if (thenable == null) {
    return {
      status: 'resolved',
      value: undefined,
    };
  }

  let isResolved = false;
  let isRejected = false;
  let value: T | undefined;
  let error: unknown;

  const promise = new Promise<T | undefined>((resolve, reject) => {
    thenable.then(
      (result) => {
        isResolved = true;
        value = result;
        resolve(result);
      },
      (reason) => {
        isResolved = true;
        isRejected = true;
        error = reason;
        reject(reason);
      }
    );
  });

  if (isResolved) {
    if (isRejected) {
      throw error;
    }

    return {
      status: 'resolved',
      value,
    };
  }

  return {
    status: 'pending',
    count: Math.random(),
    promise,
  };
}

export function useThenable<T>(create: () => Thenable<T> | undefined) {
  const [state] = React.useState(() => createThenableState(create()));

  if (state.status === 'resolved') {
    return state.value;
  }

  return React.use(state.promise);
}

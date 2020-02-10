import * as React from 'react';
import {
  NavigationState,
  NavigationAction,
  PartialState,
} from '@react-navigation/routers';

type State = NavigationState | PartialState<NavigationState> | undefined;

type Options = {
  name: string;
  reset: (state: NavigationState) => void;
  state: State;
};

type DevTools = {
  init(value: any): void;
  send(action: any, value: any): void;
  subscribe(
    listener: (message: { type: string; [key: string]: any }) => void
  ): () => void;
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      __REDUX_DEVTOOLS_EXTENSION__:
        | {
            connect(options: { name: string }): DevTools;
            disconnect(): void;
          }
        | undefined;
    }
  }
}

export default function useDevTools({ name, reset, state }: Options) {
  const devToolsRef = React.useRef<DevTools>();

  if (
    process.env.NODE_ENV !== 'production' &&
    global.__REDUX_DEVTOOLS_EXTENSION__ &&
    devToolsRef.current === undefined
  ) {
    devToolsRef.current = global.__REDUX_DEVTOOLS_EXTENSION__.connect({ name });
  }

  const devTools = devToolsRef.current;
  const lastStateRef = React.useRef<State>(state);
  const actions = React.useRef<(NavigationAction | string)[]>([]);

  React.useEffect(() => {
    devTools?.init(lastStateRef.current);
  }, [devTools]);

  React.useEffect(
    () =>
      devTools?.subscribe(message => {
        if (message.type === 'DISPATCH' && message.state) {
          reset(JSON.parse(message.state));
        }
      }),
    [devTools, reset]
  );

  const trackState = React.useCallback(
    (getState: () => State) => {
      if (!devTools) {
        return;
      }

      while (actions.current.length > 1) {
        devTools.send(actions.current.shift(), lastStateRef.current);
      }

      const state = getState();

      if (actions.current.length) {
        devTools.send(actions.current.pop(), state);
      } else {
        devTools.send('@@UNKNOWN', state);
      }

      lastStateRef.current = state;
    },
    [devTools]
  );

  const trackAction = React.useCallback(
    (action: NavigationAction | string) => {
      if (!devTools) {
        return;
      }

      actions.current.push(action);
    },
    [devTools]
  );

  return {
    trackAction,
    trackState,
  };
}

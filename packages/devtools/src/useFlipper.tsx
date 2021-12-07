import type { NavigationContainerRef } from '@react-navigation/core';
import { nanoid } from 'nanoid/non-secure';
import * as React from 'react';
import type { Flipper } from 'react-native-flipper';

import useDevToolsBase from './useDevToolsBase';

let FlipperModule: typeof import('react-native-flipper') | undefined;

try {
  FlipperModule = require('react-native-flipper');
} catch (e) {
  // Do nothing
}

export default function useFlipper(
  ref: React.RefObject<NavigationContainerRef<any>>
) {
  if (FlipperModule == null) {
    throw new Error(
      "Please install the 'react-native-flipper' package in your project to use Flipper integration for React Navigation."
    );
  }

  const { addPlugin } = FlipperModule;

  const connectionRef = React.useRef<Flipper.FlipperConnection>();

  const { resetRoot } = useDevToolsBase(ref, (result) => {
    const connection = connectionRef.current;

    if (!connection) {
      return;
    }

    switch (result.type) {
      case 'init':
        connection.send('init', {
          id: nanoid(),
          state: result.state,
        });
        break;
      case 'action':
        connection.send('action', {
          id: nanoid(),
          action: result.action,
          state: result.state,
          stack: result.stack,
        });
        break;
    }
  });

  React.useEffect(() => {
    addPlugin({
      getId() {
        return 'react-navigation';
      },
      async onConnect(connection) {
        connectionRef.current = connection;

        const on = (event: string, listener: (params: any) => Promise<any>) => {
          connection.receive(event, (params, responder) => {
            try {
              const result = listener(params);

              // Return null instead of undefined, otherwise flipper doesn't respond
              responder.success(result ?? null);
            } catch (e) {
              responder.error(e);
            }
          });
        };

        on('navigation.invoke', ({ method, args = [] }) => {
          switch (method) {
            case 'resetRoot':
              return resetRoot(args[0]);
            default:
              // @ts-expect-error: we want to call arbitrary methods here
              return ref.current?.[method](...args);
          }
        });

        on('linking.invoke', ({ method, args = [] }) => {
          const linking: any = ref.current
            ? // @ts-ignore: this might not exist
              global.REACT_NAVIGATION_DEVTOOLS?.get(ref.current)?.linking
            : null;

          switch (method) {
            case 'getStateFromPath':
            case 'getPathFromState':
            case 'getActionFromState':
              return linking?.[method](
                args[0],
                args[1]?.trim()
                  ? // eslint-disable-next-line no-eval
                    eval(`(function() { return ${args[1]}; }())`)
                  : linking.config
              );
            default:
              return linking?.[method](...args);
          }
        });
      },
      onDisconnect() {
        connectionRef.current = undefined;
      },
      runInBackground() {
        return false;
      },
    });
  }, [addPlugin, ref, resetRoot]);
}

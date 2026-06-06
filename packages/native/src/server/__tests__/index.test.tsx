import { expect, jest, test } from '@jest/globals';
import {
  createNavigatorFactory,
  type DefaultNavigatorOptions,
  type NavigatorScreenParams,
  type NavigatorTypeBagBase,
  type ParamListBase,
  type StackNavigationState,
  StackRouter,
  TabRouter,
  useNavigationBuilder,
} from '@react-navigation/core';
import * as React from 'react';
import { renderToPipeableStream } from 'react-dom/server';
import { PassThrough } from 'stream';

import { NavigationContainer } from '../../NavigationContainer';
import { ServerContainer } from '..';

// We want to use the web version of useLinking
// eslint-disable-next-line import-x/extensions
jest.mock('../../useLinking', () => require('../../useLinking.tsx'));

// Since Jest is configured for React Native, the *.native.js file is imported
// Causing the wrong useIsomorphicLayoutEffect to be imported
// It causes "Warning: useLayoutEffect does nothing on the server"
// So we explicitly silence it here
// This warning is being removed in React: https://github.com/facebook/react/pull/26395
const error = console.error;

jest.spyOn(console, 'error').mockImplementation((...args) => {
  if (/Warning: useLayoutEffect does nothing on the server/m.test(args[0])) {
    return;
  }

  error(...args);
});

const render = (element: React.ReactNode) => {
  return new Promise<string>((resolve, reject) => {
    const stream = new PassThrough();
    let result = '';
    let error: unknown;

    stream.setEncoding('utf8');
    stream.on('data', (chunk) => {
      result += chunk;
    });
    stream.on('end', () => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
    stream.on('error', reject);

    const { pipe } = renderToPipeableStream(element, {
      onAllReady() {
        pipe(stream);
      },
      onError(e) {
        error = e;
      },
      onShellError(e) {
        reject(e);
      },
    });
  });
};

test('renders without browser globals', async () => {
  const window = globalThis.window;
  let html: string;

  // @ts-expect-error: deleting window is intentional for this server test
  delete globalThis.window;

  try {
    html = await render(
      <ServerContainer location={new URL('https://example.com/')}>
        <NavigationContainer>
          <div>Home</div>
        </NavigationContainer>
      </ServerContainer>
    );
  } finally {
    // eslint-disable-next-line require-atomic-updates
    globalThis.window = window;
  }

  expect(html).toMatchInlineSnapshot(`"<div>Home</div>"`);
});

test('renders correct state with location', async () => {
  const StackNavigator = (
    props: DefaultNavigatorOptions<
      ParamListBase,
      StackNavigationState<ParamListBase>,
      {},
      {},
      unknown
    >
  ) => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      StackRouter,
      props
    );

    return (
      <NavigationContent>
        {state.routes.map((route) => (
          <div key={route.key}>{descriptors[route.key]?.render()}</div>
        ))}
      </NavigationContent>
    );
  };

  interface StackTypeBag extends NavigatorTypeBagBase {
    State: StackNavigationState<this['ParamList']>;
    Navigator: typeof StackNavigator;
  }

  const createStackNavigator =
    createNavigatorFactory<StackTypeBag>(StackNavigator);

  type StackAParamList = {
    Home: NavigatorScreenParams<StackBParamList>;
    Chat: undefined;
  };

  type StackBParamList = {
    Profile: undefined;
    Settings: undefined;
    Feed: undefined;
    Updates: undefined;
  };

  const StackA = createStackNavigator<StackAParamList>();
  const StackB = createStackNavigator<StackBParamList>();

  const TestScreen = ({ route }: any): any =>
    `${route.name} ${JSON.stringify(route.params)}`;

  const NestedStack = () => {
    return (
      <StackB.Navigator initialRouteName="Feed">
        <StackB.Screen name="Profile" component={TestScreen} />
        <StackB.Screen name="Settings" component={TestScreen} />
        <StackB.Screen name="Feed" component={TestScreen} />
        <StackB.Screen name="Updates" component={TestScreen} />
      </StackB.Navigator>
    );
  };

  const html = await render(
    <ServerContainer location={new URL('https://example.com/john/updates')}>
      <NavigationContainer<StackAParamList>
        linking={{
          config: {
            screens: {
              Home: {
                initialRouteName: 'Profile',
                screens: {
                  Settings: {
                    path: ':user/edit',
                  },
                  Updates: {
                    path: ':user/updates',
                  },
                },
              },
            },
          },
        }}
      >
        <StackA.Navigator>
          <StackA.Screen name="Home" component={NestedStack} />
          <StackA.Screen name="Chat" component={TestScreen} />
        </StackA.Navigator>
      </NavigationContainer>
    </ServerContainer>
  );

  expect(html).toMatchInlineSnapshot(
    `"<div><div>Profile undefined</div><div>Updates {&quot;user&quot;:&quot;john&quot;}</div></div>"`
  );
});

test('waits for async screens before onAllReady', async () => {
  const createTabNavigator = createNavigatorFactory((props: any) => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      TabRouter,
      props
    );

    return (
      <NavigationContent>
        {state.routes.map((route) => (
          <div key={route.key}>{descriptors[route.key]?.render()}</div>
        ))}
      </NavigationContent>
    );
  });

  const Tab = createTabNavigator();
  const title = Promise.resolve('Loaded');

  const AsyncScreen = ({ route }: any): any => {
    const value = React.use(title);

    return `${route.name} ${value}`;
  };

  const html = await render(
    <ServerContainer location={new URL('https://example.com/')}>
      <React.Suspense fallback="Loading">
        <NavigationContainer>
          <Tab.Navigator>
            <Tab.Screen
              name="Home"
              component={AsyncScreen}
              options={{ title: 'Async title' }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </React.Suspense>
    </ServerContainer>
  );

  expect(html).toMatchInlineSnapshot(
    `"<!--$--><div>Home Loaded<!-- --></div><!--/$-->"`
  );
});

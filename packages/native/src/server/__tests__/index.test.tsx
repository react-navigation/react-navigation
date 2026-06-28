import { expect, jest, test } from '@jest/globals';
import {
  createNavigatorFactory,
  type NavigatorScreenParams,
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

const render = (element: React.ReactNode, stream = new PassThrough()) => {
  return new Promise<string>((resolve, reject) => {
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
      onShellReady() {
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
  const createStackNavigator = createNavigatorFactory((props: any) => {
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
  });

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

test('waits for pending async screens with Suspense boundary around container', async () => {
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

  const { promise, resolve } = Promise.withResolvers<string>();

  const AsyncScreen = ({ route }: { route: { name: string } }) => {
    const value = React.use(promise);

    return `${route.name} ${value}`;
  };

  const stream = new PassThrough();

  const htmlPromise = render(
    <ServerContainer location={new URL('https://example.com/')}>
      <React.Suspense fallback="Loading">
        <NavigationContainer>
          <Tab.Navigator>
            <Tab.Screen name="Home" component={AsyncScreen} />
          </Tab.Navigator>
        </NavigationContainer>
      </React.Suspense>
    </ServerContainer>,
    stream
  );

  await Promise.resolve();

  resolve('Loaded');

  const html = await htmlPromise;

  expect(html).toMatchInlineSnapshot(
    `"<!--$--><div>Home Loaded<!-- --></div><!--/$-->"`
  );
});

test('waits for pending async screens with Suspense boundary in screen layout', async () => {
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

  const { promise, resolve } = Promise.withResolvers<string>();

  const AsyncScreen = ({ route }: { route: { name: string } }) => {
    const value = React.use(promise);

    return `${route.name} ${value}`;
  };

  const stream = new PassThrough();

  const shellPromise = new Promise<string>((resolve, reject) => {
    stream.once('data', resolve);
    stream.on('error', reject);
  });

  const htmlPromise = render(
    <ServerContainer location={new URL('https://example.com/')}>
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen
            name="Home"
            component={AsyncScreen}
            layout={({ children }) => (
              <React.Suspense fallback="Loading">{children}</React.Suspense>
            )}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </ServerContainer>,
    stream
  );

  await expect(shellPromise).resolves.toMatchInlineSnapshot(
    `"<div><!--$?--><template id="B:0"></template>Loading<!--/$--></div><script>requestAnimationFrame(function(){$RT=performance.now()});</script>"`
  );

  resolve('Loaded');

  const html = await htmlPromise;

  expect(html).toContain(`<div hidden id="S:0">Home Loaded<!-- --></div>`);
  expect(html).toContain(`$RC("B:0","S:0")`);
});

test('waits for lazy screens when Suspense boundary is in screen layout', async () => {
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

  const { promise, resolve } = Promise.withResolvers<{
    default: React.ComponentType<{ route: { name: string } }>;
  }>();

  const LazyScreen = React.lazy(() => promise);

  const stream = new PassThrough();

  const shellPromise = new Promise<string>((resolve, reject) => {
    stream.once('data', resolve);
    stream.on('error', reject);
  });

  const htmlPromise = render(
    <ServerContainer location={new URL('https://example.com/')}>
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen
            name="Home"
            component={LazyScreen}
            layout={({ children }) => (
              <React.Suspense fallback="Loading">{children}</React.Suspense>
            )}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </ServerContainer>,
    stream
  );

  await expect(shellPromise).resolves.toMatchInlineSnapshot(
    `"<div><!--$?--><template id="B:0"></template>Loading<!--/$--></div><script>requestAnimationFrame(function(){$RT=performance.now()});</script>"`
  );

  resolve({
    default: ({ route }) => `${route.name} Loaded`,
  });

  const html = await htmlPromise;

  expect(html).toContain(`<div hidden id="S:0">Home Loaded<!-- --></div>`);
  expect(html).toContain(`$RC("B:0","S:0")`);
});

test('waits for async screens without a Suspense boundary', async () => {
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

  const { promise, resolve } = Promise.withResolvers<string>();

  const AsyncScreen = ({ route }: { route: { name: string } }) => {
    const value = React.use(promise);

    return `${route.name} ${value}`;
  };

  const stream = new PassThrough();

  const htmlPromise = render(
    <ServerContainer location={new URL('https://example.com/')}>
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name="Home" component={AsyncScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </ServerContainer>,
    stream
  );

  await Promise.resolve();

  resolve('Loaded');

  const html = await htmlPromise;

  expect(html).toMatchInlineSnapshot(`"<div>Home Loaded<!-- --></div>"`);
});

test('waits for lazy screens without a Suspense boundary', async () => {
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

  const { promise, resolve } = Promise.withResolvers<{
    default: React.ComponentType<{ route: { name: string } }>;
  }>();

  const LazyScreen = React.lazy(() => promise);

  const stream = new PassThrough();

  const htmlPromise = render(
    <ServerContainer location={new URL('https://example.com/')}>
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name="Home" component={LazyScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </ServerContainer>,
    stream
  );

  await Promise.resolve();

  resolve({
    default: ({ route }) => `${route.name} Loaded`,
  });

  const html = await htmlPromise;

  expect(html).toMatchInlineSnapshot(`"<div>Home Loaded<!-- --></div>"`);
});

test('streams fallback before rejecting screen promise without an error boundary', async () => {
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

  const { promise, reject } = Promise.withResolvers<string>();

  const AsyncScreen = () => {
    React.use(promise);

    return 'Loaded';
  };

  const stream = new PassThrough();

  const shellPromise = new Promise<string>((resolve, reject) => {
    stream.once('data', resolve);
    stream.on('error', reject);
  });

  const htmlPromise = render(
    <ServerContainer location={new URL('https://example.com/')}>
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen
            name="Home"
            component={AsyncScreen}
            layout={({ children }) => (
              <React.Suspense fallback="Loading">{children}</React.Suspense>
            )}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </ServerContainer>,
    stream
  );

  await expect(shellPromise).resolves.toMatchInlineSnapshot(
    `"<div><!--$?--><template id="B:0"></template>Loading<!--/$--></div><script>requestAnimationFrame(function(){$RT=performance.now()});</script>"`
  );

  reject(new Error('Failed to load screen'));

  await expect(htmlPromise).rejects.toThrow('Failed to load screen');
});

test('streams fallback before rejecting screen promise with an error boundary', async () => {
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

  class TestErrorBoundary extends React.Component<
    React.PropsWithChildren<{ fallback: React.ReactNode }>,
    { error: unknown }
  > {
    override state = { error: undefined };

    static getDerivedStateFromError(error: unknown) {
      return { error };
    }

    override render() {
      if (this.state.error) {
        return this.props.fallback;
      }

      return this.props.children;
    }
  }

  const Tab = createTabNavigator();

  const { promise, reject } = Promise.withResolvers<string>();

  const AsyncScreen = () => {
    React.use(promise);

    return 'Loaded';
  };

  const stream = new PassThrough();

  const shellPromise = new Promise<string>((resolve, reject) => {
    stream.once('data', resolve);
    stream.on('error', reject);
  });

  const htmlPromise = render(
    <ServerContainer location={new URL('https://example.com/')}>
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen
            name="Home"
            component={AsyncScreen}
            layout={({ children }) => (
              <TestErrorBoundary fallback="Could not load screen">
                <React.Suspense fallback="Loading">{children}</React.Suspense>
              </TestErrorBoundary>
            )}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </ServerContainer>,
    stream
  );

  await expect(shellPromise).resolves.toMatchInlineSnapshot(
    `"<div><!--$?--><template id="B:0"></template>Loading<!--/$--></div><script>requestAnimationFrame(function(){$RT=performance.now()});</script>"`
  );

  reject(new Error('Failed to load screen'));

  await expect(htmlPromise).rejects.toThrow('Failed to load screen');
});

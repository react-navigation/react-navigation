/**
 * @jest-environment node
 */

import { expect, jest, test } from '@jest/globals';
import {
  createNavigatorFactory,
  getStateFromPath,
  NavigationIndependentTree,
  type NavigatorScreenParams,
  StackRouter,
  TabRouter,
  useNavigationBuilder,
} from '@react-navigation/core';
import * as React from 'react';
import { renderToPipeableStream } from 'react-dom/server.node';
import { PassThrough } from 'stream';

import { NavigationContainer } from '../../NavigationContainer';
import { createServerHandle, ServerContainer, type ServerHandle } from '..';

type RenderOptions = {
  stream?: PassThrough;
  onShellReady?: () => void;
};

const render = (
  element: React.ReactNode,
  { stream = new PassThrough(), onShellReady }: RenderOptions = {}
) => {
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
        onShellReady?.();
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
    { stream }
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
    { stream }
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
    { stream }
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
    { stream }
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
    { stream }
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
    { stream }
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
    { stream }
  );

  await expect(shellPromise).resolves.toMatchInlineSnapshot(
    `"<div><!--$?--><template id="B:0"></template>Loading<!--/$--></div><script>requestAnimationFrame(function(){$RT=performance.now()});</script>"`
  );

  reject(new Error('Failed to load screen'));

  await expect(htmlPromise).rejects.toThrow('Failed to load screen');
});

const Stack = createNavigatorFactory((props: any) => {
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
})();

const RouteNameScreen = ({ route }: any): any => route.name;

type NestedParamList = {
  Feed: undefined;
  Profile: undefined;
  Updates: { user: string } | undefined;
};

type RootStackParamList = {
  Home: NavigatorScreenParams<NestedParamList>;
};

test('returns no redirect when the URL matches the rendered state', async () => {
  const handle = createServerHandle();

  const html = await render(
    <ServerContainer
      handle={handle}
      location={new URL('https://example.com/john/updates')}
    >
      <NavigationContainer<RootStackParamList>
        linking={{
          config: {
            screens: {
              Home: {
                initialRouteName: 'Profile',
                screens: {
                  Profile: 'profile',
                  Updates: ':user/updates',
                },
              },
            },
          },
        }}
      >
        <Stack.Navigator>
          <Stack.Screen name="Home">
            {() => (
              <Stack.Navigator>
                <Stack.Screen name="Profile" component={RouteNameScreen} />
                <Stack.Screen name="Updates" component={RouteNameScreen} />
              </Stack.Navigator>
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </ServerContainer>
  );

  expect(html).toContain('Updates');
  expect(handle.getRedirect()).toBeUndefined();
});

test('returns redirect when the URL is for a screen that is not rendered', async () => {
  const handle = createServerHandle();

  const isSignedIn = false;

  let redirectAtShell: ReturnType<ServerHandle['getRedirect']>;

  const html = await render(
    <ServerContainer
      handle={handle}
      location={new URL('https://example.com/profile?ref=timeline')}
    >
      <NavigationContainer
        linking={{
          config: {
            screens: {
              Profile: 'profile',
              SignIn: 'signin',
            },
          },
        }}
      >
        <Stack.Navigator>
          {isSignedIn ? (
            <Stack.Screen name="Profile" component={RouteNameScreen} />
          ) : (
            <Stack.Screen name="SignIn" component={RouteNameScreen} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </ServerContainer>,
    {
      onShellReady() {
        redirectAtShell = handle.getRedirect();
      },
    }
  );

  expect(html).toContain('SignIn');
  expect(redirectAtShell).toEqual({ href: '/signin' });
  expect(handle.getRedirect()).toEqual({ href: '/signin' });
});

test('returns no redirect when the URL is for a conditional screen that is rendered', async () => {
  const handle = createServerHandle();

  const isSignedIn = true;

  const html = await render(
    <ServerContainer
      handle={handle}
      location={new URL('https://example.com/profile')}
    >
      <NavigationContainer
        linking={{
          config: {
            screens: {
              Profile: 'profile',
              SignIn: 'signin',
            },
          },
        }}
      >
        <Stack.Navigator>
          {isSignedIn ? (
            <Stack.Screen name="Profile" component={RouteNameScreen} />
          ) : (
            <Stack.Screen name="SignIn" component={RouteNameScreen} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </ServerContainer>
  );

  expect(html).toContain('Profile');
  expect(handle.getRedirect()).toBeUndefined();
});

test('returns redirect when a nested screen is not rendered', async () => {
  const handle = createServerHandle();

  const isSignedIn = false;

  const html = await render(
    <ServerContainer
      handle={handle}
      location={new URL('https://example.com/home/profile')}
    >
      <NavigationContainer<RootStackParamList>
        linking={{
          config: {
            screens: {
              Home: {
                path: 'home',
                screens: {
                  Feed: 'feed',
                  Profile: 'profile',
                },
              },
            },
          },
        }}
      >
        <Stack.Navigator>
          <Stack.Screen name="Home">
            {() => (
              <Stack.Navigator>
                <Stack.Screen name="Feed" component={RouteNameScreen} />
                {isSignedIn ? (
                  <Stack.Screen name="Profile" component={RouteNameScreen} />
                ) : null}
              </Stack.Navigator>
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </ServerContainer>
  );

  expect(html).toContain('Feed');
  expect(handle.getRedirect()).toEqual({ href: '/home/feed' });
});

test('returns redirect to initial screen when the URL does not match any screen', async () => {
  const handle = createServerHandle();

  const html = await render(
    <ServerContainer
      handle={handle}
      location={new URL('https://example.com/nonexistent')}
    >
      <NavigationContainer
        linking={{
          config: {
            screens: {
              Home: 'home',
              Feed: 'feed',
            },
          },
        }}
      >
        <Stack.Navigator>
          <Stack.Screen name="Home" component={RouteNameScreen} />
          <Stack.Screen name="Feed" component={RouteNameScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ServerContainer>
  );

  expect(html).toContain('Home');
  expect(handle.getRedirect()).toEqual({ href: '/home' });
});

test('returns redirect to initial screen for the root URL when no screen matches it', async () => {
  const handle = createServerHandle();

  const html = await render(
    <ServerContainer handle={handle} location={new URL('https://example.com/')}>
      <NavigationContainer
        linking={{
          config: {
            screens: {
              Home: 'home',
            },
          },
        }}
      >
        <Stack.Navigator>
          <Stack.Screen name="Home" component={RouteNameScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ServerContainer>
  );

  expect(html).toContain('Home');
  expect(handle.getRedirect()).toEqual({ href: '/home' });
});

test('returns no redirect when the rendered screen matches the empty path', async () => {
  const handle = createServerHandle();

  const html = await render(
    <ServerContainer handle={handle} location={new URL('https://example.com/')}>
      <NavigationContainer
        linking={{
          config: {
            screens: {
              Home: '',
            },
          },
        }}
      >
        <Stack.Navigator>
          <Stack.Screen name="Home" component={RouteNameScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ServerContainer>
  );

  expect(html).toContain('Home');
  expect(handle.getRedirect()).toBeUndefined();
});

test('returns redirect when the rendered state is deeper than the URL', async () => {
  const handle = createServerHandle();

  const html = await render(
    <ServerContainer
      handle={handle}
      location={new URL('https://example.com/home')}
    >
      <NavigationContainer<RootStackParamList>
        linking={{
          config: {
            screens: {
              Home: {
                path: 'home',
                screens: {
                  Feed: 'feed',
                },
              },
            },
          },
        }}
      >
        <Stack.Navigator>
          <Stack.Screen name="Home">
            {() => (
              <Stack.Navigator>
                <Stack.Screen name="Feed" component={RouteNameScreen} />
              </Stack.Navigator>
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </ServerContainer>
  );

  expect(html).toContain('Feed');
  expect(handle.getRedirect()).toEqual({ href: '/home/feed' });
});

test('returns no redirect when the URL is deeper than the rendered screen', async () => {
  const handle = createServerHandle();

  const html = await render(
    <ServerContainer
      handle={handle}
      location={new URL('https://example.com/home/profile')}
    >
      <NavigationContainer<RootStackParamList>
        linking={{
          config: {
            screens: {
              Home: {
                path: 'home',
                screens: {
                  Profile: 'profile',
                },
              },
            },
          },
        }}
      >
        <Stack.Navigator>
          <Stack.Screen name="Home" component={RouteNameScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ServerContainer>
  );

  // The 'Home' screen doesn't render a navigator for the nested path
  // The URL is kept since a navigator for it may still be rendered later
  // This matches the client, which also preserves the URL in this case
  expect(html).toContain('Home');
  expect(handle.getRedirect()).toBeUndefined();
});

test('returns no redirect when the URL contains a query string for the rendered screen', async () => {
  const handle = createServerHandle();

  const html = await render(
    <ServerContainer
      handle={handle}
      location={new URL('https://example.com/profile?foo=bar')}
    >
      <NavigationContainer
        linking={{
          config: {
            screens: {
              Profile: 'profile',
            },
          },
        }}
      >
        <Stack.Navigator>
          <Stack.Screen name="Profile" component={RouteNameScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ServerContainer>
  );

  expect(html).toContain('Profile');
  expect(handle.getRedirect()).toBeUndefined();
});

test('returns no redirect when the URL matches an alias for the rendered screen', async () => {
  const handle = createServerHandle();

  const html = await render(
    <ServerContainer
      handle={handle}
      location={new URL('https://example.com/p')}
    >
      <NavigationContainer
        linking={{
          config: {
            screens: {
              Profile: {
                path: 'profile',
                alias: ['p'],
              },
            },
          },
        }}
      >
        <Stack.Navigator>
          <Stack.Screen name="Profile" component={RouteNameScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ServerContainer>
  );

  expect(html).toContain('Profile');
  expect(handle.getRedirect()).toBeUndefined();
});

test('returns redirect with initial params merged into the URL', async () => {
  const handle = createServerHandle();

  const html = await render(
    <ServerContainer
      handle={handle}
      location={new URL('https://example.com/profile')}
    >
      <NavigationContainer
        linking={{
          config: {
            screens: {
              Profile: 'profile',
            },
          },
        }}
      >
        <Stack.Navigator>
          <Stack.Screen
            name="Profile"
            component={RouteNameScreen}
            initialParams={{ tab: 'posts' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ServerContainer>
  );

  // The URL for the rendered state includes the initial params
  // This matches how the URL is updated on the client after hydration
  expect(html).toContain('Profile');
  expect(handle.getRedirect()).toEqual({ href: '/profile?tab=posts' });
});

test('returns no redirect when linking is not configured', async () => {
  const handle = createServerHandle();

  const html = await render(
    <ServerContainer
      handle={handle}
      location={new URL('https://example.com/anything')}
    >
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={RouteNameScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ServerContainer>
  );

  expect(html).toContain('Home');
  expect(handle.getRedirect()).toBeUndefined();
});

test('returns no redirect when linking is disabled', async () => {
  const handle = createServerHandle();

  const html = await render(
    <ServerContainer
      handle={handle}
      location={new URL('https://example.com/anything')}
    >
      <NavigationContainer
        linking={{
          enabled: false,
          config: {
            screens: {
              Home: 'home',
            },
          },
        }}
      >
        <Stack.Navigator>
          <Stack.Screen name="Home" component={RouteNameScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ServerContainer>
  );

  expect(html).toContain('Home');
  expect(handle.getRedirect()).toBeUndefined();
});

test('uses custom getPathFromState to get the URL to redirect to', async () => {
  const handle = createServerHandle();

  const html = await render(
    <ServerContainer
      handle={handle}
      location={new URL('https://example.com/nonexistent')}
    >
      <NavigationContainer
        linking={{
          config: {
            screens: {
              Home: 'home',
            },
          },
          getPathFromState: (state) => {
            const route = state.routes[state.index ?? state.routes.length - 1];

            return `/custom-${route?.name.toLowerCase()}`;
          },
        }}
      >
        <Stack.Navigator>
          <Stack.Screen name="Home" component={RouteNameScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ServerContainer>
  );

  expect(html).toContain('Home');
  expect(handle.getRedirect()).toEqual({ href: '/custom-home' });
});

test('returns no redirect while a suspended nested navigator has not rendered', async () => {
  const handle = createServerHandle();

  const { promise, resolve } = Promise.withResolvers<{
    default: React.ComponentType<any>;
  }>();

  const LazyScreen = React.lazy(() => promise);

  const stream = new PassThrough();

  const shellPromise = new Promise<string>((resolve, reject) => {
    stream.once('data', resolve);
    stream.on('error', reject);
  });

  const htmlPromise = render(
    <ServerContainer
      handle={handle}
      location={new URL('https://example.com/home/profile')}
    >
      <NavigationContainer<RootStackParamList>
        linking={{
          config: {
            screens: {
              Home: {
                path: 'home',
                screens: {
                  Profile: 'profile',
                },
              },
            },
          },
        }}
      >
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={LazyScreen}
            layout={({ children }) => (
              <React.Suspense fallback="Loading">{children}</React.Suspense>
            )}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ServerContainer>,
    { stream }
  );

  await shellPromise;

  // The nested navigator is still suspended, so a redirect can't be known yet
  expect(handle.getRedirect()).toBeUndefined();

  resolve({
    default: () => (
      <Stack.Navigator>
        <Stack.Screen name="Profile" component={RouteNameScreen} />
      </Stack.Navigator>
    ),
  });

  const html = await htmlPromise;

  expect(html).toContain('Profile');
  expect(handle.getRedirect()).toBeUndefined();
});

test('returns redirect after a suspended nested navigator has rendered', async () => {
  const handle = createServerHandle();

  const { promise, resolve } = Promise.withResolvers<{
    default: React.ComponentType<any>;
  }>();

  const LazyScreen = React.lazy(() => promise);

  const stream = new PassThrough();

  const shellPromise = new Promise<string>((resolve, reject) => {
    stream.once('data', resolve);
    stream.on('error', reject);
  });

  const htmlPromise = render(
    <ServerContainer
      handle={handle}
      location={new URL('https://example.com/home/profile')}
    >
      <NavigationContainer<RootStackParamList>
        linking={{
          config: {
            screens: {
              Home: {
                path: 'home',
                screens: {
                  Feed: 'feed',
                  Profile: 'profile',
                },
              },
            },
          },
        }}
      >
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={LazyScreen}
            layout={({ children }) => (
              <React.Suspense fallback="Loading">{children}</React.Suspense>
            )}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ServerContainer>,
    { stream }
  );

  await shellPromise;

  expect(handle.getRedirect()).toBeUndefined();

  // The nested navigator doesn't include the 'Profile' screen from the URL
  resolve({
    default: () => (
      <Stack.Navigator>
        <Stack.Screen name="Feed" component={RouteNameScreen} />
      </Stack.Navigator>
    ),
  });

  const html = await htmlPromise;

  expect(html).toContain('Feed');
  expect(handle.getRedirect()).toEqual({ href: '/home/feed' });
});

test('returns intermediate redirect for an unmatched URL while screens are suspended', async () => {
  const handle = createServerHandle();

  const { promise, resolve } = Promise.withResolvers<{
    default: React.ComponentType<any>;
  }>();

  const LazyScreen = React.lazy(() => promise);

  const stream = new PassThrough();

  const shellPromise = new Promise<string>((resolve, reject) => {
    stream.once('data', resolve);
    stream.on('error', reject);
  });

  const htmlPromise = render(
    <ServerContainer
      handle={handle}
      location={new URL('https://example.com/nonexistent')}
    >
      <NavigationContainer<RootStackParamList>
        linking={{
          config: {
            screens: {
              Home: {
                path: 'home',
                screens: {
                  Feed: 'feed',
                },
              },
            },
          },
        }}
      >
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={LazyScreen}
            layout={({ children }) => (
              <React.Suspense fallback="Loading">{children}</React.Suspense>
            )}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ServerContainer>,
    { stream }
  );

  await shellPromise;

  // The URL doesn't match any screen, so there is no prefix to wait for
  // The redirect is for the rendered state so far and deepens after loading
  expect(handle.getRedirect()).toEqual({ href: '/home' });

  resolve({
    default: () => (
      <Stack.Navigator>
        <Stack.Screen name="Feed" component={RouteNameScreen} />
      </Stack.Navigator>
    ),
  });

  const html = await htmlPromise;

  expect(html).toContain('Feed');
  expect(handle.getRedirect()).toEqual({ href: '/home/feed' });
});

test('ignores screens rendered in an independent tree', async () => {
  const handle = createServerHandle();

  const IndependentScreen = () => (
    <NavigationIndependentTree>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Inner" component={RouteNameScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </NavigationIndependentTree>
  );

  const html = await render(
    <ServerContainer
      handle={handle}
      location={new URL('https://example.com/home')}
    >
      <NavigationContainer
        linking={{
          config: {
            screens: {
              Home: 'home',
            },
          },
        }}
      >
        <Stack.Navigator>
          <Stack.Screen name="Home" component={IndependentScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ServerContainer>
  );

  expect(html).toContain('Inner');
  expect(handle.getRedirect()).toBeUndefined();
});

test('returns no redirect when nothing was rendered with the handle', () => {
  const handle = createServerHandle();

  expect(handle.getRedirect()).toBeUndefined();
});

test('returns no redirect when no navigator was rendered', async () => {
  const handle = createServerHandle();

  const html = await render(
    <ServerContainer
      handle={handle}
      location={new URL('https://example.com/anything')}
    >
      <NavigationContainer
        linking={{
          config: {
            screens: {
              Home: 'home',
            },
          },
        }}
      >
        <div>No navigator</div>
      </NavigationContainer>
    </ServerContainer>
  );

  expect(html).toContain('No navigator');
  expect(handle.getRedirect()).toBeUndefined();
});

test('returns no redirect when an unfocused screen renders after the focused screen', async () => {
  const handle = createServerHandle();

  const Tab = createNavigatorFactory((props: any) => {
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
  })();

  const html = await render(
    <ServerContainer
      handle={handle}
      location={new URL('https://example.com/feed')}
    >
      <NavigationContainer
        linking={{
          config: {
            screens: {
              Feed: 'feed',
              Profile: 'profile',
            },
          },
        }}
      >
        <Tab.Navigator>
          <Tab.Screen name="Feed" component={RouteNameScreen} />
          <Tab.Screen name="Profile" component={RouteNameScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </ServerContainer>
  );

  // Both tabs render, but only the focused 'Feed' determines the URL
  expect(html).toContain('Feed');
  expect(html).toContain('Profile');
  expect(handle.getRedirect()).toBeUndefined();
});

test('ignores linking configured in an independent tree', async () => {
  const handle = createServerHandle();

  const IndependentScreen = () => (
    <NavigationIndependentTree>
      <NavigationContainer
        linking={{
          config: {
            screens: {
              Inner: 'inner',
            },
          },
        }}
      >
        <Stack.Navigator>
          <Stack.Screen name="Inner" component={RouteNameScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </NavigationIndependentTree>
  );

  const html = await render(
    <ServerContainer
      handle={handle}
      location={new URL('https://example.com/home')}
    >
      <NavigationContainer
        linking={{
          config: {
            screens: {
              Home: 'home',
            },
          },
        }}
      >
        <Stack.Navigator>
          <Stack.Screen name="Home" component={IndependentScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ServerContainer>
  );

  expect(html).toContain('Inner');
  expect(handle.getRedirect()).toBeUndefined();
});

test('returns redirect based on serialization when a custom getStateFromPath throws', async () => {
  const handle = createServerHandle();

  const error = jest.spyOn(console, 'error').mockImplementation(() => {});

  let calls = 0;

  const html = await render(
    <ServerContainer
      handle={handle}
      location={new URL('https://example.com/p')}
    >
      <NavigationContainer
        linking={{
          config: {
            screens: {
              Profile: {
                path: 'profile',
                alias: ['p'],
              },
            },
          },
          getStateFromPath: (path, config) => {
            calls++;

            // Parse the initial state, then throw for calls in `getRedirect`
            if (calls > 1) {
              throw new Error('Failed to parse path');
            }

            return getStateFromPath(path, config);
          },
        }}
      >
        <Stack.Navigator>
          <Stack.Screen name="Profile" component={RouteNameScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ServerContainer>
  );

  expect(html).toContain('Profile');

  // The URL for the alias can't be preserved as parsing it throws
  // So the redirect is based on serializing the state instead
  expect(handle.getRedirect()).toEqual({ href: '/profile' });
  expect(error).toHaveBeenCalledTimes(2);

  error.mockRestore();
});

test('throws when the handle was not created with createServerHandle', async () => {
  const handle = { getRedirect: () => undefined } as ServerHandle;

  await expect(
    render(
      <ServerContainer
        handle={handle}
        location={new URL('https://example.com/')}
      >
        <NavigationContainer>
          <div>Home</div>
        </NavigationContainer>
      </ServerContainer>
    )
  ).rejects.toThrow(
    "The 'handle' prop must be an object created with 'createServerHandle()'."
  );
});

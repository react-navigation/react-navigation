import { beforeEach, expect, jest, test } from '@jest/globals';
import {
  CommonActions,
  createNavigationContainerRef,
  createNavigatorFactory,
  findFocusedRoute,
  getPathFromState,
  getStateFromPath,
  type NavigationAction,
  type NavigationState,
  type ParamListBase,
  StackRouter,
  TabRouter,
  useNavigationBuilder,
  usePreventRemove,
} from '@react-navigation/core';
import {
  act,
  render,
  type RenderAPI,
  waitFor,
} from '@testing-library/react-native';

import { NavigationContainer } from '../NavigationContainer';
import { useLinking } from '../useLinking';

// We want to use the web version of useLinking
// eslint-disable-next-line import-x/extensions
jest.mock('../useLinking', () => require('../useLinking.tsx'));

// Get a fresh window stub for each test to avoid cross-test state leaks
let window: typeof import('../__stubs__/window').window;

beforeEach(() => {
  jest.isolateModules(() => {
    window = require('../__stubs__/window').window;
  });

  Object.assign(global, window);
});

const createStackNavigator = createNavigatorFactory((props: any) => {
  const { state, descriptors, NavigationContent } = useNavigationBuilder(
    StackRouter,
    props
  );

  return (
    <NavigationContent>
      {state.routes.map((route, i) => (
        <div key={route.key} aria-current={state.index === i || undefined}>
          {descriptors[route.key].render()}
        </div>
      ))}
    </NavigationContent>
  );
});

const createTabNavigator = createNavigatorFactory((props: any) => {
  const { state, descriptors, NavigationContent } = useNavigationBuilder(
    TabRouter,
    props
  );

  return (
    <NavigationContent>
      {state.routes.map((route, i) => (
        <div key={route.key} aria-current={state.index === i || undefined}>
          {descriptors[route.key].render()}
        </div>
      ))}
    </NavigationContent>
  );
});

const TestScreen = ({ route }: any): any =>
  `${route.name} ${JSON.stringify(route.params)}`;

test('throws if multiple instances of useLinking are used', () => {
  jest.useFakeTimers();

  const ref = createNavigationContainerRef<ParamListBase>();
  const options = { prefixes: [] };

  function Sample() {
    useLinking(ref, options);
    useLinking(ref, options);
    return null;
  }

  const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

  let element: RenderAPI | undefined;

  element = render(<Sample />);

  jest.runAllTimers();

  expect(spy).toHaveBeenLastCalledWith(
    expect.stringMatching(
      'Looks like you have configured linking in multiple places.'
    )
  );

  element?.unmount();

  function A() {
    useLinking(ref, options);
    return null;
  }

  function B() {
    useLinking(ref, options);
    return null;
  }

  element = render(
    <>
      <A />
      <B />
    </>
  );

  expect(spy).toHaveBeenCalledTimes(2);
  expect(spy.mock.calls[1][0]).toMatch(
    'Looks like you have configured linking in multiple places.'
  );

  element?.unmount();

  function Sample2() {
    useLinking(ref, options);
    return null;
  }

  const wrapper2 = <Sample2 />;

  render(wrapper2).unmount();

  element = render(wrapper2);

  expect(spy).toHaveBeenCalledTimes(2);

  element?.unmount();

  jest.useRealTimers();
});

test('pushes a browser history entry for each forward navigation', async () => {
  const Stack = createStackNavigator();

  const linking = {
    prefixes: [],
    config: {
      screens: {
        Home: '',
        Profile: 'profile',
        Settings: 'settings',
      },
    },
  };

  const navigation = createNavigationContainerRef<ParamListBase>();

  render(
    <NavigationContainer ref={navigation} linking={linking}>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={TestScreen} />
        <Stack.Screen name="Profile" component={TestScreen} />
        <Stack.Screen name="Settings" component={TestScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  act(() => navigation.navigate('Profile'));

  await waitFor(() => expect(window.location.pathname).toBe('/profile'));

  act(() => navigation.navigate('Settings'));

  await waitFor(() => expect(window.location.pathname).toBe('/settings'));

  act(() => window.history.back());

  await waitFor(() => expect(window.location.pathname).toBe('/profile'));

  act(() => window.history.back());

  await waitFor(() => expect(window.location.pathname).toBe('/'));
});

test('dispatches GO_BACK when browser back pops the last stack route', async () => {
  const Stack = createStackNavigator();

  const linking = {
    prefixes: [],
    config: {
      screens: {
        Home: '',
        Profile: 'profile',
      },
    },
  };

  const navigation = createNavigationContainerRef<ParamListBase>();

  const actions: NavigationAction[] = [];

  navigation.addListener('__unsafe_action__', (e) => {
    actions.push(e.data.action);
  });

  const onStateChange = jest.fn();

  render(
    <NavigationContainer
      ref={navigation}
      linking={linking}
      onStateChange={onStateChange}
    >
      <Stack.Navigator>
        <Stack.Screen name="Home" component={TestScreen} />
        <Stack.Screen name="Profile" component={TestScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  expect(window.location.pathname).toBe('/');

  act(() => navigation.navigate('Profile', { user: 'john' }));

  await waitFor(() => expect(window.location.pathname).toBe('/profile'));

  actions.length = 0;
  onStateChange.mockClear();

  act(() => window.history.back());

  await waitFor(() => expect(window.location.pathname).toBe('/'));

  expect(actions).toEqual(
    expect.arrayContaining([expect.objectContaining({ type: 'GO_BACK' })])
  );

  const state = onStateChange.mock.calls.at(-1)?.[0] as NavigationState;

  expect(state.routes.length).toBe(1);
  expect(state.routes[0].name).toBe('Home');
});

test("rolls back browser history when 'beforeRemove' prevents browser back", async () => {
  const Stack = createStackNavigator();

  const linking = {
    prefixes: [],
    config: {
      screens: {
        Home: '',
        Profile: 'profile',
      },
    },
  };

  const navigation = createNavigationContainerRef<ParamListBase>();

  const onPreventRemove = jest.fn();

  const ProfileScreen = ({
    preventRemove,
    route,
  }: {
    preventRemove: boolean;
    route: any;
  }): any => {
    usePreventRemove(preventRemove, onPreventRemove);

    return `${route.name} ${JSON.stringify(route.params)}`;
  };

  const Container = ({ preventRemove }: { preventRemove: boolean }) => (
    <NavigationContainer ref={navigation} linking={linking}>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={TestScreen} />
        <Stack.Screen name="Profile">
          {(props: any) => (
            <ProfileScreen {...props} preventRemove={preventRemove} />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );

  const root = render(<Container preventRemove={true} />);

  act(() => navigation.navigate('Profile'));

  await waitFor(() => expect(window.location.pathname).toBe('/profile'));

  act(() => window.history.back());

  await waitFor(() => expect(onPreventRemove).toHaveBeenCalledTimes(1));

  await waitFor(() => expect(window.location.pathname).toBe('/profile'));

  expect(navigation.getRootState().routes).toEqual(
    expect.arrayContaining([expect.objectContaining({ name: 'Profile' })])
  );

  root.rerender(<Container preventRemove={false} />);

  act(() => window.history.back());

  await waitFor(() => expect(window.location.pathname).toBe('/'));

  expect(onPreventRemove).toHaveBeenCalledTimes(1);

  expect(navigation.getRootState().routes).toEqual([
    expect.objectContaining({ name: 'Home' }),
  ]);
});

test('dispatches GO_BACK on each sequential browser back', async () => {
  const Stack = createStackNavigator();

  const linking = {
    prefixes: [],
    config: {
      screens: {
        Home: '',
        A: 'a',
        B: 'b',
        C: 'c',
      },
    },
  };

  const navigation = createNavigationContainerRef<ParamListBase>();

  const actions: NavigationAction[] = [];

  navigation.addListener('__unsafe_action__', (e) => {
    actions.push(e.data.action);
  });

  render(
    <NavigationContainer ref={navigation} linking={linking}>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={TestScreen} />
        <Stack.Screen name="A" component={TestScreen} />
        <Stack.Screen name="B" component={TestScreen} />
        <Stack.Screen name="C" component={TestScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  act(() => navigation.navigate('A'));

  await waitFor(() => expect(window.location.pathname).toBe('/a'));

  act(() => navigation.navigate('B'));

  await waitFor(() => expect(window.location.pathname).toBe('/b'));

  act(() => navigation.navigate('C'));

  await waitFor(() => expect(window.location.pathname).toBe('/c'));

  actions.length = 0;

  act(() => window.history.back());

  await waitFor(() => expect(window.location.pathname).toBe('/b'));

  act(() => window.history.back());

  await waitFor(() => expect(window.location.pathname).toBe('/a'));

  act(() => window.history.back());

  await waitFor(() => expect(window.location.pathname).toBe('/'));

  expect(actions.filter((a) => a.type === 'GO_BACK')).toHaveLength(3);
});

test('dispatches RESET when browser back goes to non-adjacent stack state', async () => {
  const Stack = createStackNavigator();

  const linking = {
    prefixes: [],
    config: {
      screens: {
        Home: '',
        Profile: 'profile',
        Settings: 'settings',
      },
    },
  };

  const navigation = createNavigationContainerRef<ParamListBase>();

  const actions: NavigationAction[] = [];

  navigation.addListener('__unsafe_action__', (e) => {
    actions.push(e.data.action);
  });

  const onStateChange = jest.fn();

  render(
    <NavigationContainer
      ref={navigation}
      linking={linking}
      onStateChange={onStateChange}
    >
      <Stack.Navigator>
        <Stack.Screen name="Home" component={TestScreen} />
        <Stack.Screen name="Profile" component={TestScreen} />
        <Stack.Screen name="Settings" component={TestScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  expect(window.location.pathname).toBe('/');

  act(() => navigation.navigate('Profile', { user: 'john' }));

  await waitFor(() => expect(window.location.pathname).toBe('/profile'));

  act(() => navigation.navigate('Settings'));

  await waitFor(() => expect(window.location.pathname).toBe('/settings'));

  actions.length = 0;
  onStateChange.mockClear();

  act(() => window.history.go(-2));

  await waitFor(() => expect(window.location.pathname).toBe('/'));

  expect(actions).toEqual(
    expect.arrayContaining([expect.objectContaining({ type: 'RESET' })])
  );
  expect(actions).not.toEqual(
    expect.arrayContaining([expect.objectContaining({ type: 'GO_BACK' })])
  );

  const state = onStateChange.mock.calls.at(-1)?.[0] as NavigationState;

  expect(state.routes.length).toBe(1);
  expect(state.routes[0].name).toBe('Home');
});

test('handles browser forward after going back', async () => {
  const Stack = createStackNavigator();

  const linking = {
    prefixes: [],
    config: {
      screens: {
        Home: '',
        Profile: 'profile',
      },
    },
  };

  const navigation = createNavigationContainerRef<ParamListBase>();

  const onStateChange = jest.fn();

  render(
    <NavigationContainer
      ref={navigation}
      linking={linking}
      onStateChange={onStateChange}
    >
      <Stack.Navigator>
        <Stack.Screen name="Home" component={TestScreen} />
        <Stack.Screen name="Profile" component={TestScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  expect(window.location.pathname).toBe('/');

  act(() => navigation.navigate('Profile'));

  await waitFor(() => expect(window.location.pathname).toBe('/profile'));

  act(() => window.history.back());

  await waitFor(() => expect(window.location.pathname).toBe('/'));

  expect(navigation.getRootState().index).toBe(0);

  onStateChange.mockClear();

  act(() => window.history.forward());

  await waitFor(() => expect(window.location.pathname).toBe('/profile'));

  const state = onStateChange.mock.calls.at(-1)?.[0] as NavigationState;

  expect(state.index).toBe(1);
  expect(state.routes[1].name).toBe('Profile');
});

test('syncs path with browser history across back and forward', async () => {
  const Stack = createStackNavigator();

  const linking = {
    prefixes: [],
    config: {
      screens: {
        Home: '',
        Profile: ':user',
        Settings: 'settings',
      },
    },
  };

  const navigation = createNavigationContainerRef<ParamListBase>();

  render(
    <NavigationContainer ref={navigation} linking={linking}>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={TestScreen} />
        <Stack.Screen name="Profile" component={TestScreen} />
        <Stack.Screen name="Settings" component={TestScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  expect(window.location.pathname).toBe('/');

  act(() => navigation.navigate('Profile', { user: 'jane' }));

  await waitFor(() => expect(window.location.pathname).toBe('/jane'));

  act(() => navigation.navigate('Settings'));

  await waitFor(() => expect(window.location.pathname).toBe('/settings'));

  act(() => window.history.back());

  await waitFor(() => expect(window.location.pathname).toBe('/jane'));

  act(() => window.history.back());

  await waitFor(() => expect(window.location.pathname).toBe('/'));

  act(() => window.history.forward());

  await waitFor(() => expect(window.location.pathname).toBe('/jane'));

  act(() => window.history.forward());

  await waitFor(() => expect(window.location.pathname).toBe('/settings'));
});

test('syncs browser history when programmatic goBack is called', async () => {
  const Stack = createStackNavigator();

  const linking = {
    prefixes: [],
    config: {
      screens: {
        Home: '',
        Profile: 'profile',
        Settings: 'settings',
      },
    },
  };

  const navigation = createNavigationContainerRef<ParamListBase>();

  render(
    <NavigationContainer ref={navigation} linking={linking}>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={TestScreen} />
        <Stack.Screen name="Profile" component={TestScreen} />
        <Stack.Screen name="Settings" component={TestScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  act(() => navigation.navigate('Profile'));

  await waitFor(() => expect(window.location.pathname).toBe('/profile'));

  act(() => navigation.navigate('Settings'));

  await waitFor(() => expect(window.location.pathname).toBe('/settings'));

  act(() => navigation.goBack());

  await waitFor(() => expect(window.location.pathname).toBe('/profile'));

  act(() => window.history.forward());

  await waitFor(() => expect(window.location.pathname).toBe('/settings'));
});

test('replaces browser history when params change without route change', async () => {
  const Stack = createStackNavigator();

  const linking = {
    prefixes: [],
    config: {
      screens: {
        Home: '',
        Profile: ':user',
      },
    },
  };

  const navigation = createNavigationContainerRef<ParamListBase>();

  render(
    <NavigationContainer ref={navigation} linking={linking}>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={TestScreen} />
        <Stack.Screen name="Profile" component={TestScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  act(() => navigation.navigate('Profile', { user: 'jane' }));

  await waitFor(() => expect(window.location.pathname).toBe('/jane'));

  act(() => navigation.dispatch(CommonActions.setParams({ user: 'john' })));

  await waitFor(() => expect(window.location.pathname).toBe('/john'));

  act(() => window.history.back());

  await waitFor(() => expect(window.location.pathname).toBe('/'));
});

test('replaces browser history on resetRoot', async () => {
  const Stack = createStackNavigator();

  const linking = {
    prefixes: [],
    config: {
      screens: {
        Home: '',
        Profile: 'profile',
        Settings: 'settings',
      },
    },
  };

  const navigation = createNavigationContainerRef<ParamListBase>();

  const onStateChange = jest.fn();

  render(
    <NavigationContainer
      ref={navigation}
      linking={linking}
      onStateChange={onStateChange}
    >
      <Stack.Navigator>
        <Stack.Screen name="Home" component={TestScreen} />
        <Stack.Screen name="Profile" component={TestScreen} />
        <Stack.Screen name="Settings" component={TestScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  act(() => navigation.navigate('Profile'));

  await waitFor(() => expect(window.location.pathname).toBe('/profile'));

  act(() =>
    navigation.resetRoot({
      index: 0,
      routes: [{ name: 'Settings' }],
    })
  );

  await waitFor(() => expect(window.location.pathname).toBe('/settings'));

  const state = onStateChange.mock.calls.at(-1)?.[0] as NavigationState;

  expect(state.routes.length).toBe(1);
  expect(state.routes[0].name).toBe('Settings');

  act(() => window.history.back());

  await waitFor(() => expect(window.location.pathname).toBe('/'));
});

test('truncates forward history when navigating from a mid-history position', async () => {
  const Stack = createStackNavigator();

  const linking = {
    prefixes: [],
    config: {
      screens: {
        Home: '',
        Profile: 'profile',
        Settings: 'settings',
      },
    },
  };

  const navigation = createNavigationContainerRef<ParamListBase>();

  const onStateChange = jest.fn();

  render(
    <NavigationContainer
      ref={navigation}
      linking={linking}
      onStateChange={onStateChange}
    >
      <Stack.Navigator>
        <Stack.Screen name="Home" component={TestScreen} />
        <Stack.Screen name="Profile" component={TestScreen} />
        <Stack.Screen name="Settings" component={TestScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  act(() => navigation.navigate('Profile'));

  await waitFor(() => expect(window.location.pathname).toBe('/profile'));

  act(() => window.history.back());

  await waitFor(() => expect(window.location.pathname).toBe('/'));

  act(() => navigation.navigate('Settings'));

  await waitFor(() => expect(window.location.pathname).toBe('/settings'));

  onStateChange.mockClear();

  act(() => window.history.back());

  await waitFor(() => expect(window.location.pathname).toBe('/'));

  const state = onStateChange.mock.calls.at(-1)?.[0] as NavigationState;

  expect(state.routes.length).toBe(1);
  expect(state.routes[0].name).toBe('Home');
});

test('dispatches GO_BACK when browser back pops the last tab history entry', async () => {
  const Tab = createTabNavigator();

  const linking = {
    prefixes: [],
    config: {
      screens: {
        Home: '',
        Profile: 'profile',
      },
    },
  };

  const navigation = createNavigationContainerRef<ParamListBase>();

  const actions: NavigationAction[] = [];

  navigation.addListener('__unsafe_action__', (e) => {
    actions.push(e.data.action);
  });

  const onStateChange = jest.fn();

  render(
    <NavigationContainer
      ref={navigation}
      linking={linking}
      onStateChange={onStateChange}
    >
      <Tab.Navigator>
        <Tab.Screen name="Home" component={TestScreen} />
        <Tab.Screen name="Profile" component={TestScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );

  expect(window.location.pathname).toBe('/');

  act(() => navigation.navigate('Profile'));

  await waitFor(() => expect(window.location.pathname).toBe('/profile'));

  actions.length = 0;
  onStateChange.mockClear();

  act(() => window.history.back());

  await waitFor(() => expect(window.location.pathname).toBe('/'));

  expect(actions).toEqual(
    expect.arrayContaining([expect.objectContaining({ type: 'GO_BACK' })])
  );

  const state = onStateChange.mock.calls.at(-1)?.[0] as NavigationState;

  expect(state.routes[state.index].name).toBe('Home');
});

test('dispatches GO_BACK when browser back restores the previous fullHistory tab entry', async () => {
  const Tab = createTabNavigator();

  const linking = {
    prefixes: [],
    config: {
      screens: {
        Home: '',
        Profile: ':user',
        Settings: 'settings/:section',
      },
    },
  };

  const navigation = createNavigationContainerRef<ParamListBase>();

  const actions: NavigationAction[] = [];

  navigation.addListener('__unsafe_action__', (e) => {
    actions.push(e.data.action);
  });

  const onStateChange = jest.fn();

  render(
    <NavigationContainer
      ref={navigation}
      linking={linking}
      onStateChange={onStateChange}
    >
      <Tab.Navigator backBehavior="fullHistory">
        <Tab.Screen name="Home" component={TestScreen} />
        <Tab.Screen name="Profile" component={TestScreen} />
        <Tab.Screen name="Settings" component={TestScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );

  act(() => navigation.navigate('Profile', { user: 'first' }));

  await waitFor(() => expect(window.location.pathname).toBe('/first'));

  act(() => navigation.navigate('Settings', { section: 'security' }));

  await waitFor(() => {
    expect(window.location.pathname).toBe('/settings/security');
  });

  act(() => navigation.navigate('Profile', { user: 'updated' }));

  await waitFor(() => expect(window.location.pathname).toBe('/updated'));

  actions.length = 0;
  onStateChange.mockClear();

  act(() => window.history.back());

  await waitFor(() => {
    expect(window.location.pathname).toBe('/settings/security');
  });

  expect(actions).toEqual(
    expect.arrayContaining([expect.objectContaining({ type: 'GO_BACK' })])
  );
  expect(actions).not.toEqual(
    expect.arrayContaining([expect.objectContaining({ type: 'RESET' })])
  );

  const state = onStateChange.mock.calls.at(-1)?.[0] as NavigationState;

  expect(state).toMatchObject({
    index: 2,
    routes: [{}, {}, { name: 'Settings', params: { section: 'security' } }],
  });
});

test('dispatches RESET when browser history jumps multiple fullHistory tab entries', async () => {
  const Tab = createTabNavigator();

  const linking = {
    prefixes: [],
    config: {
      screens: {
        Home: '',
        Profile: ':user',
        Settings: 'settings/:section',
      },
    },
  };

  const navigation = createNavigationContainerRef<ParamListBase>();

  const actions: NavigationAction[] = [];

  navigation.addListener('__unsafe_action__', (e) => {
    actions.push(e.data.action);
  });

  const onStateChange = jest.fn();

  render(
    <NavigationContainer
      ref={navigation}
      linking={linking}
      onStateChange={onStateChange}
    >
      <Tab.Navigator backBehavior="fullHistory">
        <Tab.Screen name="Home" component={TestScreen} />
        <Tab.Screen name="Profile" component={TestScreen} />
        <Tab.Screen name="Settings" component={TestScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );

  act(() => navigation.navigate('Profile', { user: 'first' }));

  await waitFor(() => expect(window.location.pathname).toBe('/first'));

  act(() => navigation.navigate('Settings', { section: 'security' }));

  await waitFor(() => {
    expect(window.location.pathname).toBe('/settings/security');
  });

  act(() => navigation.navigate('Profile', { user: 'updated' }));

  await waitFor(() => expect(window.location.pathname).toBe('/updated'));

  actions.length = 0;
  onStateChange.mockClear();

  act(() => window.history.go(-2));

  await waitFor(() => expect(window.location.pathname).toBe('/first'));

  expect(actions).toEqual(
    expect.arrayContaining([expect.objectContaining({ type: 'RESET' })])
  );
  expect(actions).not.toEqual(
    expect.arrayContaining([expect.objectContaining({ type: 'GO_BACK' })])
  );

  const state = onStateChange.mock.calls.at(-1)?.[0] as NavigationState;

  expect(state).toMatchObject({
    index: 1,
    routes: [{}, { name: 'Profile', params: { user: 'first' } }, {}],
  });
});

test('dispatches GO_BACK for stack inside tab when popping last stack route', async () => {
  const Stack = createStackNavigator();
  const Tab = createTabNavigator();

  const linking = {
    prefixes: [],
    config: {
      screens: {
        Home: {
          path: '',
          initialRouteName: 'Feed',
          screens: {
            Feed: 'feed',
            Profile: 'profile',
          },
        },
        Chat: 'chat',
      },
    },
  };

  const navigation = createNavigationContainerRef<ParamListBase>();

  const actions: NavigationAction[] = [];

  navigation.addListener('__unsafe_action__', (e) => {
    actions.push(e.data.action);
  });

  render(
    <NavigationContainer ref={navigation} linking={linking}>
      <Tab.Navigator>
        <Tab.Screen name="Home">
          {() => (
            <Stack.Navigator initialRouteName="Feed">
              <Stack.Screen name="Feed" component={TestScreen} />
              <Stack.Screen name="Profile" component={TestScreen} />
            </Stack.Navigator>
          )}
        </Tab.Screen>
        <Tab.Screen name="Chat" component={TestScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );

  expect(window.location.pathname).toBe('/feed');

  act(() => navigation.navigate('Profile'));

  await waitFor(() => expect(window.location.pathname).toBe('/profile'));

  actions.length = 0;

  act(() => window.history.back());

  await waitFor(() => expect(window.location.pathname).toBe('/feed'));

  expect(actions).toEqual(
    expect.arrayContaining([expect.objectContaining({ type: 'GO_BACK' })])
  );
});

test('dispatches GO_BACK for inner stack pop when outer tab history is non-empty', async () => {
  const Stack = createStackNavigator();
  const Tab = createTabNavigator();

  const linking = {
    prefixes: [],
    config: {
      screens: {
        Home: {
          path: '',
          initialRouteName: 'Feed',
          screens: {
            Feed: 'feed',
            Profile: 'profile',
          },
        },
        Chat: 'chat',
      },
    },
  };

  const navigation = createNavigationContainerRef<ParamListBase>();

  const actions: NavigationAction[] = [];

  navigation.addListener('__unsafe_action__', (e) => {
    actions.push(e.data.action);
  });

  render(
    <NavigationContainer ref={navigation} linking={linking}>
      <Tab.Navigator>
        <Tab.Screen name="Home">
          {() => (
            <Stack.Navigator initialRouteName="Feed">
              <Stack.Screen name="Feed" component={TestScreen} />
              <Stack.Screen name="Profile" component={TestScreen} />
            </Stack.Navigator>
          )}
        </Tab.Screen>
        <Tab.Screen name="Chat" component={TestScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );

  expect(window.location.pathname).toBe('/feed');

  act(() => navigation.navigate('Chat'));

  await waitFor(() => expect(window.location.pathname).toBe('/chat'));

  act(() => navigation.navigate('Home'));

  await waitFor(() => expect(window.location.pathname).toBe('/feed'));

  act(() => navigation.navigate('Profile'));

  await waitFor(() => expect(window.location.pathname).toBe('/profile'));

  actions.length = 0;

  act(() => window.history.back());

  await waitFor(() => expect(window.location.pathname).toBe('/feed'));

  expect(actions).toEqual(
    expect.arrayContaining([expect.objectContaining({ type: 'GO_BACK' })])
  );
});

test('dispatches RESET when browser back restores older nested state under the same stack route', async () => {
  const Stack = createStackNavigator();
  const Tab = createTabNavigator();

  const linking = {
    prefixes: [],
    config: {
      screens: {
        Root: {
          path: '',
          screens: {
            Feed: '',
            Profile: 'profile',
          },
        },
        Details: 'details',
      },
    },
  };

  const navigation = createNavigationContainerRef<ParamListBase>();

  const actions: NavigationAction[] = [];

  navigation.addListener('__unsafe_action__', (e) => {
    actions.push(e.data.action);
  });

  const onStateChange = jest.fn();

  render(
    <NavigationContainer
      ref={navigation}
      linking={linking}
      onStateChange={onStateChange}
    >
      <Stack.Navigator>
        <Stack.Screen name="Root">
          {() => (
            <Tab.Navigator>
              <Tab.Screen name="Feed" component={TestScreen} />
              <Tab.Screen name="Profile" component={TestScreen} />
            </Tab.Navigator>
          )}
        </Stack.Screen>
        <Stack.Screen name="Details" component={TestScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  expect(window.location.pathname).toBe('/');

  act(() => navigation.navigate('Profile'));

  await waitFor(() => expect(window.location.pathname).toBe('/profile'));

  act(() => navigation.navigate('Details'));

  await waitFor(() => expect(window.location.pathname).toBe('/details'));

  actions.length = 0;
  onStateChange.mockClear();

  act(() => window.history.go(-2));

  await waitFor(() => expect(window.location.pathname).toBe('/'));

  expect(actions).toEqual(
    expect.arrayContaining([expect.objectContaining({ type: 'RESET' })])
  );
  expect(actions).not.toEqual(
    expect.arrayContaining([expect.objectContaining({ type: 'GO_BACK' })])
  );

  const state = onStateChange.mock.calls.at(-1)?.[0] as NavigationState;

  expect(state.routes[0].state).toMatchObject({
    index: 0,
  });
});

test('keeps syncing browser history after getPathFromState throws', async () => {
  const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

  const Stack = createStackNavigator();

  const linking = {
    prefixes: [],
    config: {
      screens: {
        Home: '',
        Profile: 'profile',
        Settings: 'settings',
      },
    },
    getPathFromState(
      state: Parameters<typeof getPathFromState>[0],
      config: Parameters<typeof getPathFromState>[1]
    ) {
      if (findFocusedRoute(state)?.name === 'Profile') {
        throw new Error('Cannot build path for Profile');
      }

      return getPathFromState(state, config);
    },
  };

  const navigation = createNavigationContainerRef<ParamListBase>();

  render(
    <NavigationContainer ref={navigation} linking={linking}>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={TestScreen} />
        <Stack.Screen name="Profile" component={TestScreen} />
        <Stack.Screen name="Settings" component={TestScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  expect(window.location.pathname).toBe('/');

  act(() => navigation.navigate('Profile'));

  await waitFor(() =>
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Cannot build path for Profile' })
    )
  );

  // The URL for the failed update is not synced, but the sync should recover
  expect(window.location.pathname).toBe('/');

  act(() => navigation.navigate('Settings'));

  await waitFor(() => expect(window.location.pathname).toBe('/settings'));
});

test("doesn't leave unhandled rejection when navigation interrupts prevented back rollback", async () => {
  const Stack = createStackNavigator();

  const linking = {
    prefixes: [],
    config: {
      screens: {
        Home: '',
        Profile: 'profile',
        Settings: 'settings',
      },
    },
  };

  const navigation = createNavigationContainerRef<ParamListBase>();

  const onPreventRemove = jest.fn();

  const ProfileScreen = ({ route }: any): any => {
    usePreventRemove(true, onPreventRemove);

    return route.name;
  };

  const rejections: unknown[] = [];
  const onUnhandledRejection = (reason: unknown) => {
    rejections.push(reason);
  };

  jest.useFakeTimers();

  process.on('unhandledRejection', onUnhandledRejection);

  try {
    render(
      <NavigationContainer ref={navigation} linking={linking}>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={TestScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Settings" component={TestScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );

    act(() => navigation.navigate('Profile'));

    await waitFor(() => expect(window.location.pathname).toBe('/profile'));

    // Navigate right after the prevented back to interrupt its rollback
    // If the rollback completes before the navigation, the interruption won't be exercised
    let interrupted = false;

    window.addEventListener('popstate', () => {
      if (!interrupted && onPreventRemove.mock.calls.length) {
        interrupted = true;
        navigation.navigate('Settings');
      }
    });

    act(() => window.history.back());

    await act(async () => {
      await jest.runAllTimersAsync();
    });

    expect(onPreventRemove).toHaveBeenCalledTimes(1);
    expect(window.location.pathname).toBe('/settings');
    expect(navigation.getCurrentRoute()?.name).toBe('Settings');

    // Flush the event loop with real timers so `unhandledRejection` fires
    jest.useRealTimers();

    await new Promise<void>((resolve) => {
      setTimeout(resolve, 0);
    });

    expect(rejections).toEqual([]);
  } finally {
    jest.useRealTimers();
    process.off('unhandledRejection', onUnhandledRejection);
  }
});

test('pushes browser history entry when navigating after popstate with an unhandled path', async () => {
  const Stack = createStackNavigator();

  const linking = {
    prefixes: [],
    config: {
      screens: {
        Home: '',
        Other: 'missing',
      },
    },
    getStateFromPath(
      path: string,
      config: Parameters<typeof getStateFromPath>[1]
    ) {
      if (path.includes('missing')) {
        return {
          routes: [{ name: 'Missing' }],
        };
      }

      return getStateFromPath(path, config);
    },
  };

  const navigation = createNavigationContainerRef<ParamListBase>();

  render(
    <NavigationContainer ref={navigation} linking={linking}>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={TestScreen} />
        <Stack.Screen name="Other" component={TestScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  expect(window.location.pathname).toBe('/');

  window.history.pushState(null, '', '/missing');

  act(() => window.history.back());

  await waitFor(() => expect(window.location.pathname).toBe('/'));

  act(() => window.history.forward());

  await waitFor(() => expect(window.location.pathname).toBe('/missing'));

  expect(navigation.getCurrentRoute()?.name).toBe('Home');

  const pushSpy = jest.spyOn(window.history, 'pushState');
  const replaceSpy = jest.spyOn(window.history, 'replaceState');

  act(() => navigation.navigate('Other'));

  await waitFor(() => expect(navigation.getCurrentRoute()?.name).toBe('Other'));

  expect(window.location.pathname).toBe('/missing');
  expect(pushSpy).toHaveBeenCalledTimes(1);
  expect(replaceSpy).not.toHaveBeenCalled();
});

test('pushes a history entry for navigation racing with browser back', async () => {
  const Stack = createStackNavigator();

  const linking = {
    prefixes: [],
    config: {
      screens: {
        Home: '',
        Profile: 'profile',
        Settings: 'settings',
      },
    },
  };

  const navigation = createNavigationContainerRef<ParamListBase>();

  render(
    <NavigationContainer ref={navigation} linking={linking}>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={TestScreen} />
        <Stack.Screen name="Profile" component={TestScreen} />
        <Stack.Screen name="Settings" component={TestScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  act(() => navigation.navigate('Profile'));

  await waitFor(() => expect(window.location.pathname).toBe('/profile'));

  let raced = false;

  window.addEventListener('popstate', () => {
    if (!raced) {
      raced = true;
      navigation.navigate('Settings');
    }
  });

  const pushSpy = jest.spyOn(window.history, 'pushState');

  act(() => window.history.back());

  await waitFor(() => expect(window.location.pathname).toBe('/settings'));

  expect(navigation.getCurrentRoute()?.name).toBe('Settings');

  expect(pushSpy).toHaveBeenCalledWith(
    expect.anything(),
    expect.anything(),
    '/settings'
  );

  act(() => window.history.back());

  await waitFor(() => expect(window.location.pathname).toBe('/'));

  expect(navigation.getCurrentRoute()?.name).toBe('Home');
});

test('goes back an extra entry for goBack racing with browser back', async () => {
  const Stack = createStackNavigator();

  const linking = {
    prefixes: [],
    config: {
      screens: {
        Home: '',
        Profile: 'profile',
        Settings: 'settings',
      },
    },
  };

  const navigation = createNavigationContainerRef<ParamListBase>();

  render(
    <NavigationContainer ref={navigation} linking={linking}>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={TestScreen} />
        <Stack.Screen name="Profile" component={TestScreen} />
        <Stack.Screen name="Settings" component={TestScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  act(() => navigation.navigate('Profile'));

  await waitFor(() => expect(window.location.pathname).toBe('/profile'));

  act(() => navigation.navigate('Settings'));

  await waitFor(() => expect(window.location.pathname).toBe('/settings'));

  let raced = false;

  window.addEventListener('popstate', () => {
    if (!raced) {
      raced = true;
      navigation.goBack();
    }
  });

  act(() => window.history.back());

  await waitFor(() => expect(window.location.pathname).toBe('/'));

  expect(navigation.getCurrentRoute()?.name).toBe('Home');

  act(() => window.history.forward());

  await waitFor(() => expect(window.location.pathname).toBe('/profile'));

  expect(navigation.getCurrentRoute()?.name).toBe('Profile');
});

test("rolls back browser history when 'beforeRemove' prevents multi-entry jump", async () => {
  const Stack = createStackNavigator();

  const linking = {
    prefixes: [],
    config: {
      screens: {
        Home: '',
        Profile: 'profile',
        Settings: 'settings',
      },
    },
  };

  const navigation = createNavigationContainerRef<ParamListBase>();

  const onPreventRemove = jest.fn();

  type SettingsScreenProps = {
    preventRemove: boolean;
    route: { name: string };
  };

  const SettingsScreen = ({
    preventRemove,
    route,
  }: SettingsScreenProps): string => {
    usePreventRemove(preventRemove, onPreventRemove);

    return route.name;
  };

  const Container = ({ preventRemove }: { preventRemove: boolean }) => (
    <NavigationContainer ref={navigation} linking={linking}>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={TestScreen} />
        <Stack.Screen name="Profile" component={TestScreen} />
        <Stack.Screen name="Settings">
          {(props: Omit<SettingsScreenProps, 'preventRemove'>) => (
            <SettingsScreen {...props} preventRemove={preventRemove} />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );

  const root = render(<Container preventRemove={true} />);

  act(() => navigation.navigate('Profile'));

  await waitFor(() => expect(window.location.pathname).toBe('/profile'));

  act(() => navigation.navigate('Settings'));

  await waitFor(() => expect(window.location.pathname).toBe('/settings'));

  act(() => window.history.go(-2));

  await waitFor(() => expect(onPreventRemove).toHaveBeenCalledTimes(1));

  await waitFor(() => expect(window.location.pathname).toBe('/settings'));

  expect(navigation.getCurrentRoute()?.name).toBe('Settings');

  root.rerender(<Container preventRemove={false} />);

  act(() => window.history.go(-2));

  await waitFor(() => expect(window.location.pathname).toBe('/'));

  expect(onPreventRemove).toHaveBeenCalledTimes(1);
  expect(navigation.getCurrentRoute()?.name).toBe('Home');
});

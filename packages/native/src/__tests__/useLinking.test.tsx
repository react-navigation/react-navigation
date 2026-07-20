import { afterEach, beforeEach, expect, jest, test } from '@jest/globals';
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
  StackActions,
  StackRouter,
  TabRouter,
  useNavigationBuilder,
  usePreventRemove,
} from '@react-navigation/core';
import {
  act,
  render,
  type RenderResult,
  waitFor,
} from '@testing-library/react-native';
import * as React from 'react';
import { Text } from 'react-native';

import { NavigationContainer } from '../NavigationContainer';
import { useLinking } from '../useLinking';

// We want to use the web version of useLinking
// eslint-disable-next-line import-x/extensions
jest.mock('../useLinking', () => require('../useLinking.tsx'));

// Get a fresh window stub for each test to avoid cross-test state leaks
let window: typeof import('../__stubs__/window').window;

beforeEach(() => {
  jest.useFakeTimers();

  jest.isolateModules(() => {
    window = require('../__stubs__/window').window;
  });

  Object.defineProperties(global, Object.getOwnPropertyDescriptors(window));
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
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
          {descriptors[route.key]?.render()}
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
          {descriptors[route.key]?.render()}
        </div>
      ))}
    </NavigationContent>
  );
});

const TestScreen = ({ route }: any): any => (
  <Text>
    {route.name} {JSON.stringify(route.params)}
  </Text>
);

test('shows error if multiple instances of useLinking are used', async () => {
  const ref = createNavigationContainerRef<ParamListBase>();
  const options = { enabled: true };

  function Sample() {
    useLinking(ref, options);
    useLinking(ref, options);
    return null;
  }

  const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

  let element: RenderResult | undefined;

  element = await render(<Sample />);

  await act(() => jest.runAllTimers());

  expect(spy).toHaveBeenLastCalledWith(
    expect.stringMatching(
      'Looks like you have configured linking in multiple places.'
    )
  );

  await element?.unmount();

  function A() {
    useLinking(ref, options);
    return null;
  }

  function B() {
    useLinking(ref, options);
    return null;
  }

  element = await render(
    <>
      <A />
      <B />
    </>
  );

  expect(spy).toHaveBeenCalledTimes(2);
  expect(spy.mock.calls[1]?.[0]).toMatch(
    'Looks like you have configured linking in multiple places.'
  );

  await element?.unmount();

  function Sample2() {
    useLinking(ref, options);
    return null;
  }

  const wrapper2 = <Sample2 />;

  const rendered = await render(wrapper2);

  await rendered.unmount();

  element = await render(wrapper2);

  expect(spy).toHaveBeenCalledTimes(2);

  await element?.unmount();
});

test('pushes a browser history entry for each forward navigation', async () => {
  const Stack = createStackNavigator();

  const linking = {
    config: {
      screens: {
        Home: '',
        Profile: 'profile',
        Settings: 'settings',
      },
    },
  };

  const navigation = createNavigationContainerRef<ParamListBase>();

  await render(
    <NavigationContainer ref={navigation} linking={linking}>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={TestScreen} />
        <Stack.Screen name="Profile" component={TestScreen} />
        <Stack.Screen name="Settings" component={TestScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  await act(() => navigation.navigate('Profile'));

  await waitFor(() => expect(window.location.pathname).toBe('/profile'));

  await act(() => navigation.navigate('Settings'));

  await waitFor(() => expect(window.location.pathname).toBe('/settings'));

  await act(() => window.history.back());

  await waitFor(() => expect(window.location.pathname).toBe('/profile'));

  await act(() => window.history.back());

  await waitFor(() => expect(window.location.pathname).toBe('/'));
});

test('dispatches GO_BACK when browser back pops the last stack route', async () => {
  const Stack = createStackNavigator();

  const linking = {
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

  await render(
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

  await act(() => navigation.navigate('Profile', { user: 'john' }));

  await waitFor(() => expect(window.location.pathname).toBe('/profile'));

  actions.length = 0;
  onStateChange.mockClear();

  await act(() => window.history.back());

  await waitFor(() => expect(window.location.pathname).toBe('/'));

  expect(actions).toEqual(
    expect.arrayContaining([expect.objectContaining({ type: 'GO_BACK' })])
  );

  const state = onStateChange.mock.calls.at(-1)?.[0] as NavigationState;

  expect(state.routes.length).toBe(1);
  expect(state.routes[0]?.name).toBe('Home');
});

test("rolls back browser history when 'beforeRemove' prevents browser back", async () => {
  const Stack = createStackNavigator();

  const linking = {
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

    return (
      <Text>
        {route.name} {JSON.stringify(route.params)}
      </Text>
    );
  };

  const Container = ({ preventRemove }: { preventRemove: boolean }) => (
    <NavigationContainer ref={navigation} linking={linking}>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={TestScreen} />
        <Stack.Screen name="Profile">
          {(props) => (
            <ProfileScreen {...props} preventRemove={preventRemove} />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );

  const root = await render(<Container preventRemove={true} />);

  await act(() => navigation.navigate('Profile'));

  await waitFor(() => expect(window.location.pathname).toBe('/profile'));

  await act(() => window.history.back());

  await waitFor(() => expect(onPreventRemove).toHaveBeenCalledTimes(1));

  await waitFor(() => expect(window.location.pathname).toBe('/profile'));

  expect(navigation.getRootState().routes).toEqual(
    expect.arrayContaining([expect.objectContaining({ name: 'Profile' })])
  );

  await root.rerender(<Container preventRemove={false} />);

  await act(() => window.history.back());

  await waitFor(() => expect(window.location.pathname).toBe('/'));

  expect(onPreventRemove).toHaveBeenCalledTimes(1);

  expect(navigation.getRootState().routes).toEqual([
    expect.objectContaining({ name: 'Home' }),
  ]);
});

test('dispatches GO_BACK on each sequential browser back', async () => {
  const Stack = createStackNavigator();

  const linking = {
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

  await render(
    <NavigationContainer ref={navigation} linking={linking}>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={TestScreen} />
        <Stack.Screen name="A" component={TestScreen} />
        <Stack.Screen name="B" component={TestScreen} />
        <Stack.Screen name="C" component={TestScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  await act(() => navigation.navigate('A'));

  await waitFor(() => expect(window.location.pathname).toBe('/a'));

  await act(() => navigation.navigate('B'));

  await waitFor(() => expect(window.location.pathname).toBe('/b'));

  await act(() => navigation.navigate('C'));

  await waitFor(() => expect(window.location.pathname).toBe('/c'));

  actions.length = 0;

  await act(() => window.history.back());

  await waitFor(() => expect(window.location.pathname).toBe('/b'));

  await act(() => window.history.back());

  await waitFor(() => expect(window.location.pathname).toBe('/a'));

  await act(() => window.history.back());

  await waitFor(() => expect(window.location.pathname).toBe('/'));

  expect(actions.filter((a) => a.type === 'GO_BACK')).toHaveLength(3);
});

test('dispatches RESET when browser back goes to non-adjacent stack state', async () => {
  const Stack = createStackNavigator();

  const linking = {
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

  await render(
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

  await act(() => navigation.navigate('Profile', { user: 'john' }));

  await waitFor(() => expect(window.location.pathname).toBe('/profile'));

  await act(() => navigation.navigate('Settings'));

  await waitFor(() => expect(window.location.pathname).toBe('/settings'));

  actions.length = 0;
  onStateChange.mockClear();

  await act(() => window.history.go(-2));

  await waitFor(() => expect(window.location.pathname).toBe('/'));

  expect(actions).toEqual(
    expect.arrayContaining([expect.objectContaining({ type: 'RESET' })])
  );
  expect(actions).not.toEqual(
    expect.arrayContaining([expect.objectContaining({ type: 'GO_BACK' })])
  );

  const state = onStateChange.mock.calls.at(-1)?.[0] as NavigationState;

  expect(state.routes.length).toBe(1);
  expect(state.routes[0]?.name).toBe('Home');
});

test('handles browser forward after going back', async () => {
  const Stack = createStackNavigator();

  const linking = {
    config: {
      screens: {
        Home: '',
        Profile: 'profile',
      },
    },
  };

  const navigation = createNavigationContainerRef<ParamListBase>();

  const onStateChange = jest.fn();

  await render(
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

  await act(() => navigation.navigate('Profile'));

  await waitFor(() => expect(window.location.pathname).toBe('/profile'));

  await act(() => window.history.back());

  await waitFor(() => expect(window.location.pathname).toBe('/'));

  expect(navigation.getRootState().index).toBe(0);

  onStateChange.mockClear();

  await act(() => window.history.forward());

  await waitFor(() => expect(window.location.pathname).toBe('/profile'));

  const state = onStateChange.mock.calls.at(-1)?.[0] as NavigationState;

  expect(state.index).toBe(1);
  expect(state.routes[1]?.name).toBe('Profile');
});

test('syncs path with browser history across back and forward', async () => {
  const Stack = createStackNavigator();

  const linking = {
    config: {
      screens: {
        Home: '',
        Profile: ':user',
        Settings: 'settings',
      },
    },
  };

  const navigation = createNavigationContainerRef<ParamListBase>();

  await render(
    <NavigationContainer ref={navigation} linking={linking}>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={TestScreen} />
        <Stack.Screen name="Profile" component={TestScreen} />
        <Stack.Screen name="Settings" component={TestScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  expect(window.location.pathname).toBe('/');

  await act(() => navigation.navigate('Profile', { user: 'jane' }));

  await waitFor(() => expect(window.location.pathname).toBe('/jane'));

  await act(() => navigation.navigate('Settings'));

  await waitFor(() => expect(window.location.pathname).toBe('/settings'));

  await act(() => window.history.back());

  await waitFor(() => expect(window.location.pathname).toBe('/jane'));

  await act(() => window.history.back());

  await waitFor(() => expect(window.location.pathname).toBe('/'));

  await act(() => window.history.forward());

  await waitFor(() => expect(window.location.pathname).toBe('/jane'));

  await act(() => window.history.forward());

  await waitFor(() => expect(window.location.pathname).toBe('/settings'));
});

test('syncs browser history when programmatic goBack is called', async () => {
  const Stack = createStackNavigator();

  const linking = {
    config: {
      screens: {
        Home: '',
        Profile: 'profile',
        Settings: 'settings',
      },
    },
  };

  const navigation = createNavigationContainerRef<ParamListBase>();

  await render(
    <NavigationContainer ref={navigation} linking={linking}>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={TestScreen} />
        <Stack.Screen name="Profile" component={TestScreen} />
        <Stack.Screen name="Settings" component={TestScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  await act(() => navigation.navigate('Profile'));

  await waitFor(() => expect(window.location.pathname).toBe('/profile'));

  await act(() => navigation.navigate('Settings'));

  await waitFor(() => expect(window.location.pathname).toBe('/settings'));

  await act(() => navigation.goBack());

  await waitFor(() => expect(window.location.pathname).toBe('/profile'));

  await act(() => window.history.forward());

  await waitFor(() => expect(window.location.pathname).toBe('/settings'));
});

test('replaces browser history when params change without route change', async () => {
  const Stack = createStackNavigator();

  const linking = {
    config: {
      screens: {
        Home: '',
        Profile: ':user',
      },
    },
  };

  const navigation = createNavigationContainerRef<ParamListBase>();

  await render(
    <NavigationContainer ref={navigation} linking={linking}>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={TestScreen} />
        <Stack.Screen name="Profile" component={TestScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  await act(() => navigation.navigate('Profile', { user: 'jane' }));

  await waitFor(() => expect(window.location.pathname).toBe('/jane'));

  await act(() =>
    navigation.dispatch(CommonActions.setParams({ user: 'john' }))
  );

  await waitFor(() => expect(window.location.pathname).toBe('/john'));

  await act(() => window.history.back());

  await waitFor(() => expect(window.location.pathname).toBe('/'));
});

test('preserves browser hash when params change without route change', async () => {
  const createStackNavigator = createNavigatorFactory((props: any) => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      StackRouter,
      props
    );

    return (
      <NavigationContent>
        {state.routes.map((route, i) => (
          <div key={route.key} aria-current={state.index === i || undefined}>
            {descriptors[route.key]?.render()}
          </div>
        ))}
      </NavigationContent>
    );
  });

  const Stack = createStackNavigator();

  const TestScreen = ({ route }: any): any => (
    <Text>
      {route.name} {JSON.stringify(route.params)}
    </Text>
  );

  const linking = {
    config: {
      screens: {
        Home: '',
        Profile: ':user',
      },
    },
  };

  const navigation = createNavigationContainerRef<ParamListBase>();

  await render(
    <NavigationContainer ref={navigation} linking={linking}>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={TestScreen} />
        <Stack.Screen name="Profile" component={TestScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  await act(() => navigation.navigate('Profile', { user: 'jane' }));

  await waitFor(() => expect(window.location.pathname).toBe('/jane'));

  window.history.replaceState(window.history.state, '', '/jane#details');

  await act(() =>
    navigation.dispatch(CommonActions.setParams({ user: 'john' }))
  );

  await waitFor(() => {
    expect(window.location.pathname).toBe('/john');
    expect(window.location.hash).toBe('#details');
  });
});

test("doesn't reset state when URL parses to routes not in root navigator", async () => {
  const createStackNavigator = createNavigatorFactory((props: any) => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      StackRouter,
      props
    );

    return (
      <NavigationContent>
        {state.routes.map((route, i) => (
          <div key={route.key} aria-current={state.index === i || undefined}>
            {descriptors[route.key]?.render()}
          </div>
        ))}
      </NavigationContent>
    );
  });

  const Stack = createStackNavigator();

  const TestScreen = ({ route }: any): any => (
    <Text>
      {route.name} {JSON.stringify(route.params)}
    </Text>
  );

  const linking = {
    getStateFromPath() {
      return {
        routes: [{ name: 'Missing' }],
      };
    },
  };

  const navigation = createNavigationContainerRef<ParamListBase>();

  const onStateChange = jest.fn();

  await render(
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

  expect(navigation.getCurrentRoute()?.name).toBe('Home');
  expect(window.location.pathname).toBe('/Home');

  window.history.pushState(null, '', '/missing');

  await act(() => window.history.back());

  await waitFor(() => expect(window.location.pathname).toBe('/Home'));

  onStateChange.mockClear();

  await act(() => window.history.forward());

  await waitFor(() => expect(window.location.pathname).toBe('/missing'));

  expect(navigation.getCurrentRoute()?.name).toBe('Home');
  expect(onStateChange).not.toHaveBeenCalled();
});

test('replaces browser history on resetRoot', async () => {
  const Stack = createStackNavigator();

  const linking = {
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

  await render(
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

  await act(() => navigation.navigate('Profile'));

  await waitFor(() => expect(window.location.pathname).toBe('/profile'));

  await act(() =>
    navigation.resetRoot({
      index: 0,
      routes: [{ name: 'Settings' }],
    })
  );

  await waitFor(() => expect(window.location.pathname).toBe('/settings'));

  const state = onStateChange.mock.calls.at(-1)?.[0] as NavigationState;

  expect(state.routes.length).toBe(1);
  expect(state.routes[0]?.name).toBe('Settings');

  await act(() => window.history.back());

  await waitFor(() => expect(window.location.pathname).toBe('/'));
});

test('truncates forward history when navigating from a mid-history position', async () => {
  const Stack = createStackNavigator();

  const linking = {
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

  await render(
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

  await act(() => navigation.navigate('Profile'));

  await waitFor(() => expect(window.location.pathname).toBe('/profile'));

  await act(() => window.history.back());

  await waitFor(() => expect(window.location.pathname).toBe('/'));

  await act(() => navigation.navigate('Settings'));

  await waitFor(() => expect(window.location.pathname).toBe('/settings'));

  onStateChange.mockClear();

  await act(() => window.history.back());

  await waitFor(() => expect(window.location.pathname).toBe('/'));

  const state = onStateChange.mock.calls.at(-1)?.[0] as NavigationState;

  expect(state.routes.length).toBe(1);
  expect(state.routes[0]?.name).toBe('Home');
});

test('dispatches GO_BACK when browser back pops the last tab history entry', async () => {
  const Tab = createTabNavigator();

  const linking = {
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

  await render(
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

  await act(() => navigation.navigate('Profile'));

  await waitFor(() => expect(window.location.pathname).toBe('/profile'));

  actions.length = 0;
  onStateChange.mockClear();

  await act(() => window.history.back());

  await waitFor(() => expect(window.location.pathname).toBe('/'));

  expect(actions).toEqual(
    expect.arrayContaining([expect.objectContaining({ type: 'GO_BACK' })])
  );

  const state = onStateChange.mock.calls.at(-1)?.[0] as NavigationState;

  expect(state.routes[state.index]?.name).toBe('Home');
});

test('dispatches GO_BACK when browser back pops route history on a tab screen', async () => {
  const Tab = createTabNavigator();

  const linking = {
    config: {
      screens: {
        Home: '',
        Profile: ':user',
      },
    },
  };

  const navigation = createNavigationContainerRef<ParamListBase>();

  const actions: NavigationAction[] = [];

  navigation.addListener('__unsafe_action__', (e) => {
    actions.push(e.data.action);
  });

  const onStateChange = jest.fn();

  await render(
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

  await act(() => navigation.navigate('Profile', { user: 'jane' }));

  await waitFor(() => expect(window.location.pathname).toBe('/jane'));

  await act(() =>
    navigation.dispatch(CommonActions.pushParams({ user: 'john' }))
  );

  await waitFor(() => expect(window.location.pathname).toBe('/john'));

  actions.length = 0;
  onStateChange.mockClear();

  await act(() => window.history.back());

  await waitFor(() => expect(window.location.pathname).toBe('/jane'));

  expect(actions).toEqual(
    expect.arrayContaining([expect.objectContaining({ type: 'GO_BACK' })])
  );
  expect(actions).not.toEqual(
    expect.arrayContaining([expect.objectContaining({ type: 'RESET' })])
  );

  const state = onStateChange.mock.calls.at(-1)?.[0] as NavigationState;

  expect(state).toMatchObject({
    index: 1,
    routes: [{}, { name: 'Profile', params: { user: 'jane' } }],
  });
});

test('dispatches RESET when browser history jumps multiple route history entries on a tab screen', async () => {
  const Tab = createTabNavigator();

  const linking = {
    config: {
      screens: {
        Home: '',
        Profile: ':user',
      },
    },
  };

  const navigation = createNavigationContainerRef<ParamListBase>();

  const actions: NavigationAction[] = [];

  navigation.addListener('__unsafe_action__', (e) => {
    actions.push(e.data.action);
  });

  const onStateChange = jest.fn();

  await render(
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

  await act(() => navigation.navigate('Profile', { user: 'jane' }));

  await waitFor(() => expect(window.location.pathname).toBe('/jane'));

  await act(() =>
    navigation.dispatch(CommonActions.pushParams({ user: 'john' }))
  );

  await waitFor(() => expect(window.location.pathname).toBe('/john'));

  await act(() =>
    navigation.dispatch(CommonActions.pushParams({ user: 'kate' }))
  );

  await waitFor(() => expect(window.location.pathname).toBe('/kate'));

  actions.length = 0;
  onStateChange.mockClear();

  await act(() => window.history.go(-2));

  await waitFor(() => expect(window.location.pathname).toBe('/jane'));

  expect(actions).toEqual(
    expect.arrayContaining([expect.objectContaining({ type: 'RESET' })])
  );
  expect(actions).not.toEqual(
    expect.arrayContaining([expect.objectContaining({ type: 'GO_BACK' })])
  );

  const state = onStateChange.mock.calls.at(-1)?.[0] as NavigationState;

  expect(state).toMatchObject({
    index: 1,
    routes: [{}, { name: 'Profile', params: { user: 'jane' } }],
  });
});

test('dispatches RESET when browser back changes route while current tab route history is non-empty', async () => {
  const Tab = createTabNavigator();

  const linking = {
    config: {
      screens: {
        Home: '',
        Profile: ':user',
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

  await render(
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

  await act(() => navigation.navigate('Profile', { user: 'jane' }));

  await waitFor(() => expect(window.location.pathname).toBe('/jane'));

  await act(() =>
    navigation.dispatch(CommonActions.pushParams({ user: 'john' }))
  );

  await waitFor(() => expect(window.location.pathname).toBe('/john'));

  await act(() => navigation.navigate('Settings'));

  await waitFor(() => expect(window.location.pathname).toBe('/settings'));

  await act(() => navigation.navigate('Profile', { user: 'john' }));

  await waitFor(() => expect(window.location.pathname).toBe('/john'));

  actions.length = 0;
  onStateChange.mockClear();

  await act(() => window.history.back());

  await waitFor(() => expect(window.location.pathname).toBe('/settings'));

  expect(actions).toEqual(
    expect.arrayContaining([expect.objectContaining({ type: 'RESET' })])
  );
  expect(actions).not.toEqual(
    expect.arrayContaining([expect.objectContaining({ type: 'GO_BACK' })])
  );

  const state = onStateChange.mock.calls.at(-1)?.[0] as NavigationState;

  expect(state).toMatchObject({
    index: 2,
    routes: [{}, {}, { name: 'Settings' }],
  });
});

test('dispatches GO_BACK when browser back restores the previous fullHistory tab entry', async () => {
  const Tab = createTabNavigator();

  const linking = {
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

  await render(
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

  await act(() => navigation.navigate('Profile', { user: 'first' }));

  await waitFor(() => expect(window.location.pathname).toBe('/first'));

  await act(() => navigation.navigate('Settings', { section: 'security' }));

  await waitFor(() => {
    expect(window.location.pathname).toBe('/settings/security');
  });

  await act(() => navigation.navigate('Profile', { user: 'updated' }));

  await waitFor(() => expect(window.location.pathname).toBe('/updated'));

  actions.length = 0;
  onStateChange.mockClear();

  await act(() => window.history.back());

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

  await render(
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

  await act(() => navigation.navigate('Profile', { user: 'first' }));

  await waitFor(() => expect(window.location.pathname).toBe('/first'));

  await act(() => navigation.navigate('Settings', { section: 'security' }));

  await waitFor(() => {
    expect(window.location.pathname).toBe('/settings/security');
  });

  await act(() => navigation.navigate('Profile', { user: 'updated' }));

  await waitFor(() => expect(window.location.pathname).toBe('/updated'));

  actions.length = 0;
  onStateChange.mockClear();

  await act(() => window.history.go(-2));

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

  await render(
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

  await act(() => navigation.navigate('Profile'));

  await waitFor(() => expect(window.location.pathname).toBe('/profile'));

  actions.length = 0;

  await act(() => window.history.back());

  await waitFor(() => expect(window.location.pathname).toBe('/feed'));

  expect(actions).toEqual(
    expect.arrayContaining([expect.objectContaining({ type: 'GO_BACK' })])
  );
});

test('dispatches GO_BACK for inner stack pop when outer tab history is non-empty', async () => {
  const Stack = createStackNavigator();
  const Tab = createTabNavigator();

  const linking = {
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

  await render(
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

  await act(() => navigation.navigate('Chat'));

  await waitFor(() => expect(window.location.pathname).toBe('/chat'));

  await act(() => navigation.navigate('Home'));

  await waitFor(() => expect(window.location.pathname).toBe('/feed'));

  await act(() => navigation.navigate('Profile'));

  await waitFor(() => expect(window.location.pathname).toBe('/profile'));

  actions.length = 0;

  await act(() => window.history.back());

  await waitFor(() => expect(window.location.pathname).toBe('/feed'));

  expect(actions).toEqual(
    expect.arrayContaining([expect.objectContaining({ type: 'GO_BACK' })])
  );
});

test('dispatches RESET when browser back restores older nested state under the same stack route', async () => {
  const Stack = createStackNavigator();
  const Tab = createTabNavigator();

  const linking = {
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

  await render(
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

  await act(() => navigation.navigate('Profile'));

  await waitFor(() => expect(window.location.pathname).toBe('/profile'));

  await act(() => navigation.navigate('Details'));

  await waitFor(() => expect(window.location.pathname).toBe('/details'));

  actions.length = 0;
  onStateChange.mockClear();

  await act(() => window.history.go(-2));

  await waitFor(() => expect(window.location.pathname).toBe('/'));

  expect(actions).toEqual(
    expect.arrayContaining([expect.objectContaining({ type: 'RESET' })])
  );
  expect(actions).not.toEqual(
    expect.arrayContaining([expect.objectContaining({ type: 'GO_BACK' })])
  );

  const state = onStateChange.mock.calls.at(-1)?.[0] as NavigationState;

  expect(state.routes[0]?.state).toMatchObject({
    index: 0,
  });
});

test('keeps syncing browser history after getPathFromState throws', async () => {
  const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

  const Stack = createStackNavigator();

  const linking = {
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

  await render(
    <NavigationContainer ref={navigation} linking={linking}>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={TestScreen} />
        <Stack.Screen name="Profile" component={TestScreen} />
        <Stack.Screen name="Settings" component={TestScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  expect(window.location.pathname).toBe('/');

  await act(() => navigation.navigate('Profile'));

  await waitFor(() =>
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Cannot build path for Profile' })
    )
  );

  // The URL for the failed update is not synced, but the sync should recover
  expect(window.location.pathname).toBe('/');

  await act(() => navigation.navigate('Settings'));

  await waitFor(() => expect(window.location.pathname).toBe('/settings'));
});

test("doesn't leave unhandled rejection when navigation interrupts prevented back rollback", async () => {
  const Stack = createStackNavigator();

  const linking = {
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

    return <Text>{route.name}</Text>;
  };

  const rejections: unknown[] = [];
  const onUnhandledRejection = (reason: unknown) => {
    rejections.push(reason);
  };

  process.on('unhandledRejection', onUnhandledRejection);

  try {
    await render(
      <NavigationContainer ref={navigation} linking={linking}>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={TestScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Settings" component={TestScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );

    await act(() => navigation.navigate('Profile'));

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

    await act(() => window.history.back());

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

    jest.useFakeTimers();

    expect(rejections).toEqual([]);
  } finally {
    process.off('unhandledRejection', onUnhandledRejection);
  }
});

test('pushes browser history entry when navigating after popstate with an unhandled path', async () => {
  const Stack = createStackNavigator();

  const linking = {
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

  await render(
    <NavigationContainer ref={navigation} linking={linking}>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={TestScreen} />
        <Stack.Screen name="Other" component={TestScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  expect(window.location.pathname).toBe('/');

  window.history.pushState(null, '', '/missing');

  await act(() => window.history.back());

  await waitFor(() => expect(window.location.pathname).toBe('/'));

  await act(() => window.history.forward());

  await waitFor(() => expect(window.location.pathname).toBe('/missing'));

  expect(navigation.getCurrentRoute()?.name).toBe('Home');

  const pushSpy = jest.spyOn(window.history, 'pushState');
  const replaceSpy = jest.spyOn(window.history, 'replaceState');

  await act(() => navigation.navigate('Other'));

  await waitFor(() => expect(navigation.getCurrentRoute()?.name).toBe('Other'));

  expect(window.location.pathname).toBe('/missing');
  expect(pushSpy).toHaveBeenCalledTimes(1);
  expect(replaceSpy).not.toHaveBeenCalled();
});

test('goes back a single entry on browser back when the URL contains a hash', async () => {
  const Stack = createStackNavigator();

  const linking = {
    config: {
      screens: {
        Home: '',
        Profile: ':user',
      },
    },
  };

  const navigation = createNavigationContainerRef<ParamListBase>();

  await render(
    <NavigationContainer ref={navigation} linking={linking}>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={TestScreen} />
        <Stack.Screen name="Profile" component={TestScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  await act(() => navigation.navigate('Profile', { user: 'jane' }));

  await waitFor(() => expect(window.location.pathname).toBe('/jane'));

  window.history.replaceState(window.history.state, '', '/jane#details');

  await act(() =>
    navigation.dispatch(CommonActions.pushParams({ user: 'john' }))
  );

  await waitFor(() => {
    expect(window.location.pathname).toBe('/john');
    expect(window.location.hash).toBe('#details');
  });

  await act(() => window.history.back());

  await waitFor(() => {
    expect(window.location.pathname).toBe('/jane');
    expect(window.location.hash).toBe('#details');
  });

  expect(navigation.getCurrentRoute()?.params).toEqual({ user: 'jane' });

  await act(() => window.history.back());

  await waitFor(() => expect(window.location.pathname).toBe('/'));

  expect(navigation.getCurrentRoute()?.name).toBe('Home');
});

test('pushes a history entry for navigation racing with browser back', async () => {
  const Stack = createStackNavigator();

  const linking = {
    config: {
      screens: {
        Home: '',
        Profile: 'profile',
        Settings: 'settings',
      },
    },
  };

  const navigation = createNavigationContainerRef<ParamListBase>();

  await render(
    <NavigationContainer ref={navigation} linking={linking}>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={TestScreen} />
        <Stack.Screen name="Profile" component={TestScreen} />
        <Stack.Screen name="Settings" component={TestScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  await act(() => navigation.navigate('Profile'));

  await waitFor(() => expect(window.location.pathname).toBe('/profile'));

  let raced = false;

  window.addEventListener('popstate', () => {
    if (!raced) {
      raced = true;
      navigation.navigate('Settings');
    }
  });

  const pushSpy = jest.spyOn(window.history, 'pushState');

  await act(() => window.history.back());

  await waitFor(() => expect(window.location.pathname).toBe('/settings'));

  expect(navigation.getCurrentRoute()?.name).toBe('Settings');

  expect(pushSpy).toHaveBeenCalledWith(
    expect.anything(),
    expect.anything(),
    '/settings'
  );

  await act(() => window.history.back());

  await waitFor(() => expect(window.location.pathname).toBe('/'));

  expect(navigation.getCurrentRoute()?.name).toBe('Home');
});

test('goes back an extra entry for goBack racing with browser back', async () => {
  const Stack = createStackNavigator();

  const linking = {
    config: {
      screens: {
        Home: '',
        Profile: 'profile',
        Settings: 'settings',
      },
    },
  };

  const navigation = createNavigationContainerRef<ParamListBase>();

  await render(
    <NavigationContainer ref={navigation} linking={linking}>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={TestScreen} />
        <Stack.Screen name="Profile" component={TestScreen} />
        <Stack.Screen name="Settings" component={TestScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  await act(() => navigation.navigate('Profile'));

  await waitFor(() => expect(window.location.pathname).toBe('/profile'));

  await act(() => navigation.navigate('Settings'));

  await waitFor(() => expect(window.location.pathname).toBe('/settings'));

  let raced = false;

  window.addEventListener('popstate', () => {
    if (!raced) {
      raced = true;
      navigation.goBack();
    }
  });

  await act(() => window.history.back());

  await waitFor(() => expect(window.location.pathname).toBe('/'));

  expect(navigation.getCurrentRoute()?.name).toBe('Home');

  await act(() => window.history.forward());

  await waitFor(() => expect(window.location.pathname).toBe('/profile'));

  expect(navigation.getCurrentRoute()?.name).toBe('Profile');
});

test("rolls back browser history when 'beforeRemove' prevents multi-entry jump", async () => {
  const Stack = createStackNavigator();

  const linking = {
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

  const SettingsScreen = ({
    preventRemove,
    route,
  }: {
    preventRemove: boolean;
    route: any;
  }): any => {
    usePreventRemove(preventRemove, onPreventRemove);

    return <Text>{route.name}</Text>;
  };

  const Container = ({ preventRemove }: { preventRemove: boolean }) => (
    <NavigationContainer ref={navigation} linking={linking}>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={TestScreen} />
        <Stack.Screen name="Profile" component={TestScreen} />
        <Stack.Screen name="Settings">
          {(props) => (
            <SettingsScreen {...props} preventRemove={preventRemove} />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );

  const root = await render(<Container preventRemove={true} />);

  await act(() => navigation.navigate('Profile'));

  await waitFor(() => expect(window.location.pathname).toBe('/profile'));

  await act(() => navigation.navigate('Settings'));

  await waitFor(() => expect(window.location.pathname).toBe('/settings'));

  await act(() => window.history.go(-2));

  await waitFor(() => expect(onPreventRemove).toHaveBeenCalledTimes(1));

  await waitFor(() => expect(window.location.pathname).toBe('/settings'));

  expect(navigation.getCurrentRoute()?.name).toBe('Settings');

  await root.rerender(<Container preventRemove={false} />);

  await act(() => window.history.go(-2));

  await waitFor(() => expect(window.location.pathname).toBe('/'));

  expect(onPreventRemove).toHaveBeenCalledTimes(1);
  expect(navigation.getCurrentRoute()?.name).toBe('Home');
});

test("doesn't update URL until navigation to a suspending screen commits", async () => {
  const Stack = createStackNavigator();

  const linking = {
    config: {
      screens: {
        Home: '',
        Profile: 'profile',
      },
    },
  };

  const { promise, resolve } = Promise.withResolvers<void>();

  const ProfileScreen = (): any => {
    React.use(promise);

    return <Text>Profile</Text>;
  };

  const navigation = createNavigationContainerRef<ParamListBase>();

  await render(
    <NavigationContainer ref={navigation} linking={linking}>
      <React.Suspense fallback={<Text>Loading</Text>}>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={TestScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
        </Stack.Navigator>
      </React.Suspense>
    </NavigationContainer>
  );

  expect(window.location.pathname).toBe('/');

  await act(() => navigation.navigate('Profile'));

  expect(window.location.pathname).toBe('/');

  await act(() => resolve());

  await waitFor(() => expect(window.location.pathname).toBe('/profile'));
});

test("doesn't add history entry for navigation interrupted before commit", async () => {
  const Stack = createStackNavigator();

  const linking = {
    config: {
      screens: {
        Home: '',
        Profile: 'profile',
        Settings: 'settings',
      },
    },
  };

  const { promise } = Promise.withResolvers<void>();

  const ProfileScreen = (): any => {
    React.use(promise);

    return <Text>Profile</Text>;
  };

  const navigation = createNavigationContainerRef<
    ParamListBase,
    NavigationAction
  >();

  await render(
    <NavigationContainer ref={navigation} linking={linking}>
      <React.Suspense fallback={<Text>Loading</Text>}>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={TestScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Settings" component={TestScreen} />
        </Stack.Navigator>
      </React.Suspense>
    </NavigationContainer>
  );

  await act(() => navigation.navigate('Profile'));

  expect(window.location.pathname).toBe('/');

  await act(() => navigation.dispatch(StackActions.replace('Settings')));

  await waitFor(() => expect(window.location.pathname).toBe('/settings'));

  await act(() => window.history.back());

  await waitFor(() => expect(window.location.pathname).toBe('/'));

  expect(navigation.getCurrentRoute()?.name).toBe('Home');
});

test('preserves history entries when traversal is slower than the fallback timeout', async () => {
  const Stack = createStackNavigator();

  const linking = {
    config: {
      screens: {
        Home: '',
        Profile: 'profile',
      },
    },
  };

  const navigation = createNavigationContainerRef<ParamListBase>();

  await render(
    <NavigationContainer ref={navigation} linking={linking}>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={TestScreen} />
        <Stack.Screen name="Profile" component={TestScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  await act(() => navigation.navigate('Profile'));

  await waitFor(() => expect(window.location.pathname).toBe('/profile'));

  const originalGo = window.history.go.bind(window.history);

  const spy = jest.spyOn(window.history, 'go').mockImplementation((n) => {
    setTimeout(() => originalGo(n), 150);
  });

  await act(() => navigation.goBack());

  await act(() => jest.advanceTimersByTime(100));
  await act(() => jest.advanceTimersByTime(50));

  await waitFor(() => expect(window.location.pathname).toBe('/'));

  spy.mockRestore();

  await act(() => window.history.forward());

  await waitFor(() => expect(window.location.pathname).toBe('/profile'));

  expect(navigation.getCurrentRoute()?.name).toBe('Profile');
});

test('navigates to the last screen without waiting for an interrupted one', async () => {
  const createStackNavigator = createNavigatorFactory((props: any) => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      StackRouter,
      props
    );

    const route = state.routes[state.index];

    if (route == null) {
      return null;
    }

    return (
      <NavigationContent>{descriptors[route.key]?.render()}</NavigationContent>
    );
  });

  const Stack = createStackNavigator();

  const linking = {
    config: {
      screens: {
        Home: '',
        A: 'a',
        B: 'b',
      },
    },
  };

  const a = Promise.withResolvers<void>();
  const b = Promise.withResolvers<void>();

  const ScreenA = () => {
    React.use(a.promise);

    return <Text>Screen A</Text>;
  };

  const ScreenB = () => {
    React.use(b.promise);

    return <Text>Screen B</Text>;
  };

  const navigation = createNavigationContainerRef<ParamListBase>();

  await render(
    <NavigationContainer ref={navigation} linking={linking}>
      <React.Suspense fallback={<Text>Loading</Text>}>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={TestScreen} />
          <Stack.Screen name="A" component={ScreenA} />
          <Stack.Screen name="B" component={ScreenB} />
        </Stack.Navigator>
      </React.Suspense>
    </NavigationContainer>
  );

  await act(() => navigation.navigate('A'));
  await act(() => navigation.navigate('B'));

  expect(window.location.pathname).toBe('/');

  await act(() => b.resolve());

  await waitFor(() => expect(window.location.pathname).toBe('/b'));

  expect(navigation.getCurrentRoute()?.name).toBe('B');

  await act(() => a.resolve());

  await waitFor(() => expect(window.location.pathname).toBe('/b'));

  expect(navigation.getCurrentRoute()?.name).toBe('B');
});

test("doesn't navigate to an interrupted screen that finishes loading first", async () => {
  const createStackNavigator = createNavigatorFactory((props: any) => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      StackRouter,
      props
    );

    const route = state.routes[state.index];

    if (route == null) {
      return null;
    }

    return (
      <NavigationContent>{descriptors[route.key]?.render()}</NavigationContent>
    );
  });

  const Stack = createStackNavigator();

  const linking = {
    config: {
      screens: {
        Home: '',
        A: 'a',
        B: 'b',
      },
    },
  };

  const a = Promise.withResolvers<void>();
  const b = Promise.withResolvers<void>();

  const ScreenA = () => {
    React.use(a.promise);

    return <Text>Screen A</Text>;
  };

  const ScreenB = () => {
    React.use(b.promise);

    return <Text>Screen B</Text>;
  };

  const navigation = createNavigationContainerRef<ParamListBase>();

  await render(
    <NavigationContainer ref={navigation} linking={linking}>
      <React.Suspense fallback={<Text>Loading</Text>}>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={TestScreen} />
          <Stack.Screen name="A" component={ScreenA} />
          <Stack.Screen name="B" component={ScreenB} />
        </Stack.Navigator>
      </React.Suspense>
    </NavigationContainer>
  );

  await act(() => navigation.navigate('A'));
  await act(() => navigation.navigate('B'));

  expect(window.location.pathname).toBe('/');

  await act(() => a.resolve());

  expect(window.location.pathname).toBe('/');

  await act(() => b.resolve());

  await waitFor(() => expect(window.location.pathname).toBe('/b'));

  expect(navigation.getCurrentRoute()?.name).toBe('B');
});

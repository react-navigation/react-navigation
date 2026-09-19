import {
  afterEach,
  beforeEach,
  describe,
  expect,
  jest,
  test,
} from '@jest/globals';
import {
  CommonActions,
  createNavigationContainerRef,
  createNavigatorFactory,
  DrawerActions,
  DrawerRouter,
  findFocusedRoute,
  getPathFromState,
  getStateFromPath,
  type NavigationAction,
  type NavigationState,
  type NavigatorScreenParams,
  type ParamListBase,
  StackActions,
  StackRouter,
  TabRouter,
  useNavigationBuilder,
  usePreventRemove,
} from '@react-navigation/core';
import { act, render, waitFor } from '@testing-library/react';
import * as React from 'react';
import { Text } from 'react-native';

import { NavigationContainer } from '../NavigationContainer';
import { useLinking } from '../useLinking';

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
  jest.restoreAllMocks();
});

const createStackNavigator = createNavigatorFactory((props: any) => {
  const { state, descriptors, render } = useNavigationBuilder(
    StackRouter,
    props
  );

  return render(
    state.routes.map((route, i) => (
      <div key={route.key} aria-current={state.index === i || undefined}>
        {descriptors[route.key]?.render()}
      </div>
    ))
  );
});

const createTabNavigator = createNavigatorFactory((props: any) => {
  const { state, descriptors, render } = useNavigationBuilder(TabRouter, props);

  return render(
    state.routes.map((route, i) => (
      <div key={route.key} aria-current={state.index === i || undefined}>
        {descriptors[route.key]?.render()}
      </div>
    ))
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

  let element = render(<Sample />);

  act(() => jest.runAllTimers());

  expect(spy).toHaveBeenLastCalledWith(
    expect.stringMatching(
      'Looks like you have configured linking in multiple places.'
    )
  );

  element.unmount();

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
  expect(spy.mock.calls[1]?.[0]).toMatch(
    'Looks like you have configured linking in multiple places.'
  );

  element.unmount();

  function Sample2() {
    useLinking(ref, options);
    return null;
  }

  const wrapper2 = <Sample2 />;

  const rendered = render(wrapper2);

  rendered.unmount();

  element = render(wrapper2);

  expect(spy).toHaveBeenCalledTimes(2);

  element.unmount();
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

  const root = render(<Container preventRemove={true} />);

  act(() => navigation.navigate('Profile'));

  await waitFor(() => expect(window.location.pathname).toBe('/profile'));

  act(() => window.history.back());

  await waitFor(() => expect(onPreventRemove).toHaveBeenCalledTimes(1));

  await waitFor(() => expect(window.location.pathname).toBe('/profile'));

  expect(navigation.getRootState()?.routes).toEqual(
    expect.arrayContaining([expect.objectContaining({ name: 'Profile' })])
  );

  root.rerender(<Container preventRemove={false} />);

  act(() => window.history.back());

  await waitFor(() => expect(window.location.pathname).toBe('/'));

  expect(onPreventRemove).toHaveBeenCalledTimes(1);

  expect(navigation.getRootState()?.routes).toEqual([
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

  expect(navigation.getRootState()?.index).toBe(0);

  onStateChange.mockClear();

  act(() => window.history.forward());

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

test('preserves browser hash when params change without route change', async () => {
  const createStackNavigator = createNavigatorFactory((props: any) => {
    const { state, descriptors, render } = useNavigationBuilder(
      StackRouter,
      props
    );

    return render(
      state.routes.map((route, i) => (
        <div key={route.key} aria-current={state.index === i || undefined}>
          {descriptors[route.key]?.render()}
        </div>
      ))
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

  window.history.replaceState(window.history.state, '', '/jane#details');

  act(() => navigation.dispatch(CommonActions.setParams({ user: 'john' })));

  await waitFor(() => {
    expect(window.location.pathname).toBe('/john');
    expect(window.location.hash).toBe('#details');
  });
});

test("doesn't reset state when URL parses to routes not in root navigator", async () => {
  const createStackNavigator = createNavigatorFactory((props: any) => {
    const { state, descriptors, render } = useNavigationBuilder(
      StackRouter,
      props
    );

    return render(
      state.routes.map((route, i) => (
        <div key={route.key} aria-current={state.index === i || undefined}>
          {descriptors[route.key]?.render()}
        </div>
      ))
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

  expect(navigation.getCurrentRoute()?.name).toBe('Home');
  expect(window.location.pathname).toBe('/Home');

  window.history.pushState(null, '', '/missing');

  act(() => window.history.back());

  await waitFor(() => expect(window.location.pathname).toBe('/Home'));

  onStateChange.mockClear();

  act(() => window.history.forward());

  await waitFor(() => expect(window.location.pathname).toBe('/missing'));

  expect(navigation.getCurrentRoute()?.name).toBe('Home');
  expect(onStateChange).not.toHaveBeenCalled();
});

test('handles URL action in the root navigator', async () => {
  type NestedParamList = {
    Home: undefined;
    Target: undefined;
  };

  type RootParamList = {
    Nested: NavigatorScreenParams<NestedParamList>;
    Target: undefined;
  };

  const RootStack = createStackNavigator<RootParamList>();
  const NestedStack = createStackNavigator<NestedParamList>();

  const linking = {
    config: {
      screens: {
        Nested: {
          screens: {
            Home: '',
            Target: 'nested-target',
          },
        },
        Target: 'target',
      },
    },
  };

  const navigation = createNavigationContainerRef<RootParamList>();

  render(
    <NavigationContainer ref={navigation} linking={linking}>
      <RootStack.Navigator>
        <RootStack.Screen name="Nested">
          {() => (
            <NestedStack.Navigator>
              <NestedStack.Screen name="Home" component={TestScreen} />
              <NestedStack.Screen name="Target" component={TestScreen} />
            </NestedStack.Navigator>
          )}
        </RootStack.Screen>
        <RootStack.Screen name="Target" component={TestScreen} />
      </RootStack.Navigator>
    </NavigationContainer>
  );

  expect(window.location.pathname).toBe('/');

  window.history.pushState(null, '', '/target');

  act(() => window.history.back());

  await waitFor(() => expect(window.location.pathname).toBe('/'));

  act(() => window.history.forward());

  await waitFor(() => expect(window.location.pathname).toBe('/target'));

  expect(navigation.getRootState()?.routes).toEqual([
    expect.objectContaining({ name: 'Target' }),
  ]);
});

test('handles reset action in the root navigator', async () => {
  type NestedParamList = {
    Home: undefined;
    Target: undefined;
  };

  type RootParamList = {
    Nested: NavigatorScreenParams<NestedParamList>;
    Target: undefined;
  };

  const RootStack = createStackNavigator<RootParamList>();
  const NestedStack = createStackNavigator<NestedParamList>();

  const linking = {
    config: {
      screens: {
        Nested: {
          screens: {
            Home: '',
            Target: 'nested-target',
          },
        },
        Target: 'target',
      },
    },
    getActionFromState: () => undefined,
  };

  const navigation = createNavigationContainerRef<RootParamList>();

  render(
    <NavigationContainer ref={navigation} linking={linking}>
      <RootStack.Navigator>
        <RootStack.Screen name="Nested">
          {() => (
            <NestedStack.Navigator>
              <NestedStack.Screen name="Home" component={TestScreen} />
              <NestedStack.Screen name="Target" component={TestScreen} />
            </NestedStack.Navigator>
          )}
        </RootStack.Screen>
        <RootStack.Screen name="Target" component={TestScreen} />
      </RootStack.Navigator>
    </NavigationContainer>
  );

  expect(window.location.pathname).toBe('/');

  window.history.pushState(null, '', '/target');

  act(() => window.history.back());

  await waitFor(() => expect(window.location.pathname).toBe('/'));

  act(() => window.history.forward());

  await waitFor(() => expect(window.location.pathname).toBe('/target'));

  expect(navigation.getRootState()?.routes).toEqual([
    expect.objectContaining({ name: 'Target' }),
  ]);
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
  expect(state.routes[0]?.name).toBe('Settings');

  act(() => window.history.back());

  await waitFor(() => expect(window.location.pathname).toBe('/'));

  expect(navigation.getCurrentRoute()?.name).toBe('Home');
});

test('restores the recorded stack on browser back after resetRoot', async () => {
  const Stack = createStackNavigator();

  const navigation = createNavigationContainerRef<ParamListBase>();

  render(
    <NavigationContainer
      ref={navigation}
      linking={{
        config: {
          screens: {
            Home: '',
            Profile: 'profile',
            Settings: 'settings',
            Other: 'other',
          },
        },
      }}
    >
      <Stack.Navigator>
        <Stack.Screen name="Home" component={TestScreen} />
        <Stack.Screen name="Profile" component={TestScreen} />
        <Stack.Screen name="Settings" component={TestScreen} />
        <Stack.Screen name="Other" component={TestScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  act(() => navigation.navigate('Profile'));

  await waitFor(() => expect(window.location.pathname).toBe('/profile'));

  act(() => navigation.navigate('Settings'));

  await waitFor(() => expect(window.location.pathname).toBe('/settings'));

  act(() => navigation.resetRoot({ index: 0, routes: [{ name: 'Other' }] }));

  await waitFor(() => expect(window.location.pathname).toBe('/other'));

  act(() => window.history.back());

  await waitFor(() => expect(window.location.pathname).toBe('/profile'));

  expect(navigation.getRootState()?.routes.map((route) => route.name)).toEqual([
    'Home',
    'Profile',
  ]);

  expect(navigation.getCurrentRoute()?.name).toBe('Profile');
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

  act(() => navigation.navigate('Profile', { user: 'jane' }));

  await waitFor(() => expect(window.location.pathname).toBe('/jane'));

  act(() => navigation.dispatch(CommonActions.pushParams({ user: 'john' })));

  await waitFor(() => expect(window.location.pathname).toBe('/john'));

  actions.length = 0;
  onStateChange.mockClear();

  act(() => window.history.back());

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

  act(() => navigation.navigate('Profile', { user: 'jane' }));

  await waitFor(() => expect(window.location.pathname).toBe('/jane'));

  act(() => navigation.dispatch(CommonActions.pushParams({ user: 'john' })));

  await waitFor(() => expect(window.location.pathname).toBe('/john'));

  act(() => navigation.dispatch(CommonActions.pushParams({ user: 'kate' })));

  await waitFor(() => expect(window.location.pathname).toBe('/kate'));

  actions.length = 0;
  onStateChange.mockClear();

  act(() => window.history.go(-2));

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

  act(() => navigation.navigate('Profile', { user: 'jane' }));

  await waitFor(() => expect(window.location.pathname).toBe('/jane'));

  act(() => navigation.dispatch(CommonActions.pushParams({ user: 'john' })));

  await waitFor(() => expect(window.location.pathname).toBe('/john'));

  act(() => navigation.navigate('Settings'));

  await waitFor(() => expect(window.location.pathname).toBe('/settings'));

  act(() => navigation.navigate('Profile', { user: 'john' }));

  await waitFor(() => expect(window.location.pathname).toBe('/john'));

  actions.length = 0;
  onStateChange.mockClear();

  act(() => window.history.back());

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

  window.history.replaceState(window.history.state, '', '/jane#details');

  act(() => navigation.dispatch(CommonActions.pushParams({ user: 'john' })));

  await waitFor(() => {
    expect(window.location.pathname).toBe('/john');
    expect(window.location.hash).toBe('#details');
  });

  act(() => window.history.back());

  await waitFor(() => {
    expect(window.location.pathname).toBe('/jane');
    expect(window.location.hash).toBe('#details');
  });

  expect(navigation.getCurrentRoute()?.params).toEqual({ user: 'jane' });

  act(() => window.history.back());

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

  render(
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

  await act(async () => navigation.navigate('Profile'));

  expect(window.location.pathname).toBe('/');

  await act(async () => {
    resolve();

    await promise;
  });

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

  const navigation = createNavigationContainerRef<ParamListBase>();

  render(
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

  await act(async () => navigation.navigate('Profile'));

  expect(window.location.pathname).toBe('/');

  await act(async () => navigation.dispatch(StackActions.replace('Settings')));

  await waitFor(() => expect(window.location.pathname).toBe('/settings'));

  act(() => window.history.back());

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

  render(
    <NavigationContainer ref={navigation} linking={linking}>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={TestScreen} />
        <Stack.Screen name="Profile" component={TestScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  act(() => navigation.navigate('Profile'));

  await waitFor(() => expect(window.location.pathname).toBe('/profile'));

  const originalGo = window.history.go.bind(window.history);

  const goSpy = jest.spyOn(window.history, 'go').mockImplementation((n) => {
    setTimeout(() => originalGo(n), 1500);
  });

  act(() => navigation.goBack());

  await act(() => jest.advanceTimersByTimeAsync(1600));

  await waitFor(() => expect(window.location.pathname).toBe('/'));

  goSpy.mockRestore();

  act(() => window.history.forward());

  await waitFor(() => expect(window.location.pathname).toBe('/profile'));

  expect(navigation.getCurrentRoute()?.name).toBe('Profile');
});

test('keeps the latest navigation when programmatic back is delayed', async () => {
  const Stack = createStackNavigator();

  const linking = {
    config: {
      screens: {
        Home: '',
        Profile: 'profile',
        Settings: 'settings',
        Feed: 'feed',
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
        <Stack.Screen name="Feed" component={TestScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  act(() => navigation.navigate('Profile'));

  await waitFor(() => expect(window.location.pathname).toBe('/profile'));

  act(() => navigation.navigate('Settings'));

  await waitFor(() => expect(window.location.pathname).toBe('/settings'));

  const originalGo = window.history.go.bind(window.history);

  const goSpy = jest.spyOn(window.history, 'go').mockImplementation((n) => {
    setTimeout(() => originalGo(n), 600);
  });

  act(() => navigation.goBack());

  await act(() => jest.advanceTimersByTimeAsync(0));

  expect(goSpy).toHaveBeenCalledWith(-1);

  act(() => navigation.navigate('Feed'));

  await act(() => jest.advanceTimersByTimeAsync(700));

  await waitFor(() => expect(window.location.pathname).toBe('/feed'));

  expect(navigation.getCurrentRoute()?.name).toBe('Feed');

  goSpy.mockRestore();

  act(() => window.history.back());

  await waitFor(() => expect(window.location.pathname).toBe('/profile'));

  expect(navigation.getCurrentRoute()?.name).toBe('Profile');
});

test('queues replace while programmatic back is delayed', async () => {
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

  const originalGo = window.history.go.bind(window.history);

  const goSpy = jest.spyOn(window.history, 'go').mockImplementation((n) => {
    setTimeout(() => originalGo(n), 600);
  });

  act(() => navigation.goBack());

  await act(() => jest.advanceTimersByTimeAsync(0));

  expect(goSpy).toHaveBeenCalledWith(-1);

  act(() => navigation.dispatch(StackActions.replace('Settings')));

  await act(() => jest.advanceTimersByTimeAsync(700));

  await waitFor(() => expect(window.location.pathname).toBe('/settings'));

  expect(navigation.getCurrentRoute()?.name).toBe('Settings');

  goSpy.mockRestore();

  act(() => window.history.back());

  await waitFor(() => expect(window.location.pathname).toBe('/'));

  expect(navigation.getCurrentRoute()?.name).toBe('Home');
});

test('applies multiple updates queued during delayed history traversal', async () => {
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

  const originalGo = window.history.go.bind(window.history);

  const goSpy = jest.spyOn(window.history, 'go').mockImplementation((n) => {
    setTimeout(() => originalGo(n), 600);
  });

  act(() => navigation.goBack());

  await act(() => jest.advanceTimersByTimeAsync(0));

  expect(goSpy).toHaveBeenCalledWith(-1);

  act(() => navigation.navigate('B'));
  act(() => navigation.navigate('C'));

  await act(() => jest.advanceTimersByTimeAsync(700));

  await waitFor(() => expect(window.location.pathname).toBe('/c'));

  expect(navigation.getCurrentRoute()?.name).toBe('C');
  expect(navigation.getRootState()?.routes.map((route) => route.name)).toEqual([
    'Home',
    'A',
    'B',
    'C',
  ]);

  goSpy.mockRestore();

  act(() => window.history.back());

  await waitFor(() => expect(window.location.pathname).toBe('/b'));

  expect(navigation.getCurrentRoute()?.name).toBe('B');

  act(() => window.history.forward());

  await waitFor(() => expect(window.location.pathname).toBe('/c'));

  expect(navigation.getCurrentRoute()?.name).toBe('C');
  expect(navigation.getRootState()?.routes.map((route) => route.name)).toEqual([
    'Home',
    'A',
    'B',
    'C',
  ]);
});

test('syncs a queued navigation after history traversal times out', async () => {
  const Stack = createStackNavigator();

  const linking = {
    config: {
      screens: {
        Home: '',
        Profile: 'profile',
        Settings: 'settings',
        Feed: 'feed',
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
        <Stack.Screen name="Feed" component={TestScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  act(() => navigation.navigate('Profile'));

  await waitFor(() => expect(window.location.pathname).toBe('/profile'));

  act(() => navigation.navigate('Settings'));

  await waitFor(() => expect(window.location.pathname).toBe('/settings'));

  const goSpy = jest.spyOn(window.history, 'go').mockImplementation(() => {});

  act(() => navigation.goBack());

  await act(() => jest.advanceTimersByTimeAsync(0));

  expect(goSpy).toHaveBeenCalledWith(-1);

  act(() => navigation.navigate('Feed'));

  expect(navigation.getCurrentRoute()?.name).toBe('Feed');

  expect(window.location.pathname).toBe('/settings');

  await act(() => jest.advanceTimersByTimeAsync(999));

  expect(window.location.pathname).toBe('/settings');

  await act(() => jest.advanceTimersByTimeAsync(1));

  await waitFor(() => expect(window.location.pathname).toBe('/feed'));

  expect(navigation.getCurrentRoute()?.name).toBe('Feed');
});

test('rolls back prevented browser back when forward traversal is delayed', async () => {
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

  const ProfileScreen = ({ route }: any): any => {
    usePreventRemove(true, onPreventRemove);

    return <Text>{route.name}</Text>;
  };

  render(
    <NavigationContainer ref={navigation} linking={linking}>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={TestScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  act(() => navigation.navigate('Profile'));

  await waitFor(() => expect(window.location.pathname).toBe('/profile'));

  const originalGo = window.history.go.bind(window.history);

  jest.spyOn(window.history, 'go').mockImplementation((n) => {
    setTimeout(() => originalGo(n), 600);
  });

  act(() => window.history.back());

  await waitFor(() => expect(onPreventRemove).toHaveBeenCalledTimes(1));

  expect(window.location.pathname).toBe('/');

  await act(() => jest.advanceTimersByTimeAsync(700));

  await waitFor(() => expect(window.location.pathname).toBe('/profile'));

  expect(navigation.getCurrentRoute()?.name).toBe('Profile');
});

test('syncs a delayed multi-entry programmatic pop', async () => {
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

  const originalGo = window.history.go.bind(window.history);

  const goSpy = jest.spyOn(window.history, 'go').mockImplementation((n) => {
    setTimeout(() => originalGo(n), 600);
  });

  act(() => navigation.dispatch(StackActions.pop(2)));

  await act(() => jest.advanceTimersByTimeAsync(700));

  await waitFor(() => expect(window.location.pathname).toBe('/a'));

  expect(navigation.getCurrentRoute()?.name).toBe('A');

  goSpy.mockRestore();

  act(() => window.history.forward());

  await waitFor(() => expect(window.location.pathname).toBe('/b'));

  expect(navigation.getCurrentRoute()?.name).toBe('B');

  act(() => window.history.forward());

  await waitFor(() => expect(window.location.pathname).toBe('/c'));

  expect(navigation.getCurrentRoute()?.name).toBe('C');
});

test('handles browser navigation during a delayed programmatic traversal', async () => {
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

  const originalGo = window.history.go.bind(window.history);

  const goSpy = jest.spyOn(window.history, 'go').mockImplementation((n) => {
    setTimeout(() => originalGo(n), 600);
  });

  act(() => navigation.goBack());

  await act(() => jest.advanceTimersByTimeAsync(0));

  expect(goSpy).toHaveBeenCalledWith(-1);

  act(() => window.history.back());

  await act(() => jest.advanceTimersByTimeAsync(700));

  await waitFor(() => expect(window.location.pathname).toBe('/a'));

  expect(navigation.getCurrentRoute()?.name).toBe('A');

  goSpy.mockRestore();

  act(() => window.history.forward());

  await waitFor(() => expect(window.location.pathname).toBe('/b'));

  expect(navigation.getCurrentRoute()?.name).toBe('B');

  act(() => window.history.forward());

  await waitFor(() => expect(window.location.pathname).toBe('/c'));

  expect(navigation.getCurrentRoute()?.name).toBe('C');
});

test('navigates to the last screen without waiting for an interrupted one', async () => {
  const createStackNavigator = createNavigatorFactory((props: any) => {
    const { state, descriptors, render } = useNavigationBuilder(
      StackRouter,
      props
    );

    const route = state.routes[state.index];

    if (route == null) {
      return null;
    }

    return render(descriptors[route.key]?.render());
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

  render(
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

  await act(async () => navigation.navigate('A'));
  await act(async () => navigation.navigate('B'));

  expect(window.location.pathname).toBe('/');

  await act(async () => {
    b.resolve();

    await b.promise;
  });

  await waitFor(() => expect(window.location.pathname).toBe('/b'));

  expect(navigation.getCurrentRoute()?.name).toBe('B');

  await act(async () => {
    a.resolve();

    await a.promise;
  });

  await waitFor(() => expect(window.location.pathname).toBe('/b'));

  expect(navigation.getCurrentRoute()?.name).toBe('B');
});

test("doesn't navigate to an interrupted screen that finishes loading first", async () => {
  const createStackNavigator = createNavigatorFactory((props: any) => {
    const { state, descriptors, render } = useNavigationBuilder(
      StackRouter,
      props
    );

    const route = state.routes[state.index];

    if (route == null) {
      return null;
    }

    return render(descriptors[route.key]?.render());
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

  render(
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

  await act(async () => navigation.navigate('A'));
  await act(async () => navigation.navigate('B'));

  expect(window.location.pathname).toBe('/');

  await act(async () => {
    a.resolve();

    await a.promise;
  });

  expect(window.location.pathname).toBe('/');

  await act(async () => {
    b.resolve();

    await b.promise;
  });

  await waitFor(() => expect(window.location.pathname).toBe('/b'));

  expect(navigation.getCurrentRoute()?.name).toBe('B');
});

describe('batched browser history', () => {
  const Stack = createStackNavigator();
  const Tab = createTabNavigator();
  const Drawer = createNavigatorFactory(
    (props: Parameters<typeof useNavigationBuilder>[1]) => {
      const { state, descriptors, render } = useNavigationBuilder(
        DrawerRouter,
        props
      );

      return render(
        state.routes.map((route) => descriptors[route.key]?.render())
      );
    }
  )();

  type NavigatorKind =
    | 'stack'
    | 'custom'
    | 'drawer'
    | NonNullable<Parameters<typeof TabRouter>[0]['backBehavior']>;

  const renderNavigation = (
    kind: NavigatorKind = 'stack',
    getPath: typeof getPathFromState = getPathFromState
  ) => {
    const { Navigator, Screen } =
      kind === 'stack' || kind === 'custom'
        ? Stack
        : kind === 'drawer'
          ? Drawer
          : Tab;
    const navigation = createNavigationContainerRef<ParamListBase>();

    render(
      <NavigationContainer
        ref={navigation}
        linking={{
          config: {
            screens: {
              Home: '',
              A: 'a/:id?',
              B: 'b/:id?',
              C: 'c',
              D: 'd',
              Missing: '*',
            },
          },
          getPathFromState: getPath,
        }}
      >
        <Navigator
          backBehavior={
            kind === 'stack' || kind === 'custom'
              ? undefined
              : kind === 'drawer'
                ? 'fullHistory'
                : kind
          }
          router={
            kind === 'custom'
              ? (router) => ({
                  type: 'custom',
                  getInitialState: (options) => ({
                    ...router.getInitialState(options),
                    type: 'custom',
                  }),
                  getRehydratedState: (state, options) => ({
                    ...router.getRehydratedState(state, options),
                    type: 'custom',
                  }),
                })
              : undefined
          }
        >
          <Screen name="Home" component={TestScreen} />
          <Screen name="A" component={TestScreen} />
          <Screen name="B" component={TestScreen} />
          <Screen name="C" component={TestScreen} />
          <Screen name="D" component={TestScreen} />
          <Screen name="Missing" component={TestScreen} />
        </Navigator>
      </NavigationContainer>
    );

    return navigation;
  };

  const renderNestedNavigation = (
    kind: 'stack' | 'fullHistory' = 'fullHistory'
  ) => {
    type ChildParamList = { One: undefined; Two: undefined };
    type RootParamList = {
      Home: undefined;
      Nested:
        | (NavigatorScreenParams<ChildParamList> & { id?: string })
        | undefined;
      A: undefined;
      B: undefined;
    };
    const navigation = createNavigationContainerRef<RootParamList>();
    const { Navigator, Screen } = kind === 'stack' ? Stack : Tab;

    render(
      <NavigationContainer
        ref={navigation}
        linking={{
          config: {
            screens: {
              Home: '',
              Nested: {
                path: 'nested/:id?',
                screens: { One: 'one', Two: 'two' },
              },
              A: 'a',
              B: 'b',
            },
          },
        }}
      >
        <Navigator backBehavior="fullHistory">
          <Screen name="Home" component={TestScreen} />
          <Screen name="Nested">
            {() => (
              <Stack.Navigator>
                <Stack.Screen name="One" component={TestScreen} />
                <Stack.Screen name="Two" component={TestScreen} />
              </Stack.Navigator>
            )}
          </Screen>
          <Screen name="A" component={TestScreen} />
          <Screen name="B" component={TestScreen} />
        </Navigator>
      </NavigationContainer>
    );

    return navigation;
  };

  test.each<NavigatorKind>(['stack', 'custom'])(
    'restores every committed route with browser back and forward in a %s navigator',
    async (kind) => {
      const navigation = renderNavigation(kind);

      act(() => navigation.navigate('D'));
      await waitFor(() => expect(window.location.pathname).toBe('/d'));

      const length = window.history.length;

      act(() => {
        navigation.dispatch(StackActions.push('A', { id: 'one' }));
        navigation.dispatch(StackActions.push('B', { id: 'two' }));
        navigation.dispatch(StackActions.push('C'));
      });

      await waitFor(() => expect(window.location.pathname).toBe('/c'));

      expect(window.history.length).toBe(length + 3);
      expect(navigation.getRootState()?.type).toBe(kind);

      act(() => window.history.back());

      await waitFor(() => expect(window.location.pathname).toBe('/b/two'));
      expect(navigation.getCurrentRoute()).toMatchObject({
        name: 'B',
        params: { id: 'two' },
      });
      expect(
        navigation.getRootState()?.routes.map((route) => route.name)
      ).toEqual(['Home', 'D', 'A', 'B']);

      act(() => window.history.back());

      await waitFor(() => expect(window.location.pathname).toBe('/a/one'));
      expect(navigation.getCurrentRoute()?.params).toEqual({ id: 'one' });

      act(() => window.history.back());

      await waitFor(() => expect(window.location.pathname).toBe('/d'));
      expect(
        navigation.getRootState()?.routes.map((route) => route.name)
      ).toEqual(['Home', 'D']);

      act(() => window.history.go(2));

      await waitFor(() => expect(window.location.pathname).toBe('/b/two'));
      expect(navigation.getCurrentRoute()?.params).toEqual({ id: 'two' });

      act(() => window.history.forward());

      await waitFor(() => expect(window.location.pathname).toBe('/c'));
      expect(
        navigation.getRootState()?.routes.map((route) => route.name)
      ).toEqual(['Home', 'D', 'A', 'B', 'C']);
    }
  );

  test('keeps separate stack entries that have the same URL', async () => {
    const navigation = renderNavigation();
    const length = window.history.length;

    act(() => {
      navigation.dispatch(StackActions.push('A'));
      navigation.dispatch(StackActions.push('A'));
    });

    await waitFor(() => expect(window.location.pathname).toBe('/a'));
    expect(window.history.length).toBe(length + 2);

    const lastKey = navigation.getCurrentRoute()?.key;

    act(() => window.history.back());

    await waitFor(() =>
      expect(navigation.getRootState()?.routes).toHaveLength(2)
    );
    expect(window.location.pathname).toBe('/a');
    expect(navigation.getCurrentRoute()?.key).not.toBe(lastKey);

    act(() => window.history.forward());

    await waitFor(() =>
      expect(navigation.getRootState()?.routes).toHaveLength(3)
    );
    expect(navigation.getCurrentRoute()?.key).toBe(lastKey);
  });

  test('recovers nested stack entries without changing the parent navigator', async () => {
    const navigation = createNavigationContainerRef<{
      Home: NavigatorScreenParams<{
        Feed: undefined;
        A: { id: string };
        B: { id: string };
      }>;
      Other: undefined;
    }>();

    render(
      <NavigationContainer
        ref={navigation}
        linking={{
          config: {
            screens: {
              Home: { screens: { Feed: 'feed', A: 'a/:id', B: 'b/:id' } },
              Other: 'other',
            },
          },
        }}
      >
        <Tab.Navigator>
          <Tab.Screen name="Home">
            {() => (
              <Stack.Navigator>
                <Stack.Screen name="Feed" component={TestScreen} />
                <Stack.Screen name="A" component={TestScreen} />
                <Stack.Screen name="B" component={TestScreen} />
              </Stack.Navigator>
            )}
          </Tab.Screen>
          <Tab.Screen name="Other" component={TestScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    );

    const parentKey = navigation.getRootState()?.key;
    const length = window.history.length;

    act(() => {
      navigation.dispatch(CommonActions.navigate('A', { id: 'one' }));
      navigation.dispatch(CommonActions.navigate('B', { id: 'two' }));
    });

    await waitFor(() => expect(window.location.pathname).toBe('/b/two'));
    expect(window.history.length).toBe(length + 2);

    act(() => window.history.back());

    await waitFor(() => expect(window.location.pathname).toBe('/a/one'));
    expect(navigation.getCurrentRoute()).toMatchObject({
      name: 'A',
      params: { id: 'one' },
    });
    expect(navigation.getRootState()).toMatchObject({
      key: parentKey,
      index: 0,
    });

    act(() => window.history.back());

    await waitFor(() => expect(window.location.pathname).toBe('/feed'));
    expect(navigation.getCurrentRoute()?.name).toBe('Feed');

    act(() => window.history.go(2));

    await waitFor(() => expect(window.location.pathname).toBe('/b/two'));
    expect(navigation.getCurrentRoute()?.params).toEqual({ id: 'two' });
    expect(navigation.getRootState()?.key).toBe(parentKey);
  });

  test.each<NavigatorKind>(['stack', 'history', 'fullHistory'])(
    'recovers new focused parameter entries and preserves the hash in a %s navigator',
    async (kind) => {
      const navigation = renderNavigation(kind);

      act(() =>
        navigation.dispatch({
          type: 'NAVIGATE',
          payload: { name: 'A', params: { id: 'zero' }, path: '/a/zero' },
        })
      );
      await waitFor(() => expect(window.location.pathname).toBe('/a/zero'));

      act(() => navigation.dispatch(CommonActions.pushParams({ id: 'old' })));
      await waitFor(() => expect(window.location.pathname).toBe('/a/old'));

      window.history.replaceState(window.history.state, '', '/a/old#details');
      const length = window.history.length;

      act(() => {
        navigation.dispatch(CommonActions.pushParams({ id: 'one' }));
        navigation.dispatch(CommonActions.pushParams({ id: 'two' }));
        navigation.dispatch(CommonActions.pushParams({ id: 'three' }));
      });

      await waitFor(() => expect(window.location.pathname).toBe('/a/three'));
      expect(window.history.length).toBe(length + 3);
      expect(window.location.hash).toBe('#details');

      act(() => window.history.back());
      await waitFor(() => expect(window.location.pathname).toBe('/a/two'));
      expect(navigation.getCurrentRoute()?.params).toEqual({ id: 'two' });
      expect(window.location.hash).toBe('#details');

      act(() => window.history.back());
      await waitFor(() => expect(window.location.pathname).toBe('/a/one'));
      expect(navigation.getCurrentRoute()?.params).toEqual({ id: 'one' });
      expect(window.location.hash).toBe('#details');

      act(() => window.history.back());
      await waitFor(() => expect(window.location.pathname).toBe('/a/old'));

      act(() => window.history.go(3));
      await waitFor(() => expect(window.location.pathname).toBe('/a/three'));
      expect(navigation.getCurrentRoute()?.params).toEqual({ id: 'three' });
    }
  );

  test.each<NavigatorKind>(['history', 'fullHistory'])(
    'recovers unchanged paramless tabs with %s back behavior',
    async (kind) => {
      const navigation = renderNavigation(kind);
      const length = window.history.length;

      act(() => {
        navigation.navigate('A');
        navigation.navigate('B');
        navigation.navigate('C');
      });

      await waitFor(() => expect(window.location.pathname).toBe('/c'));
      expect(window.history.length).toBe(length + 3);

      act(() => window.history.back());
      await waitFor(() => expect(window.location.pathname).toBe('/b'));
      expect(navigation.getCurrentRoute()?.name).toBe('B');

      act(() => window.history.back());
      await waitFor(() => expect(window.location.pathname).toBe('/a'));
      expect(navigation.getCurrentRoute()?.name).toBe('A');

      act(() => window.history.go(2));
      await waitFor(() => expect(window.location.pathname).toBe('/c'));
      expect(navigation.getCurrentRoute()?.name).toBe('C');
    }
  );

  test('restores saved params for repeated fullHistory tab visits', async () => {
    const navigation = renderNavigation('fullHistory');
    const length = window.history.length;

    act(() => {
      navigation.navigate('A', { id: 'one' });
      navigation.navigate('B');
      navigation.navigate('A', { id: 'two' });
    });

    await waitFor(() => expect(window.location.pathname).toBe('/a/two'));
    expect(window.history.length).toBe(length + 3);

    act(() => window.history.go(-2));
    await waitFor(() => expect(window.location.pathname).toBe('/a/one'));
    expect(navigation.getCurrentRoute()?.params).toEqual({ id: 'one' });

    act(() => window.history.forward());
    await waitFor(() => expect(window.location.pathname).toBe('/b'));
    expect(navigation.getCurrentRoute()?.name).toBe('B');

    act(() => window.history.forward());
    await waitFor(() => expect(window.location.pathname).toBe('/a/two'));
    expect(navigation.getCurrentRoute()?.params).toEqual({ id: 'two' });
  });

  test('recovers every repeated paramless fullHistory visit', async () => {
    const navigation = renderNavigation('fullHistory');
    const length = window.history.length;

    act(() => {
      navigation.navigate('A');
      navigation.navigate('B');
      navigation.navigate('A');
      navigation.navigate('B');
    });

    await waitFor(() => expect(window.location.pathname).toBe('/b'));
    expect(window.history.length).toBe(length + 4);

    for (const [path, name] of [
      ['/a', 'A'],
      ['/b', 'B'],
      ['/a', 'A'],
      ['/', 'Home'],
    ]) {
      act(() => window.history.back());
      await waitFor(() => expect(window.location.pathname).toBe(path));
      expect(navigation.getCurrentRoute()?.name).toBe(name);
    }
  });

  test('recovers deduplicated tab history in its final back order', async () => {
    const navigation = renderNavigation('history');
    const length = window.history.length;

    act(() => {
      navigation.navigate('A');
      navigation.navigate('B');
      navigation.navigate('A');
    });

    await waitFor(() => expect(window.location.pathname).toBe('/a'));
    expect(window.history.length).toBe(length + 2);

    act(() => window.history.back());
    await waitFor(() => expect(window.location.pathname).toBe('/b'));
    expect(navigation.getCurrentRoute()?.name).toBe('B');

    act(() => navigation.goBack());
    await waitFor(() => expect(window.location.pathname).toBe('/'));
    expect(navigation.getCurrentRoute()?.name).toBe('Home');
  });

  test('recovers leaf visits when older fullHistory params changed', async () => {
    const navigation = renderNavigation('fullHistory');
    const length = window.history.length;

    act(() => {
      navigation.dispatch(CommonActions.setParams({ id: 'updated' }));
      navigation.navigate('A');
      navigation.navigate('B');
    });

    await waitFor(() => expect(window.location.pathname).toBe('/b'));
    expect(window.history.length).toBe(length + 2);

    act(() => window.history.back());
    await waitFor(() => expect(window.location.pathname).toBe('/a'));
    expect(navigation.getCurrentRoute()?.name).toBe('A');
  });

  test.each<NavigatorKind>(['history', 'fullHistory'])(
    'does not invent tab visits from background parameter updates with %s back behavior',
    async (kind) => {
      const navigation = renderNavigation(kind);

      act(() => navigation.navigate('A'));
      await waitFor(() => expect(window.location.pathname).toBe('/a'));
      act(() => navigation.navigate('B'));
      await waitFor(() => expect(window.location.pathname).toBe('/b'));

      const source = navigation
        .getRootState()
        ?.routes.find((route) => route.name === 'Home')?.key;
      expect(source).toBeDefined();
      const length = window.history.length;

      act(() => {
        navigation.dispatch({
          ...CommonActions.pushParams({ id: 'one' }),
          source,
        });
        navigation.dispatch({
          ...CommonActions.pushParams({ id: 'two' }),
          source,
        });
      });

      await waitFor(() => expect(window.history.length).toBe(length + 1));
      expect(window.location.pathname).toBe('/b');
      expect(navigation.getCurrentRoute()?.name).toBe('B');
    }
  );

  test('does not replay retained params from an earlier tab visit', async () => {
    const navigation = renderNavigation('fullHistory');

    act(() => navigation.navigate('A', { id: 'zero' }));
    await waitFor(() => expect(window.location.pathname).toBe('/a/zero'));
    act(() => navigation.dispatch(CommonActions.pushParams({ id: 'one' })));
    await waitFor(() => expect(window.location.pathname).toBe('/a/one'));
    act(() => navigation.navigate('B'));
    await waitFor(() => expect(window.location.pathname).toBe('/b'));

    const length = window.history.length;

    act(() => {
      navigation.navigate('A', { id: 'two' });
      navigation.navigate('C');
      navigation.navigate('A', { id: 'three' });
    });

    await waitFor(() => expect(window.location.pathname).toBe('/a/three'));
    expect(window.history.length).toBe(length + 1);
    expect(navigation.getCurrentRoute()?.params).toEqual({ id: 'three' });
  });

  test.each<NavigatorKind>(['stack', 'fullHistory'])(
    'stops at a preceding route with parameter history in a %s navigator',
    async (kind) => {
      const navigation = renderNavigation(kind);
      const length = window.history.length;

      act(() => {
        navigation.navigate('A', { id: 'zero' });
        navigation.dispatch(CommonActions.pushParams({ id: 'one' }));
        navigation.navigate('B');
        navigation.navigate('C');
      });

      await waitFor(() => expect(window.location.pathname).toBe('/c'));
      expect(window.history.length).toBe(length + 2);

      act(() => window.history.back());
      await waitFor(() => expect(window.location.pathname).toBe('/b'));
      expect(navigation.getCurrentRoute()?.name).toBe('B');
    }
  );

  test('does not clear unsaved params in a history-mode tab snapshot', async () => {
    const navigation = renderNavigation('history');
    const length = window.history.length;

    act(() => {
      navigation.navigate('A', { id: 'one' });
      navigation.navigate('B');
    });

    await waitFor(() => expect(window.location.pathname).toBe('/b'));
    expect(window.history.length).toBe(length + 1);
    expect(
      navigation.getRootState()?.routes.find((route) => route.name === 'A')
        ?.params
    ).toEqual({ id: 'one' });
  });

  test.each<NavigatorKind>(['history', 'fullHistory'])(
    'handles params cleared by preload with %s back behavior',
    async (kind) => {
      const navigation = renderNavigation(kind);
      const length = window.history.length;

      act(() => {
        navigation.navigate('A', { id: 'original' });
        navigation.navigate('B');
        navigation.dispatch(CommonActions.preload('A'));
      });

      await waitFor(() => expect(window.location.pathname).toBe('/b'));
      expect(
        navigation.getRootState()?.routes.find((route) => route.name === 'A')
          ?.params
      ).toBeUndefined();
      expect(window.history.length).toBe(
        length + (kind === 'fullHistory' ? 2 : 1)
      );

      act(() => window.history.back());
      await waitFor(() =>
        expect(window.location.pathname).toBe(
          kind === 'fullHistory' ? '/a/original' : '/'
        )
      );
      expect(navigation.getCurrentRoute()).toMatchObject(
        kind === 'fullHistory'
          ? { name: 'A', params: { id: 'original' } }
          : { name: 'Home' }
      );
    }
  );

  test('does not infer an older undefined snapshot from a changed tab route', async () => {
    const navigation = renderNavigation('fullHistory');
    const length = window.history.length;

    act(() => {
      navigation.navigate('A');
      navigation.navigate('B');
      navigation.navigate('A', { id: 'latest' });
      navigation.navigate('C');
    });

    await waitFor(() => expect(window.location.pathname).toBe('/c'));
    expect(window.history.length).toBe(length + 3);

    act(() => window.history.back());
    await waitFor(() => expect(window.location.pathname).toBe('/a/latest'));
    act(() => window.history.back());
    await waitFor(() => expect(window.location.pathname).toBe('/b'));
  });

  test('does not add entries for unvisited ordered tabs', async () => {
    const navigation = renderNavigation('order');
    const length = window.history.length;

    act(() => navigation.navigate('C'));

    await waitFor(() => expect(window.location.pathname).toBe('/c'));
    expect(window.history.length).toBe(length + 1);

    act(() => window.history.back());
    await waitFor(() => expect(window.location.pathname).toBe('/'));
    expect(navigation.getCurrentRoute()?.name).toBe('Home');
  });

  test('does not infer extra visits when a drawer opens in the same commit', async () => {
    const navigation = renderNavigation('drawer');
    const length = window.history.length;

    act(() => {
      navigation.navigate('A');
      navigation.dispatch(DrawerActions.openDrawer());
    });

    await waitFor(() => expect(window.location.pathname).toBe('/a'));
    expect(window.history.length).toBe(length + 1);
    expect(navigation.getRootState()?.history).toContainEqual({
      type: 'drawer',
      status: 'open',
    });

    act(() => window.history.back());
    await waitFor(() => expect(window.location.pathname).toBe('/'));
    expect(navigation.getRootState()?.history).not.toContainEqual({
      type: 'drawer',
      status: 'open',
    });
  });

  test('preserves the original wildcard URL for a recovered stack entry', async () => {
    const navigation = renderNavigation();

    act(() => {
      navigation.dispatch({
        type: 'NAVIGATE',
        payload: { name: 'Missing', path: '/unknown/deep/path' },
      });
      navigation.navigate('B');
    });

    await waitFor(() => expect(window.location.pathname).toBe('/b'));

    act(() => window.history.back());
    await waitFor(() =>
      expect(window.location.pathname).toBe('/unknown/deep/path')
    );
    expect(navigation.getCurrentRoute()?.name).toBe('Missing');

    act(() => window.history.forward());
    await waitFor(() => expect(window.location.pathname).toBe('/b'));
  });

  test('uses a custom path builder for every recovered entry', async () => {
    const navigation = renderNavigation(
      'stack',
      (state, options) => `/custom${getPathFromState(state, options)}`
    );

    act(() => {
      navigation.navigate('A', { id: 'one' });
      navigation.navigate('B', { id: 'two' });
    });

    await waitFor(() => expect(window.location.pathname).toBe('/custom/b/two'));

    act(() => window.history.back());
    await waitFor(() => expect(window.location.pathname).toBe('/custom/a/one'));
    expect(navigation.getCurrentRoute()?.params).toEqual({ id: 'one' });
  });

  test('drops the previous route hash from every new stack entry', async () => {
    const navigation = renderNavigation();

    window.history.replaceState(window.history.state, '', '/#details');

    act(() => {
      navigation.navigate('A');
      navigation.navigate('B');
    });

    await waitFor(() => expect(window.location.pathname).toBe('/b'));
    expect(window.location.hash).toBe('');

    act(() => window.history.back());
    await waitFor(() => expect(window.location.pathname).toBe('/a'));
    expect(window.location.hash).toBe('');
    expect(navigation.getCurrentRoute()?.name).toBe('A');
  });

  test('keeps the recoverable suffix and final URL when an earlier path cannot be built', async () => {
    const error = new Error('Cannot build path for B');
    const errors = jest.spyOn(console, 'error').mockImplementation(() => {});
    const navigation = renderNavigation('stack', (state, options) => {
      if (findFocusedRoute(state)?.name === 'B') {
        throw error;
      }

      return getPathFromState(state, options);
    });
    const length = window.history.length;

    act(() => {
      navigation.navigate('A');
      navigation.navigate('B');
      navigation.navigate('C');
      navigation.navigate('D');
    });

    await waitFor(() => expect(window.location.pathname).toBe('/d'));
    expect(window.history.length).toBe(length + 2);
    expect(errors).toHaveBeenCalledWith(error);

    act(() => window.history.back());
    await waitFor(() => expect(window.location.pathname).toBe('/c'));
    expect(navigation.getCurrentRoute()?.name).toBe('C');

    act(() => navigation.navigate('A', { id: 'next' }));
    await waitFor(() => expect(window.location.pathname).toBe('/a/next'));
    expect(navigation.getCurrentRoute()?.params).toEqual({ id: 'next' });
  });

  test('does not reuse the latest child state for an earlier tab visit', async () => {
    const navigation = renderNestedNavigation();
    const child = navigation
      .getRootState()
      ?.routes.find((route) => route.name === 'Nested')?.state;

    if (child?.stale !== false) {
      throw new Error('The nested navigator was not initialized.');
    }

    const length = window.history.length;

    act(() => {
      navigation.navigate('Nested');
      navigation.navigate('Home');
      navigation.navigate('Nested');
      navigation.dispatch({
        ...StackActions.replace('Two'),
        target: child.key,
      });
    });

    await waitFor(() => expect(window.location.pathname).toBe('/nested/two'));
    expect(window.history.length).toBe(length + 2);
    expect(navigation.getCurrentRoute()?.name).toBe('Two');

    act(() => window.history.back());
    await waitFor(() => expect(window.location.pathname).toBe('/'));
    expect(navigation.getCurrentRoute()?.name).toBe('Home');

    act(() => window.history.forward());
    await waitFor(() => expect(window.location.pathname).toBe('/nested/two'));
    expect(navigation.getCurrentRoute()?.name).toBe('Two');
  });

  test('stops recovering stack entries when a preceding route contains child state', async () => {
    const navigation = renderNestedNavigation('stack');
    const length = window.history.length;

    act(() => {
      navigation.navigate('Nested');
      navigation.navigate('A');
      navigation.navigate('B');
    });

    await waitFor(() => expect(window.location.pathname).toBe('/b'));
    expect(window.history.length).toBe(length + 2);

    act(() => window.history.back());
    await waitFor(() => expect(window.location.pathname).toBe('/a'));
    expect(navigation.getCurrentRoute()?.name).toBe('A');

    act(() => window.history.back());
    await waitFor(() => expect(window.location.pathname).toBe('/'));
    expect(navigation.getCurrentRoute()?.name).toBe('Home');
  });

  test.each([false, true])(
    'recovers parent params only while its child state stays unchanged (child changed: %s)',
    async (changeChild) => {
      const navigation = renderNestedNavigation();

      act(() => navigation.navigate('Nested', { screen: 'One', id: 'zero' }));
      await waitFor(() =>
        expect(window.location.pathname).toBe('/nested/zero/one')
      );

      const state = navigation.getRootState();
      const route = state?.routes.find((item) => item.name === 'Nested');
      const child = route?.state;

      if (!route || child?.stale !== false) {
        throw new Error('The nested navigator was not initialized.');
      }

      const length = window.history.length;

      act(() => {
        navigation.dispatch({
          ...CommonActions.pushParams({ id: 'first' }),
          source: route.key,
          target: state?.key,
        });
        if (changeChild) {
          navigation.dispatch({
            ...StackActions.replace('Two'),
            target: child.key,
          });
        }
        navigation.dispatch({
          ...CommonActions.pushParams({ id: 'last' }),
          source: route.key,
          target: state?.key,
        });
      });

      await waitFor(() =>
        expect(window.location.pathname).toBe(
          changeChild ? '/nested/last/two' : '/nested/last/one'
        )
      );
      expect(window.history.length).toBe(length + (changeChild ? 1 : 2));

      act(() => window.history.back());
      await waitFor(() =>
        expect(window.location.pathname).toBe(
          changeChild ? '/nested/zero/one' : '/nested/first/one'
        )
      );
      expect(navigation.getCurrentRoute()?.name).toBe('One');
    }
  );

  test('does not mix new parameter entries with tab switches', async () => {
    const navigation = renderNavigation('fullHistory');

    act(() => navigation.navigate('A', { id: 'zero' }));
    await waitFor(() => expect(window.location.pathname).toBe('/a/zero'));
    const length = window.history.length;

    act(() => {
      navigation.dispatch(CommonActions.pushParams({ id: 'one' }));
      navigation.dispatch(CommonActions.pushParams({ id: 'two' }));
      navigation.navigate('B');
      navigation.navigate('A', { id: 'three' });
    });

    await waitFor(() => expect(window.location.pathname).toBe('/a/three'));
    expect(window.history.length).toBe(length + 1);
  });

  test('does not infer parameter visits on a route first added in the same commit', async () => {
    const navigation = renderNavigation();
    const length = window.history.length;

    act(() => {
      navigation.navigate('A', { id: 'zero' });
      navigation.dispatch(CommonActions.pushParams({ id: 'one' }));
      navigation.dispatch(CommonActions.pushParams({ id: 'two' }));
    });

    await waitFor(() => expect(window.location.pathname).toBe('/a/two'));
    expect(window.history.length).toBe(length + 1);
  });

  test('preserves preloaded stack routes when restoring recovered entries', async () => {
    const navigation = renderNavigation();

    act(() => navigation.dispatch(CommonActions.preload('D')));
    await waitFor(() =>
      expect(
        navigation.getRootState()?.routes.map((route) => route.name)
      ).toEqual(['Home', 'D'])
    );

    act(() => {
      navigation.navigate('A');
      navigation.navigate('B');
    });

    await waitFor(() => expect(window.location.pathname).toBe('/b'));

    act(() => window.history.go(-2));
    await waitFor(() => expect(window.location.pathname).toBe('/'));

    act(() => window.history.forward());
    await waitFor(() => expect(window.location.pathname).toBe('/a'));
    expect(
      navigation.getRootState()?.routes.map((route) => route.name)
    ).toEqual(['Home', 'A', 'D']);

    act(() => window.history.forward());
    await waitFor(() => expect(window.location.pathname).toBe('/b'));
    expect(
      navigation.getRootState()?.routes.map((route) => route.name)
    ).toEqual(['Home', 'A', 'B', 'D']);
  });

  test('pushes only the final URL for an unfamiliar custom history format', async () => {
    const navigation = createNavigationContainerRef<ParamListBase>();

    render(
      <NavigationContainer
        ref={navigation}
        linking={{ config: { screens: { Home: '', A: 'a', B: 'b' } } }}
      >
        <Stack.Navigator
          router={(router) => ({
            getInitialState(options) {
              const state = router.getInitialState(options);
              return {
                ...state,
                history: state.routes.map((route) => ({
                  type: 'visit',
                  key: route.key,
                })),
              };
            },
            getStateForAction(state, action, options) {
              const next = router.getStateForAction(state, action, options);
              return next
                ? {
                    ...next,
                    history: next.routes.map((route) => ({
                      type: 'visit',
                      key: route.key,
                    })),
                  }
                : next;
            },
          })}
        >
          <Stack.Screen name="Home" component={TestScreen} />
          <Stack.Screen name="A" component={TestScreen} />
          <Stack.Screen name="B" component={TestScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );

    const length = window.history.length;

    act(() => {
      navigation.navigate('A');
      navigation.navigate('B');
    });

    await waitFor(() => expect(window.location.pathname).toBe('/b'));
    expect(window.history.length).toBe(length + 1);

    act(() => window.history.back());
    await waitFor(() => expect(window.location.pathname).toBe('/'));
    expect(navigation.getCurrentRoute()?.name).toBe('Home');
  });

  test('keeps browser history aligned when a batch races with browser back', async () => {
    const navigation = renderNavigation();

    act(() => navigation.navigate('A'));
    await waitFor(() => expect(window.location.pathname).toBe('/a'));
    const length = window.history.length;

    window.addEventListener(
      'popstate',
      () => {
        navigation.navigate('B');
        navigation.navigate('C');
      },
      { once: true }
    );

    act(() => window.history.back());
    await waitFor(() => expect(window.location.pathname).toBe('/c'));
    expect(window.history.length).toBe(length);
    expect(
      navigation.getRootState()?.routes.map((route) => route.name)
    ).toEqual(['Home', 'B', 'C']);

    act(() => window.history.back());
    await waitFor(() => expect(window.location.pathname).toBe('/'));
    expect(navigation.getCurrentRoute()?.name).toBe('Home');

    act(() => window.history.forward());
    await waitFor(() => expect(window.location.pathname).toBe('/c'));
    expect(navigation.getCurrentRoute()?.name).toBe('C');
  });

  test('replaces forward history with the recovered entries of a new batch', async () => {
    const navigation = renderNavigation();

    act(() => {
      navigation.navigate('A');
      navigation.navigate('B');
    });
    await waitFor(() => expect(window.location.pathname).toBe('/b'));

    act(() => window.history.back());
    await waitFor(() => expect(window.location.pathname).toBe('/a'));

    act(() => {
      navigation.navigate('C');
      navigation.navigate('D');
    });
    await waitFor(() => expect(window.location.pathname).toBe('/d'));

    act(() => window.history.back());
    await waitFor(() => expect(window.location.pathname).toBe('/c'));
    expect(navigation.getCurrentRoute()?.name).toBe('C');

    act(() => window.history.back());
    await waitFor(() => expect(window.location.pathname).toBe('/a'));

    act(() => window.history.forward());
    await waitFor(() => expect(window.location.pathname).toBe('/c'));
    expect(navigation.getCurrentRoute()?.name).toBe('C');
  });
});

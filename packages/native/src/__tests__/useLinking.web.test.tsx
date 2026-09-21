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
  type NavigatorScreenParams,
  type ParamListBase,
  type RouteProp,
  StackActions,
  StackRouter,
  TabRouter,
  useIsFocused,
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

test('preserves updated params on browser back when navigation suspends', async () => {
  const Stack = createStackNavigator();

  const linking = {
    config: {
      screens: { Home: '', Profile: 'profile', Settings: 'settings' },
    },
  };

  const { promise, resolve } = Promise.withResolvers<void>();

  const SettingsScreen = () => {
    React.use(promise);

    return <Text>Settings</Text>;
  };

  const navigation = createNavigationContainerRef<ParamListBase>();

  render(
    <NavigationContainer ref={navigation} linking={linking}>
      <React.Suspense fallback={<Text>Loading</Text>}>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={TestScreen} />
          <Stack.Screen name="Profile" component={TestScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
        </Stack.Navigator>
      </React.Suspense>
    </NavigationContainer>
  );

  const homeKey = navigation.getCurrentRoute()?.key;

  await act(async () => navigation.navigate('Profile'));

  await waitFor(() => expect(window.location.pathname).toBe('/profile'));

  await act(async () =>
    navigation.dispatch({
      ...CommonActions.setParams({ updated: true }),
      source: homeKey,
    })
  );

  await act(async () => navigation.navigate('Settings'));

  expect(window.location.pathname).toBe('/profile');

  act(() => window.history.back());

  await waitFor(() => expect(navigation.getCurrentRoute()?.name).toBe('Home'));

  expect(navigation.getRootState()?.routes).toEqual([
    expect.objectContaining({
      key: homeKey,
      name: 'Home',
      params: { updated: true },
    }),
  ]);
  expect(window.location.pathname).toBe('/');

  await act(async () => {
    resolve();

    await promise;
  });

  expect(navigation.getCurrentRoute()?.name).toBe('Home');

  act(() => window.history.forward());

  await waitFor(() =>
    expect(navigation.getCurrentRoute()?.name).toBe('Profile')
  );

  expect(window.location.pathname).toBe('/profile');
});

test('preserves updated params on browser back when nested navigation suspends', async () => {
  const Stack = createStackNavigator();

  const Tab = createTabNavigator();

  const linking = {
    config: {
      screens: {
        Home: {
          path: '',
          screens: {
            Feed: 'feed',
            Profile: 'profile',
            Settings: 'settings',
          },
        },
        Chat: 'chat',
      },
    },
  };

  const { promise, resolve } = Promise.withResolvers<void>();

  const SettingsScreen = () => {
    React.use(promise);

    return <Text>Settings</Text>;
  };

  const navigation = createNavigationContainerRef<ParamListBase>();

  render(
    <NavigationContainer ref={navigation} linking={linking}>
      <React.Suspense fallback={<Text>Loading</Text>}>
        <Tab.Navigator>
          <Tab.Screen name="Home">
            {() => (
              <Stack.Navigator>
                <Stack.Screen name="Feed" component={TestScreen} />
                <Stack.Screen name="Profile" component={TestScreen} />
                <Stack.Screen name="Settings" component={SettingsScreen} />
              </Stack.Navigator>
            )}
          </Tab.Screen>
          <Tab.Screen name="Chat" component={TestScreen} />
        </Tab.Navigator>
      </React.Suspense>
    </NavigationContainer>
  );

  const feedKey = navigation.getCurrentRoute()?.key;

  await act(async () => navigation.navigate('Profile'));

  await waitFor(() => expect(window.location.pathname).toBe('/profile'));

  await act(async () =>
    navigation.dispatch({
      ...CommonActions.setParams({ updated: true }),
      source: feedKey,
    })
  );

  await act(async () => navigation.navigate('Settings'));

  expect(window.location.pathname).toBe('/profile');

  act(() => window.history.back());

  await waitFor(() => expect(navigation.getCurrentRoute()?.name).toBe('Feed'));

  expect(window.location.pathname).toBe('/feed');
  expect(navigation.getCurrentRoute()?.params).toEqual({ updated: true });
  expect(navigation.getRootState()?.routes[0]?.state?.routes).toEqual([
    expect.objectContaining({ key: feedKey, name: 'Feed' }),
  ]);

  await act(async () => {
    resolve();

    await promise;
  });

  expect(navigation.getCurrentRoute()?.name).toBe('Feed');
});

test('goes back from the visible parent screen when navigation suspends', async () => {
  const Stack = createStackNavigator();

  const Child = createStackNavigator();

  const linking = {
    config: {
      screens: {
        Home: '',
        Section: { path: 'section', screens: { Feed: 'feed' } },
        Settings: 'settings',
      },
    },
  };

  const { promise, resolve } = Promise.withResolvers<void>();

  const SettingsScreen = () => {
    React.use(promise);

    return <Text>Settings</Text>;
  };

  const navigation = createNavigationContainerRef<ParamListBase>();

  render(
    <NavigationContainer ref={navigation} linking={linking}>
      <React.Suspense fallback={<Text>Loading</Text>}>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={TestScreen} />
          <Stack.Screen name="Section">
            {() => (
              <Child.Navigator>
                <Child.Screen name="Feed" component={TestScreen} />
              </Child.Navigator>
            )}
          </Stack.Screen>
          <Stack.Screen name="Settings" component={SettingsScreen} />
        </Stack.Navigator>
      </React.Suspense>
    </NavigationContainer>
  );

  await act(async () => navigation.navigate('Section'));

  await waitFor(() => expect(window.location.pathname).toBe('/section/feed'));

  await act(async () => navigation.navigate('Settings'));

  expect(window.location.pathname).toBe('/section/feed');

  act(() => window.history.back());

  await waitFor(() => expect(navigation.getCurrentRoute()?.name).toBe('Home'));

  expect(window.location.pathname).toBe('/');
  expect(navigation.getRootState()?.routes).toEqual([
    expect.objectContaining({ name: 'Home' }),
  ]);

  await act(async () => {
    resolve();

    await promise;
  });

  expect(navigation.getCurrentRoute()?.name).toBe('Home');
});

test('goes back in the visible tab on browser back when switching tabs suspends', async () => {
  const Tab = createTabNavigator();

  const Stack = createStackNavigator();

  const linking = {
    config: {
      screens: {
        Home: { path: '', screens: { Feed: 'feed', Profile: 'profile' } },
        Other: {
          path: 'other',
          screens: { Start: 'start', Detail: 'detail' },
        },
      },
    },
  };

  const { promise, resolve } = Promise.withResolvers<void>();

  let suspendOther = false;

  const DetailScreen = () => {
    const focused = useIsFocused();

    if (focused && suspendOther) {
      React.use(promise);
    }

    return <Text>Detail</Text>;
  };

  const navigation = createNavigationContainerRef<ParamListBase>();

  render(
    <NavigationContainer ref={navigation} linking={linking}>
      <React.Suspense fallback={<Text>Loading</Text>}>
        <Tab.Navigator backBehavior="history">
          <Tab.Screen name="Home">
            {() => (
              <Stack.Navigator>
                <Stack.Screen name="Feed" component={TestScreen} />
                <Stack.Screen name="Profile" component={TestScreen} />
              </Stack.Navigator>
            )}
          </Tab.Screen>
          <Tab.Screen name="Other">
            {() => (
              <Stack.Navigator>
                <Stack.Screen name="Start" component={TestScreen} />
                <Stack.Screen name="Detail" component={DetailScreen} />
              </Stack.Navigator>
            )}
          </Tab.Screen>
        </Tab.Navigator>
      </React.Suspense>
    </NavigationContainer>
  );

  await act(async () => navigation.navigate('Other'));

  await waitFor(() => expect(window.location.pathname).toBe('/other/start'));

  await act(async () => navigation.navigate('Detail'));

  await waitFor(() => expect(window.location.pathname).toBe('/other/detail'));

  await act(async () => navigation.navigate('Home'));

  await waitFor(() => expect(window.location.pathname).toBe('/feed'));

  await act(async () => navigation.navigate('Profile'));

  await waitFor(() => expect(window.location.pathname).toBe('/profile'));

  suspendOther = true;

  await act(async () => navigation.navigate('Other'));

  expect(window.location.pathname).toBe('/profile');

  act(() => window.history.back());

  await waitFor(() => expect(navigation.getCurrentRoute()?.name).toBe('Feed'));

  expect(window.location.pathname).toBe('/feed');

  await act(async () => {
    resolve();

    await promise;
  });

  expect(navigation.getCurrentRoute()?.name).toBe('Feed');
});

test('goes back from the parent screen when a child navigation suspends', async () => {
  const Stack = createStackNavigator();

  const Child = createStackNavigator();

  const linking = {
    config: {
      screens: {
        Home: '',
        Section: {
          path: 'section',
          screens: { Feed: 'feed', Profile: 'profile' },
        },
      },
    },
  };

  const { promise, resolve } = Promise.withResolvers<void>();

  const ProfileScreen = () => {
    React.use(promise);

    return <Text>Profile</Text>;
  };

  const navigation = createNavigationContainerRef<ParamListBase>();

  render(
    <NavigationContainer ref={navigation} linking={linking}>
      <React.Suspense fallback={<Text>Loading</Text>}>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={TestScreen} />
          <Stack.Screen name="Section">
            {() => (
              <Child.Navigator>
                <Child.Screen name="Feed" component={TestScreen} />
                <Child.Screen name="Profile" component={ProfileScreen} />
              </Child.Navigator>
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </React.Suspense>
    </NavigationContainer>
  );

  await act(async () => navigation.navigate('Section'));

  await waitFor(() => expect(window.location.pathname).toBe('/section/feed'));

  await act(async () => navigation.navigate('Profile'));

  expect(window.location.pathname).toBe('/section/feed');

  act(() => window.history.back());

  await waitFor(() => expect(navigation.getCurrentRoute()?.name).toBe('Home'));

  expect(window.location.pathname).toBe('/');

  await act(async () => {
    resolve();

    await promise;
  });

  expect(navigation.getCurrentRoute()?.name).toBe('Home');
});

test('returns to the previous screen on browser back while a reset suspends', async () => {
  const Stack = createStackNavigator();

  const linking = {
    config: {
      screens: {
        Home: '',
        Profile: 'profile',
        Other: 'other',
        Settings: 'settings',
      },
    },
  };

  const { promise, resolve } = Promise.withResolvers<void>();

  const SettingsScreen = () => {
    React.use(promise);

    return <Text>Settings</Text>;
  };

  const navigation = createNavigationContainerRef<ParamListBase>();

  render(
    <NavigationContainer ref={navigation} linking={linking}>
      <React.Suspense fallback={<Text>Loading</Text>}>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={TestScreen} />
          <Stack.Screen name="Profile" component={TestScreen} />
          <Stack.Screen name="Other" component={TestScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
        </Stack.Navigator>
      </React.Suspense>
    </NavigationContainer>
  );

  await act(async () => navigation.navigate('Profile'));

  await waitFor(() => expect(window.location.pathname).toBe('/profile'));

  await act(async () => {
    React.startTransition(() => {
      navigation.resetRoot({
        index: 1,
        routes: [{ name: 'Other' }, { name: 'Settings' }],
      });
    });
  });

  expect(window.location.pathname).toBe('/profile');

  act(() => window.history.back());

  await waitFor(() => expect(navigation.getCurrentRoute()?.name).toBe('Home'));

  expect(window.location.pathname).toBe('/');

  await act(async () => {
    resolve();

    await promise;
  });

  expect(navigation.getCurrentRoute()?.name).toBe('Home');
});

test('returns to the previous screen on browser back while resetting screens in the same navigator suspends', async () => {
  const Stack = createStackNavigator();

  const linking = {
    config: {
      screens: {
        Home: '',
        Profile: 'profile',
        Other: 'other',
        Settings: 'settings',
      },
    },
  };

  const { promise, resolve } = Promise.withResolvers<void>();

  const SettingsScreen = () => {
    React.use(promise);

    return <Text>Settings</Text>;
  };

  const navigation = createNavigationContainerRef<ParamListBase>();

  render(
    <NavigationContainer ref={navigation} linking={linking}>
      <React.Suspense fallback={<Text>Loading</Text>}>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={TestScreen} />
          <Stack.Screen name="Profile" component={TestScreen} />
          <Stack.Screen name="Other" component={TestScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
        </Stack.Navigator>
      </React.Suspense>
    </NavigationContainer>
  );

  await act(async () => navigation.navigate('Profile'));

  await waitFor(() => expect(window.location.pathname).toBe('/profile'));

  const state = navigation.getRootState();

  if (state === undefined) {
    throw new Error('Expected navigation state to be initialized');
  }

  await act(async () => {
    React.startTransition(() => {
      navigation.resetRoot({
        ...state,
        index: 1,
        routes: [
          { key: 'other', name: 'Other' },
          { key: 'settings', name: 'Settings' },
        ],
      });
    });
  });

  expect(window.location.pathname).toBe('/profile');

  act(() => window.history.back());

  await waitFor(() => expect(navigation.getCurrentRoute()?.name).toBe('Home'));

  expect(window.location.pathname).toBe('/');

  await act(async () => {
    resolve();

    await promise;
  });

  expect(navigation.getCurrentRoute()?.name).toBe('Home');
});

test('restores the previous tab on browser back while a tab change suspends', async () => {
  const Tab = createTabNavigator();

  const linking = {
    config: { screens: { Home: '', Profile: 'profile', Settings: 'settings' } },
  };

  const { promise, resolve } = Promise.withResolvers<void>();

  const SettingsScreen = () => {
    const focused = useIsFocused();

    if (focused) {
      React.use(promise);
    }

    return <Text>Settings</Text>;
  };

  const navigation = createNavigationContainerRef<ParamListBase>();

  render(
    <NavigationContainer ref={navigation} linking={linking}>
      <React.Suspense fallback={<Text>Loading</Text>}>
        <Tab.Navigator backBehavior="history">
          <Tab.Screen name="Home" component={TestScreen} />
          <Tab.Screen name="Profile" component={TestScreen} />
          <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
      </React.Suspense>
    </NavigationContainer>
  );

  await act(async () => navigation.navigate('Profile'));

  await waitFor(() => expect(window.location.pathname).toBe('/profile'));

  await act(async () => navigation.navigate('Settings'));

  expect(window.location.pathname).toBe('/profile');

  act(() => window.history.back());

  await waitFor(() => expect(navigation.getCurrentRoute()?.name).toBe('Home'));

  expect(window.location.pathname).toBe('/');

  await act(async () => {
    resolve();

    await promise;
  });

  expect(navigation.getCurrentRoute()?.name).toBe('Home');
});

test('restores previous params on browser back while another screen suspends', async () => {
  const Stack = createStackNavigator();

  const linking = {
    config: {
      screens: { Home: '', Profile: 'profile/:user', Settings: 'settings' },
    },
  };

  const { promise, resolve } = Promise.withResolvers<void>();

  const SettingsScreen = () => {
    React.use(promise);

    return <Text>Settings</Text>;
  };

  const navigation = createNavigationContainerRef<ParamListBase>();

  render(
    <NavigationContainer ref={navigation} linking={linking}>
      <React.Suspense fallback={<Text>Loading</Text>}>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={TestScreen} />
          <Stack.Screen name="Profile" component={TestScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
        </Stack.Navigator>
      </React.Suspense>
    </NavigationContainer>
  );

  await act(async () => navigation.navigate('Profile', { user: 'alice' }));

  await waitFor(() => expect(window.location.pathname).toBe('/profile/alice'));

  const profileKey = navigation.getCurrentRoute()?.key;

  await act(async () =>
    navigation.dispatch(CommonActions.pushParams({ user: 'bob' }))
  );

  await waitFor(() => expect(window.location.pathname).toBe('/profile/bob'));

  await act(async () => navigation.navigate('Settings'));

  expect(window.location.pathname).toBe('/profile/bob');

  act(() => window.history.back());

  await waitFor(() =>
    expect(navigation.getCurrentRoute()?.params).toEqual({ user: 'alice' })
  );

  expect(navigation.getCurrentRoute()?.key).toBe(profileKey);
  expect(window.location.pathname).toBe('/profile/alice');
  expect(navigation.getRootState()?.routes.map((route) => route.name)).toEqual([
    'Home',
    'Profile',
  ]);

  await act(async () => {
    resolve();

    await promise;
  });

  expect(window.location.pathname).toBe('/profile/alice');
});

test('restores previous params on browser back while pushParams suspends', async () => {
  type ParamList = {
    Home: undefined;
    Profile: { user: string };
  };

  const Stack = createStackNavigator<ParamList>();

  const linking = {
    config: { screens: { Home: '', Profile: 'profile/:user' } },
  };

  const { promise, resolve } = Promise.withResolvers<void>();

  const ProfileScreen = ({
    route,
  }: {
    route: RouteProp<ParamList, 'Profile'>;
  }) => {
    if (route.params.user === 'charlie') {
      React.use(promise);
    }

    return <Text>{route.params.user}</Text>;
  };

  const navigation = createNavigationContainerRef<ParamList>();

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

  await act(async () => navigation.navigate('Profile', { user: 'alice' }));

  await waitFor(() => expect(window.location.pathname).toBe('/profile/alice'));

  await act(async () =>
    navigation.dispatch(CommonActions.pushParams({ user: 'bob' }))
  );

  await waitFor(() => expect(window.location.pathname).toBe('/profile/bob'));

  await act(async () =>
    navigation.dispatch(CommonActions.pushParams({ user: 'charlie' }))
  );

  expect(window.location.pathname).toBe('/profile/bob');

  act(() => window.history.back());

  await waitFor(() =>
    expect(navigation.getCurrentRoute()?.params).toEqual({ user: 'alice' })
  );

  expect(window.location.pathname).toBe('/profile/alice');

  await act(async () => {
    resolve();

    await promise;
  });

  expect(navigation.getCurrentRoute()?.params).toEqual({ user: 'alice' });
});

test('preserves updated params on consecutive browser back presses while the first destination is suspended', async () => {
  const Stack = createStackNavigator();

  const linking = {
    config: { screens: { Home: '', Profile: 'profile', Settings: 'settings' } },
  };

  const { promise, resolve } = Promise.withResolvers<void>();

  let suspendProfile = false;

  const ProfileScreen = () => {
    const focused = useIsFocused();

    if (suspendProfile && focused) {
      React.use(promise);
    }

    return <Text>Profile</Text>;
  };

  const navigation = createNavigationContainerRef<ParamListBase>();

  const root = render(
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

  await waitFor(() => expect(window.location.pathname).toBe('/profile'));

  await act(async () => navigation.navigate('Settings'));

  await waitFor(() => expect(window.location.pathname).toBe('/settings'));

  await act(async () =>
    navigation.dispatch({
      ...CommonActions.setParams({ updated: true }),
      source: navigation.getRootState()?.routes[0]?.key,
    })
  );

  suspendProfile = true;

  act(() => window.history.back());

  await waitFor(() =>
    expect(navigation.getCurrentRoute()?.name).toBe('Profile')
  );

  expect(
    root
      .getByText('Settings')
      .closest('[aria-current]')
      ?.getAttribute('aria-current')
  ).toBe('true');

  act(() => window.history.back());

  await waitFor(() => expect(navigation.getCurrentRoute()?.name).toBe('Home'));

  expect(navigation.getCurrentRoute()?.params).toEqual({ updated: true });
  expect(window.location.pathname).toBe('/');
  expect(navigation.getRootState()?.routes).toEqual([
    expect.objectContaining({ name: 'Home' }),
  ]);

  await act(async () => {
    resolve();

    await promise;
  });

  expect(navigation.getCurrentRoute()?.name).toBe('Home');
  expect(navigation.getCurrentRoute()?.params).toEqual({ updated: true });
  expect(window.location.pathname).toBe('/');
});

test('handles browser forward while the back destination is suspended', async () => {
  const Stack = createStackNavigator();

  const linking = {
    config: { screens: { Home: '', Profile: 'profile', Settings: 'settings' } },
  };

  const { promise, resolve } = Promise.withResolvers<void>();

  let suspendProfile = false;

  const ProfileScreen = () => {
    const focused = useIsFocused();

    if (suspendProfile && focused) {
      React.use(promise);
    }

    return <Text>Profile</Text>;
  };

  const navigation = createNavigationContainerRef<ParamListBase>();

  const root = render(
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

  await waitFor(() => expect(window.location.pathname).toBe('/profile'));

  await act(async () => navigation.navigate('Settings'));

  await waitFor(() => expect(window.location.pathname).toBe('/settings'));

  suspendProfile = true;

  act(() => window.history.back());

  await waitFor(() =>
    expect(navigation.getCurrentRoute()?.name).toBe('Profile')
  );

  expect(
    root
      .getByText('Settings')
      .closest('[aria-current]')
      ?.getAttribute('aria-current')
  ).toBe('true');

  act(() => window.history.forward());

  await waitFor(() =>
    expect(navigation.getCurrentRoute()?.name).toBe('Settings')
  );

  expect(window.location.pathname).toBe('/settings');

  await act(async () => {
    resolve();

    await promise;
  });

  expect(navigation.getCurrentRoute()?.name).toBe('Settings');
  expect(window.location.pathname).toBe('/settings');

  act(() => window.history.back());

  await waitFor(() =>
    expect(navigation.getCurrentRoute()?.name).toBe('Profile')
  );

  expect(window.location.pathname).toBe('/profile');

  act(() => window.history.back());

  await waitFor(() => expect(navigation.getCurrentRoute()?.name).toBe('Home'));

  expect(window.location.pathname).toBe('/');
});

test('handles consecutive browser back presses across nested navigators while a destination is suspended', async () => {
  const Stack = createStackNavigator();

  const Child = createStackNavigator();

  const linking = {
    config: {
      screens: {
        Home: '',
        Section: {
          path: 'section',
          screens: { Feed: 'feed', Profile: 'profile' },
        },
      },
    },
  };

  const { promise, resolve } = Promise.withResolvers<void>();

  let suspendFeed = false;

  const FeedScreen = () => {
    const focused = useIsFocused();

    if (suspendFeed && focused) {
      React.use(promise);
    }

    return <Text>Feed</Text>;
  };

  const navigation = createNavigationContainerRef<ParamListBase>();

  const root = render(
    <NavigationContainer ref={navigation} linking={linking}>
      <React.Suspense fallback={<Text>Loading</Text>}>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={TestScreen} />
          <Stack.Screen name="Section">
            {() => (
              <Child.Navigator>
                <Child.Screen name="Feed" component={FeedScreen} />
                <Child.Screen name="Profile" component={TestScreen} />
              </Child.Navigator>
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </React.Suspense>
    </NavigationContainer>
  );

  await act(async () => navigation.navigate('Section'));

  await waitFor(() => expect(window.location.pathname).toBe('/section/feed'));

  await act(async () => navigation.navigate('Profile'));

  await waitFor(() =>
    expect(window.location.pathname).toBe('/section/profile')
  );

  suspendFeed = true;

  act(() => window.history.back());

  await waitFor(() => expect(navigation.getCurrentRoute()?.name).toBe('Feed'));

  expect(
    root
      .getByText('Profile')
      .closest('[aria-current]')
      ?.getAttribute('aria-current')
  ).toBe('true');

  act(() => window.history.back());

  await waitFor(() => expect(navigation.getCurrentRoute()?.name).toBe('Home'));

  expect(window.location.pathname).toBe('/');

  await act(async () => {
    resolve();

    await promise;
  });

  expect(navigation.getCurrentRoute()?.name).toBe('Home');
  expect(window.location.pathname).toBe('/');

  act(() => window.history.forward());

  await waitFor(() => expect(navigation.getCurrentRoute()?.name).toBe('Feed'));

  expect(window.location.pathname).toBe('/section/feed');

  act(() => window.history.forward());

  await waitFor(() =>
    expect(navigation.getCurrentRoute()?.name).toBe('Profile')
  );

  expect(window.location.pathname).toBe('/section/profile');
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

  await waitFor(() => expect(window.location.pathname).toBe('/a'));

  expect(navigation.getCurrentRoute()?.name).toBe('A');

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

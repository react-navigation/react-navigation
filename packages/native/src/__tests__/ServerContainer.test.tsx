import {
  createNavigatorFactory,
  NavigatorScreenParams,
  StackRouter,
  TabRouter,
  useNavigationBuilder,
} from '@react-navigation/core';
import * as React from 'react';
import { renderToString } from 'react-dom/server';

import NavigationContainer from '../NavigationContainer';
import ServerContainer from '../ServerContainer';
import type { ServerContainerRef } from '../types';

// @ts-expect-error: practically window is same as global, so we can ignore the error
global.window = global;

window.addEventListener = () => {};
window.removeEventListener = () => {};

// We want to use the web version of useLinking
// eslint-disable-next-line import/extensions
jest.mock('../useLinking', () => require('../useLinking.tsx').default);

it('renders correct state with location', () => {
  const createStackNavigator = createNavigatorFactory((props: any) => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      StackRouter,
      props
    );

    return (
      <NavigationContent>
        {state.routes.map((route) => (
          <div key={route.key}>{descriptors[route.key].render()}</div>
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

  const element = (
    <NavigationContainer<StackAParamList>
      linking={{
        prefixes: [],
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
  );

  // @ts-expect-error: we don't care about adding all properties on location for the test
  window.location = { pathname: '/jane/edit', search: '' };

  const client = renderToString(element);

  expect(client).toMatchInlineSnapshot(
    `"<div><div>Profile undefined</div><div>Settings {&quot;user&quot;:&quot;jane&quot;}</div></div>"`
  );

  const server = renderToString(
    <ServerContainer location={{ pathname: '/john/updates', search: '' }}>
      {element}
    </ServerContainer>
  );

  expect(server).toMatchInlineSnapshot(
    `"<div><div>Profile undefined</div><div>Updates {&quot;user&quot;:&quot;john&quot;}</div></div>"`
  );
});

it('gets the current options', () => {
  const createTabNavigator = createNavigatorFactory((props: any) => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      TabRouter,
      props
    );

    return (
      <NavigationContent>
        {state.routes.map((route) => (
          <div key={route.key}>{descriptors[route.key].render()}</div>
        ))}
      </NavigationContent>
    );
  });

  const Tab = createTabNavigator();

  const TestScreen = ({ route }: any): any =>
    `${route.name} ${JSON.stringify(route.params)}`;

  const NestedStack = () => {
    return (
      <Tab.Navigator initialRouteName="Feed">
        <Tab.Screen
          name="Profile"
          component={TestScreen}
          options={{ title: 'My profile' }}
        />
        <Tab.Screen
          name="Settings"
          component={TestScreen}
          options={{ title: 'Configure' }}
        />
        <Tab.Screen
          name="Feed"
          component={TestScreen}
          options={{ title: 'News feed' }}
        />
        <Tab.Screen
          name="Updates"
          component={TestScreen}
          options={{ title: 'Updates from cloud', description: 'Woah' }}
        />
      </Tab.Navigator>
    );
  };

  const ref = React.createRef<ServerContainerRef>();

  renderToString(
    <ServerContainer ref={ref}>
      <NavigationContainer
        initialState={{
          routes: [
            {
              name: 'Others',
              state: {
                routes: [{ name: 'Updates' }],
              },
            },
          ],
        }}
      >
        <Tab.Navigator>
          <Tab.Screen
            name="Home"
            component={TestScreen}
            options={{ title: 'My app' }}
          />
          <Tab.Screen
            name="Others"
            component={NestedStack}
            options={{ title: 'Other stuff' }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </ServerContainer>
  );

  expect(ref.current?.getCurrentOptions()).toEqual({
    title: 'Updates from cloud',
    description: 'Woah',
  });
});

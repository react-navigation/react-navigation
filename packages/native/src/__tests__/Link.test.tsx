import { expect, jest, test } from '@jest/globals';
import {
  CommonActions,
  createNavigationContainerRef,
  createNavigatorFactory,
  type NavigatorScreenParams,
  StackActions,
  TabActions,
  TabRouter,
  useNavigationBuilder,
} from '@react-navigation/core';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { Fragment, useMemo } from 'react';
import { Platform, Text } from 'react-native';

import { createStackNavigator } from '../__stubs__/createStackNavigator';
import { Link } from '../Link';
import { NavigationContainer } from '../NavigationContainer';
import { useLinkBuilder } from '../useLinkBuilder';

type RootParamList = { Foo: undefined; Bar: { id: string } };

jest.replaceProperty(Platform, 'OS', 'web');

test('renders link with href on web', async () => {
  const config = {
    config: {
      screens: {
        Foo: 'foo',
        Bar: 'bar/:id',
      },
    },
    getInitialURL() {
      return null;
    },
  };

  const Stack = createStackNavigator<RootParamList>();

  const FooScreen = () => {
    return (
      <Link<any> screen="Bar" params={{ id: '42' }}>
        Go to Bar
      </Link>
    );
  };

  const BarScreen = () => {
    return <Link<any> screen="Foo">Go to Foo</Link>;
  };

  const { toJSON } = await render(
    <NavigationContainer linking={config}>
      <Stack.Navigator>
        <Stack.Screen name="Foo" component={FooScreen} />
        <Stack.Screen name="Bar" component={BarScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  expect(toJSON()).toMatchInlineSnapshot(`
<Text
  href="/bar/42"
  onPress={[Function]}
  role="link"
  style={
    [
      {
        "color": "rgb(0, 122, 255)",
      },
      {
        "fontFamily": "System",
        "fontWeight": "400",
      },
      undefined,
    ]
  }
>
  Go to Bar
</Text>
`);

  const event = {
    defaultPrevented: false,
    preventDefault(this: { defaultPrevented: boolean }) {
      this.defaultPrevented = true;
    },
  };

  await fireEvent.press(screen.getByText('Go to Bar'), event);

  expect(toJSON()).toMatchInlineSnapshot(`
<Text
  href="/foo"
  onPress={[Function]}
  role="link"
  style={
    [
      {
        "color": "rgb(0, 122, 255)",
      },
      {
        "fontFamily": "System",
        "fontWeight": "400",
      },
      undefined,
    ]
  }
>
  Go to Foo
</Text>
`);
});

test("doesn't navigate if default was prevented", async () => {
  const config = {
    config: {
      screens: {
        Foo: 'foo',
        Bar: 'bar/:id',
      },
    },
    getInitialURL() {
      return null;
    },
  };

  const Stack = createStackNavigator<RootParamList>();

  const FooScreen = () => {
    return (
      <Link<any>
        screen="Bar"
        params={{ id: '42' }}
        onPress={(e) => e.preventDefault()}
      >
        Go to Bar
      </Link>
    );
  };

  const BarScreen = () => {
    return <Link<any> screen="Foo">Go to Foo</Link>;
  };

  const { toJSON } = await render(
    <NavigationContainer linking={config}>
      <Stack.Navigator>
        <Stack.Screen name="Foo" component={FooScreen} />
        <Stack.Screen name="Bar" component={BarScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  expect(toJSON()).toMatchInlineSnapshot(`
<Text
  href="/bar/42"
  onPress={[Function]}
  role="link"
  style={
    [
      {
        "color": "rgb(0, 122, 255)",
      },
      {
        "fontFamily": "System",
        "fontWeight": "400",
      },
      undefined,
    ]
  }
>
  Go to Bar
</Text>
`);

  const event = {
    defaultPrevented: false,
    preventDefault(this: { defaultPrevented: boolean }) {
      this.defaultPrevented = true;
    },
  };

  await fireEvent.press(screen.getByText('Go to Bar'), event);

  expect(toJSON()).toMatchInlineSnapshot(`
<Text
  href="/bar/42"
  onPress={[Function]}
  role="link"
  style={
    [
      {
        "color": "rgb(0, 122, 255)",
      },
      {
        "fontFamily": "System",
        "fontWeight": "400",
      },
      undefined,
    ]
  }
>
  Go to Bar
</Text>
`);
});

test.each([
  ['CommonActions.navigate', CommonActions.navigate],
  ['StackActions.push', StackActions.push],
  ['StackActions.replace', StackActions.replace],
  ['StackActions.popTo', StackActions.popTo],
  ['TabActions.jumpTo', TabActions.jumpTo],
])(
  'renders link with href from %s when only action is specified',
  async (_, actionCreator) => {
    const config = {
      config: {
        screens: {
          Foo: 'foo',
          Bar: 'bar/:id',
        },
      },
      getInitialURL() {
        return null;
      },
    };

    const Stack = createStackNavigator<RootParamList>();

    const FooScreen = () => {
      return (
        <Link<any> action={actionCreator('Bar', { id: '42' })}>Go to Bar</Link>
      );
    };

    const BarScreen = () => {
      return <Link<any> screen="Foo">Go to Foo</Link>;
    };

    const { toJSON } = await render(
      <NavigationContainer linking={config}>
        <Stack.Navigator>
          <Stack.Screen name="Foo" component={FooScreen} />
          <Stack.Screen name="Bar" component={BarScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );

    expect(toJSON()).toMatchInlineSnapshot(`
<Text
  href="/bar/42"
  onPress={[Function]}
  role="link"
  style={
    [
      {
        "color": "rgb(0, 122, 255)",
      },
      {
        "fontFamily": "System",
        "fontWeight": "400",
      },
      undefined,
    ]
  }
>
  Go to Bar
</Text>
`);
  }
);

test('does not render link with href from action when no linking config is present', async () => {
  const Stack = createStackNavigator<RootParamList>();

  const FooScreen = () => {
    return (
      <Link<any> action={CommonActions.navigate('Bar', { id: '42' })}>
        Go to Bar
      </Link>
    );
  };

  const BarScreen = () => {
    return <Link<any> screen="Foo">Go to Foo</Link>;
  };

  const { toJSON } = await render(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Foo" component={FooScreen} />
        <Stack.Screen name="Bar" component={BarScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  expect(toJSON()).toMatchInlineSnapshot(`
<Text
  onPress={[Function]}
  role="link"
  style={
    [
      {
        "color": "rgb(0, 122, 255)",
      },
      {
        "fontFamily": "System",
        "fontWeight": "400",
      },
      undefined,
    ]
  }
>
  Go to Bar
</Text>
`);
});

test('does not render link with href from action when screen is not in linking config', async () => {
  const config = {
    config: {
      screens: {
        Foo: 'foo',
      },
    },
    getInitialURL() {
      return null;
    },
  };

  const Stack = createStackNavigator<RootParamList>();

  const FooScreen = () => {
    return (
      <Link<any> action={CommonActions.navigate('Bar', { id: '42' })}>
        Go to Bar
      </Link>
    );
  };

  const BarScreen = () => {
    return <Link<any> screen="Foo">Go to Foo</Link>;
  };

  const { toJSON } = await render(
    <NavigationContainer linking={config}>
      <Stack.Navigator>
        <Stack.Screen name="Foo" component={FooScreen} />
        <Stack.Screen name="Bar" component={BarScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  expect(toJSON()).toMatchInlineSnapshot(`
<Text
  onPress={[Function]}
  role="link"
  style={
    [
      {
        "color": "rgb(0, 122, 255)",
      },
      {
        "fontFamily": "System",
        "fontWeight": "400",
      },
      undefined,
    ]
  }
>
  Go to Bar
</Text>
`);
});

test('navigates to a nested screen again with the same params object', async () => {
  type TabParamList = {
    First: undefined;
    Second: { id: string };
  };

  type ParentParamList = {
    Nested: NavigatorScreenParams<TabParamList>;
  };

  const createTabNavigator = createNavigatorFactory((props: any) => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      TabRouter,
      props
    );

    return (
      <NavigationContent>
        {state.routes.map((route) => (
          <Fragment key={route.key}>
            {descriptors[route.key]?.render()}
          </Fragment>
        ))}
      </NavigationContent>
    );
  });

  const Stack = createStackNavigator<ParentParamList>();
  const Tab = createTabNavigator<TabParamList>();
  const navigation = createNavigationContainerRef<ParentParamList>();
  const params: NavigatorScreenParams<TabParamList> = {
    screen: 'Second',
    params: { id: '42' },
  };

  await render(
    <NavigationContainer ref={navigation}>
      <Stack.Navigator>
        <Stack.Screen name="Nested">
          {() => (
            <Tab.Navigator>
              <Tab.Screen name="First">
                {() => (
                  <Link<ParentParamList> screen="Nested" params={params}>
                    Go to Second
                  </Link>
                )}
              </Tab.Screen>
              <Tab.Screen name="Second">
                {({ navigation }) => (
                  <Text onPress={() => navigation.navigate('First')}>
                    Go to First
                  </Text>
                )}
              </Tab.Screen>
            </Tab.Navigator>
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );

  await fireEvent.press(screen.getByText('Go to Second'));

  expect(navigation.getCurrentRoute()?.name).toBe('Second');

  await fireEvent.press(screen.getByText('Go to First'));

  expect(navigation.getCurrentRoute()?.name).toBe('First');

  await fireEvent.press(screen.getByText('Go to Second'));

  expect(navigation.getCurrentRoute()?.name).toBe('Second');
});

test('navigates to nested state again with the same params object', async () => {
  type TabParamList = {
    First: undefined;
    Second: { id: string };
  };

  type ParentParamList = {
    Nested: NavigatorScreenParams<TabParamList>;
  };

  const createTabNavigator = createNavigatorFactory((props: any) => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      TabRouter,
      props
    );

    return (
      <NavigationContent>
        {state.routes.map((route) => (
          <Fragment key={route.key}>
            {descriptors[route.key]?.render()}
          </Fragment>
        ))}
      </NavigationContent>
    );
  });

  const Stack = createStackNavigator<ParentParamList>();
  const Tab = createTabNavigator<TabParamList>();
  const navigation = createNavigationContainerRef<ParentParamList>();
  const params: NavigatorScreenParams<TabParamList> = {
    state: {
      routes: [{ name: 'Second', params: { id: '42' } }],
    },
  };

  await render(
    <NavigationContainer ref={navigation}>
      <Stack.Navigator>
        <Stack.Screen name="Nested">
          {() => (
            <Tab.Navigator>
              <Tab.Screen name="First">
                {() => (
                  <Link<ParentParamList> screen="Nested" params={params}>
                    Go to Second
                  </Link>
                )}
              </Tab.Screen>
              <Tab.Screen name="Second">
                {({ navigation }) => (
                  <Text onPress={() => navigation.navigate('First')}>
                    Go to First
                  </Text>
                )}
              </Tab.Screen>
            </Tab.Navigator>
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );

  await fireEvent.press(screen.getByText('Go to Second'));

  expect(navigation.getCurrentRoute()?.name).toBe('Second');

  await fireEvent.press(screen.getByText('Go to First'));

  expect(navigation.getCurrentRoute()?.name).toBe('First');

  await fireEvent.press(screen.getByText('Go to Second'));

  expect(navigation.getCurrentRoute()?.name).toBe('Second');
});

test('navigates again with a memoized action built from an href', async () => {
  type TabParamList = {
    First: undefined;
    Second: { id: string };
  };

  type ParentParamList = {
    Nested: NavigatorScreenParams<TabParamList>;
  };

  const createTabNavigator = createNavigatorFactory((props: any) => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      TabRouter,
      props
    );

    return (
      <NavigationContent>
        {state.routes.map((route) => (
          <Fragment key={route.key}>
            {descriptors[route.key]?.render()}
          </Fragment>
        ))}
      </NavigationContent>
    );
  });

  const Stack = createStackNavigator<ParentParamList>();
  const Tab = createTabNavigator<TabParamList>();
  const navigation = createNavigationContainerRef<ParentParamList>();

  const FirstScreen = () => {
    const { buildAction } = useLinkBuilder();
    const action = useMemo(() => buildAction('/second/42'), [buildAction]);

    return (
      <Link action={action} href="/second/42">
        Go to Second from href
      </Link>
    );
  };

  await render(
    <NavigationContainer<ParentParamList>
      ref={navigation}
      linking={{
        config: {
          screens: {
            Nested: {
              path: '',
              screens: {
                First: '',
                Second: 'second/:id',
              },
            },
          },
        },
      }}
    >
      <Stack.Navigator>
        <Stack.Screen name="Nested">
          {() => (
            <Tab.Navigator>
              <Tab.Screen name="First" component={FirstScreen} />
              <Tab.Screen name="Second">
                {({ navigation }) => (
                  <Text onPress={() => navigation.navigate('First')}>
                    Go to First
                  </Text>
                )}
              </Tab.Screen>
            </Tab.Navigator>
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );

  await fireEvent.press(screen.getByText('Go to Second from href'));

  expect(navigation.getCurrentRoute()?.name).toBe('Second');

  await fireEvent.press(screen.getByText('Go to First'));

  expect(navigation.getCurrentRoute()?.name).toBe('First');

  await fireEvent.press(screen.getByText('Go to Second from href'));

  expect(navigation.getCurrentRoute()?.name).toBe('Second');
});

test('navigates through multiple nested screens again with the same params objects', async () => {
  type LeafParamList = {
    LeafFirst: undefined;
    LeafSecond: { id: string };
  };

  type TabParamList = {
    First: undefined;
    Deep: NavigatorScreenParams<LeafParamList>;
  };

  type ParentParamList = {
    Nested: NavigatorScreenParams<TabParamList>;
  };

  const createTabNavigator = createNavigatorFactory((props: any) => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      TabRouter,
      props
    );

    return (
      <NavigationContent>
        {state.routes.map((route) => (
          <Fragment key={route.key}>
            {descriptors[route.key]?.render()}
          </Fragment>
        ))}
      </NavigationContent>
    );
  });

  const Stack = createStackNavigator<ParentParamList>();
  const Tab = createTabNavigator<TabParamList>();
  const Leaf = createTabNavigator<LeafParamList>();
  const navigation = createNavigationContainerRef<ParentParamList>();
  const leafParams: NavigatorScreenParams<LeafParamList> = {
    screen: 'LeafSecond',
    params: { id: '42' },
  };
  const params: NavigatorScreenParams<TabParamList> = {
    screen: 'Deep',
    params: leafParams,
  };

  const FirstScreen = () => (
    <Link<ParentParamList> screen="Nested" params={params}>
      Go to deep second
    </Link>
  );

  await render(
    <NavigationContainer ref={navigation}>
      <Stack.Navigator>
        <Stack.Screen name="Nested">
          {() => (
            <Tab.Navigator>
              <Tab.Screen name="First" component={FirstScreen} />
              <Tab.Screen name="Deep">
                {() => (
                  <Leaf.Navigator>
                    <Leaf.Screen name="LeafFirst">{() => null}</Leaf.Screen>
                    <Leaf.Screen name="LeafSecond">
                      {({ navigation }) => (
                        <Text onPress={() => navigation.navigate('LeafFirst')}>
                          Go to leaf first
                        </Text>
                      )}
                    </Leaf.Screen>
                  </Leaf.Navigator>
                )}
              </Tab.Screen>
            </Tab.Navigator>
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );

  await fireEvent.press(screen.getByText('Go to deep second'));

  expect(navigation.getCurrentRoute()?.name).toBe('LeafSecond');

  await fireEvent.press(screen.getByText('Go to leaf first'));

  expect(navigation.getCurrentRoute()?.name).toBe('LeafFirst');

  await fireEvent.press(screen.getByText('Go to deep second'));

  expect(navigation.getCurrentRoute()?.name).toBe('LeafSecond');
});

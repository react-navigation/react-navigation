import { expect, jest, test } from '@jest/globals';
import {
  CommonActions,
  type NavigatorScreenParams,
  StackActions,
  TabActions,
} from '@react-navigation/core';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { Platform, Text } from 'react-native';

import { createStackNavigator } from '../__stubs__/createStackNavigator';
import { Link } from '../Link';
import { NavigationContainer } from '../NavigationContainer';

type RootParamList = { Foo: undefined; Bar: { id: string } };

jest.replaceProperty(Platform, 'OS', 'web');

const createEvent = () => ({
  defaultPrevented: false,
  preventDefault(this: { defaultPrevented: boolean }) {
    this.defaultPrevented = true;
  },
});

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
      <Link<RootParamList> screen="Bar" params={{ id: '42' }}>
        Go to Bar
      </Link>
    );
  };

  const BarScreen = () => {
    return <Link<RootParamList> screen="Foo">Go to Foo</Link>;
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

  await fireEvent.press(screen.getByText('Go to Bar'), createEvent());

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
      <Link<RootParamList>
        screen="Bar"
        params={{ id: '42' }}
        onPress={(e) => e.preventDefault()}
      >
        Go to Bar
      </Link>
    );
  };

  const BarScreen = () => {
    return <Link<RootParamList> screen="Foo">Go to Foo</Link>;
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
        <Link<RootParamList> action={actionCreator('Bar', { id: '42' })}>
          Go to Bar
        </Link>
      );
    };

    const BarScreen = () => {
      return <Link<RootParamList> screen="Foo">Go to Foo</Link>;
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
      <Link<RootParamList> action={CommonActions.navigate('Bar', { id: '42' })}>
        Go to Bar
      </Link>
    );
  };

  const BarScreen = () => {
    return <Link<RootParamList> screen="Foo">Go to Foo</Link>;
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
      <Link<RootParamList> action={CommonActions.navigate('Bar', { id: '42' })}>
        Go to Bar
      </Link>
    );
  };

  const BarScreen = () => {
    return <Link<RootParamList> screen="Foo">Go to Foo</Link>;
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

test('renders hrefs with in for current, parent, and root navigators', async () => {
  type FeedStackParamList = {
    ArticleList: undefined;
    ArticleDetails: { id: string };
  };

  type HomeTabParamList = {
    Feed: NavigatorScreenParams<FeedStackParamList>;
    Profile: { id: string };
  };

  type RootStackParamList = {
    Home: NavigatorScreenParams<HomeTabParamList>;
    Settings: undefined;
  };

  const RootStack = createStackNavigator<RootStackParamList>();
  const HomeTabs = createStackNavigator<HomeTabParamList>();
  const FeedStack = createStackNavigator<FeedStackParamList>();

  const config = {
    config: {
      screens: {
        Home: {
          path: 'home',
          screens: {
            Feed: {
              path: 'feed',
              screens: {
                ArticleList: 'articles',
                ArticleDetails: 'articles/:id',
              },
            },
            Profile: 'profile/:id',
          },
        },
        Settings: 'settings',
      },
    },
    getInitialURL() {
      return null;
    },
  };

  const ArticleListScreen = () => {
    return (
      <>
        <Link<RootStackParamList>
          in="ArticleList"
          screen="ArticleDetails"
          params={{ id: '1' }}
        >
          Article
        </Link>
        <Link<RootStackParamList>
          in="Feed"
          screen="Profile"
          params={{ id: '2' }}
        >
          Profile
        </Link>
        <Link<RootStackParamList> in="Home" screen="Settings">
          Settings
        </Link>
        <Link<RootStackParamList> screen="Settings">Root Settings</Link>
      </>
    );
  };

  const FeedScreen = () => {
    return (
      <FeedStack.Navigator>
        <FeedStack.Screen name="ArticleList" component={ArticleListScreen} />
        <FeedStack.Screen name="ArticleDetails">
          {() => <>Article Details</>}
        </FeedStack.Screen>
      </FeedStack.Navigator>
    );
  };

  const HomeScreen = () => {
    return (
      <HomeTabs.Navigator>
        <HomeTabs.Screen name="Feed" component={FeedScreen} />
        <HomeTabs.Screen name="Profile">{() => <>Profile</>}</HomeTabs.Screen>
      </HomeTabs.Navigator>
    );
  };

  const { toJSON } = await render(
    <NavigationContainer linking={config}>
      <RootStack.Navigator>
        <RootStack.Screen name="Home" component={HomeScreen} />
        <RootStack.Screen name="Settings">
          {() => <Text>Settings Screen</Text>}
        </RootStack.Screen>
      </RootStack.Navigator>
    </NavigationContainer>
  );

  expect(toJSON()).toMatchInlineSnapshot(`
<>
  <Text
    href="/home/feed/articles/1"
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
    Article
  </Text>
  <Text
    href="/home/profile/2"
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
    Profile
  </Text>
  <Text
    href="/settings"
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
    Settings
  </Text>
  <Text
    href="/settings"
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
    Root Settings
  </Text>
</>
`);
});

test('navigates with in for a root navigator', async () => {
  type RootStackParamList = {
    Home: undefined;
    Settings: undefined;
  };

  const RootStack = createStackNavigator<RootStackParamList>();

  const HomeScreen = () => {
    return (
      <Link<RootStackParamList> in="Home" screen="Settings">
        Settings
      </Link>
    );
  };

  await render(
    <NavigationContainer>
      <RootStack.Navigator>
        <RootStack.Screen name="Home" component={HomeScreen} />
        <RootStack.Screen name="Settings">
          {() => <Text>Settings Screen</Text>}
        </RootStack.Screen>
      </RootStack.Navigator>
    </NavigationContainer>
  );

  await fireEvent.press(screen.getByText('Settings'), createEvent());

  expect(await screen.findByText('Settings Screen')).toBeTruthy();
});

test('navigates to root when in is not specified', async () => {
  type ArticleStackParamList = {
    Article: undefined;
    Settings: undefined;
  };

  type RootStackParamList = {
    Articles: NavigatorScreenParams<ArticleStackParamList>;
    Settings: undefined;
  };

  const RootStack = createStackNavigator<RootStackParamList>();
  const ArticleStack = createStackNavigator<ArticleStackParamList>();

  const ArticleScreen = () => {
    return <Link<RootStackParamList> screen="Settings">Settings</Link>;
  };

  const ArticlesScreen = () => {
    return (
      <ArticleStack.Navigator>
        <ArticleStack.Screen name="Article" component={ArticleScreen} />
        <ArticleStack.Screen name="Settings">
          {() => <Text>Nested Settings Screen</Text>}
        </ArticleStack.Screen>
      </ArticleStack.Navigator>
    );
  };

  await render(
    <NavigationContainer>
      <RootStack.Navigator>
        <RootStack.Screen name="Articles" component={ArticlesScreen} />
        <RootStack.Screen name="Settings">
          {() => <Text>Settings Screen</Text>}
        </RootStack.Screen>
      </RootStack.Navigator>
    </NavigationContainer>
  );

  await fireEvent.press(screen.getByText('Settings'), createEvent());

  expect(await screen.findByText('Settings Screen')).toBeTruthy();
  expect(screen.queryByText('Nested Settings Screen')).toBeNull();
});

test('dispatches custom actions on current navigation when in is not specified', async () => {
  type ArticleStackParamList = {
    Article: undefined;
    Settings: undefined;
  };

  type RootStackParamList = {
    Articles: NavigatorScreenParams<ArticleStackParamList>;
    Settings: undefined;
  };

  const RootStack = createStackNavigator<RootStackParamList>();
  const ArticleStack = createStackNavigator<ArticleStackParamList>();

  const ArticleScreen = () => {
    return (
      <Link<RootStackParamList> action={StackActions.replace('Settings')}>
        Settings
      </Link>
    );
  };

  const ArticlesScreen = () => {
    return (
      <ArticleStack.Navigator>
        <ArticleStack.Screen name="Article" component={ArticleScreen} />
        <ArticleStack.Screen name="Settings">
          {() => <Text>Nested Settings Screen</Text>}
        </ArticleStack.Screen>
      </ArticleStack.Navigator>
    );
  };

  await render(
    <NavigationContainer>
      <RootStack.Navigator>
        <RootStack.Screen name="Articles" component={ArticlesScreen} />
        <RootStack.Screen name="Settings">
          {() => <Text>Root Settings Screen</Text>}
        </RootStack.Screen>
      </RootStack.Navigator>
    </NavigationContainer>
  );

  await fireEvent.press(screen.getByText('Settings'), createEvent());

  expect(await screen.findByText('Nested Settings Screen')).toBeTruthy();
  expect(screen.queryByText('Root Settings Screen')).toBeNull();
});

test('throws when in does not match current or parent screens', async () => {
  type RootStackParamList = {
    Home: undefined;
    Settings: undefined;
  };

  const RootStack = createStackNavigator<RootStackParamList>();

  const HomeScreen = () => {
    return (
      <Link<RootStackParamList>
        // @ts-expect-error Testing runtime error for invalid parent screen.
        in="Missing"
        screen="Settings"
      >
        Settings
      </Link>
    );
  };

  await render(
    <NavigationContainer>
      <RootStack.Navigator>
        <RootStack.Screen name="Home" component={HomeScreen} />
        <RootStack.Screen name="Settings">
          {() => <Text>Settings Screen</Text>}
        </RootStack.Screen>
      </RootStack.Navigator>
    </NavigationContainer>
  );

  const event = {
    defaultPrevented: false,
    preventDefault(this: { defaultPrevented: boolean }) {
      this.defaultPrevented = true;
    },
  };

  await expect(
    fireEvent.press(screen.getByText('Settings'), event)
  ).rejects.toThrow(
    "Couldn't find a navigation object for 'Missing' in current or any parent screens. Is your component inside the correct screen?"
  );
});

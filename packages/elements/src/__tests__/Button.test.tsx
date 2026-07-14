import { expect, jest, test } from '@jest/globals';
import {
  createNavigatorFactory,
  type DefaultNavigatorOptions,
  NavigationContainer,
  type NavigatorScreenParams,
  type NavigatorTypeBagBase,
  type ParamListBase,
  StackActions,
  type StackNavigationState,
  StackRouter,
  useNavigationBuilder,
} from '@react-navigation/native';
import { render, screen, userEvent } from '@testing-library/react-native';
import { Platform, Text } from 'react-native';

import { Button } from '../Button';

jest.replaceProperty(Platform, 'OS', 'web');

jest.mock('../PlatformPressable', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const actual = jest.requireActual<typeof import('../PlatformPressable')>(
    '../PlatformPressable'
  );

  // The hover effect on web renders a `<style>` tag with a text child,
  // which is not supported by the react-native test renderer
  const PlatformPressable = (props: import('../PlatformPressable').Props) =>
    React.createElement(actual.PlatformPressable, {
      ...props,
      hoverEffect: undefined,
    });

  return { PlatformPressable };
});

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

  const route = state.routes[state.index];

  if (route == null) {
    throw new Error(`Couldn't find a route at index ${state.index}.`);
  }

  const descriptor = descriptors[route.key];

  if (descriptor == null) {
    throw new Error(`Couldn't find a descriptor for route '${route.key}'.`);
  }

  return <NavigationContent>{descriptor.render()}</NavigationContent>;
};

interface StubStackTypeBag extends NavigatorTypeBagBase {
  State: StackNavigationState<this['ParamList']>;
  Navigator: typeof StackNavigator;
}

const createStackNavigator =
  createNavigatorFactory<StubStackTypeBag>(StackNavigator);

type NestedStackParamList = {
  ArticleList: undefined;
  ArticleDetails: { id: string };
};

type RootStackParamList = {
  Home: NavigatorScreenParams<NestedStackParamList>;
};

const RootStack = createStackNavigator<RootStackParamList>();
const NestedStack = createStackNavigator<NestedStackParamList>();

const linking = {
  config: {
    screens: {
      Home: {
        path: 'home',
        screens: {
          ArticleList: 'articles',
          ArticleDetails: 'articles/:id',
        },
      },
    },
  },
  getInitialURL() {
    return null;
  },
};

const App = ({ children }: { children: React.ReactNode }) => {
  return (
    <NavigationContainer linking={linking}>
      <RootStack.Navigator>
        <RootStack.Screen name="Home">
          {() => (
            <NestedStack.Navigator>
              <NestedStack.Screen name="ArticleList">
                {() => children}
              </NestedStack.Screen>
              <NestedStack.Screen name="ArticleDetails">
                {() => <Text>Article Details Screen</Text>}
              </NestedStack.Screen>
            </NestedStack.Navigator>
          )}
        </RootStack.Screen>
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

test('calls onPress for a plain button', async () => {
  const user = userEvent.setup();
  const onPress = jest.fn();

  await render(<Button onPress={onPress}>Action</Button>, {
    wrapper: NavigationContainer,
  });

  await user.press(screen.getByRole('button', { name: 'Action' }));

  expect(onPress).toHaveBeenCalledTimes(1);
});

test('dispatches a custom action and calls onPress', async () => {
  const user = userEvent.setup();
  const onPress = jest.fn();

  await render(
    <App>
      <Button
        action={StackActions.push('ArticleDetails', { id: '42' })}
        onPress={onPress}
      >
        Article
      </Button>
    </App>
  );

  await user.press(screen.getByRole('link', { name: 'Article' }));

  expect(onPress).toHaveBeenCalledTimes(1);
  expect(await screen.findByText('Article Details Screen')).toBeOnTheScreen();
});

test('does not call onPress or navigate when disabled', async () => {
  const user = userEvent.setup();
  const onPress = jest.fn();

  await render(
    <App>
      <Button
        action={StackActions.push('ArticleDetails', { id: '42' })}
        disabled
        onPress={onPress}
      >
        Article
      </Button>
    </App>
  );

  const button = screen.getByRole('link', { name: 'Article' });

  expect(button).toBeDisabled();

  await user.press(button);

  expect(onPress).not.toHaveBeenCalled();
  expect(screen.queryByText('Article Details Screen')).not.toBeOnTheScreen();
});

test('does not call onPress or render the icon when loading', async () => {
  const user = userEvent.setup();
  const onPress = jest.fn();

  await render(
    <Button loading icon={() => <Text>Icon</Text>} onPress={onPress}>
      Action
    </Button>,
    { wrapper: NavigationContainer }
  );

  const button = screen.getByRole('button', { name: 'Action' });

  expect(button).toBeDisabled();
  expect(screen.queryByText('Icon')).not.toBeOnTheScreen();

  await user.press(button);

  expect(onPress).not.toHaveBeenCalled();
});

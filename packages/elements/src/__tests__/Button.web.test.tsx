import '@testing-library/jest-dom/jest-globals';

import { expect, test } from '@jest/globals';
import {
  createNavigatorFactory,
  type DefaultNavigatorOptions,
  NavigationContainer,
  type NavigatorScreenParams,
  type NavigatorTypeBagBase,
  type ParamListBase,
  type StackNavigationState,
  StackRouter,
  useNavigationBuilder,
} from '@react-navigation/native';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Button } from '../Button';

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

test('renders an href and navigates within the navigator specified by in', async () => {
  const user = userEvent.setup();

  render(
    <NavigationContainer<RootStackParamList>
      linking={{
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
      }}
    >
      <RootStack.Navigator>
        <RootStack.Screen name="Home">
          {() => (
            <NestedStack.Navigator>
              <NestedStack.Screen name="ArticleList">
                {() => (
                  <Button<RootStackParamList>
                    in="ArticleList"
                    screen="ArticleDetails"
                    params={{ id: '42' }}
                  >
                    Article
                  </Button>
                )}
              </NestedStack.Screen>
              <NestedStack.Screen name="ArticleDetails">
                {() => <span>Article Details Screen</span>}
              </NestedStack.Screen>
            </NestedStack.Navigator>
          )}
        </RootStack.Screen>
      </RootStack.Navigator>
    </NavigationContainer>
  );

  const button = screen.getByRole('link', { name: 'Article' });

  expect(button).toHaveAttribute('href', '/home/articles/42');

  await user.click(button);

  expect(await screen.findByText('Article Details Screen')).toBeInTheDocument();
});

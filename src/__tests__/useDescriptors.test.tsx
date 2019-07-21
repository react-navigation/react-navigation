import * as React from 'react';
import { render, act } from 'react-native-testing-library';
import useNavigationBuilder from '../useNavigationBuilder';
import NavigationContainer from '../NavigationContainer';
import Screen from '../Screen';
import MockRouter from './__fixtures__/MockRouter';

jest.useFakeTimers();

beforeEach(() => (MockRouter.key = 0));

it('sets options with options prop as an object', () => {
  const TestNavigator = (props: any) => {
    const { state, descriptors } = useNavigationBuilder<{ title?: string }>(
      MockRouter,
      props
    );
    const { render, options } = descriptors[state.routes[state.index].key];

    return (
      <main>
        <h1>{options.title}</h1>
        <div>{render()}</div>
      </main>
    );
  };

  const TestScreen = (): any => 'Test screen';

  const root = render(
    <NavigationContainer>
      <TestNavigator>
        <Screen
          name="foo"
          component={TestScreen}
          options={{ title: 'Hello world' }}
        />
        <Screen name="bar" component={jest.fn()} />
      </TestNavigator>
    </NavigationContainer>
  );

  expect(root).toMatchInlineSnapshot(`
            <main>
              <h1>
                Hello world
              </h1>
              <div>
                Test screen
              </div>
            </main>
      `);
});

it('sets options with options prop as a fuction', () => {
  const TestNavigator = (props: any) => {
    const { state, descriptors } = useNavigationBuilder<{ title?: string }>(
      MockRouter,
      props
    );
    const { render, options } = descriptors[state.routes[state.index].key];

    return (
      <main>
        <h1>{options.title}</h1>
        <div>{render()}</div>
      </main>
    );
  };

  const TestScreen = (): any => 'Test screen';

  const root = render(
    <NavigationContainer>
      <TestNavigator>
        <Screen
          name="foo"
          component={TestScreen}
          options={({ route }: any) => ({ title: route.params.author })}
          initialParams={{ author: 'Jane' }}
        />
        <Screen name="bar" component={jest.fn()} />
      </TestNavigator>
    </NavigationContainer>
  );

  expect(root).toMatchInlineSnapshot(`
            <main>
              <h1>
                Jane
              </h1>
              <div>
                Test screen
              </div>
            </main>
      `);
});

it('sets initial options with setOptions', () => {
  const TestNavigator = (props: any) => {
    const { state, descriptors } = useNavigationBuilder<{
      title?: string;
      color?: string;
    }>(MockRouter, props);
    const { render, options } = descriptors[state.routes[state.index].key];

    return (
      <main>
        <h1 color={options.color}>{options.title}</h1>
        <div>{render()}</div>
      </main>
    );
  };

  const TestScreen = ({ navigation }: any): any => {
    navigation.setOptions({
      title: 'Hello world',
    });

    return 'Test screen';
  };

  const root = render(
    <NavigationContainer>
      <TestNavigator>
        <Screen name="foo" options={{ color: 'blue' }}>
          {props => <TestScreen {...props} />}
        </Screen>
        <Screen name="bar" component={jest.fn()} />
      </TestNavigator>
    </NavigationContainer>
  );

  expect(root).toMatchInlineSnapshot(`
        <main>
          <h1
            color="blue"
          >
            Hello world
          </h1>
          <div>
            Test screen
          </div>
        </main>
    `);
});

it('updates options with setOptions', () => {
  const TestNavigator = (props: any) => {
    const { state, descriptors } = useNavigationBuilder<any>(MockRouter, props);
    const { render, options } = descriptors[state.routes[state.index].key];

    return (
      <main>
        <h1 color={options.color}>{options.title}</h1>
        <p>{options.description}</p>
        <caption>{options.author}</caption>
        <div>{render()}</div>
      </main>
    );
  };

  const TestScreen = ({ navigation }: any): any => {
    navigation.setOptions({
      title: 'Hello world',
      description: 'Something here',
    });

    React.useEffect(() => {
      const timer = setTimeout(() =>
        navigation.setOptions({
          title: 'Hello again',
          author: 'Jane',
        })
      );

      return () => clearTimeout(timer);
    });

    return 'Test screen';
  };

  const element = (
    <NavigationContainer>
      <TestNavigator>
        <Screen name="foo" options={{ color: 'blue' }}>
          {props => <TestScreen {...props} />}
        </Screen>
        <Screen name="bar" component={jest.fn()} />
      </TestNavigator>
    </NavigationContainer>
  );

  const root = render(element);

  act(() => jest.runAllTimers());

  root.update(element);

  expect(root).toMatchInlineSnapshot(`
    <main>
      <h1
        color="blue"
      >
        Hello again
      </h1>
      <p>
        Something here
      </p>
      <caption>
        Jane
      </caption>
      <div>
        Test screen
      </div>
    </main>
  `);
});

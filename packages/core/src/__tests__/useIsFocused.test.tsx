import { beforeEach, expect, test } from '@jest/globals';
import { type ParamListBase } from '@react-navigation/routers';
import { act, render } from '@testing-library/react-native';
import * as React from 'react';
import { Text } from 'react-native';

import { BaseNavigationContainer } from '../BaseNavigationContainer';
import { createNavigationContainerRef } from '../createNavigationContainerRef';
import { Screen } from '../Screen';
import { useIsFocused } from '../useIsFocused';
import { useNavigationBuilder } from '../useNavigationBuilder';
import { useRoute } from '../useRoute';
import { MockRouter, MockRouterKey } from './__fixtures__/MockRouter';

beforeEach(() => {
  MockRouterKey.current = 0;
});

test('renders correct focus state', async () => {
  const TestNavigator = (props: any): any => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      MockRouter,
      props
    );

    return (
      <NavigationContent>
        {state.routes.map((route) => descriptors[route.key]?.render())}
      </NavigationContent>
    );
  };

  const Test = () => {
    const isFocused = useIsFocused();

    return <Text>{isFocused ? 'focused' : 'unfocused'}</Text>;
  };

  const navigation = React.createRef<any>();

  const root = await render(
    <BaseNavigationContainer ref={navigation}>
      <TestNavigator>
        <Screen name="first">{() => null}</Screen>
        <Screen name="second" component={Test} />
        <Screen name="third">{() => null}</Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  expect(root).toMatchInlineSnapshot(`
<Text>
  unfocused
</Text>
`);

  await act(() => navigation.current.navigate('second'));

  expect(root).toMatchInlineSnapshot(`
<Text>
  focused
</Text>
`);

  await act(() => navigation.current.navigate('third'));

  expect(root).toMatchInlineSnapshot(`
<Text>
  unfocused
</Text>
`);

  await act(() => navigation.current.navigate('second'));

  expect(root).toMatchInlineSnapshot(`
<Text>
  focused
</Text>
`);
});

test('returns correct focus state after conditional rendering', async () => {
  const TestNavigator = (props: any): any => {
    const { state, descriptors, NavigationContent } = useNavigationBuilder(
      MockRouter,
      props
    );

    const route = state.routes[state.index];

    if (route == null) {
      return null;
    }

    return (
      <NavigationContent>{descriptors[route.key]?.render()}</NavigationContent>
    );
  };

  const TestScreen = () => {
    const route = useRoute();
    const isFocused = useIsFocused();

    // Ensure that there is no tearing
    expect(isFocused).toBe(true);

    return (
      <Text>{`${route.name}, ${isFocused ? 'focused' : 'not-focused'}`}</Text>
    );
  };

  const navigation = createNavigationContainerRef<ParamListBase>();

  let update: (condition: boolean) => void;

  const Test = () => {
    const [condition, setCondition] = React.useState(false);

    update = setCondition;

    return (
      <BaseNavigationContainer ref={navigation}>
        <TestNavigator>
          {condition ? (
            <Screen name="bar" component={TestScreen} />
          ) : (
            <Screen name="foo" component={TestScreen} />
          )}
        </TestNavigator>
      </BaseNavigationContainer>
    );
  };

  const element = await render(<Test />);

  expect(element).toMatchInlineSnapshot(`
<Text>
  foo, focused
</Text>
`);

  await act(() => update(true));

  expect(element).toMatchInlineSnapshot(`
<Text>
  bar, focused
</Text>
`);
});

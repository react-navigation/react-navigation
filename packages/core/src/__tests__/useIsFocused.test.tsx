import * as React from 'react';
import { render, act } from 'react-native-testing-library';
import useNavigationBuilder from '../useNavigationBuilder';
import useIsFocused from '../useIsFocused';
import BaseNavigationContainer from '../BaseNavigationContainer';
import Screen from '../Screen';
import MockRouter from './__fixtures__/MockRouter';

it('renders correct focus state', () => {
  const TestNavigator = (props: any): any => {
    const { state, descriptors } = useNavigationBuilder(MockRouter, props);

    return state.routes.map((route) => descriptors[route.key].render());
  };

  const Test = () => {
    const isFocused = useIsFocused();

    return (
      <React.Fragment>{isFocused ? 'focused' : 'unfocused'}</React.Fragment>
    );
  };

  const navigation = React.createRef<any>();

  const root = render(
    <BaseNavigationContainer ref={navigation}>
      <TestNavigator>
        <Screen name="first">{() => null}</Screen>
        <Screen name="second" component={Test} />
        <Screen name="third">{() => null}</Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  expect(root).toMatchInlineSnapshot(`"unfocused"`);

  act(() => navigation.current.navigate('second'));

  expect(root).toMatchInlineSnapshot(`"focused"`);

  act(() => navigation.current.navigate('third'));

  expect(root).toMatchInlineSnapshot(`"unfocused"`);

  act(() => navigation.current.navigate('second'));

  expect(root).toMatchInlineSnapshot(`"focused"`);
});

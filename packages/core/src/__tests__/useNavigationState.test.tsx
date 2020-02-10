import * as React from 'react';
import { render, act } from 'react-native-testing-library';
import { NavigationState } from '@react-navigation/routers';
import useNavigationBuilder from '../useNavigationBuilder';
import useNavigationState from '../useNavigationState';
import BaseNavigationContainer from '../BaseNavigationContainer';
import Screen from '../Screen';
import MockRouter from './__fixtures__/MockRouter';

it('gets the current navigation state', () => {
  const TestNavigator = (props: any): any => {
    const { state, descriptors } = useNavigationBuilder(MockRouter, props);

    return state.routes.map(route => descriptors[route.key].render());
  };

  const callback = jest.fn();

  const Test = () => {
    const state = useNavigationState(state => state);

    callback(state);

    return null;
  };

  const navigation = React.createRef<any>();

  const element = (
    <BaseNavigationContainer ref={navigation}>
      <TestNavigator>
        <Screen name="first" component={Test} />
        <Screen name="second">{() => null}</Screen>
        <Screen name="third">{() => null}</Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  render(element);

  expect(callback).toBeCalledTimes(1);
  expect(callback.mock.calls[0][0].index).toBe(0);

  act(() => navigation.current.navigate('second'));

  expect(callback).toBeCalledTimes(2);
  expect(callback.mock.calls[1][0].index).toBe(1);

  act(() => navigation.current.navigate('third'));

  expect(callback).toBeCalledTimes(3);
  expect(callback.mock.calls[2][0].index).toBe(2);

  act(() => navigation.current.navigate('second', { answer: 42 }));

  expect(callback).toBeCalledTimes(4);
  expect(callback.mock.calls[3][0].index).toBe(1);
  expect(callback.mock.calls[3][0].routes[1].params).toEqual({ answer: 42 });
});

it('gets the current navigation state with selector', () => {
  const TestNavigator = (props: any): any => {
    const { state, descriptors } = useNavigationBuilder(MockRouter, props);

    return state.routes.map(route => descriptors[route.key].render());
  };

  const callback = jest.fn();

  const Test = () => {
    const index = useNavigationState(state => state.index);

    callback(index);

    return null;
  };

  const navigation = React.createRef<any>();

  const element = (
    <BaseNavigationContainer ref={navigation}>
      <TestNavigator>
        <Screen name="first" component={Test} />
        <Screen name="second">{() => null}</Screen>
        <Screen name="third">{() => null}</Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  render(element);

  expect(callback).toBeCalledTimes(1);
  expect(callback.mock.calls[0][0]).toBe(0);

  act(() => navigation.current.navigate('second'));

  expect(callback).toBeCalledTimes(2);
  expect(callback.mock.calls[1][0]).toBe(1);

  act(() => navigation.current.navigate('third'));

  expect(callback).toBeCalledTimes(3);
  expect(callback.mock.calls[1][0]).toBe(1);

  act(() => navigation.current.navigate('second'));

  expect(callback).toBeCalledTimes(4);
  expect(callback.mock.calls[3][0]).toBe(1);
});

it('gets the correct value if selector changes', () => {
  const TestNavigator = (props: any): any => {
    const { state, descriptors } = useNavigationBuilder(MockRouter, props);

    return state.routes.map(route => descriptors[route.key].render());
  };

  const callback = jest.fn();

  const SelectorContext = React.createContext<any>(null);

  const Test = () => {
    const selector = React.useContext(SelectorContext);
    const result = useNavigationState(selector);

    callback(result);

    return null;
  };

  const navigation = React.createRef<any>();

  const App = ({ selector }: { selector: (state: NavigationState) => any }) => {
    return (
      <SelectorContext.Provider value={selector}>
        <BaseNavigationContainer ref={navigation}>
          <TestNavigator>
            <Screen name="first" component={Test} />
            <Screen name="second">{() => null}</Screen>
            <Screen name="third">{() => null}</Screen>
          </TestNavigator>
        </BaseNavigationContainer>
      </SelectorContext.Provider>
    );
  };

  const root = render(<App selector={state => state.index} />);

  expect(callback).toBeCalledTimes(1);
  expect(callback.mock.calls[0][0]).toBe(0);

  root.update(<App selector={state => state.routes[state.index].name} />);

  expect(callback).toBeCalledTimes(2);
  expect(callback.mock.calls[1][0]).toBe('first');
});

import * as React from 'react';
import { render, act } from 'react-native-testing-library';
import useNavigationBuilder from '../useNavigationBuilder';
import useFocusEffect from '../useFocusEffect';
import BaseNavigationContainer from '../BaseNavigationContainer';
import Screen from '../Screen';
import MockRouter from './__fixtures__/MockRouter';

it('runs focus effect on focus change', () => {
  const TestNavigator = (props: any): any => {
    const { state, descriptors } = useNavigationBuilder(MockRouter, props);

    return state.routes.map(route => descriptors[route.key].render());
  };

  const focusEffect = jest.fn();
  const focusEffectCleanup = jest.fn();

  const Test = () => {
    const onFocus = React.useCallback(() => {
      focusEffect();

      return focusEffectCleanup;
    }, []);

    useFocusEffect(onFocus);

    return null;
  };

  const navigation = React.createRef<any>();

  const element = (
    <BaseNavigationContainer ref={navigation}>
      <TestNavigator>
        <Screen name="first">{() => null}</Screen>
        <Screen name="second" component={Test} />
        <Screen name="third">{() => null}</Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  render(element);

  expect(focusEffect).not.toBeCalled();
  expect(focusEffectCleanup).not.toBeCalled();

  act(() => navigation.current.navigate('second'));

  expect(focusEffect).toBeCalledTimes(1);
  expect(focusEffectCleanup).not.toBeCalled();

  act(() => navigation.current.navigate('third'));

  expect(focusEffect).toBeCalledTimes(1);
  expect(focusEffectCleanup).toBeCalledTimes(1);

  act(() => navigation.current.navigate('second'));

  expect(focusEffect).toBeCalledTimes(2);
  expect(focusEffectCleanup).toBeCalledTimes(1);
});

it('runs focus effect on deps change', () => {
  const TestNavigator = (props: any): any => {
    const { state, descriptors } = useNavigationBuilder(MockRouter, props);

    return descriptors[state.routes[state.index].key].render();
  };

  const focusEffect = jest.fn();
  const focusEffectCleanup = jest.fn();

  const Test = ({ count }: { count: number }) => {
    const onFocus = React.useCallback(() => {
      focusEffect(count);

      return focusEffectCleanup;
    }, [count]);

    useFocusEffect(onFocus);

    return null;
  };

  const App = ({ count }: { count: number }) => (
    <BaseNavigationContainer>
      <TestNavigator>
        <Screen name="first">{() => <Test count={count} />}</Screen>
        <Screen name="second">{() => null}</Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  const root = render(<App count={1} />);

  expect(focusEffect).toBeCalledTimes(1);
  expect(focusEffectCleanup).not.toBeCalled();

  root.update(<App count={2} />);

  expect(focusEffectCleanup).toBeCalledTimes(1);
  expect(focusEffect).toBeCalledTimes(2);
});

it('runs focus effect when initial state is given', () => {
  const TestNavigator = (props: any): any => {
    const { state, descriptors } = useNavigationBuilder(MockRouter, props);

    return state.routes.map(route => descriptors[route.key].render());
  };

  const focusEffect = jest.fn();
  const focusEffectCleanup = jest.fn();

  const Test = () => {
    useFocusEffect(() => {
      focusEffect();

      return focusEffectCleanup;
    });

    return null;
  };

  const initialState = {
    index: 2,
    routes: [
      { key: 'first', name: 'first' },
      { key: 'second', name: 'second' },
      { key: 'third', name: 'third' },
    ],
  };

  const navigation = React.createRef<any>();

  const element = (
    <BaseNavigationContainer ref={navigation} initialState={initialState}>
      <TestNavigator>
        <Screen name="first">{() => null}</Screen>
        <Screen name="second">{() => null}</Screen>
        <Screen name="third" component={Test} />
      </TestNavigator>
    </BaseNavigationContainer>
  );

  render(element);

  expect(focusEffect).toBeCalledTimes(1);
  expect(focusEffectCleanup).not.toBeCalled();

  act(() => navigation.current.navigate('first'));

  expect(focusEffect).toBeCalledTimes(1);
  expect(focusEffectCleanup).toBeCalledTimes(1);
});

it('runs focus effect when only focused route is rendered', () => {
  const TestNavigator = (props: any): any => {
    const { state, descriptors } = useNavigationBuilder(MockRouter, props);

    return descriptors[state.routes[state.index].key].render();
  };

  const focusEffect = jest.fn();
  const focusEffectCleanup = jest.fn();

  const Test = () => {
    useFocusEffect(() => {
      focusEffect();

      return focusEffectCleanup;
    });

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

  expect(focusEffect).toBeCalledTimes(1);
  expect(focusEffectCleanup).not.toBeCalled();

  act(() => navigation.current.navigate('second'));

  expect(focusEffect).toBeCalledTimes(1);
  expect(focusEffectCleanup).toBeCalledTimes(1);
});

it('runs cleanup when component is unmounted', () => {
  const TestNavigator = (props: any): any => {
    const { state, descriptors } = useNavigationBuilder(MockRouter, props);

    return descriptors[state.routes[state.index].key].render();
  };

  const focusEffect = jest.fn();
  const focusEffectCleanup = jest.fn();

  const TestA = () => {
    useFocusEffect(() => {
      focusEffect();

      return focusEffectCleanup;
    });

    return null;
  };

  const TestB = () => null;

  const App = ({ mounted }: { mounted: boolean }) => (
    <BaseNavigationContainer>
      <TestNavigator>
        <Screen name="first" component={mounted ? TestA : TestB} />
        <Screen name="second">{() => null}</Screen>
      </TestNavigator>
    </BaseNavigationContainer>
  );

  const root = render(<App mounted />);

  expect(focusEffect).toBeCalledTimes(1);
  expect(focusEffectCleanup).not.toBeCalled();

  root.update(<App mounted={false} />);

  expect(focusEffect).toBeCalledTimes(1);
  expect(focusEffectCleanup).toBeCalledTimes(1);
});

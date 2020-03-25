import * as React from 'react';
import { render, act } from 'react-native-testing-library';
import { navigate } from '../NavigationActions';
import TabRouter from '../routers/TabRouter';
import createNavigator from '../navigators/createNavigator';
import createNavigationContainer from '../__fixtures__/createNavigationContainer';

it('fires focus and blur events in root navigator', async () => {
  function createTestNavigator(routeConfigMap, config = {}) {
    const router = TabRouter(routeConfigMap, config);

    return createNavigator(
      ({ descriptors, navigation }) =>
        navigation.state.routes.map((route) => {
          const Comp = descriptors[route.key].getComponent();
          return (
            <Comp
              key={route.key}
              navigation={descriptors[route.key].navigation}
            />
          );
        }),
      router,
      config
    );
  }

  const firstFocusCallback = jest.fn();
  const firstBlurCallback = jest.fn();

  const secondFocusCallback = jest.fn();
  const secondBlurCallback = jest.fn();

  const thirdFocusCallback = jest.fn();
  const thirdBlurCallback = jest.fn();

  const fourthFocusCallback = jest.fn();
  const fourthBlurCallback = jest.fn();

  const createComponent = (focusCallback, blurCallback) =>
    class TestComponent extends React.Component {
      componentDidMount() {
        const { navigation } = this.props;

        this.focusSub = navigation.addListener('willFocus', focusCallback);
        this.blurSub = navigation.addListener('willBlur', blurCallback);
      }

      componentWillUnmount() {
        this.focusSub?.remove();
        this.blurSub?.remove();
      }

      render() {
        return null;
      }
    };

  const navigation = React.createRef();

  const Navigator = createNavigationContainer(
    createTestNavigator({
      first: createComponent(firstFocusCallback, firstBlurCallback),
      second: createComponent(secondFocusCallback, secondBlurCallback),
      third: createComponent(thirdFocusCallback, thirdBlurCallback),
      fourth: createComponent(fourthFocusCallback, fourthBlurCallback),
    })
  );

  const element = <Navigator ref={navigation} />;

  render(element);

  expect(firstFocusCallback).toBeCalledTimes(1);
  expect(firstBlurCallback).toBeCalledTimes(0);
  expect(secondFocusCallback).toBeCalledTimes(0);
  expect(secondBlurCallback).toBeCalledTimes(0);
  expect(thirdFocusCallback).toBeCalledTimes(0);
  expect(thirdBlurCallback).toBeCalledTimes(0);
  expect(fourthFocusCallback).toBeCalledTimes(0);
  expect(fourthBlurCallback).toBeCalledTimes(0);

  act(() => {
    navigation.current.dispatch(navigate({ routeName: 'second' }));
  });

  expect(firstBlurCallback).toBeCalledTimes(1);
  expect(secondFocusCallback).toBeCalledTimes(1);

  act(() => {
    navigation.current.dispatch(navigate({ routeName: 'fourth' }));
  });

  expect(firstFocusCallback).toBeCalledTimes(1);
  expect(firstBlurCallback).toBeCalledTimes(1);
  expect(secondFocusCallback).toBeCalledTimes(1);
  expect(secondBlurCallback).toBeCalledTimes(1);
  expect(thirdFocusCallback).toBeCalledTimes(0);
  expect(thirdBlurCallback).toBeCalledTimes(0);
  expect(fourthFocusCallback).toBeCalledTimes(1);
  expect(fourthBlurCallback).toBeCalledTimes(0);
});

it('fires focus and blur events in nested navigator', () => {
  function createTestNavigator(routeConfigMap, config = {}) {
    const router = TabRouter(routeConfigMap, config);

    return createNavigator(
      ({ descriptors, navigation }) =>
        navigation.state.routes.map((route) => {
          const Comp = descriptors[route.key].getComponent();
          return (
            <Comp
              key={route.key}
              navigation={descriptors[route.key].navigation}
            />
          );
        }),
      router,
      config
    );
  }

  const firstFocusCallback = jest.fn();
  const firstBlurCallback = jest.fn();

  const secondFocusCallback = jest.fn();
  const secondBlurCallback = jest.fn();

  const thirdFocusCallback = jest.fn();
  const thirdBlurCallback = jest.fn();

  const fourthFocusCallback = jest.fn();
  const fourthBlurCallback = jest.fn();

  const createComponent = (focusCallback, blurCallback) =>
    class TestComponent extends React.Component {
      componentDidMount() {
        const { navigation } = this.props;

        this.focusSub = navigation.addListener('willFocus', focusCallback);
        this.blurSub = navigation.addListener('willBlur', blurCallback);
      }

      componentWillUnmount() {
        this.focusSub?.remove();
        this.blurSub?.remove();
      }

      render() {
        return null;
      }
    };

  const Navigator = createNavigationContainer(
    createTestNavigator({
      first: createComponent(firstFocusCallback, firstBlurCallback),
      second: createComponent(secondFocusCallback, secondBlurCallback),
      nested: createTestNavigator({
        third: createComponent(thirdFocusCallback, thirdBlurCallback),
        fourth: createComponent(fourthFocusCallback, fourthBlurCallback),
      }),
    })
  );

  const navigation = React.createRef();

  const element = <Navigator ref={navigation} />;

  render(element);

  expect(thirdFocusCallback).toBeCalledTimes(0);
  expect(firstFocusCallback).toBeCalledTimes(1);

  act(() => {
    navigation.current.dispatch(navigate({ routeName: 'nested' }));
  });

  expect(firstFocusCallback).toBeCalledTimes(1);
  expect(fourthFocusCallback).toBeCalledTimes(0);
  expect(thirdFocusCallback).toBeCalledTimes(1);

  act(() => {
    navigation.current.dispatch(navigate({ routeName: 'second' }));
  });

  expect(thirdFocusCallback).toBeCalledTimes(1);
  expect(secondFocusCallback).toBeCalledTimes(1);
  expect(fourthBlurCallback).toBeCalledTimes(0);

  act(() => {
    navigation.current.dispatch(navigate({ routeName: 'nested' }));
  });

  expect(firstBlurCallback).toBeCalledTimes(1);
  expect(secondBlurCallback).toBeCalledTimes(1);
  expect(thirdFocusCallback).toBeCalledTimes(2);
  expect(fourthFocusCallback).toBeCalledTimes(0);

  act(() => {
    navigation.current.dispatch(navigate({ routeName: 'third' }));
  });

  expect(fourthBlurCallback).toBeCalledTimes(0);
  expect(thirdFocusCallback).toBeCalledTimes(2);

  act(() => {
    navigation.current.dispatch(navigate({ routeName: 'first' }));
  });

  expect(firstFocusCallback).toBeCalledTimes(2);
  expect(thirdBlurCallback).toBeCalledTimes(2);

  act(() => {
    navigation.current.dispatch(navigate({ routeName: 'fourth' }));
  });

  expect(fourthFocusCallback).toBeCalledTimes(1);
  expect(thirdBlurCallback).toBeCalledTimes(2);
  expect(firstBlurCallback).toBeCalledTimes(2);

  act(() => {
    navigation.current.dispatch(navigate({ routeName: 'third' }));
  });

  expect(thirdFocusCallback).toBeCalledTimes(3);
  expect(fourthBlurCallback).toBeCalledTimes(1);

  // Make sure nothing else has changed
  expect(firstFocusCallback).toBeCalledTimes(2);
  expect(firstBlurCallback).toBeCalledTimes(2);

  expect(secondFocusCallback).toBeCalledTimes(1);
  expect(secondBlurCallback).toBeCalledTimes(1);

  expect(thirdFocusCallback).toBeCalledTimes(3);
  expect(thirdBlurCallback).toBeCalledTimes(2);

  expect(fourthFocusCallback).toBeCalledTimes(1);
  expect(fourthBlurCallback).toBeCalledTimes(1);
});

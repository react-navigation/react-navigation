import React from 'react';

import validateRouteConfigMap from '../validateRouteConfigMap';
import StackRouter from '../StackRouter';

const ListScreen = () => <div />;

const ProfileNavigator = () => <div />;
ProfileNavigator.router = StackRouter({
  list: {
    screen: ListScreen,
  },
});

const ScreenWithForwardRef = React.forwardRef((props, ref) => (
  <div ref={ref} />
));

describe('validateRouteConfigMap', () => {
  test('Fails on empty bare screen', () => {
    const invalidMap = {
      Home: undefined,
    };
    expect(() =>
      validateRouteConfigMap(invalidMap)
    ).toThrowErrorMatchingSnapshot();
  });
  test('Fails on empty config', () => {
    const invalidMap = {};
    expect(() =>
      validateRouteConfigMap(invalidMap)
    ).toThrowErrorMatchingSnapshot();
  });
  test('Fails on bad object', () => {
    const invalidMap = {
      Home: {
        foo: 'bar',
      },
    };
    expect(() =>
      validateRouteConfigMap(invalidMap)
    ).toThrowErrorMatchingSnapshot();
  });
  test('Fails if both screen and getScreen are defined', () => {
    const invalidMap = {
      Home: {
        screen: ListScreen,
        getScreen: () => ListScreen,
      },
    };
    expect(() =>
      validateRouteConfigMap(invalidMap)
    ).toThrowErrorMatchingSnapshot();
  });
  test('Succeeds on a valid config', () => {
    const validMap = {
      Home: {
        screen: ProfileNavigator,
      },
      Chat: ListScreen,
    };
    validateRouteConfigMap(validMap);
  });
  test('Succeeds on React.forwardRef', () => {
    const validMap = {
      Chat: ScreenWithForwardRef,
    };
    validateRouteConfigMap(validMap);
  });
});

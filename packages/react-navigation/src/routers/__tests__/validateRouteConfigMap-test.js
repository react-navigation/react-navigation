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

describe('validateRouteConfigMap', () => {
  test('Fails on empty config', () => {
    const invalidMap = {};
    expect(() => validateRouteConfigMap(invalidMap)).toThrow();
  });
  test('Fails on bad object', () => {
    const invalidMap = {
      Home: {
        foo: 'bar',
      },
    };
    expect(() => validateRouteConfigMap(invalidMap)).toThrow();
  });
  test('Fails if both screen and getScreen are defined', () => {
    const invalidMap = {
      Home: {
        screen: ListScreen,
        getScreen: () => ListScreen,
      },
    };
    expect(() => validateRouteConfigMap(invalidMap)).toThrow();
  });
  test('Succeeds on a valid config', () => {
    const invalidMap = {
      Home: {
        screen: ProfileNavigator,
      },
      Chat: {
        screen: ListScreen,
      },
    };
    validateRouteConfigMap(invalidMap);
  });
});

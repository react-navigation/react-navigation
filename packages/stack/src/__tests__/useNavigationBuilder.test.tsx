import {
  BaseNavigationContainer,
  NavigationContainerRef,
} from '@react-navigation/core';
import { act, render } from '@testing-library/react-native';
import React, { useImperativeHandle } from 'react';

import createStackNavigator from '../navigators/createStackNavigator';

it('should cleanup state of child routes with same name when switching navigators', () => {
  const StackA = createStackNavigator();
  const StackB = createStackNavigator();

  const StackC = createStackNavigator();

  const MockScreen = () => null;

  const appRef = React.createRef<{ toggle: () => void }>();
  function MyAppNavigator() {
    const [isAuthenticated, setIsAuthenticated] = React.useState(true);
    console.log('isAuthenticated', isAuthenticated);

    useImperativeHandle(appRef, () => ({
      toggle: () => setIsAuthenticated((prev) => !prev),
    }));

    if (isAuthenticated) {
      return (
        <StackA.Navigator id="StackA">
          <StackA.Screen name="foo">
            {() => (
              <StackB.Navigator id="StackB">
                <StackB.Screen name="bar" component={MockScreen} />
                <StackB.Screen name="shared" component={MockScreen} />
              </StackB.Navigator>
            )}
          </StackA.Screen>
          <StackA.Screen name="differentScreenA" component={MockScreen} />
        </StackA.Navigator>
      );
    }

    return (
      <StackC.Navigator id="StackC">
        {/* The screen appears to be identical to the first, however… */}
        <StackC.Screen name="foo" component={MockScreen} />
        <StackC.Screen name="differentScreenB" component={MockScreen} />
      </StackC.Navigator>
    );
  }

  const navigationRef = React.createRef<NavigationContainerRef<any>>();
  render(
    <BaseNavigationContainer ref={navigationRef}>
      <MyAppNavigator />
    </BaseNavigationContainer>
  );

  act(() => {
    navigationRef.current?.navigate('foo', {
      screen: 'bar',
    });
  });

  act(() => {
    appRef.current?.toggle();
  });

  const state = navigationRef.current?.getState();
  console.log(state);

  expect(state?.routes).toHaveLength(1);
  expect(state?.routes[0].name).toEqual('foo');
  // The "foo" screen inside the new navigator is just a screen,
  // and has no nested statem, so we expect it to be removed:
  expect(state?.routes[0].state?.routes).toBeUndefined();
});

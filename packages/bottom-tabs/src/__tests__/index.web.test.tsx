import '@testing-library/jest-dom/jest-globals';

import { expect, test } from '@jest/globals';
import { NavigationContainer } from '@react-navigation/native';
import { render, screen } from '@testing-library/react';

import { createBottomTabNavigator } from '../index';

type BottomTabParamList = {
  A: undefined;
  B: undefined;
};

test('tab bars render appropriate hrefs', () => {
  const Tab = createBottomTabNavigator<BottomTabParamList>();

  render(
    <NavigationContainer
      linking={{
        config: {
          path: 'root',
          screens: {
            A: 'first',
            B: 'second',
          },
        },
      }}
    >
      <Tab.Navigator
        implementation="custom"
        screenOptions={{ tabBarButton: ({ href }) => <span>{href}</span> }}
      >
        <Tab.Screen name="A">{() => null}</Tab.Screen>
        <Tab.Screen name="B">{() => null}</Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );

  expect(screen.getByText('/root/first')).toBeInTheDocument();
  expect(screen.getByText('/root/second')).toBeInTheDocument();
});

import { afterEach, beforeEach, expect, jest, test } from '@jest/globals';
import { NavigationContainer } from '@react-navigation/native';
import { render, screen, userEvent } from '@testing-library/react-native';
import * as React from 'react';
import { Button, Text, View } from 'react-native';

import {
  createMaterialTopTabNavigator,
  type MaterialTopTabScreenProps,
} from '../index';

type TopTabParamList = {
  A: undefined;
  B: undefined;
};

jest.mock('react-native-pager-view', () => {
  const React = require('react');
  const { View } = require('react-native');

  return class ViewPager extends React.Component<React.PropsWithChildren<{}>> {
    setPage() {}

    render() {
      return <View>{this.props.children}</View>;
    }
  };
});

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

test('renders a material top tab navigator with screens', async () => {
  const Test = ({
    route,
    navigation,
  }: MaterialTopTabScreenProps<TopTabParamList>) => (
    <View>
      <Text>Screen {route.name}</Text>
      <Button onPress={() => navigation.navigate('A')} title="Go to A" />
      <Button onPress={() => navigation.navigate('B')} title="Go to B" />
    </View>
  );

  const Tab = createMaterialTopTabNavigator<TopTabParamList>();
  const user = userEvent.setup();

  await render(
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="A" component={Test} />
        <Tab.Screen name="B" component={Test} />
      </Tab.Navigator>
    </NavigationContainer>
  );

  expect(screen.getByText('Screen A')).not.toBeNull();
  expect(screen.queryByText('Screen B')).toBeNull();

  await user.press(screen.getByRole('button', { name: 'Go to B' }));

  expect(screen.getByText('Screen B')).not.toBeNull();
});

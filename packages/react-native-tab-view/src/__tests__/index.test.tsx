import { expect, test } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { type GestureResponderEvent, View } from 'react-native';

import { SceneMap, TabView } from '../index';

const FirstRoute = () => (
  <View style={{ flex: 1, backgroundColor: '#ff4081' }} testID={'route1'} />
);

const SecondRoute = () => (
  <View style={{ flex: 1, backgroundColor: '#673ab7' }} testID={'route2'} />
);

const renderScene = SceneMap({
  first: FirstRoute,
  second: SecondRoute,
});

const ComponentWithTabView = () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: 'First' },
    { key: 'second', title: 'Second' },
  ]);

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
    />
  );
};

test('renders using the scene for the initial index', () => {
  const { getByTestId, queryByTestId } = render(<ComponentWithTabView />);

  expect(getByTestId('route1')).toBeTruthy();
  expect(queryByTestId('route2')).toBeNull();
});

test('switches tabs when the tab header for another route is pressed', () => {
  const { getByTestId, getByLabelText } = render(<ComponentWithTabView />);

  expect(getByTestId('route1')).toBeTruthy();

  fireEvent.press(getByLabelText('Second'), {} as GestureResponderEvent);
  expect(getByTestId('route2')).toBeTruthy();
});

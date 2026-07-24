import '@testing-library/jest-dom/jest-globals';

import { expect, jest, test } from '@jest/globals';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { View } from 'react-native';

import { SceneMap, TabView } from '../index';

jest.useFakeTimers();

const FirstRoute = () => <View testID="route1" />;
const SecondRoute = () => <View testID="route2" />;

const renderScene = SceneMap({
  first: FirstRoute,
  second: SecondRoute,
});

const Test = ({
  onTabSelect,
}: {
  onTabSelect?: ((props: { index: number }) => void) | undefined;
}) => {
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
      onTabSelect={onTabSelect}
    />
  );
};

test('renders using the scene for the initial index', () => {
  render(<Test />);

  act(() => jest.runAllTimers());

  expect(screen.getByTestId('route1')).toBeInTheDocument();
  expect(screen.queryByTestId('route2')).not.toBeInTheDocument();
});

test('switches tabs on tab press in the tab bar', async () => {
  const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

  render(<Test />);

  act(() => jest.runAllTimers());

  expect(screen.getByTestId('route1')).toBeInTheDocument();

  await user.click(screen.getByLabelText('Second'));

  act(() => jest.runAllTimers());

  expect(screen.getByTestId('route2')).toBeInTheDocument();
});

test('calls onTabSelect when tab is selected', async () => {
  const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
  const onTabSelect = jest.fn();

  render(<Test onTabSelect={onTabSelect} />);

  act(() => jest.runAllTimers());

  expect(onTabSelect).not.toHaveBeenCalled();

  await user.click(screen.getByLabelText('Second'));

  act(() => jest.runAllTimers());

  expect(onTabSelect).toHaveBeenCalledTimes(1);
  expect(onTabSelect).toHaveBeenCalledWith({ index: 1 });
});

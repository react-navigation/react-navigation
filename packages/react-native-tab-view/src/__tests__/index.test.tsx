import { describe, expect, jest, test } from '@jest/globals';
import { act, render, screen, userEvent } from '@testing-library/react-native';
import * as React from 'react';
import { Text, View } from 'react-native';

import { SceneMap, TabView } from '../index';

jest.useFakeTimers();

jest.mock('react-native-pager-view', () => {
  const React = require('react');
  const { View } = require('react-native');

  return class MockViewPager extends React.Component {
    // eslint-disable-next-line @eslint-react/no-unused-class-component-members
    setPage = (index: number) => {
      if (this.props.onPageSelected) {
        this.props.onPageSelected({
          nativeEvent: { position: index },
        });
      }
    };
    // eslint-disable-next-line @eslint-react/no-unused-class-component-members
    setPageWithoutAnimation = (index: number) => {
      if (this.props.onPageSelected) {
        this.props.onPageSelected({
          nativeEvent: { position: index },
        });
      }
    };
    render() {
      return <View>{this.props.children}</View>;
    }
  };
});

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

const Test = ({
  onTabSelect,
  options,
}: {
  onTabSelect?: ((props: { index: number }) => void) | undefined;
  options?: React.ComponentProps<typeof TabView>['options'] | undefined;
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
      options={options}
    />
  );
};

describe('iOS implementation', () => {
  test('renders using the scene for the initial index', async () => {
    await render(<Test />);

    await act(() => jest.runAllTimers());

    expect(screen.getByTestId('route1')).toBeTruthy();
    expect(screen.queryByTestId('route2')).toBeNull();
  });

  test('switches tabs on tab press in the tab bar', async () => {
    const user = userEvent.setup();

    await render(<Test />);

    await act(() => jest.runAllTimers());

    expect(screen.getByTestId('route1')).toBeTruthy();

    await user.press(screen.getByLabelText('Second'));

    await act(() => jest.runAllTimers());

    expect(screen.getByTestId('route2')).toBeTruthy();
  });

  test('calls onTabSelect when tab is selected', async () => {
    const user = userEvent.setup();
    const onTabSelect = jest.fn();

    await render(<Test onTabSelect={onTabSelect} />);

    await act(() => jest.runAllTimers());

    expect(onTabSelect).not.toHaveBeenCalled();

    await user.press(screen.getByLabelText('Second'));

    await act(() => jest.runAllTimers());

    expect(onTabSelect).toHaveBeenCalledTimes(1);
    expect(onTabSelect).toHaveBeenCalledWith({ index: 1 });
  });
});

describe('badge', () => {
  test('renders a badge from a string or a number', async () => {
    await render(
      <Test
        options={{
          first: { badge: 3 },
          second: { badge: 'new' },
        }}
      />
    );

    await act(() => jest.runAllTimers());

    expect(screen.getByText('3')).toBeTruthy();
    expect(screen.getByText('new')).toBeTruthy();
  });

  test('renders a badge next to an icon', async () => {
    await render(
      <Test options={{ first: { badge: 3, icon: () => <Text>Icon</Text> } }} />
    );

    await act(() => jest.runAllTimers());

    // The icon renders twice, as an active and an inactive copy that cross-fade.
    expect(screen.getAllByText('Icon')).not.toHaveLength(0);
    expect(screen.getByText('3')).toBeTruthy();
  });

  test('renders a badge from a function', async () => {
    await render(
      <Test
        options={{
          first: { badge: () => <Text>Custom badge</Text> },
        }}
      />
    );

    await act(() => jest.runAllTimers());

    expect(screen.getByText('Custom badge')).toBeTruthy();
  });

  test('applies the badge style to the badge', async () => {
    await render(
      <Test
        options={{
          first: { badge: 3, badgeStyle: { backgroundColor: 'tomato' } },
        }}
      />
    );

    await act(() => jest.runAllTimers());

    expect(screen.getByText('3')).toHaveStyle({ backgroundColor: 'tomato' });
  });
});

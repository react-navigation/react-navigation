import { describe, expect, jest, test } from '@jest/globals';
import { act, render, screen, userEvent } from '@testing-library/react-native';
import * as React from 'react';
import { View } from 'react-native';

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

  test('keeps the pager on the controlled index when the parent rejects a change', async () => {
    const user = userEvent.setup();
    const onTabSelect = jest.fn();

    const Pinned = () => {
      const [routes] = React.useState([
        { key: 'first', title: 'First' },
        { key: 'second', title: 'Second' },
      ]);

      // Fully controlled parent: the index is pinned to 0 and requested
      // changes via `onIndexChange` are intentionally not applied.
      return (
        <TabView
          navigationState={{ index: 0, routes }}
          renderScene={renderScene}
          onIndexChange={() => {}}
          onTabSelect={onTabSelect}
        />
      );
    };

    await render(<Pinned />);

    await act(() => jest.runAllTimers());

    await user.press(screen.getByLabelText('Second'));

    await act(() => jest.runAllTimers());

    // Since the parent keeps the index pinned to 0, a controlled TabView must
    // drive the pager back to index 0 instead of leaving it on the pressed tab.
    // `onTabSelect` fires for every settled page, so its last call reflects the
    // page the pager actually ended up on.
    expect(onTabSelect).toHaveBeenLastCalledWith({ index: 0 });
  });
});

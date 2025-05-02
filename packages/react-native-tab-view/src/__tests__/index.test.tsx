import { expect, jest, test } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { type GestureResponderEvent, View } from 'react-native';
import type ViewPager from 'react-native-pager-view';

import { SceneMap, TabView } from '../index';

jest.mock('../Pager', () => {
  return jest.requireActual('../Pager');
});

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

const onTabSelectMock = jest.fn();

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
      onTabSelect={
        onTabSelectMock as React.ComponentProps<
          typeof ViewPager
        >['onPageSelected']
      }
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

test('calls onTabSelect when a tab is selected', () => {
  const { getByLabelText } = render(<ComponentWithTabView />);

  onTabSelectMock.mockReset();

  expect(onTabSelectMock).not.toHaveBeenCalled();

  fireEvent.press(getByLabelText('Second'), {} as GestureResponderEvent);

  expect(onTabSelectMock).toHaveBeenCalledTimes(1);
  expect(onTabSelectMock).toHaveBeenCalledWith(
    expect.objectContaining({
      nativeEvent: expect.objectContaining({
        position: 1,
      }),
    })
  );
});

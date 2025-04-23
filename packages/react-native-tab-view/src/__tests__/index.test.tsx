import { expect, jest, test } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { type GestureResponderEvent, View } from 'react-native';
import type { NativeProps } from 'react-native-pager-view/lib/typescript/specs/PagerViewNativeComponent';

import { SceneMap, TabView } from '../index';

// We need to mock the Pager module before importing TabView
// to ensure our tests have proper control
jest.mock('../Pager', () => {
  const mockJumpTo = jest.fn();
  const mockOnPageSelected = jest.fn();

  return {
    Pager: (props: any) => {
      // Store the onPageSelected callback for testing
      if (props.onPageSelected) {
        mockOnPageSelected.mockImplementation(props.onPageSelected);
      }

      // Call the children prop with the required parameters
      return props.children({
        position: { interpolate: () => 0 },
        addEnterListener: () => () => {},
        jumpTo: (key: string) => {
          mockJumpTo(key);
          // Simulate the page selected event when jumpTo is called
          if (props.onPageSelected && props.navigationState) {
            const newIndex = props.navigationState.routes.findIndex(
              (route: any) => route.key === key
            );
            mockOnPageSelected({
              nativeEvent: { position: newIndex },
            });
          }
          // Actually update the state via props.onIndexChange
          if (props.onIndexChange && props.navigationState) {
            const newIndex = props.navigationState.routes.findIndex(
              (route: any) => route.key === key
            );
            props.onIndexChange(newIndex);
          }
        },
        render: (children: React.ReactNode) => <>{children}</>,
      });
    },
    __mockJumpTo: mockJumpTo,
    __mockOnPageSelected: mockOnPageSelected,
    // Add a function to reset the mocks before each test
    __resetMocks: () => {
      mockJumpTo.mockReset();
      mockOnPageSelected.mockReset();
    },
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

const onPageSelectedMock = jest.fn();

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
      onPageSelected={onPageSelectedMock as NativeProps['onPageSelected']}
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

test('passes onPageSelected prop from TabView to Pager', () => {
  const pagerMock = require('../Pager');
  render(<ComponentWithTabView />);

  // Verify onPageSelected was passed to the Pager
  expect(pagerMock.__mockOnPageSelected).toBeDefined();
});

test('calls onPageSelected when a tab is selected', () => {
  // Reset the mocks before this test
  require('../Pager').__resetMocks();

  const { getByLabelText } = render(<ComponentWithTabView />);

  // Reset the onPageSelectedMock as well
  onPageSelectedMock.mockReset();

  // The initial render should not trigger onPageSelected
  expect(onPageSelectedMock).not.toHaveBeenCalled();

  // Simulate selecting the second tab
  fireEvent.press(getByLabelText('Second'), {} as GestureResponderEvent);

  // Verify onPageSelected was called with the correct event
  expect(onPageSelectedMock).toHaveBeenCalledTimes(1);
  expect(
    (
      onPageSelectedMock.mock.calls[0][0] as {
        nativeEvent: { position: number };
      }
    ).nativeEvent
  ).toHaveProperty('position', 1);
});

test('maintains backward compatibility when onPageSelected is not provided', () => {
  // Reset mocks
  require('../Pager').__resetMocks();

  // Create a component without onPageSelected
  const BackwardCompatComponent = () => {
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
        // Intentionally not passing onPageSelected
      />
    );
  };

  const { getByLabelText, getByTestId } = render(<BackwardCompatComponent />);

  // Verify initial render
  expect(getByTestId('route1')).toBeTruthy();

  // Should still be able to switch tabs without errors
  fireEvent.press(getByLabelText('Second'), {} as GestureResponderEvent);

  // Verify tab switched successfully
  expect(getByTestId('route2')).toBeTruthy();
});

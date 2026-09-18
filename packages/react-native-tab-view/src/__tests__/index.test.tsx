import { describe, expect, jest, test } from '@jest/globals';
import { act, render, screen, userEvent } from '@testing-library/react-native';
import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';

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

describe('badge layout', () => {
  // The view that reports the label layout sets the width of the primary
  // indicator. A badge inside it would stretch the indicator under the badge.
  const find = (node: any, match: (node: any) => boolean): any => {
    if (node == null || typeof node !== 'object') return null;

    if (Array.isArray(node)) {
      for (const child of node) {
        const found = find(child, match);
        if (found) return found;
      }
      return null;
    }

    if (match(node)) {
      return node;
    }

    return find(node.children ?? [], match);
  };

  const findMeasuredLabelView = (tree: any) => {
    // The item view reports a layout too, and it is the only one with a
    // minHeight. The label view is the one that reports a layout inside it.
    const item = find(
      tree,
      (node) =>
        node.props?.onLayout != null &&
        (StyleSheet.flatten(node.props?.style) ?? {}).minHeight != null
    );

    return find(item?.children ?? [], (node) => node.props?.onLayout != null);
  };

  const containsText = (node: any, text: string): boolean => {
    if (node == null || typeof node !== 'object') return false;
    if (Array.isArray(node)) return node.some((c) => containsText(c, text));

    const children = node.children ?? [];

    if (
      children.filter((c: any) => typeof c === 'string').join('') === text &&
      node.type === 'Text'
    ) {
      return true;
    }

    return children.some((c: any) => containsText(c, text));
  };

  test('keeps the badge out of the measured label view', async () => {
    await render(<Test options={{ first: { badge: 3 } }} />);

    await act(() => jest.runAllTimers());

    const measured = findMeasuredLabelView(screen.toJSON());

    expect(measured).not.toBeNull();
    expect(containsText(measured, 'First')).toBe(true);
    expect(containsText(measured, '3')).toBe(false);
    expect(screen.getByText('3')).toBeTruthy();
  });

  test('positions a badge on the icon out of the layout flow', async () => {
    await render(
      <Test options={{ first: { badge: 3, icon: () => <Text>Icon</Text> } }} />
    );

    await act(() => jest.runAllTimers());

    // With an icon, the badge sits on the icon inside the measured view.
    // It must stay absolute, so that it adds no width to the indicator.
    const badge = screen.getByText('3');

    expect(StyleSheet.flatten(badge.parent?.props?.style)?.position).toBe(
      'absolute'
    );
  });

  test('keeps a function badge out of the measured label view', async () => {
    await render(
      <Test options={{ first: { badge: () => <Text>Custom badge</Text> } }} />
    );

    await act(() => jest.runAllTimers());

    const measured = findMeasuredLabelView(screen.toJSON());

    expect(measured).not.toBeNull();
    expect(containsText(measured, 'Custom badge')).toBe(false);
    expect(screen.getByText('Custom badge')).toBeTruthy();
  });
});

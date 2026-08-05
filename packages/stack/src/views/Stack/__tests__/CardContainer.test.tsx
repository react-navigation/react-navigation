import 'react-native-gesture-handler/jestSetup';

import { beforeEach, expect, jest, test } from '@jest/globals';
import { NavigationContainer } from '@react-navigation/native';
import { act, render } from '@testing-library/react-native';
import type { ReactNode, Ref } from 'react';
import { Animated } from 'react-native';

import type { Scene } from '../../../types';
import { CardContainer } from '../CardContainer';

const mockSetInert = jest.fn();

jest.mock('../CardA11yWrapper', () => {
  const React = require('react') as typeof import('react');

  return {
    CardA11yWrapper: React.forwardRef(
      ({ children }: { children: ReactNode }, ref: Ref<unknown>) => {
        React.useImperativeHandle(ref, () => ({ setInert: mockSetInert }));
        return children;
      }
    ),
  };
});

jest.mock('../Card', () => ({
  Card: ({ children }: { children: ReactNode }) => children,
}));

const createScene = (
  next: Animated.AnimatedInterpolation<number> | undefined
) =>
  ({
    route: { key: 'A', name: 'A' },
    descriptor: {
      route: { key: 'A', name: 'A' },
      navigation: {},
      options: {
        animation: 'default',
        cardOverlayEnabled: false,
        gestureEnabled: true,
        headerMode: 'float',
        presentation: 'card',
      },
      render: () => null,
    },
    progress: {
      current: new Animated.Value(1).interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      }),
      next,
    },
  }) as unknown as Scene;

const renderCard = (scene: Scene) => (
  <NavigationContainer>
    <CardContainer
      active
      closing={false}
      detachCurrentScreen
      focused
      gesture={new Animated.Value(1)}
      getFocusedRoute={() => scene.route}
      getPreviousScene={() => undefined}
      hasAbsoluteFloatHeader={false}
      headerHeight={0}
      index={0}
      interpolationIndex={0}
      isNextScreenTransparent={false}
      isParentHeaderShown={false}
      layout={{ height: 640, width: 320 }}
      modal={false}
      onCloseRoute={jest.fn()}
      onGestureCancel={jest.fn()}
      onGestureEnd={jest.fn()}
      onGestureStart={jest.fn()}
      onHeaderHeightChange={jest.fn()}
      onOpenRoute={jest.fn()}
      onTransitionEnd={jest.fn()}
      onTransitionStart={jest.fn()}
      opening={false}
      preloaded={false}
      renderHeader={() => null}
      safeAreaInsetBottom={0}
      safeAreaInsetLeft={0}
      safeAreaInsetRight={0}
      safeAreaInsetTop={0}
      scene={scene}
    />
  </NavigationContainer>
);

beforeEach(() => {
  mockSetInert.mockClear();
});

test('clears inert state when progress for the next screen is removed', () => {
  let listener: ((event: { value: number }) => void) | undefined;
  const next = {
    addListener: jest.fn((callback: (event: { value: number }) => void) => {
      listener = callback;
      return 'listener';
    }),
    removeListener: jest.fn(),
  } as unknown as Animated.AnimatedInterpolation<number>;
  const { rerender } = render(renderCard(createScene(next)));

  act(() => listener?.({ value: 1 }));
  expect(mockSetInert).toHaveBeenLastCalledWith(true);

  rerender(renderCard(createScene(undefined)));
  expect(mockSetInert).toHaveBeenLastCalledWith(false);
});

import 'react-native-gesture-handler/jestSetup';

import { afterEach, expect, jest, test } from '@jest/globals';
import { act, render } from '@testing-library/react-native';
import { Text, View } from 'react-native';

import { Drawer } from '../views/Drawer';

jest.useFakeTimers();

afterEach(() => {
  jest.restoreAllMocks();
});

jest.mock('react-native-worklets', () => {
  const Worklets = require('react-native-worklets/src/mock');

  return {
    ...Worklets,
    // Call immediately so drawer transition callbacks are observable in tests.
    scheduleOnRN: (fun: (...args: unknown[]) => unknown, ...args: unknown[]) =>
      fun(...args),
  };
});

// Keep the real Jest/Reanimated surface (Animated, ReduceMotion, shared values),
// but finish springs immediately so onAnimationEnd is reachable in unit tests.
jest.mock('react-native-reanimated', () => {
  const Reanimated = jest.requireActual<
    typeof import('react-native-reanimated')
  >('react-native-reanimated');

  return {
    __esModule: true,
    ...Reanimated,
    default: Reanimated.default,
    withSpring: (
      toValue: number,
      _config?: unknown,
      callback?: (finished?: boolean) => void
    ) => {
      callback?.(true);
      return toValue;
    },
  };
});

// Use the web GestureHandler stubs so Jest does not pull in RNGH pan validation.
jest.mock('../views/GestureHandler', () =>
  jest.requireActual('../views/GestureHandler.tsx')
);

type HarnessProps = {
  open: boolean;
  onTransitionEnd: jest.Mock;
  onOpen: jest.Mock;
  onClose: jest.Mock;
};

function DrawerHarness({
  open,
  onTransitionEnd,
  onOpen,
  onClose,
}: HarnessProps) {
  return (
    <Drawer
      open={open}
      onOpen={onOpen}
      onClose={onClose}
      onTransitionEnd={onTransitionEnd}
      // Explicit width so open/closed translations differ when Dimensions is 0 in Jest.
      drawerStyle={{ width: 280 }}
      renderDrawerContent={() => (
        <View>
          <Text>Drawer</Text>
        </View>
      )}
    >
      <View>
        <Text>Content</Text>
      </View>
    </Drawer>
  );
}

test('keeps hitSlop in sync when already settled at the open target', async () => {
  const onTransitionEnd = jest.fn();

  // Starts open: toggleDrawer(true) hits the already-at-target path and
  // syncs settledOpen without starting a spring.
  await render(
    <DrawerHarness
      open
      onTransitionEnd={onTransitionEnd}
      onOpen={jest.fn()}
      onClose={jest.fn()}
    />
  );

  expect(onTransitionEnd).not.toHaveBeenCalled();
});

test('updates settled open state after the open spring finishes', async () => {
  const onTransitionEnd = jest.fn();
  const onOpen = jest.fn();
  const onClose = jest.fn();

  const screen = await render(
    <DrawerHarness
      open={false}
      onTransitionEnd={onTransitionEnd}
      onOpen={onOpen}
      onClose={onClose}
    />
  );

  await act(() => {
    screen.rerender(
      <DrawerHarness
        open
        onTransitionEnd={onTransitionEnd}
        onOpen={onOpen}
        onClose={onClose}
      />
    );
  });

  expect(onOpen).toHaveBeenCalled();
  expect(onTransitionEnd).toHaveBeenCalledWith(false);
});

test('updates settled open state after the close spring finishes', async () => {
  const onTransitionEnd = jest.fn();
  const onOpen = jest.fn();
  const onClose = jest.fn();

  const screen = await render(
    <DrawerHarness
      open
      onTransitionEnd={onTransitionEnd}
      onOpen={onOpen}
      onClose={onClose}
    />
  );

  await act(() => {
    screen.rerender(
      <DrawerHarness
        open={false}
        onTransitionEnd={onTransitionEnd}
        onOpen={onOpen}
        onClose={onClose}
      />
    );
  });

  expect(onClose).toHaveBeenCalled();
  expect(onTransitionEnd).toHaveBeenCalledWith(true);
});

import { beforeEach, expect, jest, test } from '@jest/globals';
import { act, render } from '@testing-library/react-native';
import { BackHandler } from 'react-native';

import { useBackButton } from '../useBackButton.native';
import { useDoubleBackToExit } from '../useDoubleBackToExit.native';

const backHandlers: ((() => boolean | void))[] = [];

beforeEach(() => {
  backHandlers.length = 0;
  jest.clearAllMocks();
  jest.spyOn(BackHandler, 'addEventListener').mockImplementation(
    (_event: any, handler: any) => {
      backHandlers.push(handler);
      return {
        remove: () => {
          const index = backHandlers.indexOf(handler);
          if (index !== -1) {
            backHandlers.splice(index, 1);
          }
        },
      } as any;
    }
  );
  jest.spyOn(BackHandler, 'exitApp').mockImplementation(() => {});
});

function pressHardwareBack() {
  for (let i = backHandlers.length - 1; i >= 0; i--) {
    const handled = backHandlers[i]();
    if (handled) {
      return true;
    }
  }
  return false;
}

test('useBackButton: default behavior without doubleBackToExit exits immediately when cannot go back', () => {
  const ref = {
    current: {
      canGoBack: () => false,
      goBack: jest.fn(),
    },
  } as any;

  function Component() {
    useBackButton(ref);
    return null;
  }

  render(<Component />);

  const handled = pressHardwareBack();
  // Returns false so default system exit takes place
  expect(handled).toBe(false);
  expect(ref.current.goBack).not.toHaveBeenCalled();
});

test('useBackButton: pops navigation when canGoBack is true', () => {
  const ref = {
    current: {
      canGoBack: () => true,
      goBack: jest.fn(),
    },
  } as any;

  function Component() {
    useBackButton(ref);
    return null;
  }

  render(<Component />);

  const handled = pressHardwareBack();
  expect(handled).toBe(true);
  expect(ref.current.goBack).toHaveBeenCalledTimes(1);
});

test('useBackButton: doubleBackToExit shows message on first press and exits on second press within timeout', () => {
  jest.useFakeTimers();
  const exitApp = jest.fn();
  const showMessage = jest.fn();

  const ref = {
    current: {
      canGoBack: () => false,
      goBack: jest.fn(),
    },
  } as any;

  function Component() {
    useBackButton(ref, {
      exitApp,
      showMessage,
      timeout: 2000,
    });
    return null;
  }

  render(<Component />);

  // First press at t=0
  const handled1 = pressHardwareBack();
  expect(handled1).toBe(true);
  expect(showMessage).toHaveBeenCalledTimes(1);
  expect(showMessage).toHaveBeenCalledWith('Press back again to exit');
  expect(exitApp).not.toHaveBeenCalled();

  // Second press at t=800ms
  act(() => {
    jest.advanceTimersByTime(800);
  });
  const handled2 = pressHardwareBack();
  expect(handled2).toBe(true);
  expect(exitApp).toHaveBeenCalledTimes(1);

  jest.useRealTimers();
});

test('useBackButton: doubleBackToExit resets timer if more than 2 seconds elapse', () => {
  jest.useFakeTimers();
  const exitApp = jest.fn();
  const showMessage = jest.fn();

  const ref = {
    current: {
      canGoBack: () => false,
      goBack: jest.fn(),
    },
  } as any;

  function Component() {
    useBackButton(ref, {
      exitApp,
      showMessage,
      timeout: 2000,
    });
    return null;
  }

  render(<Component />);

  // First press at t=0
  pressHardwareBack();
  expect(showMessage).toHaveBeenCalledTimes(1);
  expect(exitApp).not.toHaveBeenCalled();

  // Advance time past 2000ms
  act(() => {
    jest.advanceTimersByTime(2500);
  });

  // Second press after 2500ms -> should reset sequence and show prompt again
  pressHardwareBack();
  expect(showMessage).toHaveBeenCalledTimes(2);
  expect(exitApp).not.toHaveBeenCalled();

  // Third press 500ms later -> exits!
  act(() => {
    jest.advanceTimersByTime(500);
  });
  pressHardwareBack();
  expect(exitApp).toHaveBeenCalledTimes(1);

  jest.useRealTimers();
});

test('useDoubleBackToExit standalone hook works with navigation object', () => {
  jest.useFakeTimers();
  const exitApp = jest.fn();
  const showMessage = jest.fn();
  const navigation = { canGoBack: () => false };

  function Component() {
    useDoubleBackToExit(navigation, {
      exitApp,
      showMessage,
      timeout: 2000,
    });
    return null;
  }

  render(<Component />);

  pressHardwareBack();
  expect(showMessage).toHaveBeenCalledTimes(1);
  expect(exitApp).not.toHaveBeenCalled();

  act(() => {
    jest.advanceTimersByTime(500);
  });
  pressHardwareBack();
  expect(exitApp).toHaveBeenCalledTimes(1);

  jest.useRealTimers();
});

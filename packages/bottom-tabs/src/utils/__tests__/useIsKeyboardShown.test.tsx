import { expect, jest, test } from '@jest/globals';
import { act, render } from '@testing-library/react-native';
import { Keyboard, type KeyboardEventName } from 'react-native';

import { useIsKeyboardShown } from '../useIsKeyboardShown';

const mockKeyboardListeners = () => {
  // @ts-expect-error: mock implementation for testing
  const listeners: Record<
    KeyboardEventName,
    Parameters<typeof Keyboard.addListener>[1][]
  > = {
    keyboardWillShow: [],
    keyboardWillHide: [],
    keyboardDidShow: [],
    keyboardDidHide: [],
  };

  const spy = jest
    .spyOn(Keyboard, 'addListener')
    // @ts-expect-error: types require private fields.
    .mockImplementation((name, callback) => {
      listeners[name].push(callback);

      return {
        remove: () => {
          listeners[name] = listeners[name].filter((c) => c !== callback);
        },
      };
    });

  const emit = (names: KeyboardEventName[], event: object) =>
    act(() => {
      names.forEach((name) =>
        // @ts-expect-error: mock event
        listeners[name].forEach((listener) => listener(event))
      );
    });

  return { spy, emit };
};

const renderHook = async () => {
  let current = false;

  const Test = () => {
    current = useIsKeyboardShown();

    return null;
  };

  await render(<Test />);

  return () => current;
};

test('reports a keyboard that has a height', async () => {
  const { spy, emit } = mockKeyboardListeners();
  const isKeyboardShown = await renderHook();

  await emit(['keyboardWillShow', 'keyboardDidShow'], {
    endCoordinates: { height: 336 },
  });

  expect(isKeyboardShown()).toBe(true);

  await emit(['keyboardWillHide', 'keyboardDidHide'], {
    endCoordinates: { height: 0 },
  });

  expect(isKeyboardShown()).toBe(false);

  spy.mockRestore();
});

test('ignores the empty keyboard frame reported on interface rotation', async () => {
  const { spy, emit } = mockKeyboardListeners();
  const isKeyboardShown = await renderHook();

  await emit(['keyboardWillShow', 'keyboardDidShow'], {
    endCoordinates: { height: 0 },
  });

  expect(isKeyboardShown()).toBe(false);

  spy.mockRestore();
});

test('reports a keyboard when the event carries no frame', async () => {
  const { spy, emit } = mockKeyboardListeners();
  const isKeyboardShown = await renderHook();

  await emit(['keyboardWillShow', 'keyboardDidShow'], {});

  expect(isKeyboardShown()).toBe(true);

  spy.mockRestore();
});

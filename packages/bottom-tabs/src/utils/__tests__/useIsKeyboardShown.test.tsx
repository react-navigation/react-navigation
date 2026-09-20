import { expect, jest, test } from '@jest/globals';
import { act, render } from '@testing-library/react-native';
import { Keyboard, type KeyboardEvent } from 'react-native';

import { useIsKeyboardShown } from '../useIsKeyboardShown';

const listeners: Record<string, (e: KeyboardEvent) => void> = {};

jest
  .spyOn(Keyboard, 'addListener')
  .mockImplementation((type: string, listener: (e: KeyboardEvent) => void) => {
    listeners[type] = listener;

    return { remove: () => {} } as ReturnType<typeof Keyboard.addListener>;
  });

const emit = (type: string, height: number) =>
  act(() => {
    listeners[type]?.({ endCoordinates: { height } } as KeyboardEvent);
  });

const renderHook = () => {
  const results: boolean[] = [];

  const Test = () => {
    results.push(useIsKeyboardShown());

    return null;
  };

  render(<Test />);

  return results;
};

test('reports a keyboard that has a height', () => {
  const results = renderHook();

  emit('keyboardWillShow', 336);

  expect(results[results.length - 1]).toBe(true);

  emit('keyboardWillHide', 0);

  expect(results[results.length - 1]).toBe(false);
});

test('ignores the empty keyboard frame reported on interface rotation', () => {
  const results = renderHook();

  emit('keyboardWillShow', 0);

  expect(results[results.length - 1]).toBe(false);
});

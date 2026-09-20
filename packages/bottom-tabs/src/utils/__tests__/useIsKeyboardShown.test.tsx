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

const emit = async (types: string[], height: number) => {
  const listener = types.map((type) => listeners[type]).find(Boolean);

  await act(async () => {
    listener?.({ endCoordinates: { height } } as KeyboardEvent);
  });
};

const show = (height: number) =>
  emit(['keyboardWillShow', 'keyboardDidShow'], height);

const hide = () => emit(['keyboardWillHide', 'keyboardDidHide'], 0);

const renderHook = () => {
  const results: boolean[] = [];

  const Test = () => {
    results.push(useIsKeyboardShown());

    return null;
  };

  render(<Test />);

  return () => results[results.length - 1];
};

test('reports a keyboard that has a height', async () => {
  const current = renderHook();

  await show(336);

  expect(current()).toBe(true);

  await hide();

  expect(current()).toBe(false);
});

test('ignores the empty keyboard frame reported on interface rotation', async () => {
  const current = renderHook();

  await show(0);

  expect(current()).toBe(false);
});

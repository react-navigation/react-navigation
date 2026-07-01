import { describe, expect, jest, test } from '@jest/globals';
import { act, renderHook } from '@testing-library/react-native';
import type { RefObject } from 'react';
import {
  type EmitterSubscription,
  type HostInstance,
  Keyboard,
  type KeyboardEventListener,
  type KeyboardEventName,
  TextInput,
} from 'react-native';

import { useKeyboardManager } from '../useKeyboardManager';

jest.useFakeTimers();

const contentRef = {
  current: null,
} satisfies RefObject<HostInstance | null>;

type Props = {
  enabled: boolean;
  focused: boolean;
  contentRef: RefObject<HostInstance | null>;
};

describe('useKeyboardManager', () => {
  describe('onPageChangeConfirm', () => {
    test('calls onPageChangeCancel when closing is false', async () => {
      const { result } = await renderHook(
        (props: Props) => useKeyboardManager(props),
        { initialProps: { enabled: true, focused: true, contentRef } }
      );

      const blurMock = jest.fn();
      const input = { blur: blurMock } as any;

      jest
        .spyOn(TextInput.State, 'currentlyFocusedInput')
        .mockReturnValue(input);

      await act(() => result.current.onPageChangeStart());
      await act(() =>
        result.current.onPageChangeConfirm({
          gesture: false,
          active: true,
          closing: false,
        })
      );

      expect(blurMock).toHaveBeenCalledTimes(1);
    });

    test('dismisses keyboard when closing without gesture', async () => {
      const dismissSpy = jest.spyOn(Keyboard, 'dismiss');

      const { result } = await renderHook(
        (props: Props) => useKeyboardManager(props),
        { initialProps: { enabled: true, focused: true, contentRef } }
      );

      await act(() =>
        result.current.onPageChangeConfirm({
          gesture: false,
          active: false,
          closing: true,
        })
      );

      expect(dismissSpy).toHaveBeenCalled();

      dismissSpy.mockRestore();
    });

    test('blurs previously focused input when closing with gesture and active', async () => {
      const { result } = await renderHook(
        (props: Props) => useKeyboardManager(props),
        { initialProps: { enabled: true, focused: true, contentRef } }
      );

      const blurMock = jest.fn();
      const input = { blur: blurMock } as any;

      jest
        .spyOn(TextInput.State, 'currentlyFocusedInput')
        .mockReturnValue(input);

      await act(() => result.current.onPageChangeStart());

      blurMock.mockClear();

      await act(() =>
        result.current.onPageChangeConfirm({
          gesture: true,
          active: true,
          closing: true,
        })
      );

      expect(blurMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('useLayoutEffect keyboard dismiss on focus loss', () => {
    test('dismisses keyboard when focused transitions from true to false', async () => {
      const dismissSpy = jest.spyOn(Keyboard, 'dismiss');

      const { rerender } = await renderHook(
        (props: Props) => useKeyboardManager(props),
        { initialProps: { enabled: true, focused: true, contentRef } }
      );

      dismissSpy.mockClear();

      await rerender({ enabled: false, focused: false, contentRef });

      expect(dismissSpy).toHaveBeenCalled();

      dismissSpy.mockRestore();
    });

    test('does not dismiss keyboard when focused stays false', async () => {
      const dismissSpy = jest.spyOn(Keyboard, 'dismiss');

      const { rerender } = await renderHook(
        (props: Props) => useKeyboardManager(props),
        { initialProps: { enabled: false, focused: false, contentRef } }
      );

      dismissSpy.mockClear();

      await rerender({ enabled: false, focused: false, contentRef });

      expect(dismissSpy).not.toHaveBeenCalled();

      dismissSpy.mockRestore();
    });

    test('does not dismiss keyboard when only enabled changes without focus changing', async () => {
      const dismissSpy = jest.spyOn(Keyboard, 'dismiss');

      const { rerender } = await renderHook(
        (props: Props) => useKeyboardManager(props),
        { initialProps: { enabled: true, focused: true, contentRef } }
      );

      dismissSpy.mockClear();

      await rerender({ enabled: false, focused: true, contentRef });

      expect(dismissSpy).not.toHaveBeenCalled();

      dismissSpy.mockRestore();
    });

    test('does not dismiss keyboard when losing focus while disabled', async () => {
      const dismissSpy = jest.spyOn(Keyboard, 'dismiss');

      const { rerender } = await renderHook(
        (props: Props) => useKeyboardManager(props),
        { initialProps: { enabled: false, focused: true, contentRef } }
      );

      dismissSpy.mockClear();

      await rerender({ enabled: false, focused: false, contentRef });

      expect(dismissSpy).not.toHaveBeenCalled();

      dismissSpy.mockRestore();
    });
  });

  describe('input focus on unfocused screen', () => {
    test('blurs focused input in an unfocused screen when keyboard is shown', async () => {
      const listeners: Partial<
        Record<KeyboardEventName, KeyboardEventListener[] | undefined>
      > = {};

      const addListenerSpy = jest
        .spyOn(Keyboard, 'addListener')
        .mockImplementation((name, callback) => {
          listeners[name] = [...(listeners[name] ?? []), callback];

          return {
            remove: () => {
              listeners[name] = listeners[name]?.filter(
                (listener) => listener !== callback
              );
            },
          } as EmitterSubscription;
        });

      const blurMock = jest.fn();
      const input = { blur: blurMock } as unknown as HostInstance;
      const contentRef = {
        current: {
          contains: (node: HostInstance) => node === input,
        } as HostInstance,
      } satisfies RefObject<HostInstance | null>;

      jest
        .spyOn(TextInput.State, 'currentlyFocusedInput')
        .mockReturnValue(input);

      await renderHook((props: Props) => useKeyboardManager(props), {
        initialProps: { enabled: true, focused: false, contentRef },
      });

      await act(() => {
        listeners.keyboardDidShow?.forEach((listener) =>
          listener({} as Parameters<KeyboardEventListener>[0])
        );
      });

      expect(blurMock).toHaveBeenCalledTimes(1);

      addListenerSpy.mockRestore();
    });
  });
});

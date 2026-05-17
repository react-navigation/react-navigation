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
    test('calls onPageChangeCancel when closing is false', () => {
      const { result } = renderHook(
        (props: Props) => useKeyboardManager(props),
        { initialProps: { enabled: true, focused: true, contentRef } }
      );

      const blurMock = jest.fn();
      const input = { blur: blurMock } as any;

      jest
        .spyOn(TextInput.State, 'currentlyFocusedInput')
        .mockReturnValue(input);

      act(() => result.current.onPageChangeStart());
      act(() =>
        result.current.onPageChangeConfirm({
          gesture: false,
          active: true,
          closing: false,
        })
      );

      expect(blurMock).toHaveBeenCalledTimes(1);
    });

    test('dismisses keyboard when closing without gesture', () => {
      const dismissSpy = jest.spyOn(Keyboard, 'dismiss');

      const { result } = renderHook(
        (props: Props) => useKeyboardManager(props),
        { initialProps: { enabled: true, focused: true, contentRef } }
      );

      act(() =>
        result.current.onPageChangeConfirm({
          gesture: false,
          active: false,
          closing: true,
        })
      );

      expect(dismissSpy).toHaveBeenCalled();

      dismissSpy.mockRestore();
    });

    test('blurs previously focused input when closing with gesture and active', () => {
      const { result } = renderHook(
        (props: Props) => useKeyboardManager(props),
        { initialProps: { enabled: true, focused: true, contentRef } }
      );

      const blurMock = jest.fn();
      const input = { blur: blurMock } as any;

      jest
        .spyOn(TextInput.State, 'currentlyFocusedInput')
        .mockReturnValue(input);

      act(() => result.current.onPageChangeStart());

      blurMock.mockClear();

      act(() =>
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
    test('dismisses keyboard when focused transitions from true to false', () => {
      const dismissSpy = jest.spyOn(Keyboard, 'dismiss');

      const { rerender } = renderHook(
        (props: Props) => useKeyboardManager(props),
        { initialProps: { enabled: true, focused: true, contentRef } }
      );

      dismissSpy.mockClear();

      rerender({ enabled: false, focused: false, contentRef });

      expect(dismissSpy).toHaveBeenCalled();

      dismissSpy.mockRestore();
    });

    test('does not dismiss keyboard when focused stays false', () => {
      const dismissSpy = jest.spyOn(Keyboard, 'dismiss');

      const { rerender } = renderHook(
        (props: Props) => useKeyboardManager(props),
        { initialProps: { enabled: false, focused: false, contentRef } }
      );

      dismissSpy.mockClear();

      rerender({ enabled: false, focused: false, contentRef });

      expect(dismissSpy).not.toHaveBeenCalled();

      dismissSpy.mockRestore();
    });

    test('does not dismiss keyboard when only enabled changes without focus changing', () => {
      const dismissSpy = jest.spyOn(Keyboard, 'dismiss');

      const { rerender } = renderHook(
        (props: Props) => useKeyboardManager(props),
        { initialProps: { enabled: true, focused: true, contentRef } }
      );

      dismissSpy.mockClear();

      rerender({ enabled: false, focused: true, contentRef });

      expect(dismissSpy).not.toHaveBeenCalled();

      dismissSpy.mockRestore();
    });

    test('does not dismiss keyboard when losing focus while disabled', () => {
      const dismissSpy = jest.spyOn(Keyboard, 'dismiss');

      const { rerender } = renderHook(
        (props: Props) => useKeyboardManager(props),
        { initialProps: { enabled: false, focused: true, contentRef } }
      );

      dismissSpy.mockClear();

      rerender({ enabled: false, focused: false, contentRef });

      expect(dismissSpy).not.toHaveBeenCalled();

      dismissSpy.mockRestore();
    });
  });

  describe('input focus on unfocused screen', () => {
    test('blurs focused input in an unfocused screen when keyboard is shown', () => {
      const listeners: Partial<
        Record<KeyboardEventName, KeyboardEventListener[]>
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

      renderHook((props: Props) => useKeyboardManager(props), {
        initialProps: { enabled: true, focused: false, contentRef },
      });

      act(() => {
        listeners.keyboardDidShow?.forEach((listener) =>
          listener({} as Parameters<KeyboardEventListener>[0])
        );
      });

      expect(blurMock).toHaveBeenCalledTimes(1);

      addListenerSpy.mockRestore();
    });
  });
});

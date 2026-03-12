import { describe, expect, jest, test } from '@jest/globals';
import { act, renderHook } from '@testing-library/react-native';
import { Keyboard, TextInput } from 'react-native';

import { useKeyboardManager } from '../useKeyboardManager';

jest.useFakeTimers();

describe('useKeyboardManager', () => {
  describe('onPageChangeConfirm', () => {
    test('calls onPageChangeCancel when closing is false', () => {
      const { result } = renderHook(() =>
        useKeyboardManager({ enabled: true })
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

      const { result } = renderHook(() =>
        useKeyboardManager({ enabled: true })
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
      const { result } = renderHook(() =>
        useKeyboardManager({ enabled: true })
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
    test('dismisses keyboard when enabled transitions from true to false', () => {
      const dismissSpy = jest.spyOn(Keyboard, 'dismiss');

      const { rerender } = renderHook(
        ({ enabled }: { enabled: boolean }) => useKeyboardManager({ enabled }),
        { initialProps: { enabled: true } }
      );

      dismissSpy.mockClear();

      rerender({ enabled: false });

      expect(dismissSpy).toHaveBeenCalled();

      dismissSpy.mockRestore();
    });

    test('does not dismiss keyboard when enabled stays false', () => {
      const dismissSpy = jest.spyOn(Keyboard, 'dismiss');

      const { rerender } = renderHook(
        ({ enabled }: { enabled: boolean }) => useKeyboardManager({ enabled }),
        { initialProps: { enabled: false } }
      );

      dismissSpy.mockClear();

      rerender({ enabled: false });

      expect(dismissSpy).not.toHaveBeenCalled();

      dismissSpy.mockRestore();
    });
  });
});

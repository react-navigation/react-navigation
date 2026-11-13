import { afterEach, describe, expect, jest, test } from '@jest/globals';
import { act, renderHook } from '@testing-library/react-native';
import * as React from 'react';
import {
  type HostInstance,
  Keyboard,
  type KeyboardEventName,
  Platform,
  TextInput,
  type TextInputInstance,
  View,
} from 'react-native';

import { useKeyboardManager } from '../useKeyboardManager';

jest.useFakeTimers();

afterEach(() => {
  jest.restoreAllMocks();
});

type FocusProps = Pick<
  Parameters<typeof useKeyboardManager>[0],
  'active' | 'enabled' | 'focused'
>;

describe('useKeyboardManager', () => {
  async function renderKeyboardManager(initialProps?: Partial<FocusProps>) {
    const props = {
      active: true,
      enabled: true,
      focused: true,
      ...initialProps,
    };
    const contentRef = React.createRef<HostInstance>();
    const inputRef = React.createRef<TextInputInstance>();
    const otherInputRef = React.createRef<TextInputInstance>();
    const activityMode: { current: 'visible' | 'hidden' } = {
      current: 'visible',
    };

    const hook = await renderHook(
      (props: FocusProps) => useKeyboardManager({ ...props, contentRef }),
      {
        initialProps: props,
        wrapper: ({ children }: React.PropsWithChildren) => (
          <>
            <View ref={contentRef}>
              <TextInput ref={inputRef} />
            </View>
            <TextInput ref={otherInputRef} />
            <React.Activity mode={activityMode.current}>
              {children}
            </React.Activity>
          </>
        ),
      }
    );

    const input = inputRef.current;
    const otherInput = otherInputRef.current;
    const content = contentRef.current;

    if (input === null || otherInput === null || content === null) {
      throw new Error('Native input and screen refs must be mounted');
    }

    const contains = jest.fn<HostInstance['contains']>(
      (node) => node === input
    );

    Object.assign(content, { contains });

    const focusedInput = jest
      .spyOn(TextInput.State, 'currentlyFocusedInput')
      .mockReturnValue(input);

    const focus = jest.fn(() => {
      focusedInput.mockReturnValue(input);
    });

    const blur = jest.fn(() => {
      focusedInput.mockReturnValue(undefined);
    });

    Object.assign(input, { focus, blur });

    const dismiss = jest.spyOn(Keyboard, 'dismiss').mockImplementation(() => {
      TextInput.State.currentlyFocusedInput()?.blur();
    });

    return {
      ...hook,
      props,
      input,
      otherInput,
      focusedInput,
      focus,
      blur,
      dismiss,
      contains,
      activityMode,
    };
  }

  describe('confirming a page change', () => {
    test('restores the input when the page stays open', async () => {
      const { result, blur, focus } = await renderKeyboardManager();

      await act(() => result.current.onPageChangeStart());
      await act(() =>
        result.current.onPageChangeConfirm({
          gesture: false,
          active: true,
          closing: false,
        })
      );
      await act(() => jest.runOnlyPendingTimers());

      expect(blur).toHaveBeenCalledTimes(1);
      expect(focus).toHaveBeenCalledTimes(1);
    });

    test('dismisses the keyboard when closing without a gesture', async () => {
      const { result, dismiss } = await renderKeyboardManager();

      await act(() =>
        result.current.onPageChangeConfirm({
          gesture: false,
          active: false,
          closing: true,
        })
      );

      expect(dismiss).toHaveBeenCalledTimes(1);
    });

    test('blurs the input when closing the topmost screen with a gesture', async () => {
      const { result, blur } = await renderKeyboardManager();

      await act(() => result.current.onPageChangeStart());

      blur.mockClear();

      await act(() =>
        result.current.onPageChangeConfirm({
          gesture: true,
          active: true,
          closing: true,
        })
      );

      expect(blur).toHaveBeenCalledTimes(1);
    });
  });

  describe('keyboard dismissal on focus changes', () => {
    test.each([
      {
        title:
          'dismisses the keyboard when losing focus in the same render that disables handling',
        initial: { enabled: true, focused: true },
        next: { enabled: false, focused: false },
        dismissals: 1,
      },
      {
        title: 'keeps the keyboard when the screen stays unfocused',
        initial: { enabled: false, focused: false },
        next: { enabled: false, focused: false },
        dismissals: 0,
      },
      {
        title:
          'keeps the keyboard when handling is disabled without losing focus',
        initial: { enabled: true, focused: true },
        next: { enabled: false, focused: true },
        dismissals: 0,
      },
      {
        title:
          'keeps the keyboard when losing focus while handling is disabled',
        initial: { enabled: false, focused: true },
        next: { enabled: false, focused: false },
        dismissals: 0,
      },
    ])('$title', async ({ initial, next, dismissals }) => {
      const { props, rerender, dismiss } = await renderKeyboardManager(initial);

      await rerender({ ...props, ...next });

      expect(dismiss).toHaveBeenCalledTimes(dismissals);
    });

    test('does not dismiss the keyboard when a screen mounts unfocused', async () => {
      const dismiss = jest.spyOn(Keyboard, 'dismiss');

      await renderKeyboardManager({ focused: false });

      expect(dismiss).not.toHaveBeenCalled();
    });

    test('keeps the keyboard when Activity replays effects on an unfocused screen', async () => {
      const { props, rerender, activityMode, dismiss } =
        await renderKeyboardManager();

      const unfocused = { ...props, focused: false, active: false };

      await rerender(unfocused);

      dismiss.mockClear();

      activityMode.current = 'hidden';

      await rerender(unfocused);

      activityMode.current = 'visible';

      await rerender(unfocused);

      expect(dismiss).not.toHaveBeenCalled();
    });
  });

  test('blurs an input in an unfocused screen when the keyboard is shown', async () => {
    const listeners: Partial<
      Record<
        KeyboardEventName,
        Parameters<typeof Keyboard.addListener>[1][] | undefined
      >
    > = {};

    jest.spyOn(Keyboard, 'addListener').mockImplementation((name, callback) => {
      listeners[name] = [...(listeners[name] ?? []), callback];

      return {
        remove: () => {
          listeners[name] = listeners[name]?.filter(
            (listener) => listener !== callback
          );
        },
      };
    });

    const { blur } = await renderKeyboardManager({ focused: false });

    await act(() => {
      listeners.keyboardDidShow?.forEach((listener) =>
        listener({
          duration: 0,
          easing: 'keyboard',
          endCoordinates: { screenX: 0, screenY: 0, width: 0, height: 0 },
        })
      );
    });

    expect(blur).toHaveBeenCalledTimes(1);
  });

  describe('restoring screen input focus', () => {
    test.each([
      {
        title: 'restores the input with an open keyboard on iOS',
        platform: 'ios',
        visible: true,
        restores: true,
      },
      {
        title: 'restores the input with a hidden keyboard on iOS',
        platform: 'ios',
        visible: false,
        restores: true,
      },
      {
        title: 'restores the input with an open keyboard on Android',
        platform: 'android',
        visible: true,
        restores: true,
      },
      {
        title: 'does not restore the input with a hidden keyboard on Android',
        platform: 'android',
        visible: false,
        restores: false,
      },
    ] satisfies {
      title: string;
      platform: typeof Platform.OS;
      visible: boolean;
      restores: boolean;
    }[])('$title', async ({ platform, visible, restores }) => {
      jest.replaceProperty(Platform, 'OS', platform);
      jest.spyOn(Keyboard, 'isVisible').mockReturnValue(visible);

      const { props, rerender, input, focus, dismiss } =
        await renderKeyboardManager();

      await rerender({ ...props, focused: false, active: false });

      expect(dismiss).toHaveBeenCalledTimes(1);
      expect(TextInput.State.currentlyFocusedInput()).toBeUndefined();
      expect(focus).not.toHaveBeenCalled();

      await rerender(props);

      expect(focus).toHaveBeenCalledTimes(restores ? 1 : 0);
      expect(TextInput.State.currentlyFocusedInput()).toBe(
        restores ? input : undefined
      );
    });

    test('keeps focus set by the returning screen', async () => {
      const { props, rerender, otherInput, focusedInput, focus } =
        await renderKeyboardManager();

      await rerender({ ...props, focused: false, active: false });

      focusedInput.mockReturnValue(otherInput);

      await rerender(props);

      expect(focus).not.toHaveBeenCalled();
      expect(TextInput.State.currentlyFocusedInput()).toBe(otherInput);
    });

    test('does not restore an input that was removed from the screen', async () => {
      const { props, rerender, contains, focus } =
        await renderKeyboardManager();

      await rerender({ ...props, focused: false, active: false });

      contains.mockReturnValue(false);

      await rerender(props);

      expect(focus).not.toHaveBeenCalled();
    });

    test('does not focus an input belonging to another screen', async () => {
      const { props, rerender, otherInput, focusedInput, focus } =
        await renderKeyboardManager();

      const otherFocus = jest.fn();

      Object.assign(otherInput, { focus: otherFocus });

      focusedInput.mockReturnValue(otherInput);

      await rerender({ ...props, focused: false, active: false });

      focusedInput.mockReturnValue(undefined);

      await rerender(props);

      expect(focus).not.toHaveBeenCalled();
      expect(otherFocus).not.toHaveBeenCalled();
    });

    test('waits until the returning screen is topmost before restoring focus', async () => {
      const { props, rerender, focus } = await renderKeyboardManager();

      await rerender({ ...props, focused: false, active: false });
      await rerender({ ...props, active: false });

      expect(focus).not.toHaveBeenCalled();

      await rerender(props);

      expect(focus).toHaveBeenCalledTimes(1);
    });

    test('does not restore an input blurred before navigation', async () => {
      const { props, rerender, input, focus } = await renderKeyboardManager();

      input.blur();

      await rerender({ ...props, focused: false, active: false });
      await rerender(props);

      expect(focus).not.toHaveBeenCalled();
    });

    test('keeps a retained screen input when reopening after losing focus', async () => {
      const { props, rerender, result, focus } = await renderKeyboardManager();

      await act(() => result.current.onPageChangeStart());
      await act(() =>
        result.current.onPageChangeConfirm({
          gesture: true,
          active: true,
          closing: true,
        })
      );
      await rerender({ ...props, focused: false, active: false });
      await rerender({ ...props, active: false });
      await act(() =>
        result.current.onPageChangeConfirm({
          gesture: false,
          active: true,
          closing: false,
        })
      );
      await rerender(props);

      expect(focus).toHaveBeenCalledTimes(1);
    });

    test('keeps a swiped retained screen input when another screen input is focused on focus loss', async () => {
      const { props, rerender, result, otherInput, focusedInput, focus } =
        await renderKeyboardManager();

      await act(() => result.current.onPageChangeStart());
      await act(() =>
        result.current.onPageChangeConfirm({
          gesture: true,
          active: true,
          closing: true,
        })
      );

      focusedInput.mockReturnValue(otherInput);

      await rerender({ ...props, focused: false, active: false });

      focusedInput.mockReturnValue(undefined);

      await rerender(props);

      expect(focus).toHaveBeenCalledTimes(1);
    });

    test('does not restore a retained screen input after swiping with a hidden keyboard on Android', async () => {
      jest.replaceProperty(Platform, 'OS', 'android');
      jest.spyOn(Keyboard, 'isVisible').mockReturnValue(false);

      const { props, rerender, result, focus, blur } =
        await renderKeyboardManager();

      await act(() => result.current.onPageChangeStart());
      await act(() =>
        result.current.onPageChangeConfirm({
          gesture: true,
          active: true,
          closing: true,
        })
      );

      expect(blur).not.toHaveBeenCalled();

      await rerender({ ...props, focused: false, active: false });

      expect(blur).toHaveBeenCalledTimes(1);

      await rerender(props);

      expect(focus).not.toHaveBeenCalled();
    });

    test.each([
      { visible: false, title: 'keeps focus when the keyboard is hidden' },
      { visible: true, title: 'restores focus when the keyboard is open' },
    ])('$title after cancelling a swipe on Android', async ({ visible }) => {
      jest.replaceProperty(Platform, 'OS', 'android');
      jest.spyOn(Keyboard, 'isVisible').mockReturnValue(visible);

      const { result, input, focus, blur } = await renderKeyboardManager();

      await act(() => result.current.onPageChangeStart());

      expect(blur).toHaveBeenCalledTimes(visible ? 1 : 0);
      expect(TextInput.State.currentlyFocusedInput()).toBe(
        visible ? undefined : input
      );

      await act(() => result.current.onPageChangeCancel());
      await act(() => jest.runOnlyPendingTimers());

      expect(focus).toHaveBeenCalledTimes(visible ? 1 : 0);
      expect(TextInput.State.currentlyFocusedInput()).toBe(input);
    });

    test('forgets the input when a blocked closing swipe reopens without losing focus', async () => {
      const { props, rerender, result, focus } = await renderKeyboardManager();

      await act(() => result.current.onPageChangeStart());
      await act(() =>
        result.current.onPageChangeConfirm({
          gesture: true,
          active: true,
          closing: true,
        })
      );
      await act(() =>
        result.current.onPageChangeConfirm({
          gesture: false,
          active: true,
          closing: false,
        })
      );

      expect(focus).not.toHaveBeenCalled();

      await rerender({ ...props, focused: false, active: false });
      await rerender(props);

      expect(focus).not.toHaveBeenCalled();
    });

    test('does not save or restore focus when keyboard handling is disabled', async () => {
      const { props, rerender, result, focusedInput, focus, blur, dismiss } =
        await renderKeyboardManager({ enabled: false });

      await act(() => result.current.onPageChangeStart());
      await act(() => result.current.onPageChangeCancel());
      await act(() =>
        result.current.onPageChangeConfirm({
          gesture: true,
          active: true,
          closing: true,
        })
      );

      await rerender({ ...props, focused: false, active: false });

      expect(blur).not.toHaveBeenCalled();
      expect(dismiss).not.toHaveBeenCalled();

      focusedInput.mockReturnValue(undefined);

      await rerender(props);
      await rerender({ ...props, enabled: true });
      await rerender({
        ...props,
        enabled: true,
        focused: false,
        active: false,
      });
      await rerender({ ...props, enabled: true });

      expect(focus).not.toHaveBeenCalled();
    });

    test('forgets saved focus when returning with handling disabled before enabling it again', async () => {
      const { props, rerender, focus } = await renderKeyboardManager();

      await rerender({ ...props, focused: false, active: false });
      await rerender({
        ...props,
        focused: false,
        active: false,
        enabled: false,
      });
      await rerender({ ...props, enabled: false });

      expect(focus).not.toHaveBeenCalled();

      await rerender(props);
      await rerender({ ...props, focused: false, active: false });
      await rerender(props);

      expect(focus).not.toHaveBeenCalled();
    });

    test('does not restore screen input focus on web', async () => {
      jest.replaceProperty(Platform, 'OS', 'web');

      const { props, rerender, result, focus } = await renderKeyboardManager();

      await rerender({ ...props, focused: false, active: false });
      await rerender(props);
      await act(() => result.current.onPageChangeStart());
      await act(() =>
        result.current.onPageChangeConfirm({
          gesture: true,
          active: true,
          closing: true,
        })
      );
      await rerender({ ...props, focused: false, active: false });
      await rerender(props);

      expect(focus).not.toHaveBeenCalled();
    });
  });
});

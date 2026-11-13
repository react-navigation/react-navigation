import { afterEach, expect, jest, test } from '@jest/globals';
import { act, render, renderHook } from '@testing-library/react-native';
import { Activity, type ComponentRef, createRef, type RefObject } from 'react';
import {
  type HostInstance,
  Keyboard,
  type KeyboardEvent,
  type KeyboardEventName,
  Platform,
  TextInput,
  UIManager,
  View,
} from 'react-native';

import { useKeyboardManager } from '../useKeyboardManager';

jest.useFakeTimers();

afterEach(() => {
  jest.restoreAllMocks();
});

type Props = {
  active: boolean;
  enabled: boolean;
  focused: boolean;
  contentRef: RefObject<HostInstance | null>;
};

test('focuses input again when confirming an opening transition', () => {
  const contentRef = createRef<HostInstance>();

  const { result } = renderHook((props: Props) => useKeyboardManager(props), {
    initialProps: {
      active: true,
      enabled: true,
      focused: true,
      contentRef,
    },
  });

  const focusMock = jest.fn();
  const input = { blur: jest.fn(), focus: focusMock } as any;

  jest.spyOn(TextInput.State, 'currentlyFocusedInput').mockReturnValue(input);

  act(() => result.current.onPageChangeStart());
  act(() =>
    result.current.onPageChangeConfirm({
      gesture: false,
      active: true,
      closing: false,
    })
  );

  act(() => jest.runAllTimers());

  expect(focusMock).toHaveBeenCalledTimes(1);
});

test('dismisses keyboard when closing without gesture', () => {
  const contentRef = createRef<HostInstance>();

  const dismissSpy = jest.spyOn(Keyboard, 'dismiss');

  const { result } = renderHook((props: Props) => useKeyboardManager(props), {
    initialProps: {
      active: true,
      enabled: true,
      focused: true,
      contentRef,
    },
  });

  act(() =>
    result.current.onPageChangeConfirm({
      gesture: false,
      active: false,
      closing: true,
    })
  );

  expect(dismissSpy).toHaveBeenCalled();
});

test('blurs previously focused input when closing with gesture and active', () => {
  const contentRef = createRef<HostInstance>();

  const { result } = renderHook((props: Props) => useKeyboardManager(props), {
    initialProps: {
      active: true,
      enabled: true,
      focused: true,
      contentRef,
    },
  });

  const blurMock = jest.fn();
  const input = { blur: blurMock } as any;

  jest.spyOn(TextInput.State, 'currentlyFocusedInput').mockReturnValue(input);

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

test('dismisses keyboard when screen loses focus even if handling is disabled in the same render', () => {
  const contentRef = createRef<HostInstance>();

  const dismissSpy = jest.spyOn(Keyboard, 'dismiss');

  const { rerender } = renderHook((props: Props) => useKeyboardManager(props), {
    initialProps: {
      active: true,
      enabled: true,
      focused: true,
      contentRef,
    },
  });

  dismissSpy.mockClear();

  rerender({
    active: true,
    enabled: false,
    focused: false,
    contentRef,
  });

  expect(dismissSpy).toHaveBeenCalled();
});

test('does not dismiss keyboard when an unfocused screen rerenders with handling disabled', () => {
  const contentRef = createRef<HostInstance>();

  const dismissSpy = jest.spyOn(Keyboard, 'dismiss');

  const { rerender } = renderHook((props: Props) => useKeyboardManager(props), {
    initialProps: {
      active: true,
      enabled: false,
      focused: false,
      contentRef,
    },
  });

  dismissSpy.mockClear();

  rerender({
    active: true,
    enabled: false,
    focused: false,
    contentRef,
  });

  expect(dismissSpy).not.toHaveBeenCalled();
});

test('does not dismiss keyboard when handling is disabled on a focused screen', () => {
  const contentRef = createRef<HostInstance>();

  const dismissSpy = jest.spyOn(Keyboard, 'dismiss');

  const { rerender } = renderHook((props: Props) => useKeyboardManager(props), {
    initialProps: {
      active: true,
      enabled: true,
      focused: true,
      contentRef,
    },
  });

  dismissSpy.mockClear();

  rerender({
    active: true,
    enabled: false,
    focused: true,
    contentRef,
  });

  expect(dismissSpy).not.toHaveBeenCalled();
});

test('does not dismiss keyboard when losing focus while disabled', () => {
  const contentRef = createRef<HostInstance>();

  const dismissSpy = jest.spyOn(Keyboard, 'dismiss');

  const { rerender } = renderHook((props: Props) => useKeyboardManager(props), {
    initialProps: {
      active: true,
      enabled: false,
      focused: true,
      contentRef,
    },
  });

  dismissSpy.mockClear();

  rerender({
    active: true,
    enabled: false,
    focused: false,
    contentRef,
  });

  expect(dismissSpy).not.toHaveBeenCalled();
});

test('blurs focused input in an unfocused screen when keyboard is shown', () => {
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

  const blurMock = jest.fn();
  const input = { blur: blurMock } as unknown as HostInstance;
  const contentRef = {
    current: {
      contains: (node: HostInstance) => node === input,
    } as HostInstance,
  } satisfies RefObject<HostInstance | null>;

  jest.spyOn(TextInput.State, 'currentlyFocusedInput').mockReturnValue(input);

  renderHook((props: Props) => useKeyboardManager(props), {
    initialProps: {
      active: true,
      enabled: true,
      focused: false,
      contentRef,
    },
  });

  act(() => {
    listeners.keyboardDidShow?.forEach((listener) =>
      listener({} as KeyboardEvent)
    );
  });

  expect(blurMock).toHaveBeenCalledTimes(1);
});

test('focuses previously focused input when the screen is on top again', () => {
  const focusMock = jest.fn();
  const input = { focus: focusMock } as unknown as HostInstance;
  const contentRef = {
    current: {
      contains: (node: HostInstance) => node === input,
    } as HostInstance,
  } satisfies RefObject<HostInstance | null>;

  const focusedInputSpy = jest
    .spyOn(TextInput.State, 'currentlyFocusedInput')
    .mockReturnValue(input);

  const { rerender } = renderHook((props: Props) => useKeyboardManager(props), {
    initialProps: {
      active: true,
      enabled: true,
      focused: true,
      contentRef,
    },
  });

  rerender({
    active: false,
    enabled: true,
    focused: false,
    contentRef,
  });

  focusedInputSpy.mockReturnValue(undefined);

  rerender({
    active: false,
    enabled: true,
    focused: true,
    contentRef,
  });

  expect(focusMock).not.toHaveBeenCalled();

  rerender({
    active: true,
    enabled: true,
    focused: true,
    contentRef,
  });

  expect(focusMock).toHaveBeenCalledTimes(1);
});

test('does not focus previously focused input when another input is focused', () => {
  const focusMock = jest.fn();
  const input = { focus: focusMock } as unknown as HostInstance;
  const otherInput = { focus: jest.fn() } as unknown as HostInstance;
  const contentRef = {
    current: {
      contains: (node: HostInstance) => node === input,
    } as HostInstance,
  } satisfies RefObject<HostInstance | null>;

  const focusedInputSpy = jest
    .spyOn(TextInput.State, 'currentlyFocusedInput')
    .mockReturnValue(input);

  const { rerender } = renderHook((props: Props) => useKeyboardManager(props), {
    initialProps: {
      active: true,
      enabled: true,
      focused: true,
      contentRef,
    },
  });

  rerender({
    active: false,
    enabled: true,
    focused: false,
    contentRef,
  });

  focusedInputSpy.mockReturnValue(otherInput);

  rerender({
    active: true,
    enabled: true,
    focused: true,
    contentRef,
  });

  expect(focusMock).not.toHaveBeenCalled();
});

test('does not focus previously focused input when it was removed from the screen', () => {
  let removed = false;

  const focusMock = jest.fn();
  const input = { focus: focusMock } as unknown as HostInstance;
  const contentRef = {
    current: {
      contains: (node: HostInstance) => !removed && node === input,
    } as HostInstance,
  } satisfies RefObject<HostInstance | null>;

  const focusedInputSpy = jest
    .spyOn(TextInput.State, 'currentlyFocusedInput')
    .mockReturnValue(input);

  const { rerender } = renderHook((props: Props) => useKeyboardManager(props), {
    initialProps: {
      active: true,
      enabled: true,
      focused: true,
      contentRef,
    },
  });

  rerender({
    active: false,
    enabled: true,
    focused: false,
    contentRef,
  });

  focusedInputSpy.mockReturnValue(undefined);

  removed = true;

  rerender({
    active: true,
    enabled: true,
    focused: true,
    contentRef,
  });

  expect(focusMock).not.toHaveBeenCalled();
});

test('does not focus previously focused input on Android when keyboard was hidden', () => {
  jest.replaceProperty(Platform, 'OS', 'android');
  jest.spyOn(Keyboard, 'isVisible').mockReturnValue(false);

  const focusMock = jest.fn();
  const input = { focus: focusMock } as unknown as HostInstance;
  const contentRef = {
    current: {
      contains: (node: HostInstance) => node === input,
    } as HostInstance,
  } satisfies RefObject<HostInstance | null>;

  const focusedInputSpy = jest
    .spyOn(TextInput.State, 'currentlyFocusedInput')
    .mockReturnValue(input);

  const { rerender } = renderHook((props: Props) => useKeyboardManager(props), {
    initialProps: {
      active: true,
      enabled: true,
      focused: true,
      contentRef,
    },
  });

  rerender({
    active: false,
    enabled: true,
    focused: false,
    contentRef,
  });

  focusedInputSpy.mockReturnValue(undefined);

  rerender({
    active: true,
    enabled: true,
    focused: true,
    contentRef,
  });

  expect(focusMock).not.toHaveBeenCalled();
});

test('does not focus previously focused input when handling is disabled and enabled again while unfocused', () => {
  const focusMock = jest.fn();
  const input = { focus: focusMock } as unknown as HostInstance;
  const contentRef = {
    current: {
      contains: (node: HostInstance) => node === input,
    } as HostInstance,
  } satisfies RefObject<HostInstance | null>;

  const focusedInputSpy = jest
    .spyOn(TextInput.State, 'currentlyFocusedInput')
    .mockReturnValue(input);

  const { rerender } = renderHook((props: Props) => useKeyboardManager(props), {
    initialProps: {
      active: true,
      enabled: true,
      focused: true,
      contentRef,
    },
  });

  rerender({
    active: false,
    enabled: true,
    focused: false,
    contentRef,
  });

  focusedInputSpy.mockReturnValue(undefined);

  rerender({
    active: false,
    enabled: false,
    focused: false,
    contentRef,
  });
  rerender({
    active: false,
    enabled: true,
    focused: false,
    contentRef,
  });
  rerender({
    active: true,
    enabled: true,
    focused: true,
    contentRef,
  });

  expect(focusMock).not.toHaveBeenCalled();
});

test('focuses input again when a screen closed with a gesture is opened again', () => {
  const focusMock = jest.fn();
  const input = {
    blur: jest.fn(),
    focus: focusMock,
  } as unknown as HostInstance;
  const contentRef = {
    current: {
      contains: (node: HostInstance) => node === input,
    } as HostInstance,
  } satisfies RefObject<HostInstance | null>;

  const focusedInputSpy = jest
    .spyOn(TextInput.State, 'currentlyFocusedInput')
    .mockReturnValue(input);

  const { result, rerender } = renderHook(
    (props: Props) => useKeyboardManager(props),
    {
      initialProps: {
        active: true,
        enabled: true,
        focused: true,
        contentRef,
      },
    }
  );

  act(() => result.current.onPageChangeStart());

  focusedInputSpy.mockReturnValue(undefined);

  act(() =>
    result.current.onPageChangeConfirm({
      gesture: true,
      active: true,
      closing: true,
    })
  );

  rerender({
    active: false,
    enabled: true,
    focused: false,
    contentRef,
  });
  rerender({
    active: false,
    enabled: true,
    focused: true,
    contentRef,
  });

  act(() =>
    result.current.onPageChangeConfirm({
      gesture: false,
      active: true,
      closing: false,
    })
  );

  rerender({
    active: true,
    enabled: true,
    focused: true,
    contentRef,
  });

  expect(focusMock).toHaveBeenCalledTimes(1);
});

test('does not restore input focus on a later screen visit after a closing gesture is cancelled', () => {
  const focusMock = jest.fn();
  const input = {
    blur: jest.fn(),
    focus: focusMock,
  } as unknown as HostInstance;
  const contentRef = {
    current: {
      contains: (node: HostInstance) => node === input,
    } as HostInstance,
  } satisfies RefObject<HostInstance | null>;

  const focusedInputSpy = jest
    .spyOn(TextInput.State, 'currentlyFocusedInput')
    .mockReturnValue(input);

  const { result, rerender } = renderHook(
    (props: Props) => useKeyboardManager(props),
    {
      initialProps: {
        active: true,
        enabled: true,
        focused: true,
        contentRef,
      },
    }
  );

  act(() => result.current.onPageChangeStart());

  focusedInputSpy.mockReturnValue(undefined);

  act(() =>
    result.current.onPageChangeConfirm({
      gesture: true,
      active: true,
      closing: true,
    })
  );

  act(() =>
    result.current.onPageChangeConfirm({
      gesture: false,
      active: true,
      closing: false,
    })
  );

  rerender({
    active: false,
    enabled: true,
    focused: false,
    contentRef,
  });
  rerender({
    active: true,
    enabled: true,
    focused: true,
    contentRef,
  });

  expect(focusMock).not.toHaveBeenCalled();
});

test('does not blur input when closing an Android screen with a gesture while the keyboard is hidden', () => {
  jest.replaceProperty(Platform, 'OS', 'android');
  jest.spyOn(Keyboard, 'isVisible').mockReturnValue(false);

  const contentRef = createRef<HostInstance>();

  const blurMock = jest.fn();
  const input = { blur: blurMock } as unknown as HostInstance;

  jest.spyOn(TextInput.State, 'currentlyFocusedInput').mockReturnValue(input);

  const { result } = renderHook((props: Props) => useKeyboardManager(props), {
    initialProps: {
      active: true,
      enabled: true,
      focused: true,
      contentRef,
    },
  });

  act(() => result.current.onPageChangeStart());
  act(() =>
    result.current.onPageChangeConfirm({
      gesture: true,
      active: true,
      closing: true,
    })
  );

  expect(blurMock).not.toHaveBeenCalled();
});

test('does not dismiss keyboard when Activity shows an unfocused screen again', () => {
  const contentRef = createRef<HostInstance>();

  const dismissSpy = jest.spyOn(Keyboard, 'dismiss');

  const Test = ({ focused }: { focused: boolean }) => {
    useKeyboardManager({
      active: focused,
      enabled: true,
      focused,
      contentRef,
    });

    return null;
  };

  const { rerender } = render(
    <Activity mode="visible">
      <Test focused />
    </Activity>
  );

  rerender(
    <Activity mode="visible">
      <Test focused={false} />
    </Activity>
  );

  dismissSpy.mockClear();

  rerender(
    <Activity mode="hidden">
      <Test focused={false} />
    </Activity>
  );

  rerender(
    <Activity mode="visible">
      <Test focused={false} />
    </Activity>
  );

  expect(dismissSpy).not.toHaveBeenCalled();
});

function renderLegacyScreen() {
  const contentRef = createRef<HostInstance>();
  const inputRef = createRef<ComponentRef<typeof TextInput>>();
  const otherInputRef = createRef<ComponentRef<typeof TextInput>>();

  render(
    <View ref={contentRef}>
      <TextInput ref={inputRef} />
      <TextInput ref={otherInputRef} />
    </View>
  );

  const content = contentRef.current;
  const input = inputRef.current;
  const otherInput = otherInputRef.current;

  if (!content || !input || !otherInput) {
    throw new Error('Expected mounted screen and input');
  }

  Object.defineProperty(content, 'contains', {
    configurable: true,
    value: undefined,
  });

  jest
    .spyOn(
      jest.requireActual<typeof import('react-native')>('react-native'),
      'findNodeHandle'
    )
    .mockImplementation((view) => {
      return view === input ? 1 : 2;
    });

  const callbacks: ((result: boolean[]) => void)[] = [];

  Object.defineProperty(UIManager, 'viewIsDescendantOf', {
    configurable: true,
    value: jest.fn<typeof UIManager.viewIsDescendantOf>(
      (_viewTag, _ancestorTag, callback) => {
        callbacks.push(callback);
      }
    ),
  });

  const focus = jest.spyOn(input, 'focus').mockImplementation(() => {});

  focus.mockClear();
  const focusedInput = jest
    .spyOn(TextInput.State, 'currentlyFocusedInput')
    .mockReturnValue(input);

  const initialProps = {
    active: true,
    enabled: true,
    focused: true,
    contentRef,
  };

  const hook = renderHook((props: Props) => useKeyboardManager(props), {
    initialProps,
  });

  hook.rerender({ ...initialProps, active: false, focused: false });

  return {
    ...hook,
    callbacks,
    focus,
    focusedInput,
    initialProps,
    input,
    otherInput,
  };
}

test.each([true, [true]])(
  'restores input focus with the legacy native ownership response %j',
  (response) => {
    const { callbacks, focus, focusedInput, initialProps, rerender } =
      renderLegacyScreen();

    act(() => Reflect.apply(callbacks[0], undefined, [response]));

    focusedInput.mockReturnValue(undefined);

    rerender(initialProps);

    act(() => Reflect.apply(callbacks[1], undefined, [response]));

    expect(focus).toHaveBeenCalledTimes(1);
  }
);

test('does not restore an input that no longer belongs to the screen with the legacy renderer', () => {
  const { callbacks, focus, focusedInput, initialProps, rerender } =
    renderLegacyScreen();

  act(() => callbacks[0]([true]));

  focusedInput.mockReturnValue(undefined);

  rerender(initialProps);

  act(() => callbacks[1]([false]));

  expect(focus).not.toHaveBeenCalled();
});

test('does not replace another focused input while waiting for native ownership', () => {
  const { callbacks, focus, focusedInput, initialProps, otherInput, rerender } =
    renderLegacyScreen();

  act(() => callbacks[0]([true]));

  focusedInput.mockReturnValue(undefined);

  rerender(initialProps);

  focusedInput.mockReturnValue(otherInput);

  act(() => callbacks[1]([true]));

  expect(focus).not.toHaveBeenCalled();
});

test('does not restore focus after leaving the screen while waiting for native ownership', () => {
  const { callbacks, focus, focusedInput, initialProps, rerender } =
    renderLegacyScreen();

  act(() => callbacks[0]([true]));

  focusedInput.mockReturnValue(undefined);

  rerender(initialProps);
  rerender({ ...initialProps, active: false, focused: false });

  act(() => callbacks[1]([true]));

  expect(focus).not.toHaveBeenCalled();
});

test('does not restore focus after unmounting while waiting for native ownership', () => {
  const { callbacks, focus, focusedInput, initialProps, rerender, unmount } =
    renderLegacyScreen();

  act(() => callbacks[0]([true]));

  focusedInput.mockReturnValue(undefined);

  rerender(initialProps);
  unmount();

  act(() => callbacks[1]([true]));

  expect(focus).not.toHaveBeenCalled();
});

test('does not query a disconnected input when restoring focus with the legacy fallback', () => {
  const { callbacks, focus, focusedInput, initialProps, input, rerender } =
    renderLegacyScreen();

  act(() => callbacks[0]([true]));

  focusedInput.mockReturnValue(undefined);

  Object.defineProperty(input, 'isConnected', {
    configurable: true,
    value: false,
  });

  jest.spyOn(UIManager, 'viewIsDescendantOf').mockImplementation(() => {
    throw new Error('Native ownership queries require a connected view');
  });

  rerender(initialProps);

  expect(focus).not.toHaveBeenCalled();
});

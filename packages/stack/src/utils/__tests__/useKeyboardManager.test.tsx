import { afterEach, expect, jest, test } from '@jest/globals';
import { act, render, renderHook } from '@testing-library/react-native';
import { Activity, createRef, type RefObject } from 'react';
import {
  type HostInstance,
  Keyboard,
  type KeyboardEvent,
  type KeyboardEventName,
  Platform,
  TextInput,
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

test('focuses input again when confirming an opening transition', async () => {
  const contentRef = createRef<HostInstance>();

  const { result } = await renderHook(
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

  const focusMock = jest.fn();
  const input = { blur: jest.fn(), focus: focusMock } as any;

  jest.spyOn(TextInput.State, 'currentlyFocusedInput').mockReturnValue(input);

  await act(() => result.current.onPageChangeStart());
  await act(() =>
    result.current.onPageChangeConfirm({
      gesture: false,
      active: true,
      closing: false,
    })
  );

  await act(() => jest.runAllTimers());

  expect(focusMock).toHaveBeenCalledTimes(1);
});

test('dismisses keyboard when closing without gesture', async () => {
  const contentRef = createRef<HostInstance>();

  const dismissSpy = jest.spyOn(Keyboard, 'dismiss');

  const { result } = await renderHook(
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

  await act(() =>
    result.current.onPageChangeConfirm({
      gesture: false,
      active: false,
      closing: true,
    })
  );

  expect(dismissSpy).toHaveBeenCalled();
});

test('blurs previously focused input when closing with gesture and active', async () => {
  const contentRef = createRef<HostInstance>();

  const { result } = await renderHook(
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

  const blurMock = jest.fn();
  const input = { blur: blurMock } as any;

  jest.spyOn(TextInput.State, 'currentlyFocusedInput').mockReturnValue(input);

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

test('dismisses keyboard when screen loses focus even if handling is disabled in the same render', async () => {
  const contentRef = createRef<HostInstance>();

  const dismissSpy = jest.spyOn(Keyboard, 'dismiss');

  const { rerender } = await renderHook(
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

  dismissSpy.mockClear();

  await rerender({
    active: true,
    enabled: false,
    focused: false,
    contentRef,
  });

  expect(dismissSpy).toHaveBeenCalled();
});

test('does not dismiss keyboard when an unfocused screen rerenders with handling disabled', async () => {
  const contentRef = createRef<HostInstance>();

  const dismissSpy = jest.spyOn(Keyboard, 'dismiss');

  const { rerender } = await renderHook(
    (props: Props) => useKeyboardManager(props),
    {
      initialProps: {
        active: true,
        enabled: false,
        focused: false,
        contentRef,
      },
    }
  );

  dismissSpy.mockClear();

  await rerender({
    active: true,
    enabled: false,
    focused: false,
    contentRef,
  });

  expect(dismissSpy).not.toHaveBeenCalled();
});

test('does not dismiss keyboard when handling is disabled on a focused screen', async () => {
  const contentRef = createRef<HostInstance>();

  const dismissSpy = jest.spyOn(Keyboard, 'dismiss');

  const { rerender } = await renderHook(
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

  dismissSpy.mockClear();

  await rerender({
    active: true,
    enabled: false,
    focused: true,
    contentRef,
  });

  expect(dismissSpy).not.toHaveBeenCalled();
});

test('does not dismiss keyboard when losing focus while disabled', async () => {
  const contentRef = createRef<HostInstance>();

  const dismissSpy = jest.spyOn(Keyboard, 'dismiss');

  const { rerender } = await renderHook(
    (props: Props) => useKeyboardManager(props),
    {
      initialProps: {
        active: true,
        enabled: false,
        focused: true,
        contentRef,
      },
    }
  );

  dismissSpy.mockClear();

  await rerender({
    active: true,
    enabled: false,
    focused: false,
    contentRef,
  });

  expect(dismissSpy).not.toHaveBeenCalled();
});

test('blurs focused input in an unfocused screen when keyboard is shown', async () => {
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

  await renderHook((props: Props) => useKeyboardManager(props), {
    initialProps: {
      active: true,
      enabled: true,
      focused: false,
      contentRef,
    },
  });

  await act(() => {
    listeners.keyboardDidShow?.forEach((listener) =>
      listener({} as KeyboardEvent)
    );
  });

  expect(blurMock).toHaveBeenCalledTimes(1);
});

test('focuses previously focused input when the screen is on top again', async () => {
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

  const { rerender } = await renderHook(
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

  await rerender({
    active: false,
    enabled: true,
    focused: false,
    contentRef,
  });

  focusedInputSpy.mockReturnValue(undefined);

  await rerender({
    active: false,
    enabled: true,
    focused: true,
    contentRef,
  });

  expect(focusMock).not.toHaveBeenCalled();

  await rerender({
    active: true,
    enabled: true,
    focused: true,
    contentRef,
  });

  expect(focusMock).toHaveBeenCalledTimes(1);
});

test('does not focus previously focused input when another input is focused', async () => {
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

  const { rerender } = await renderHook(
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

  await rerender({
    active: false,
    enabled: true,
    focused: false,
    contentRef,
  });

  focusedInputSpy.mockReturnValue(otherInput);

  await rerender({
    active: true,
    enabled: true,
    focused: true,
    contentRef,
  });

  expect(focusMock).not.toHaveBeenCalled();
});

test('does not focus previously focused input when it was removed from the screen', async () => {
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

  const { rerender } = await renderHook(
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

  await rerender({
    active: false,
    enabled: true,
    focused: false,
    contentRef,
  });

  focusedInputSpy.mockReturnValue(undefined);

  removed = true;

  await rerender({
    active: true,
    enabled: true,
    focused: true,
    contentRef,
  });

  expect(focusMock).not.toHaveBeenCalled();
});

test('does not focus previously focused input on Android when keyboard was hidden', async () => {
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

  const { rerender } = await renderHook(
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

  await rerender({
    active: false,
    enabled: true,
    focused: false,
    contentRef,
  });

  focusedInputSpy.mockReturnValue(undefined);

  await rerender({
    active: true,
    enabled: true,
    focused: true,
    contentRef,
  });

  expect(focusMock).not.toHaveBeenCalled();
});

test('does not focus previously focused input when handling is disabled and enabled again while unfocused', async () => {
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

  const { rerender } = await renderHook(
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

  await rerender({
    active: false,
    enabled: true,
    focused: false,
    contentRef,
  });

  focusedInputSpy.mockReturnValue(undefined);

  await rerender({
    active: false,
    enabled: false,
    focused: false,
    contentRef,
  });
  await rerender({
    active: false,
    enabled: true,
    focused: false,
    contentRef,
  });
  await rerender({
    active: true,
    enabled: true,
    focused: true,
    contentRef,
  });

  expect(focusMock).not.toHaveBeenCalled();
});

test('focuses input again when a screen closed with a gesture is opened again', async () => {
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

  const { result, rerender } = await renderHook(
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

  await act(() => result.current.onPageChangeStart());

  focusedInputSpy.mockReturnValue(undefined);

  await act(() =>
    result.current.onPageChangeConfirm({
      gesture: true,
      active: true,
      closing: true,
    })
  );

  await rerender({
    active: false,
    enabled: true,
    focused: false,
    contentRef,
  });
  await rerender({
    active: false,
    enabled: true,
    focused: true,
    contentRef,
  });

  await act(() =>
    result.current.onPageChangeConfirm({
      gesture: false,
      active: true,
      closing: false,
    })
  );

  await rerender({
    active: true,
    enabled: true,
    focused: true,
    contentRef,
  });

  expect(focusMock).toHaveBeenCalledTimes(1);
});

test('does not restore input focus on a later screen visit after a closing gesture is cancelled', async () => {
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

  const { result, rerender } = await renderHook(
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

  await act(() => result.current.onPageChangeStart());

  focusedInputSpy.mockReturnValue(undefined);

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

  await rerender({
    active: false,
    enabled: true,
    focused: false,
    contentRef,
  });
  await rerender({
    active: true,
    enabled: true,
    focused: true,
    contentRef,
  });

  expect(focusMock).not.toHaveBeenCalled();
});

test('does not blur input when closing an Android screen with a gesture while the keyboard is hidden', async () => {
  jest.replaceProperty(Platform, 'OS', 'android');
  jest.spyOn(Keyboard, 'isVisible').mockReturnValue(false);

  const contentRef = createRef<HostInstance>();

  const blurMock = jest.fn();
  const input = { blur: blurMock } as unknown as HostInstance;

  jest.spyOn(TextInput.State, 'currentlyFocusedInput').mockReturnValue(input);

  const { result } = await renderHook(
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

  await act(() => result.current.onPageChangeStart());
  await act(() =>
    result.current.onPageChangeConfirm({
      gesture: true,
      active: true,
      closing: true,
    })
  );

  expect(blurMock).not.toHaveBeenCalled();
});

test('does not dismiss keyboard when Activity shows an unfocused screen again', async () => {
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

  const { rerender } = await render(
    <Activity mode="visible">
      <Test focused />
    </Activity>
  );

  await rerender(
    <Activity mode="visible">
      <Test focused={false} />
    </Activity>
  );

  dismissSpy.mockClear();

  await rerender(
    <Activity mode="hidden">
      <Test focused={false} />
    </Activity>
  );

  await rerender(
    <Activity mode="visible">
      <Test focused={false} />
    </Activity>
  );

  expect(dismissSpy).not.toHaveBeenCalled();
});

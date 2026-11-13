import * as React from 'react';
import { type HostInstance, Keyboard, Platform, TextInput } from 'react-native';

export function useKeyboardManager({
  active,
  enabled,
  focused,
  contentRef,
}: {
  active: boolean;
  enabled: boolean;
  focused: boolean;
  contentRef: React.RefObject<HostInstance | null>;
}) {
  const previouslyFocusedTextInputRef = React.useRef<HostInstance>(undefined);
  const unfocusedScreenTextInputRef = React.useRef<HostInstance>(undefined);
  const closingGestureRef = React.useRef(false);
  const startTimestampRef = React.useRef<number>(0);
  const keyboardTimeoutRef =
    React.useRef<ReturnType<typeof setTimeout>>(undefined);
  const enabledRef = React.useRef(enabled);
  const focusedRef = React.useRef(focused);

  const clearKeyboardTimeout = React.useCallback(() => {
    if (keyboardTimeoutRef.current !== undefined) {
      clearTimeout(keyboardTimeoutRef.current);
      keyboardTimeoutRef.current = undefined;
    }
  }, []);

  const onPageChangeStart = React.useCallback(() => {
    if (!enabledRef.current || !focusedRef.current) {
      return;
    }

    clearKeyboardTimeout();

    // On Android, back button hides keyboard without blurring input,
    // so we need to check if the keyboard is actually visible.
    if (Platform.OS === 'android' && !Keyboard.isVisible()) {
      return;
    }

    const input = TextInput.State.currentlyFocusedInput();

    // When a page change begins, blur the currently focused input
    input?.blur();

    // Store the id of this input so we can refocus it if change was cancelled
    previouslyFocusedTextInputRef.current = input;

    // Store timestamp for touch start
    startTimestampRef.current = Date.now();
  }, [clearKeyboardTimeout]);

  const onPageChangeCancel = React.useCallback(() => {
    if (!enabledRef.current || !focusedRef.current) {
      return;
    }

    clearKeyboardTimeout();

    // The page didn't change, we should restore the focus of text input
    const input = previouslyFocusedTextInputRef.current;

    if (input) {
      // If the interaction was super short we should make sure keyboard won't hide again.

      // Too fast input refocus will result only in keyboard flashing on screen and hiding right away.
      // During first ~100ms keyboard will be dismissed no matter what,
      // so we have to make sure it won't interrupt input refocus logic.
      // That's why when the interaction is shorter than 100ms we add delay so it won't hide once again.
      // Subtracting timestamps makes us sure the delay is executed only when needed.
      if (Date.now() - startTimestampRef.current < 100) {
        keyboardTimeoutRef.current = setTimeout(() => {
          input?.focus();
          previouslyFocusedTextInputRef.current = undefined;
        }, 100);
      } else {
        input?.focus();
        previouslyFocusedTextInputRef.current = undefined;
      }
    }
  }, [clearKeyboardTimeout]);

  const onPageChangeConfirm = React.useCallback(
    ({
      gesture,
      active,
      closing,
    }: {
      gesture: boolean;
      active: boolean;
      closing: boolean;
    }) => {
      if (!enabledRef.current || !focusedRef.current) {
        return;
      }

      if (!closing) {
        // If the screen was reopened without losing focus,
        // e.g. the swipe was blocked by preventing removal
        // We should clear the saved input to avoid refocusing it incorrectly later.
        if (closingGestureRef.current) {
          unfocusedScreenTextInputRef.current = undefined;
          closingGestureRef.current = false;
        }

        onPageChangeCancel();
        return;
      }

      clearKeyboardTimeout();

      if (!gesture) {
        // Always dismiss input, even if we don't have a ref to it
        // We might not have the ref if onPageChangeStart was never called
        // This can happen if page change was not from a gesture
        Keyboard.dismiss();
      } else if (active) {
        const input = previouslyFocusedTextInputRef.current;

        // Dismiss the keyboard only if an input was a focused before
        // This makes sure we don't dismiss input on going back and focusing an input
        input?.blur();
      }

      // If a closing swipe already blurred the input,
      // we can't get it using currentlyFocusedInput() anymore.
      // So we need to use the input that was saved before the blur.
      if (gesture) {
        unfocusedScreenTextInputRef.current =
          previouslyFocusedTextInputRef.current;
        closingGestureRef.current = true;
      }

      // Cleanup the ID on successful page change
      previouslyFocusedTextInputRef.current = undefined;
    },
    [clearKeyboardTimeout, onPageChangeCancel]
  );

  // Dismiss keyboard when screen loses focus (e.g. when pushing a new screen).
  // This handles the "navigate forward" case so we don't dismiss the new screen's
  // auto-focused input from handleTransition.
  React.useLayoutEffect(() => {
    if (
      enabledRef.current &&
      // Check the previous focus value so we only dismiss when focus is lost,
      // and not if the effect re-runs (e.g. because of StrictMode, Activity etc.)
      focusedRef.current &&
      !focused
    ) {
      closingGestureRef.current = false;

      if (
        Platform.OS !== 'web' &&
        // On Android, back button hides keyboard without blurring input,
        // so we need to check if the keyboard is actually visible.
        (Platform.OS !== 'android' || Keyboard.isVisible())
      ) {
        const input = TextInput.State.currentlyFocusedInput();

        if (input && contentRef.current?.contains(input)) {
          unfocusedScreenTextInputRef.current = input;
        }
      }

      Keyboard.dismiss();
    }
  }, [contentRef, focused]);

  React.useEffect(() => {
    if (Platform.OS !== 'web' && focused && active) {
      const input = unfocusedScreenTextInputRef.current;

      if (
        enabledRef.current &&
        input &&
        contentRef.current?.contains(input) &&
        !TextInput.State.currentlyFocusedInput()
      ) {
        input.focus();
      }

      unfocusedScreenTextInputRef.current = undefined;
    }
  }, [active, contentRef, focused]);

  // Dismiss keyboard if native focus is restored to an input in an unfocused screen.
  // This can happen after dismissing a native alert when `autoFocus` is used on iOS.
  React.useEffect(() => {
    const blurInputInScreen = () => {
      if (focusedRef.current || !enabledRef.current) {
        return;
      }

      const input = TextInput.State.currentlyFocusedInput();

      if (input && contentRef.current?.contains(input)) {
        input.blur();
      }
    };

    const subscriptions = [
      Keyboard.addListener('keyboardWillShow', blurInputInScreen),
      Keyboard.addListener('keyboardDidShow', blurInputInScreen),
    ];

    return () => {
      subscriptions.forEach((subscription) => subscription.remove());
    };
  }, [contentRef]);

  React.useLayoutEffect(() => {
    if (!enabled) {
      unfocusedScreenTextInputRef.current = undefined;
    }

    enabledRef.current = enabled;
    focusedRef.current = focused;
  });

  React.useEffect(() => {
    return () => clearKeyboardTimeout();
  }, [clearKeyboardTimeout]);

  return {
    onPageChangeStart,
    onPageChangeConfirm,
    onPageChangeCancel,
  };
}

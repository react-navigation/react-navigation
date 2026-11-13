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
  // Numeric id of the previously focused text input
  // When a gesture didn't change the tab, we can restore the focused input with this
  const previouslyFocusedTextInputRef = React.useRef<HostInstance>(undefined);
  const lastFocusedTextInputRef = React.useRef<HostInstance>(undefined);
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

    const input = TextInput.State.currentlyFocusedInput();

    // FIXME: On Android, the back button hides the keyboard without blurring
    // the input, so focused input alone doesn't mean the keyboard was open.
    const keyboardVisible = Platform.OS !== 'android' || Keyboard.isVisible();

    // Keep focus without a visible Android keyboard, since blurring would
    // lose focus for hardware keyboards and inputs that disable soft input.
    if (keyboardVisible) {
      input?.blur();
    }

    // Only save the input for a cancelled change or retained screen restore
    // when it needed blurring
    previouslyFocusedTextInputRef.current = keyboardVisible ? input : undefined;

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
        // A closing swipe blocked by usePreventRemove reopens without the screen
        // losing focus, so clear the saved input before a later focus change.
        if (closingGestureRef.current) {
          lastFocusedTextInputRef.current = undefined;
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

      // If the input was blurred in onPageChangeStart, it won't be
      // available from currentlyFocusedInput() when the screen loses focus.
      // Save it here so it can be focused again if the screen was retained
      // with navigation.retain(true) and is opened again after going back.
      if (gesture && Platform.OS !== 'web') {
        lastFocusedTextInputRef.current = previouslyFocusedTextInputRef.current;
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
    // Effects re-run when Activity shows a screen and during StrictMode replay.
    // Check the previous focus value so we only dismiss when focus is lost.
    // The ref still holds that value until a later layout effect updates it.
    if (enabledRef.current && focusedRef.current && !focused) {
      closingGestureRef.current = false;

      // FIXME: On Android, the back button hides the keyboard without blurring
      // the input, so focused input alone doesn't mean the keyboard was open.
      if (
        Platform.OS !== 'web' &&
        (Platform.OS !== 'android' || Keyboard.isVisible())
      ) {
        const input = TextInput.State.currentlyFocusedInput();

        if (input && contentRef.current?.contains(input)) {
          lastFocusedTextInputRef.current = input;
        }
      }

      Keyboard.dismiss();
    }
  }, [contentRef, focused]);

  React.useEffect(() => {
    if (Platform.OS !== 'web' && focused && active) {
      const input = lastFocusedTextInputRef.current;

      if (
        enabledRef.current &&
        input &&
        contentRef.current?.contains(input) &&
        !TextInput.State.currentlyFocusedInput()
      ) {
        input.focus();
      }

      lastFocusedTextInputRef.current = undefined;
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

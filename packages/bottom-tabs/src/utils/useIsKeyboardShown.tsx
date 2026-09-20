import * as React from 'react';
import { Keyboard, type KeyboardEvent, Platform } from 'react-native';

export function useIsKeyboardShown() {
  const [isKeyboardShown, setIsKeyboardShown] = React.useState(false);

  React.useEffect(() => {
    // iOS 26+ posts a show notification on every interface rotation with an empty keyboard
    // frame, and never posts a matching hide. Treating those as a keyboard latches this
    // `true` for good, which leaves `tabBarHideOnKeyboard` navigators with no tab bar until
    // the app is restarted. A keyboard that occupies no space is not shown.
    const handleKeyboardShow = (e: KeyboardEvent) => {
      if (e.endCoordinates.height === 0) {
        return;
      }

      setIsKeyboardShown(true);
    };
    const handleKeyboardHide = () => setIsKeyboardShown(false);

    let subscriptions: ReturnType<typeof Keyboard.addListener>[];

    if (Platform.OS === 'ios') {
      subscriptions = [
        Keyboard.addListener('keyboardWillShow', handleKeyboardShow),
        Keyboard.addListener('keyboardWillHide', handleKeyboardHide),
      ];
    } else {
      subscriptions = [
        Keyboard.addListener('keyboardDidShow', handleKeyboardShow),
        Keyboard.addListener('keyboardDidHide', handleKeyboardHide),
      ];
    }

    return () => {
      subscriptions.forEach((s) => s.remove());
    };
  }, []);

  return isKeyboardShown;
}

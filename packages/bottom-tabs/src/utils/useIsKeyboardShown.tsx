import * as React from 'react';
import { Keyboard, Platform } from 'react-native';

export default function useIsKeyboardShown() {
  const [isKeyboardShown, setIsKeyboardShown] = React.useState(false);

  React.useEffect(() => {
    const handleKeyboardShow = () => setIsKeyboardShown(true);
    const handleKeyboardHide = () => setIsKeyboardShown(false);

    if (Platform.OS === 'ios') {
      const subscrA = Keyboard.addListener(
        'keyboardWillShow',
        handleKeyboardShow
      );
      const subscrB = Keyboard.addListener(
        'keyboardWillHide',
        handleKeyboardHide
      );

      return () => {
        subscrA?.remove();
        subscrB?.remove();
      };
    } else {
      const subscrA = Keyboard.addListener(
        'keyboardDidShow',
        handleKeyboardShow
      );
      const subscrB = Keyboard.addListener(
        'keyboardDidHide',
        handleKeyboardHide
      );

      return () => {
        subscrA?.remove();
        subscrB?.remove();
      };
    }
  }, []);

  return isKeyboardShown;
}

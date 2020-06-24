import * as React from 'react';
import { useNavigation } from '@react-navigation/native';

type Props = {
  onWillFocus?: () => void;
  onDidFocus?: () => void;
  onWillBlur?: () => void;
  onDidBlur?: () => void;
};

export default function NavigationEvents(props: Props) {
  const navigation = useNavigation();
  const propsRef = React.useRef(props);

  React.useEffect(() => {
    propsRef.current = props;
  });

  React.useEffect(() => {
    const unsubFocus = navigation.addListener('focus', () => {
      propsRef.current.onWillFocus?.();
    });

    const unsubBlur = navigation.addListener('blur', () => {
      propsRef.current.onWillBlur?.();
    });

    // @ts-expect-error: transitionEnd may not exist on this navigator
    const unsubTransitionEnd = navigation.addListener('transitionEnd', () => {
      if (navigation.isFocused()) {
        propsRef.current.onDidFocus?.();
      } else {
        propsRef.current.onDidBlur?.();
      }
    });

    return () => {
      unsubFocus();
      unsubBlur();
      unsubTransitionEnd();
    };
  }, [navigation]);

  return null;
}

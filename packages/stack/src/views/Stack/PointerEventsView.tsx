import * as React from 'react';
import { Animated, View, ViewProps } from 'react-native';

type Props = ViewProps & {
  active: boolean;
  progress: Animated.AnimatedInterpolation;
  children: React.ReactNode;
};

const TRUE = 1;
const FALSE = 0;

/**
 * Component that automatically computes the `pointerEvents` property
 * whenever position changes.
 */
export default function PointerEventsView({ active, ...rest }: Props) {
  const [pointerEventsEnabled] = React.useState(
    () => new Animated.Value(active ? TRUE : FALSE)
  );

  const root = React.useRef<View | null>(null);

  const setPointerEventsEnabled = React.useCallback((enabled: boolean) => {
    const pointerEvents = enabled ? 'box-none' : 'none';

    root.current && root.current.setNativeProps({ pointerEvents });
  }, []);

  React.useEffect(() => {
    pointerEventsEnabled.setValue(active ? TRUE : FALSE);
    setPointerEventsEnabled(active);
  }, [active, pointerEventsEnabled, setPointerEventsEnabled]);

  return <View ref={root} {...rest} />;
}

import * as React from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import type { EdgeInsets } from 'react-native-safe-area-context';
import type { Layout } from '../types';

type Props = {
  dark: boolean | undefined;
  layout: Layout;
  insets: EdgeInsets;
  style: any;
};

export default function ModalStatusBarManager({
  dark,
  layout,
  insets,
  style,
}: Props) {
  const { dark: darkTheme } = useTheme();
  const [overlapping, setOverlapping] = React.useState(true);

  const enabled = layout.width && layout.height > layout.width;
  const scale = 1 - 20 / layout.width;
  const offset = (insets.top - 34) * scale;

  const flattenedStyle = StyleSheet.flatten(style);
  const translateY = flattenedStyle?.transform?.find(
    (s: any) => s.translateY !== undefined
  )?.translateY;

  React.useEffect(() => {
    if (!enabled) {
      return;
    }

    const listener = ({ value }: { value: number }) => {
      setOverlapping(value < offset);
    };

    const sub = translateY?.addListener(listener);

    return () => translateY?.removeListener(sub);
  }, [enabled, offset, translateY]);

  if (!enabled) {
    return null;
  }

  const darkContent = dark ?? !darkTheme;

  return (
    <StatusBar
      animated
      barStyle={overlapping && darkContent ? 'dark-content' : 'light-content'}
    />
  );
}

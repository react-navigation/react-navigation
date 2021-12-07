import { useTheme } from '@react-navigation/native';
import * as React from 'react';
import { StatusBar, StyleSheet } from 'react-native';
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

  const scale = 1 - 20 / layout.width;
  const offset = (insets.top - 34) * scale;

  const flattenedStyle = StyleSheet.flatten(style);
  const translateY = flattenedStyle?.transform?.find(
    (s: any) => s.translateY !== undefined
  )?.translateY;

  React.useEffect(() => {
    const listener = ({ value }: { value: number }) => {
      setOverlapping(value < offset);
    };

    const sub = translateY?.addListener(listener);

    return () => translateY?.removeListener(sub);
  }, [offset, translateY]);

  const darkContent = dark ?? !darkTheme;

  return (
    <StatusBar
      animated
      barStyle={overlapping && darkContent ? 'dark-content' : 'light-content'}
    />
  );
}

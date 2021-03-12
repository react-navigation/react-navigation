import * as React from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import type { EdgeInsets } from 'react-native-safe-area-context';
import type { Layout } from '../types';

type Props = {
  layout: Layout;
  insets: EdgeInsets;
  style: any;
};

export default function ModalStatusBarManager({
  layout,
  insets,
  style,
}: Props) {
  const { dark } = useTheme();
  const [isDark, setIsDark] = React.useState(true);

  const flattenedStyle = StyleSheet.flatten(style);
  const translateY = flattenedStyle?.transform?.find(
    (s: any) => s.translateY !== undefined
  )?.translateY;

  React.useEffect(() => {
    const isLandscape = layout.width > layout.height;
    const scale = 1 - 20 / layout.width;

    if (dark || isLandscape || !layout.width) {
      return;
    }

    const listener = ({ value }: { value: number }) => {
      const isOverlappingStatusBar = value / scale < insets.top / 3;
      setIsDark(isOverlappingStatusBar);
    };

    const sub = translateY?.addListener(listener);

    return () => translateY?.removeListener(sub);
  }, [dark, insets.top, layout.height, layout.width, translateY]);

  if (dark) {
    return null;
  }

  return (
    <StatusBar animated barStyle={isDark ? 'dark-content' : 'light-content'} />
  );
}

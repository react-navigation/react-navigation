import { UNSTABLE_CornerInset, useLocale } from '@react-navigation/native';
import * as React from 'react';
import {
  Platform,
  ScrollView,
  type ScrollViewProps,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DrawerPositionContext } from '../utils/DrawerPositionContext';

type Props = ScrollViewProps & {
  children: React.ReactNode;
  ref?: React.Ref<ScrollView>;
};

const SPACING = 12;

export function DrawerContentScrollView({
  contentInsetAdjustmentBehavior = 'automatic',
  contentContainerStyle,
  style,
  children,
  ref,
  ...rest
}: Props) {
  const drawerPosition = React.use(DrawerPositionContext);
  const insets = useSafeAreaInsets();
  const { direction } = useLocale();

  const isRight =
    direction === 'rtl'
      ? drawerPosition === 'left'
      : drawerPosition === 'right';

  return (
    <ScrollView
      {...rest}
      ref={ref}
      contentInsetAdjustmentBehavior={contentInsetAdjustmentBehavior}
      contentContainerStyle={[
        {
          paddingTop:
            SPACING + Platform.select({ ios: 0, default: insets.top }),
          paddingBottom:
            SPACING + Platform.select({ ios: 0, default: insets.bottom }),
          paddingStart:
            SPACING +
            (!isRight ? Platform.select({ ios: 0, default: insets.left }) : 0),
          paddingEnd:
            SPACING +
            (isRight ? Platform.select({ ios: 0, default: insets.right }) : 0),
        },
        contentContainerStyle,
      ]}
      style={[styles.container, style]}
    >
      {Platform.OS === 'ios' && contentInsetAdjustmentBehavior !== 'never' && (
        <UNSTABLE_CornerInset direction="vertical" edge="top" />
      )}
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

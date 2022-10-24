import {
  CommonActions,
  Link,
  Route,
  useLinkBuilder,
} from '@react-navigation/native';
import * as React from 'react';
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import PlatformPressable from './PlatformPressable';

export default function LinkPressable({
  route,
  children,
  style,
  onPress,
  onLongPress,
  onPressIn,
  onPressOut,
  accessibilityRole,
  ...rest
}: Omit<React.ComponentProps<typeof PlatformPressable>, 'style'> & {
  style: StyleProp<ViewStyle>;
} & {
  route?: Route<string>;
  children: React.ReactNode;
  onPress?: () => void;
}) {
  const { buildHref } = useLinkBuilder();

  if (Platform.OS === 'web' && route) {
    // React Native Web doesn't forward `onClick` if we use `TouchableWithoutFeedback`.
    // We need to use `onClick` to be able to prevent default browser handling of links.
    return (
      <Link
        {...rest}
        href={buildHref(route.name, route.params)}
        action={CommonActions.navigate(route.name, route.params)}
        style={[styles.button, style]}
        onPress={(e: any) => {
          if (
            !(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) && // ignore clicks with modifier keys
            (e.button == null || e.button === 0) // ignore everything but left clicks
          ) {
            e.preventDefault();
            onPress?.(e);
          }
        }}
        // types for PressableProps and TextProps are incompatible with each other by `null` so we
        // can't use {...rest} for these 3 props
        onLongPress={onLongPress ?? undefined}
        onPressIn={onPressIn ?? undefined}
        onPressOut={onPressOut ?? undefined}
      >
        {children}
      </Link>
    );
  } else {
    return (
      <PlatformPressable
        {...rest}
        accessibilityRole={accessibilityRole}
        onPress={onPress}
      >
        <View style={style}>{children}</View>
      </PlatformPressable>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    display: 'flex',
  },
});

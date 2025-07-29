import * as React from 'react';
import {
  Platform,
  type StyleProp,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native';

type Props = {
  visible: boolean;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

const FAR_FAR_AWAY = 30000; // this should be big enough to move the whole view out of its container

export function ResourceSavingView({
  visible,
  children,
  style,
  ...rest
}: Props) {
  if (Platform.OS === 'web') {
    return (
      <View
        // @ts-expect-error: hidden exists on web, but not in React Native
        hidden={!visible}
        style={[
          {
            display: visible ? 'flex' : 'none',
            pointerEvents: visible ? 'auto' : 'none',
          },
          styles.container,
          style,
        ]}
        {...rest}
      >
        {children}
      </View>
    );
  }

  return (
    <View
      style={[styles.container, style]}
      // box-none doesn't seem to work properly on Android
      pointerEvents={visible ? 'auto' : 'none'}
    >
      <View
        collapsable={false}
        removeClippedSubviews={
          // On iOS & macOS, set removeClippedSubviews to true only when not focused
          // This is an workaround for a bug where the clipped view never re-appears
          Platform.OS === 'ios' || Platform.OS === 'macos' ? !visible : true
        }
        style={visible ? styles.attached : styles.detached}
      >
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  attached: {
    flex: 1,
    pointerEvents: 'auto',
  },
  detached: {
    flex: 1,
    top: FAR_FAR_AWAY,
    pointerEvents: 'none',
  },
});

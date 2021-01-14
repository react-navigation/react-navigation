import * as React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import {
  Screen,
  screensEnabled,
  // @ts-ignore
  shouldUseActivityState,
} from 'react-native-screens';

type Props = {
  isVisible: boolean;
  children: React.ReactNode;
  enabled: boolean;
  style?: any;
};

const FAR_FAR_AWAY = 30000; // this should be big enough to move the whole view out of its container

export default function ResourceSavingScene({
  isVisible,
  children,
  style,
  ...rest
}: Props) {
  // react-native-screens is buggy on web
  if (screensEnabled?.() && Platform.OS !== 'web') {
    if (shouldUseActivityState) {
      return (
        // @ts-expect-error: there was an `active` prop and no `activityState` in older version and stackPresentation was required
        <Screen activityState={isVisible ? 2 : 0} style={style} {...rest}>
          {children}
        </Screen>
      );
    } else {
      return (
        // @ts-expect-error: there was an `active` prop and no `activityState` in older version and stackPresentation was required
        <Screen active={isVisible ? 1 : 0} style={style} {...rest}>
          {children}
        </Screen>
      );
    }
  }

  return (
    <View
      // @ts-expect-error: hidden exists on web, but not in React Native
      hidden={!isVisible}
      style={[
        styles.container,
        Platform.OS === 'web' ? { display: isVisible ? 'flex' : 'none' } : null,
        style,
      ]}
      collapsable={false}
      removeClippedSubviews={
        // On iOS, set removeClippedSubviews to true only when not focused
        // This is an workaround for a bug where the clipped view never re-appears
        Platform.OS === 'ios' ? !isVisible : true
      }
      pointerEvents={isVisible ? 'auto' : 'none'}
      {...rest}
    >
      <View
        style={
          Platform.OS === 'web'
            ? null
            : isVisible
            ? styles.attached
            : styles.detached
        }
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
  },
  detached: {
    flex: 1,
    top: FAR_FAR_AWAY,
  },
});

import * as React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Screen, screensEnabled } from 'react-native-screens';

// eslint-disable-next-line import/no-commonjs
const ReactNativeScreens = require('react-native-screens');

type Props = {
  isVisible: boolean;
  children: React.ReactNode;
  enabled: boolean;
  style?: any;
};

const FAR_FAR_AWAY = 30000; // this should be big enough to move the whole view out of its container

export default class ResourceSavingScene extends React.Component<Props> {
  render() {
    // react-native-screens is buggy on web
    if (screensEnabled?.() && Platform.OS !== 'web') {
      const { isVisible, ...rest } = this.props;

      // @ts-ignore
      if (ReactNativeScreens.shouldUseActivityState) {
        return (
          // @ts-expect-error: there was an `active` prop and no `activityState` in older version and stackPresentation was required
          <Screen activityState={isVisible ? 2 : 0} {...rest} />
        );
      } else {
        return (
          // @ts-expect-error: there was an `active` prop and no `activityState` in older version and stackPresentation was required
          <Screen active={isVisible ? 1 : 0} {...rest} />
        );
      }
    }

    const { isVisible, children, style, ...rest } = this.props;

    return (
      <View
        style={[
          styles.container,
          Platform.OS === 'web'
            ? { display: isVisible ? 'flex' : 'none' }
            : { overflow: 'hidden' },
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
        <View style={isVisible ? styles.attached : styles.detached}>
          {children}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  attached: {
    flex: 1,
  },
  detached: {
    flex: 1,
    top: FAR_FAR_AWAY,
  },
});

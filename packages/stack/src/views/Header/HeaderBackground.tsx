import * as React from 'react';
import { StyleSheet, Platform, ViewProps } from 'react-native';
import Animated from 'react-native-reanimated';

export default function HeaderBackground({ style, ...rest }: ViewProps) {
  return <Animated.View style={[styles.container, style]} {...rest} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    ...Platform.select({
      android: {
        elevation: 4,
      },
      ios: {
        shadowColor: 'rgba(0, 0, 0, 0.3)',
        shadowOpacity: 0.85,
        shadowRadius: 0,
        shadowOffset: {
          width: 0,
          height: StyleSheet.hairlineWidth,
        },
      },
      default: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: 'rgba(0, 0, 0, 0.20)',
      },
    }),
  },
});

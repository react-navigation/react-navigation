import * as React from 'react';
import { View, StyleSheet, Platform, ViewProps } from 'react-native';

type Props = ViewProps;

export default function HeaderBackground({ style, ...rest }: Props) {
  return <View style={[styles.container, style]} {...rest} />;
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
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#A7A7AA',
      },
      default: {
        // https://github.com/necolas/react-native-web/issues/44
        // Material Design
        boxShadow: `0 2px 4px -1px rgba(0,0,0,0.2), 0 4px 5px 0 rgba(0,0,0,0.14), 0 1px 10px 0 rgba(0,0,0,0.12)`,
      },
    }),
  },
});

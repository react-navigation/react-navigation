import * as React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { StackNavigationState, StackActions } from '@react-navigation/routers';

import {
  // @ts-ignore
  ScreenStack,
  Screen,
  // eslint-disable-next-line import/no-unresolved
} from 'react-native-screens';
import HeaderConfig from './HeaderConfig';
import {
  NativeStackNavigationHelpers,
  NativeStackDescriptorMap,
} from '../types';

type Props = {
  state: StackNavigationState;
  navigation: NativeStackNavigationHelpers;
  descriptors: NativeStackDescriptorMap;
};

export default function StackView({ state, navigation, descriptors }: Props) {
  return (
    <ScreenStack style={styles.scenes}>
      {state.routes.map(route => {
        const { options, render: renderScene } = descriptors[route.key];
        const { presentation = 'push', contentStyle } = options;

        return (
          // @ts-ignore
          <Screen
            key={route.key}
            style={StyleSheet.absoluteFill}
            stackPresentation={presentation}
            onDismissed={() => {
              navigation.dispatch({
                ...StackActions.pop(),
                source: route.key,
                target: state.key,
              });
            }}
          >
            <HeaderConfig {...options} route={route} />
            <View style={[styles.content, contentStyle]}>{renderScene()}</View>
          </Screen>
        );
      })}
    </ScreenStack>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: '#eee',
    marginTop: Platform.OS === 'android' ? 56 : 0,
  },
  scenes: {
    flex: 1,
  },
});

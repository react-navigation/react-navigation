import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { StackNavigationState, StackActions } from '@react-navigation/routers';

import {
  // @ts-ignore
  ScreenStack,
  Screen as ScreenComponent,
  ScreenProps,
  // eslint-disable-next-line import/no-unresolved
} from 'react-native-screens';
import HeaderConfig from './HeaderConfig';
import {
  NativeStackNavigationHelpers,
  NativeStackDescriptorMap,
} from '../types';

const Screen = (ScreenComponent as unknown) as React.ComponentType<
  ScreenProps & {
    stackPresentation?: 'push' | 'modal' | 'transparentModal';
    stackAnimation?: 'default' | 'fade' | 'none';
    onDismissed?: () => void;
  }
>;

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
        const { presentation = 'push', animation, contentStyle } = options;

        return (
          <Screen
            key={route.key}
            style={StyleSheet.absoluteFill}
            stackPresentation={presentation}
            stackAnimation={animation}
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
  },
  scenes: {
    flex: 1,
  },
});

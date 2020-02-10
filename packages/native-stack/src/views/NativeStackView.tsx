import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  ScreenStack,
  Screen as ScreenComponent,
  ScreenProps,
  // eslint-disable-next-line import/no-unresolved
} from 'react-native-screens';
import {
  StackNavigationState,
  StackActions,
  useTheme,
} from '@react-navigation/native';
import HeaderConfig from './HeaderConfig';
import {
  NativeStackNavigationHelpers,
  NativeStackDescriptorMap,
} from '../types';

const Screen = (ScreenComponent as unknown) as React.ComponentType<ScreenProps>;

type Props = {
  state: StackNavigationState;
  navigation: NativeStackNavigationHelpers;
  descriptors: NativeStackDescriptorMap;
};

export default function NativeStackView({
  state,
  navigation,
  descriptors,
}: Props) {
  const { colors } = useTheme();

  return (
    <ScreenStack style={styles.container}>
      {state.routes.map(route => {
        const { options, render: renderScene } = descriptors[route.key];
        const {
          gestureEnabled,
          stackPresentation = 'push',
          stackAnimation,
          contentStyle,
        } = options;

        return (
          <Screen
            key={route.key}
            style={StyleSheet.absoluteFill}
            gestureEnabled={gestureEnabled}
            stackPresentation={stackPresentation}
            stackAnimation={stackAnimation}
            onAppear={() => {
              navigation.emit({
                type: 'appear',
                target: route.key,
              });
            }}
            onDismissed={() => {
              navigation.emit({
                type: 'dismiss',
                target: route.key,
              });

              navigation.dispatch({
                ...StackActions.pop(),
                source: route.key,
                target: state.key,
              });
            }}
          >
            <HeaderConfig {...options} route={route} />
            <View
              style={[
                styles.container,
                { backgroundColor: colors.background },
                contentStyle,
              ]}
            >
              {renderScene()}
            </View>
          </Screen>
        );
      })}
    </ScreenStack>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

import {
  HeaderBackContext,
  HeaderHeightContext,
  HeaderShownContext,
} from '@react-navigation/elements';
import { usePreventRemoveContext, useTheme } from '@react-navigation/native';
import * as React from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { FormSheet } from 'react-native-screens';

import type {
  NativeStackDescriptor,
  NativeStackNavigationHelpers,
} from '../../types';
import { AnimatedHeaderHeightContext } from '../../utils/useAnimatedHeaderHeight';

type Props = {
  descriptor: NativeStackDescriptor;
  navigation: NativeStackNavigationHelpers;
  isFocused: boolean;
  isPopped: boolean;
  onRemovePoppedRoute: (key: string) => void;
  onNativeDismiss: (markNativelyDismissed: boolean) => void;
  onNativeDismissPrevented: () => void;
};

export function SheetScreen({
  descriptor,
  navigation,
  isFocused,
  isPopped,
  onRemovePoppedRoute,
  onNativeDismiss,
  onNativeDismissPrevented,
}: Props) {
  const { preventedRoutes } = usePreventRemoveContext();
  const { colors } = useTheme();

  const { options, route } = descriptor;

  const isRemovePrevented = preventedRoutes[route.key]?.preventRemove === true;
  const [animatedHeaderHeight] = React.useState(() => new Animated.Value(0));

  return (
    <FormSheet
      isOpen={isFocused}
      detents={options.sheetAllowedDetents}
      initialDetentIndex={options.sheetInitialDetentIndex}
      largestUndimmedDetentIndex={options.sheetLargestUndimmedDetentIndex}
      preferredCornerRadius={options.sheetCornerRadius}
      prefersGrabberVisible={options.sheetGrabberVisible}
      prefersScrollingExpandsWhenScrolledToEdge={
        options.sheetExpandsWhenScrolledToEdge
      }
      preventNativeDismiss={isRemovePrevented}
      onWillAppear={() =>
        navigation.emit({
          type: 'transitionStart',
          data: { closing: false },
          target: route.key,
        })
      }
      onDidAppear={() =>
        navigation.emit({
          type: 'transitionEnd',
          data: { closing: false },
          target: route.key,
        })
      }
      onWillDisappear={() =>
        navigation.emit({
          type: 'transitionStart',
          data: { closing: true },
          target: route.key,
        })
      }
      onDidDisappear={() => {
        navigation.emit({
          type: 'transitionEnd',
          data: { closing: true },
          target: route.key,
        });

        if (isPopped) {
          onRemovePoppedRoute(route.key);
        }
      }}
      onDetentChanged={(event) => {
        navigation.emit({
          type: 'sheetDetentChange',
          data: { index: event.nativeEvent.index, stable: true },
          target: route.key,
        });
      }}
      onNativeDismiss={() => {
        onNativeDismiss(!isRemovePrevented);
      }}
      onNativeDismissPrevented={onNativeDismissPrevented}
    >
      <View
        style={[
          options.sheetAllowedDetents === 'fitToContents'
            ? styles.fit
            : styles.fill,
          { backgroundColor: colors.background },
          options.contentStyle,
        ]}
      >
        <AnimatedHeaderHeightContext.Provider value={animatedHeaderHeight}>
          <HeaderHeightContext.Provider value={0}>
            <HeaderShownContext.Provider value={false}>
              <HeaderBackContext.Provider value={undefined}>
                {descriptor.render()}
              </HeaderBackContext.Provider>
            </HeaderShownContext.Provider>
          </HeaderHeightContext.Provider>
        </AnimatedHeaderHeightContext.Provider>
      </View>
    </FormSheet>
  );
}

const styles = StyleSheet.create({
  fit: {
    width: '100%',
  },
  fill: {
    flex: 1,
  },
});

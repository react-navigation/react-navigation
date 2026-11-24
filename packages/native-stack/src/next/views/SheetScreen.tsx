import {
  HeaderBackContext,
  HeaderHeightContext,
  HeaderShownContext,
} from '@react-navigation/elements';
import { usePreventRemoveContext } from '@react-navigation/native';
import * as React from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { FormSheet, PageSheet } from 'react-native-screens';

import type {
  NativeStackDescriptor,
  NativeStackNavigationHelpers,
} from '../../types';
import { AnimatedHeaderHeightContext } from '../../utils/useAnimatedHeaderHeight';
import { getTransitionEventHandlers } from './getTransitionEventHandlers';

type Props = {
  descriptor: NativeStackDescriptor;
  navigation: NativeStackNavigationHelpers;
  isFocused: boolean;
  onRemovePoppedRoute: (key: string) => void;
  onNativeDismiss: (key: string) => void;
  onNativeDismissPrevented: (key: string) => void;
};

export const SheetScreen = React.memo(function SheetScreen({
  descriptor,
  navigation,
  isFocused,
  onRemovePoppedRoute,
  onNativeDismiss,
  onNativeDismissPrevented,
}: Props) {
  const { preventedRoutes } = usePreventRemoveContext();

  const { options, route } = descriptor;

  const isRemovePrevented = preventedRoutes[route.key]?.preventRemove === true;
  const [animatedHeaderHeight] = React.useState(() => new Animated.Value(0));

  const transitionEventHandlers = getTransitionEventHandlers(
    navigation,
    route.key
  );

  const Sheet = options.presentation === 'pageSheet' ? PageSheet : FormSheet;

  return (
    <Sheet
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
      {...transitionEventHandlers}
      onDidDisappear={() => {
        transitionEventHandlers.onDidDisappear();
        onRemovePoppedRoute(route.key);
      }}
      onDetentChanged={(event) => {
        navigation.emit({
          type: 'sheetDetentChange',
          data: { index: event.nativeEvent.index, stable: true },
          target: route.key,
        });
      }}
      onNativeDismiss={() => {
        onNativeDismiss(route.key);
      }}
      onNativeDismissPrevented={() => {
        onNativeDismissPrevented(route.key);
      }}
    >
      <View
        style={[
          options.sheetAllowedDetents === 'fitToContents'
            ? styles.fit
            : styles.fill,
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
    </Sheet>
  );
});

const styles = StyleSheet.create({
  fit: {
    width: '100%',
  },
  fill: {
    flex: 1,
  },
});

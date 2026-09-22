import { getHeaderTitle, HeaderBackContext } from '@react-navigation/elements';
import {
  NavigationProvider,
  usePreventRemoveContext,
  useTheme,
} from '@react-navigation/native';
import * as React from 'react';
import { Platform } from 'react-native';
import { Stack } from 'react-native-screens';

import type {
  NativeStackDescriptor,
  NativeStackNavigationHelpers,
} from '../../types';
import { CardContent } from './CardContent';
import { useHeaderConfig } from './useHeaderConfig';

type Props = {
  descriptor: NativeStackDescriptor;
  previousDescriptor: NativeStackDescriptor | undefined;
  navigation: NativeStackNavigationHelpers;
  isFocused: boolean;
  isBeforeLast: boolean;
  isPopped: boolean;
  isDetached: boolean;
  hasNestedState: boolean;
  onRemovePoppedRoute: (key: string) => void;
  onNativeDismiss: (options: {
    key: string;
    markNativelyDismissed: boolean;
  }) => void;
  onNativeDismissPrevented: (key: string) => void;
};

export const CardScreen = React.memo(function CardScreen({
  descriptor,
  previousDescriptor,
  navigation,
  isFocused,
  isBeforeLast,
  isPopped,
  isDetached,
  hasNestedState,
  onRemovePoppedRoute,
  onNativeDismiss,
  onNativeDismissPrevented,
}: Props) {
  const { colors } = useTheme();
  const { preventedRoutes } = usePreventRemoveContext();

  const parentHeaderBack = React.use(HeaderBackContext);

  const { route, options } = descriptor;

  const {
    header,
    headerLeft,
    headerRight,
    headerTitle,
    headerBackTitle,
    headerTintColor,
    inactiveBehavior = 'pause',
  } = options;

  const tintColor =
    headerTintColor ?? (Platform.OS === 'ios' ? colors.primary : colors.text);

  const hasCustomHeader = header != null;

  const headerTitleText = getHeaderTitle(options, route.name);

  const previousTitle =
    previousDescriptor == null
      ? parentHeaderBack?.title
      : getHeaderTitle(
          previousDescriptor.options,
          previousDescriptor.route.name
        );

  const canGoBack = previousDescriptor != null || parentHeaderBack != null;

  const headerBack = React.useMemo(
    () => (canGoBack ? { href: undefined, title: previousTitle } : undefined),
    [canGoBack, previousTitle]
  );

  const headerLeftElement = hasCustomHeader
    ? null
    : headerLeft?.({
        tintColor,
        canGoBack,
        label: headerBackTitle ?? headerBack?.title,
        href: undefined,
      });

  const headerTitleElement =
    !hasCustomHeader && typeof headerTitle === 'function'
      ? headerTitle({
          tintColor,
          children: headerTitleText,
        })
      : null;

  const headerRightElement = hasCustomHeader
    ? null
    : headerRight?.({
        tintColor,
        canGoBack,
      });

  const {
    platformConfig,
    headerConfigRef,
    usesHeaderLeftElement,
    headerBackgroundMode,
  } = useHeaderConfig({
    options,
    hasCustomHeader,
    headerLeftElement,
    headerRightElement,
    headerTitleElement,
    headerTitleText,
    canGoBack,
    tintColor,
  });

  const isRemovePrevented = preventedRoutes[route.key]?.preventRemove;
  // Nested navigators clean up `route.state` when the screen is paused with `Activity`
  // So we remember if the route had state until the screen is removed
  const [hadNestedState, setHadNestedState] = React.useState(hasNestedState);

  if (hasNestedState && !hadNestedState) {
    setHadNestedState(true);
  }

  let activityMode: 'normal' | 'inert' | 'paused' | 'unmounted';

  if (isPopped) {
    // The screen is animating out, so don't let it handle any interaction
    activityMode = 'inert';
  } else if (
    // Render focused screens normally
    isFocused ||
    // Unpause previous screen so update isn't delayed for swipe back
    isBeforeLast ||
    // Unpause preloaded and retained screens so updates are visible
    // This lets effects on those screens run
    isDetached
  ) {
    activityMode = 'normal';
  } else {
    switch (inactiveBehavior) {
      case 'none':
        activityMode = 'normal';
        break;
      case 'unmount':
        activityMode = hadNestedState ? 'paused' : 'unmounted';
        break;
      case 'pause':
        activityMode = 'paused';
        break;
    }
  }

  return (
    <Stack.Screen
      screenKey={route.key}
      activityMode={isPopped || isDetached ? 'detached' : 'attached'}
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
      onDidDisappear={() =>
        navigation.emit({
          type: 'transitionEnd',
          data: { closing: true },
          target: route.key,
        })
      }
      onDismiss={onRemovePoppedRoute}
      onNativeDismiss={() => {
        onNativeDismiss({ key: route.key, markNativelyDismissed: true });
      }}
      onNativeDismissPrevented={() => {
        onNativeDismissPrevented(route.key);
      }}
    >
      <NavigationProvider navigation={descriptor.navigation} route={route}>
        <CardContent
          descriptor={descriptor}
          headerBack={headerBack}
          activityMode={activityMode}
          backgroundColor={colors.background}
          headerBackgroundMode={headerBackgroundMode}
        />
        <Stack.HeaderConfig
          ref={headerConfigRef}
          title={headerTitleElement == null ? headerTitleText : undefined}
          subtitle={
            typeof options.unstable_headerSubtitle === 'string'
              ? options.unstable_headerSubtitle
              : undefined
          }
          hidden={hasCustomHeader || options.headerShown === false}
          transparent={
            (options.headerBackground != null &&
              headerBackgroundMode === 'screen') ||
            options.headerTransparent
          }
          backButtonHidden={
            options.headerBackVisible === false ||
            !canGoBack ||
            (usesHeaderLeftElement && options.headerBackVisible !== true)
          }
          {...platformConfig}
        />
      </NavigationProvider>
    </Stack.Screen>
  );
});

import { getHeaderTitle, HeaderBackContext } from '@react-navigation/elements';
import {
  NavigationProvider,
  usePreventRemoveContext,
  useTheme,
} from '@react-navigation/native';
import * as React from 'react';
import { Platform } from 'react-native';
import {
  Stack,
  type StackScreenAnimation,
  type StackScreenAnimationPresetName,
} from 'react-native-screens';

import type {
  NativeStackDescriptor,
  NativeStackNavigationHelpers,
  NativeStackNavigationOptions,
} from '../../types';
import { CardContent } from './CardContent';
import { getTransitionEventHandlers } from './getTransitionEventHandlers';
import { useHeaderConfig } from './useHeaderConfig';

const ANIMATION_PRESETS: Partial<
  Record<
    NonNullable<NativeStackNavigationOptions['animation']>,
    StackScreenAnimationPresetName
  >
> = {
  default: 'default',
  none: 'none',
  fade: 'fade',
  fade_from_bottom: 'fadeFromBottom',
  slide_from_bottom: 'slideFromBottom',
  slide_from_right: 'slideFromRight',
  slide_from_left: 'slideFromLeft',
  ios_from_right: 'iosFromRight',
  ios_from_left: 'iosFromLeft',
};

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
  onNativeDismiss: (key: string) => void;
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

  const isRemovePrevented = preventedRoutes[route.key]?.preventRemove === true;

  const {
    platformConfig,
    headerConfigRef,
    usesHeaderLeftElement,
    rendersHeaderBackgroundInScreen,
  } = useHeaderConfig({
    options,
    hasCustomHeader,
    headerLeftElement,
    headerRightElement,
    headerTitleElement,
    headerTitleText,
    canGoBack,
    tintColor,
    isRemovePrevented,
  });

  // Nested navigators clean up `route.state` when the screen is paused with `Activity`
  // So we remember if the route had state until the screen is removed
  const [hadNestedState, setHadNestedState] = React.useState(hasNestedState);

  if (hasNestedState && !hadNestedState) {
    setHadNestedState(true);
  }

  let contentActivityMode: 'normal' | 'inert' | 'paused' | 'unmounted';

  if (isPopped) {
    // The screen is animating out, so don't let it handle any interaction
    contentActivityMode = 'inert';
  } else if (
    // Render focused screens normally
    isFocused ||
    // Unpause previous screen so update isn't delayed for swipe back
    isBeforeLast ||
    // Unpause preloaded and retained screens so updates are visible
    // This lets effects on those screens run
    isDetached
  ) {
    contentActivityMode = 'normal';
  } else {
    switch (inactiveBehavior) {
      case 'none':
        contentActivityMode = 'normal';
        break;
      case 'unmount':
        contentActivityMode = hadNestedState ? 'paused' : 'unmounted';
        break;
      case 'pause':
        contentActivityMode = 'paused';
        break;
    }
  }

  const animationPreset =
    options.animation == null
      ? undefined
      : ANIMATION_PRESETS[options.animation];

  const animation: StackScreenAnimation | undefined =
    animationPreset == null ||
    animationPreset === 'default' ||
    animationPreset === 'none' ||
    options.animationDuration == null
      ? animationPreset
      : {
          type: 'preset',
          name: animationPreset,
          duration: options.animationDuration,
        };

  return (
    <Stack.Screen
      screenKey={route.key}
      activityMode={isPopped || isDetached ? 'detached' : 'attached'}
      preventNativeDismiss={isRemovePrevented}
      animation={animation}
      replaceAnimation={options.animationTypeForReplace ?? 'push'}
      {...getTransitionEventHandlers(navigation, route.key)}
      onDismiss={onRemovePoppedRoute}
      onNativeDismiss={onNativeDismiss}
      onNativeDismissPrevented={() => {
        onNativeDismissPrevented(route.key);
      }}
    >
      <NavigationProvider navigation={descriptor.navigation} route={route}>
        <CardContent
          descriptor={descriptor}
          headerBack={headerBack}
          activityMode={contentActivityMode}
          backgroundColor={colors.background}
          rendersHeaderBackgroundInScreen={rendersHeaderBackgroundInScreen}
        />
        <Stack.HeaderConfig
          ref={headerConfigRef}
          // iOS uses the title for the back button and back menu of the next screen
          // So we pass it even when a custom title element replaces it in the header
          title={
            Platform.OS === 'ios' || headerTitleElement == null
              ? headerTitleText
              : undefined
          }
          subtitle={
            typeof options.unstable_headerSubtitle === 'string'
              ? options.unstable_headerSubtitle
              : undefined
          }
          hidden={hasCustomHeader || options.headerShown === false}
          transparent={
            (options.headerBackground != null &&
              rendersHeaderBackgroundInScreen) ||
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

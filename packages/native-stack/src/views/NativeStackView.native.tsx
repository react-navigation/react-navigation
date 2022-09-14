import {
  getDefaultHeaderHeight,
  getHeaderTitle,
  HeaderBackContext,
  HeaderHeightContext,
  HeaderShownContext,
  SafeAreaProviderCompat,
} from '@react-navigation/elements';
import {
  NavigationContext,
  NavigationRouteContext,
  ParamListBase,
  Route,
  StackActions,
  StackNavigationState,
  usePreventRemoveContext,
  useTheme,
} from '@react-navigation/native';
import * as React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import {
  useSafeAreaFrame,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import type { ScreenProps } from 'react-native-screens';
import {
  Screen,
  ScreenStack,
  StackPresentationTypes,
} from 'react-native-screens';
import warnOnce from 'warn-once';

import type {
  NativeStackDescriptor,
  NativeStackDescriptorMap,
  NativeStackNavigationHelpers,
  NativeStackNavigationOptions,
} from '../types';
import useDismissedRouteError from '../utils/useDismissedRouteError';
import useInvalidPreventRemoveError from '../utils/useInvalidPreventRemoveError';
import DebugContainer from './DebugContainer';
import HeaderConfig from './HeaderConfig';

const isAndroid = Platform.OS === 'android';

const MaybeNestedStack = ({
  options,
  route,
  presentation,
  headerHeight,
  children,
}: {
  options: NativeStackNavigationOptions;
  route: Route<string>;
  presentation: Exclude<StackPresentationTypes, 'push'> | 'card';
  headerHeight: number;
  children: React.ReactNode;
}) => {
  const { colors } = useTheme();
  const { header, headerShown = true, contentStyle } = options;

  const isHeaderInModal = isAndroid
    ? false
    : presentation !== 'card' && headerShown === true && header === undefined;

  const headerShownPreviousRef = React.useRef(headerShown);

  React.useEffect(() => {
    warnOnce(
      !isAndroid &&
        presentation !== 'card' &&
        headerShownPreviousRef.current !== headerShown,
      `Dynamically changing 'headerShown' in modals will result in remounting the screen and losing all local state. See options for the screen '${route.name}'.`
    );

    headerShownPreviousRef.current = headerShown;
  }, [headerShown, presentation, route.name]);

  const content = (
    <DebugContainer
      style={[
        styles.container,
        presentation !== 'transparentModal' &&
          presentation !== 'containedTransparentModal' && {
            backgroundColor: colors.background,
          },
        contentStyle,
      ]}
      stackPresentation={presentation === 'card' ? 'push' : presentation}
    >
      {children}
    </DebugContainer>
  );

  if (isHeaderInModal) {
    return (
      <ScreenStack style={styles.container}>
        <Screen enabled style={StyleSheet.absoluteFill}>
          <HeaderConfig
            {...options}
            route={route}
            headerHeight={headerHeight}
            canGoBack
          />
          {content}
        </Screen>
      </ScreenStack>
    );
  }

  return content;
};

type SceneViewProps = {
  index: number;
  descriptor: NativeStackDescriptor;
  previousDescriptor?: NativeStackDescriptor;
  nextDescriptor?: NativeStackDescriptor;
  onWillDisappear: () => void;
  onAppear: () => void;
  onDisappear: () => void;
  onDismissed: ScreenProps['onDismissed'];
  onHeaderBackButtonClicked: () => void;
  onNativeDismissCancelled: ScreenProps['onDismissed'];
};

const SceneView = ({
  descriptor,
  previousDescriptor,
  nextDescriptor,
  index,
  onWillDisappear,
  onAppear,
  onDisappear,
  onDismissed,
  onHeaderBackButtonClicked,
  onNativeDismissCancelled,
}: SceneViewProps) => {
  const { route, navigation, options, render } = descriptor;
  const {
    animationDuration,
    animationTypeForReplace = 'push',
    gestureEnabled,
    header,
    headerBackButtonMenuEnabled,
    headerShown,
    autoHideHomeIndicator,
    navigationBarColor,
    navigationBarHidden,
    orientation,
    statusBarAnimation,
    statusBarHidden,
    statusBarStyle,
    statusBarTranslucent,
    statusBarColor,
  } = options;

  let {
    animation,
    customAnimationOnGesture,
    fullScreenGestureEnabled,
    presentation = 'card',
    gestureDirection = presentation === 'card' ? 'horizontal' : 'vertical',
  } = options;

  if (gestureDirection === 'vertical' && Platform.OS === 'ios') {
    // for `vertical` direction to work, we need to set `fullScreenGestureEnabled` to `true`
    // so the screen can be dismissed from any point on screen.
    // `customAnimationOnGesture` needs to be set to `true` so the `animation` set by user can be used,
    // otherwise `simple_push` will be used.
    // Also, the default animation for this direction seems to be `slide_from_bottom`.
    if (fullScreenGestureEnabled === undefined) {
      fullScreenGestureEnabled = true;
    }
    if (customAnimationOnGesture === undefined) {
      customAnimationOnGesture = true;
    }
    if (animation === undefined) {
      animation = 'slide_from_bottom';
    }
  }

  // workaround for rn-screens where gestureDirection has to be set on both
  // current and previous screen - software-mansion/react-native-screens/pull/1509
  const nextGestureDirection = nextDescriptor?.options.gestureDirection;
  const gestureDirectionOverride =
    nextGestureDirection != null ? nextGestureDirection : gestureDirection;

  if (index === 0) {
    // first screen should always be treated as `card`, it resolves problems with no header animation
    // for navigator with first screen as `modal` and the next as `card`
    presentation = 'card';
  }

  const isHeaderInPush = isAndroid
    ? headerShown
    : presentation === 'card' && headerShown !== false;

  const insets = useSafeAreaInsets();
  const frame = useSafeAreaFrame();

  // `modal` and `formSheet` presentations do not take whole screen, so should not take the inset.
  const isModal = presentation === 'modal' || presentation === 'formSheet';

  // Modals are fullscreen in landscape only on iPhone
  const isIPhone =
    Platform.OS === 'ios' && !(Platform.isPad || Platform.isTVOS);
  const isLandscape = frame.width > frame.height;

  const topInset = isModal || (isIPhone && isLandscape) ? 0 : insets.top;

  const isParentHeaderShown = React.useContext(HeaderShownContext);
  const parentHeaderHeight = React.useContext(HeaderHeightContext);
  const parentHeaderBack = React.useContext(HeaderBackContext);

  const { preventedRoutes } = usePreventRemoveContext();

  const defaultHeaderHeight = getDefaultHeaderHeight(frame, isModal, topInset);

  const [customHeaderHeight, setCustomHeaderHeight] =
    React.useState(defaultHeaderHeight);

  const headerHeight = header ? customHeaderHeight : defaultHeaderHeight;
  const headerBack = previousDescriptor
    ? {
        title: getHeaderTitle(
          previousDescriptor.options,
          previousDescriptor.route.name
        ),
      }
    : parentHeaderBack;

  const isRemovePrevented = preventedRoutes[route.key]?.preventRemove;

  return (
    <Screen
      key={route.key}
      enabled
      style={StyleSheet.absoluteFill}
      customAnimationOnSwipe={customAnimationOnGesture}
      fullScreenSwipeEnabled={fullScreenGestureEnabled}
      gestureEnabled={
        isAndroid
          ? // This prop enables handling of system back gestures on Android
            // Since we handle them in JS side, we disable this
            false
          : gestureEnabled
      }
      homeIndicatorHidden={autoHideHomeIndicator}
      navigationBarColor={navigationBarColor}
      navigationBarHidden={navigationBarHidden}
      replaceAnimation={animationTypeForReplace}
      stackPresentation={presentation === 'card' ? 'push' : presentation}
      stackAnimation={animation}
      screenOrientation={orientation}
      statusBarAnimation={statusBarAnimation}
      statusBarHidden={statusBarHidden}
      statusBarStyle={statusBarStyle}
      statusBarColor={statusBarColor}
      statusBarTranslucent={statusBarTranslucent}
      swipeDirection={gestureDirectionOverride}
      transitionDuration={animationDuration}
      onWillDisappear={onWillDisappear}
      onAppear={onAppear}
      onDisappear={onDisappear}
      onDismissed={onDismissed}
      isNativeStack
      // Props for enabling preventing removal in native-stack
      nativeBackButtonDismissalEnabled={false} // on Android
      // @ts-expect-error prop not publicly exported from rn-screens
      preventNativeDismiss={isRemovePrevented} // on iOS
      onHeaderBackButtonClicked={onHeaderBackButtonClicked}
      onNativeDismissCancelled={onNativeDismissCancelled}
    >
      <NavigationContext.Provider value={navigation}>
        <NavigationRouteContext.Provider value={route}>
          <HeaderShownContext.Provider
            value={isParentHeaderShown || isHeaderInPush !== false}
          >
            <HeaderHeightContext.Provider
              value={
                isHeaderInPush !== false
                  ? headerHeight
                  : parentHeaderHeight ?? 0
              }
            >
              {header !== undefined && headerShown !== false ? (
                <View
                  onLayout={(e) => {
                    setCustomHeaderHeight(e.nativeEvent.layout.height);
                  }}
                >
                  {header({
                    back: headerBack,
                    options,
                    route,
                    navigation,
                  })}
                </View>
              ) : (
                <HeaderConfig
                  {...options}
                  route={route}
                  headerBackButtonMenuEnabled={
                    isRemovePrevented !== undefined
                      ? !isRemovePrevented
                      : headerBackButtonMenuEnabled
                  }
                  headerShown={isHeaderInPush}
                  headerHeight={headerHeight}
                  headerBackTitle={
                    options.headerBackTitle !== undefined
                      ? options.headerBackTitle
                      : headerBack?.title
                  }
                  canGoBack={headerBack !== undefined}
                />
              )}
              <MaybeNestedStack
                options={options}
                route={route}
                presentation={presentation}
                headerHeight={headerHeight}
              >
                <HeaderBackContext.Provider value={headerBack}>
                  {render()}
                </HeaderBackContext.Provider>
              </MaybeNestedStack>
            </HeaderHeightContext.Provider>
          </HeaderShownContext.Provider>
        </NavigationRouteContext.Provider>
      </NavigationContext.Provider>
    </Screen>
  );
};

type Props = {
  state: StackNavigationState<ParamListBase>;
  navigation: NativeStackNavigationHelpers;
  descriptors: NativeStackDescriptorMap;
};

function NativeStackViewInner({ state, navigation, descriptors }: Props) {
  const { setNextDismissedKey } = useDismissedRouteError(state);

  useInvalidPreventRemoveError(descriptors);

  return (
    <ScreenStack style={styles.container}>
      {state.routes.map((route, index) => {
        const descriptor = descriptors[route.key];
        const previousKey = state.routes[index - 1]?.key;
        const nextKey = state.routes[index + 1]?.key;
        const previousDescriptor = previousKey
          ? descriptors[previousKey]
          : undefined;
        const nextDescriptor = nextKey ? descriptors[nextKey] : undefined;

        return (
          <SceneView
            key={route.key}
            index={index}
            descriptor={descriptor}
            previousDescriptor={previousDescriptor}
            nextDescriptor={nextDescriptor}
            onWillDisappear={() => {
              navigation.emit({
                type: 'transitionStart',
                data: { closing: true },
                target: route.key,
              });
            }}
            onAppear={() => {
              navigation.emit({
                type: 'transitionEnd',
                data: { closing: false },
                target: route.key,
              });
            }}
            onDisappear={() => {
              navigation.emit({
                type: 'transitionEnd',
                data: { closing: true },
                target: route.key,
              });
            }}
            onDismissed={(event) => {
              navigation.dispatch({
                ...StackActions.pop(event.nativeEvent.dismissCount),
                source: route.key,
                target: state.key,
              });

              setNextDismissedKey(route.key);
            }}
            onHeaderBackButtonClicked={() => {
              navigation.dispatch({
                ...StackActions.pop(),
                source: route.key,
                target: state.key,
              });
            }}
            onNativeDismissCancelled={(event) => {
              navigation.dispatch({
                ...StackActions.pop(event.nativeEvent.dismissCount),
                source: route.key,
                target: state.key,
              });
            }}
          />
        );
      })}
    </ScreenStack>
  );
}

export default function NativeStackView(props: Props) {
  return (
    <SafeAreaProviderCompat>
      <NativeStackViewInner {...props} />
    </SafeAreaProviderCompat>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

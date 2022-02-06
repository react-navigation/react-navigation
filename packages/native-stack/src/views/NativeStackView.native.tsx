import {
  getDefaultHeaderHeight,
  getHeaderTitle,
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
  useTheme,
} from '@react-navigation/native';
import * as React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import {
  useSafeAreaFrame,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
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
  onWillDisappear: () => void;
  onAppear: () => void;
  onDisappear: () => void;
  onDismissed: () => void;
};

const SceneView = ({
  descriptor,
  previousDescriptor,
  index,
  onWillDisappear,
  onAppear,
  onDisappear,
  onDismissed,
}: SceneViewProps) => {
  const { route, navigation, options, render } = descriptor;
  const {
    animation,
    animationTypeForReplace = 'push',
    customAnimationOnGesture,
    fullScreenGestureEnabled,
    gestureEnabled,
    header,
    headerShown,
    orientation,
    statusBarAnimation,
    statusBarHidden,
    statusBarStyle,
  } = options;

  let { presentation = 'card' } = options;

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
    Platform.OS === 'ios' && !(Platform.isPad && Platform.isTVOS);
  const isLandscape = frame.width > frame.height;

  const topInset = isModal || (isIPhone && isLandscape) ? 0 : insets.top;

  const isParentHeaderShown = React.useContext(HeaderShownContext);
  const parentHeaderHeight = React.useContext(HeaderHeightContext);

  const defaultHeaderHeight = getDefaultHeaderHeight(frame, isModal, topInset);

  const [customHeaderHeight, setCustomHeaderHeight] =
    React.useState(defaultHeaderHeight);

  const headerHeight = header ? customHeaderHeight : defaultHeaderHeight;

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
      replaceAnimation={animationTypeForReplace}
      stackPresentation={presentation === 'card' ? 'push' : presentation}
      stackAnimation={animation}
      screenOrientation={orientation}
      statusBarAnimation={statusBarAnimation}
      statusBarHidden={statusBarHidden}
      statusBarStyle={statusBarStyle}
      onWillDisappear={onWillDisappear}
      onAppear={onAppear}
      onDisappear={onDisappear}
      onDismissed={onDismissed}
      isNativeStack
    >
      <HeaderShownContext.Provider
        value={isParentHeaderShown || isHeaderInPush !== false}
      >
        <HeaderHeightContext.Provider
          value={
            isHeaderInPush !== false ? headerHeight : parentHeaderHeight ?? 0
          }
        >
          {header !== undefined && headerShown !== false ? (
            <NavigationContext.Provider value={navigation}>
              <NavigationRouteContext.Provider value={route}>
                <View
                  onLayout={(e) => {
                    setCustomHeaderHeight(e.nativeEvent.layout.height);
                  }}
                >
                  {header({
                    back: previousDescriptor
                      ? {
                          title: getHeaderTitle(
                            previousDescriptor.options,
                            previousDescriptor.route.name
                          ),
                        }
                      : undefined,
                    options,
                    route,
                    navigation,
                  })}
                </View>
              </NavigationRouteContext.Provider>
            </NavigationContext.Provider>
          ) : (
            <HeaderConfig
              {...options}
              route={route}
              headerShown={isHeaderInPush}
              headerHeight={headerHeight}
              canGoBack={index !== 0}
            />
          )}
          <MaybeNestedStack
            options={options}
            route={route}
            presentation={presentation}
            headerHeight={headerHeight}
          >
            {render()}
          </MaybeNestedStack>
        </HeaderHeightContext.Provider>
      </HeaderShownContext.Provider>
    </Screen>
  );
};

type Props = {
  state: StackNavigationState<ParamListBase>;
  navigation: NativeStackNavigationHelpers;
  descriptors: NativeStackDescriptorMap;
};

function NativeStackViewInner({ state, navigation, descriptors }: Props) {
  const [nextDismissedKey, setNextDismissedKey] = React.useState<string | null>(
    null
  );

  const dismissedRouteName = nextDismissedKey
    ? state.routes.find((route) => route.key === nextDismissedKey)?.name
    : null;

  React.useEffect(() => {
    if (dismissedRouteName) {
      const message =
        `The screen '${dismissedRouteName}' was removed natively but didn't get removed from JS state. ` +
        `This can happen if the action was prevented in a 'beforeRemove' listener, which is not fully supported in native-stack.\n\n` +
        `Consider using 'gestureEnabled: false' to prevent back gesture and use a custom back button with 'headerLeft' option to override the native behavior.`;

      console.error(message);
    }
  }, [dismissedRouteName]);

  return (
    <ScreenStack style={styles.container}>
      {state.routes.map((route, index) => {
        const descriptor = descriptors[route.key];
        const previousKey = state.routes[index - 1]?.key;
        const previousDescriptor = previousKey
          ? descriptors[previousKey]
          : undefined;

        return (
          <SceneView
            key={route.key}
            index={index}
            descriptor={descriptor}
            previousDescriptor={previousDescriptor}
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
            onDismissed={() => {
              navigation.dispatch({
                ...StackActions.pop(),
                source: route.key,
                target: state.key,
              });

              setNextDismissedKey(route.key);
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

import {
  getDefaultHeaderHeight,
  getHeaderTitle,
  HeaderHeightContext,
  HeaderShownContext,
  SafeAreaProviderCompat,
} from '@react-navigation/elements';
import {
  ParamListBase,
  Route,
  StackActions,
  StackNavigationState,
  useTheme,
} from '@react-navigation/native';
import * as React from 'react';
import { Platform, PlatformIOSStatic, StyleSheet } from 'react-native';
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
  children,
}: {
  options: NativeStackNavigationOptions;
  route: Route<string>;
  presentation: Exclude<StackPresentationTypes, 'push'> | 'card';
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

  const insets = useSafeAreaInsets();
  const dimensions = useSafeAreaFrame();
  // landscape is meaningful only for iPhone
  const isLandscape =
    dimensions.width > dimensions.height &&
    !(Platform as PlatformIOSStatic).isPad &&
    !(Platform as PlatformIOSStatic).isTVOS;
  // `modal` and `formSheet` presentations do not take whole screen, so should not take the inset.
  const isFullScreenModal =
    presentation !== 'modal' && presentation !== 'formSheet';
  const topInset = isFullScreenModal && !isLandscape ? insets.top : 0;
  const headerHeight = getDefaultHeaderHeight(
    dimensions,
    !isFullScreenModal,
    topInset
  );

  if (isHeaderInModal) {
    return (
      <ScreenStack style={styles.container}>
        <Screen enabled style={StyleSheet.absoluteFill}>
          <HeaderShownContext.Provider value>
            <HeaderHeightContext.Provider value={headerHeight}>
              <HeaderConfig {...options} route={route} canGoBack />
              {content}
            </HeaderHeightContext.Provider>
          </HeaderShownContext.Provider>
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
    gestureEnabled,
    header,
    headerShown,
    animationTypeForReplace = 'push',
    animation,
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

  const isParentHeaderShown = React.useContext(HeaderShownContext);
  const parentHeaderHeight = React.useContext(HeaderHeightContext);
  const headerHeight = getDefaultHeaderHeight(
    useSafeAreaFrame(),
    false,
    insets.top
  );

  return (
    <Screen
      key={route.key}
      enabled
      style={StyleSheet.absoluteFill}
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
            // TODO: expose custom header height
            header({
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
            })
          ) : (
            <HeaderConfig
              {...options}
              route={route}
              headerShown={isHeaderInPush}
              canGoBack={index !== 0}
            />
          )}
          <MaybeNestedStack
            options={options}
            route={route}
            presentation={presentation}
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
  const [nextDismissedKey, setNextDismissedKey] =
    React.useState<string | null>(null);

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

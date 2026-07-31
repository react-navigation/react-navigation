import {
  getHeaderTitle,
  Header,
  HeaderBackButton,
  HeaderBackContext,
  useHeaderHeight,
} from '@react-navigation/elements';
import {
  ActivityView,
  SafeAreaProviderCompat,
  Screen,
} from '@react-navigation/elements/internal';
import {
  IsFocusedContext,
  type ParamListBase,
  type StackNavigationState,
  useLinkBuilder,
} from '@react-navigation/native';
import * as React from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import type {
  NativeStackDescriptorMap,
  NativeStackNavigationHelpers,
} from '../types';
import { getModalRouteKeys } from '../utils/getModalRoutesKeys';
import { AnimatedHeaderHeightContext } from '../utils/useAnimatedHeaderHeight';

type Props = {
  state: StackNavigationState<ParamListBase>;
  navigation: NativeStackNavigationHelpers;
  descriptors: NativeStackDescriptorMap;
};

const TRANSPARENT_PRESENTATIONS = [
  'transparentModal',
  'containedTransparentModal',
];

export function NativeStackView({ state, descriptors }: Props) {
  const parentHeaderBack = React.use(HeaderBackContext);
  const { buildHref } = useLinkBuilder();

  // Whether a navigator above this one is covered, e.g. by a modal in a parent stack
  // The context composes the parent chain, so it's `false` if any ancestor is blurred
  // It's `undefined` in the root navigator, which is always considered focused
  const isCoveredExternally = React.use(IsFocusedContext) === false;

  const activeRoutes = state.routes.slice(0, state.index + 1);
  const modalRouteKeys = getModalRouteKeys(activeRoutes, descriptors);

  return (
    <SafeAreaProviderCompat>
      {state.routes.map((route, i) => {
        const isFocused = state.index === i;
        const previousKey = activeRoutes[i - 1]?.key;
        const nextKey = activeRoutes[i + 1]?.key;
        const previousDescriptor = previousKey
          ? descriptors[previousKey]
          : undefined;
        const nextDescriptor = nextKey ? descriptors[nextKey] : undefined;
        const descriptor = descriptors[route.key];

        if (descriptor == null) {
          throw new Error(
            `Couldn't find a descriptor for route '${route.key}'.`
          );
        }

        const { options, navigation, render } = descriptor;

        const headerBack = previousDescriptor
          ? {
              title: getHeaderTitle(
                previousDescriptor.options,
                previousDescriptor.route.name
              ),
              href: buildHref(
                previousDescriptor.route.name,
                previousDescriptor.route.params
              ),
            }
          : parentHeaderBack;

        const canGoBack = headerBack != null;

        const {
          inactiveBehavior = 'pause',
          header,
          headerShown,
          headerBackIcon,
          headerLeft,
          headerTransparent,
          headerBackTitle,
          presentation,
          contentStyle,
          ...rest
        } = options;

        const nextPresentation = nextDescriptor?.options.presentation;

        const isNextScreenTransparent =
          nextPresentation != null &&
          TRANSPARENT_PRESENTATIONS.includes(nextPresentation);

        const isInactive = i > state.index;

        const isBeforeLast = i === activeRoutes.length - 2;

        const isNextScreenModal = nextKey
          ? modalRouteKeys.includes(nextKey)
          : false;

        const pauseWhenCovered = inactiveBehavior === 'pauseWhenCovered';

        // Whether the screen is covered: by the screen above it in this stack,
        // or by a screen covering the navigator it's in
        const isCovered = isFocused
          ? isCoveredExternally
          : !isInactive && (isNextScreenTransparent || isBeforeLast);

        const activityMode =
          // Pause covered screens, including covers that leave them visible
          pauseWhenCovered && isCovered
            ? 'paused'
            : // Render focused screens normally
              isFocused
              ? 'normal'
              : // Unpause preloaded and retained screens so updates are visible
                // This lets effects on those screens run
                inactiveBehavior === 'none' ||
                  isInactive ||
                  isNextScreenTransparent
                ? 'inert'
                : inactiveBehavior === 'unmount' &&
                    !isNextScreenModal &&
                    !isBeforeLast &&
                    !route.state
                  ? 'unmounted'
                  : 'paused';

        if (activityMode === 'unmounted') {
          return null;
        }

        const content = (
          <Screen
            key={route.key}
            focused={isFocused}
            route={route}
            navigation={navigation}
            headerShown={headerShown}
            headerTransparent={headerTransparent}
            header={
              header !== undefined ? (
                header({
                  back: headerBack,
                  options,
                  route,
                  navigation,
                })
              ) : (
                <Header
                  {...rest}
                  back={headerBack}
                  title={getHeaderTitle(options, route.name)}
                  headerLeft={
                    typeof headerLeft === 'function'
                      ? ({ label, ...rest }) =>
                          headerLeft({
                            ...rest,
                            label: headerBackTitle ?? label,
                          })
                      : headerLeft === undefined && canGoBack
                        ? ({ tintColor, label, ...rest }) => (
                            <HeaderBackButton
                              {...rest}
                              label={headerBackTitle ?? label}
                              tintColor={tintColor}
                              icon={headerBackIcon}
                              onPress={navigation.goBack}
                            />
                          )
                        : headerLeft
                  }
                  headerTransparent={headerTransparent}
                />
              )
            }
            style={{
              ...StyleSheet.absoluteFill,
              ...(presentation != null &&
              TRANSPARENT_PRESENTATIONS.includes(presentation)
                ? { backgroundColor: 'transparent' }
                : null),
            }}
          >
            <HeaderBackContext.Provider value={headerBack}>
              <AnimatedHeaderHeightProvider>
                <View style={[styles.contentContainer, contentStyle]}>
                  {render()}
                </View>
              </AnimatedHeaderHeightProvider>
            </HeaderBackContext.Provider>
          </Screen>
        );

        return (
          <ActivityView
            key={route.key}
            mode={activityMode}
            visible={isFocused || isNextScreenTransparent}
            style={StyleSheet.absoluteFill}
          >
            {content}
          </ActivityView>
        );
      })}
    </SafeAreaProviderCompat>
  );
}

const AnimatedHeaderHeightProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const headerHeight = useHeaderHeight();
  const [animatedHeaderHeight] = React.useState(
    () => new Animated.Value(headerHeight)
  );

  React.useEffect(() => {
    animatedHeaderHeight.setValue(headerHeight);
  }, [animatedHeaderHeight, headerHeight]);

  return (
    <AnimatedHeaderHeightContext.Provider value={animatedHeaderHeight}>
      {children}
    </AnimatedHeaderHeightContext.Provider>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
});

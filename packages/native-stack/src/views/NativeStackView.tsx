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

  return (
    <SafeAreaProviderCompat>
      {state.routes.concat(state.preloadedRoutes).map((route, i) => {
        const isFocused = state.index === i;
        const previousKey = state.routes[i - 1]?.key;
        const nextKey = state.routes[i + 1]?.key;
        const previousDescriptor = previousKey
          ? descriptors[previousKey]
          : undefined;
        const nextDescriptor = nextKey ? descriptors[nextKey] : undefined;
        const { options, navigation, render } = descriptors[route.key];

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

        const isPreloaded = state.preloadedRoutes.some(
          (r) => r.key === route.key
        );

        const isBeforeLast = i === state.routes.length - 2;

        const activityMode =
          // Render focused screens normally
          isFocused
            ? 'normal'
            : // Unpause preloaded screens so updates are visible
              // This lets effects on preloaded screens run
              inactiveBehavior === 'none' ||
                isPreloaded ||
                isNextScreenTransparent
              ? 'inert'
              : inactiveBehavior === 'unmount' && !isBeforeLast && !route.state
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
            {/* oxlint-disable-next-line react/jsx-no-constructed-context-values */}
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
            visible={isFocused || isPreloaded || isNextScreenTransparent}
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

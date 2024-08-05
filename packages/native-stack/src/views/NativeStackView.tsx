import {
  getHeaderTitle,
  Header,
  HeaderBackButton,
  HeaderBackContext,
  SafeAreaProviderCompat,
  Screen,
  useHeaderHeight,
} from '@react-navigation/elements';
import {
  type ParamListBase,
  type RouteProp,
  type StackNavigationState,
  useLinkBuilder,
  useTheme,
} from '@react-navigation/native';
import * as React from 'react';
import { Animated, Image, StyleSheet, View } from 'react-native';

import type {
  NativeStackDescriptor,
  NativeStackDescriptorMap,
  NativeStackNavigationHelpers,
} from '../types';
import { AnimatedHeaderHeightContext } from '../utils/useAnimatedHeaderHeight';

type Props = {
  state: StackNavigationState<ParamListBase>;
  // This is used for the native implementation of the stack.
  navigation: NativeStackNavigationHelpers;
  descriptors: NativeStackDescriptorMap;
  describe: (
    route: RouteProp<ParamListBase>,
    placeholder: boolean
  ) => NativeStackDescriptor;
};

const TRANSPARENT_PRESENTATIONS = [
  'transparentModal',
  'containedTransparentModal',
];

export function NativeStackView({ state, descriptors, describe }: Props) {
  const parentHeaderBack = React.useContext(HeaderBackContext);
  const { buildHref } = useLinkBuilder();
  const { colors } = useTheme();

  const preloadedDescriptors =
    state.preloadedRoutes.reduce<NativeStackDescriptorMap>((acc, route) => {
      acc[route.key] = acc[route.key] || describe(route, true);
      return acc;
    }, {});

  return (
    <SafeAreaProviderCompat style={{ backgroundColor: colors.background }}>
      {state.routes.concat(state.preloadedRoutes).map((route, i) => {
        const isFocused = state.index === i;
        const previousKey = state.routes[i - 1]?.key;
        const nextKey = state.routes[i + 1]?.key;
        const previousDescriptor = previousKey
          ? descriptors[previousKey]
          : undefined;
        const nextDescriptor = nextKey ? descriptors[nextKey] : undefined;
        const { options, navigation, render } = descriptors[route.key] ?? preloadedDescriptors[route.key];

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

        const canGoBack = headerBack !== undefined;

        const {
          header,
          headerShown,
          headerTintColor,
          headerBackImageSource,
          headerLeft,
          headerRight,
          headerTitle,
          headerTitleAlign,
          headerTitleStyle,
          headerStyle,
          headerShadowVisible,
          headerTransparent,
          headerBackground,
          headerBackTitle,
          presentation,
          contentStyle,
        } = options;

        const nextPresentation = nextDescriptor?.options.presentation;

        const shouldBePreloaded = preloadedDescriptors[route.key] !== undefined && descriptors[route.key] === undefined;

        return (
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
                  title={getHeaderTitle(options, route.name)}
                  headerTintColor={headerTintColor}
                  headerLeft={
                    typeof headerLeft === 'function'
                      ? ({ tintColor }) =>
                          headerLeft({
                            tintColor,
                            canGoBack,
                            label: headerBackTitle,
                            href: headerBack?.href,
                          })
                      : headerLeft === undefined && canGoBack
                        ? ({ tintColor }) => (
                            <HeaderBackButton
                              tintColor={tintColor}
                              backImage={
                                headerBackImageSource !== undefined
                                  ? () => (
                                      <Image
                                        source={headerBackImageSource}
                                        resizeMode="contain"
                                        style={[
                                          styles.backImage,
                                          { tintColor },
                                        ]}
                                      />
                                    )
                                  : undefined
                              }
                              onPress={navigation.goBack}
                              href={headerBack.href}
                            />
                          )
                        : headerLeft
                  }
                  headerRight={
                    typeof headerRight === 'function'
                      ? ({ tintColor }) => headerRight({ tintColor, canGoBack })
                      : headerRight
                  }
                  headerTitle={
                    typeof headerTitle === 'function'
                      ? ({ children, tintColor }) =>
                          headerTitle({ children, tintColor })
                      : headerTitle
                  }
                  headerTitleAlign={headerTitleAlign}
                  headerTitleStyle={headerTitleStyle}
                  headerTransparent={headerTransparent}
                  headerShadowVisible={headerShadowVisible}
                  headerBackground={headerBackground}
                  headerStyle={headerStyle}
                />
              )
            }
            style={[
              StyleSheet.absoluteFill,
              {
                display:
                  (isFocused ||
                  (nextPresentation != null &&
                    TRANSPARENT_PRESENTATIONS.includes(nextPresentation))) &&
                      !shouldBePreloaded
                    ? 'flex'
                    : 'none',
              },
              presentation != null &&
              TRANSPARENT_PRESENTATIONS.includes(presentation)
                ? { backgroundColor: 'transparent' }
                : null,
            ]}
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
  backImage: {
    height: 24,
    width: 24,
    margin: 3,
  },
});

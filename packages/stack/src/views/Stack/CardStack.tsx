import * as React from 'react';
import {
  Animated,
  View,
  StyleSheet,
  LayoutChangeEvent,
  Dimensions,
  Platform,
  ViewProps,
} from 'react-native';
import { EdgeInsets } from 'react-native-safe-area-context';
// eslint-disable-next-line import/no-unresolved
import { ScreenContainer, Screen, screensEnabled } from 'react-native-screens'; // Import with * as to prevent getters being called
import { Route } from '@react-navigation/native';
import { StackNavigationState } from '@react-navigation/routers';

import { getDefaultHeaderHeight } from '../Header/HeaderSegment';
import { Props as HeaderContainerProps } from '../Header/HeaderContainer';
import CardContainer from './CardContainer';
import {
  DefaultTransition,
  ModalTransition,
} from '../../TransitionConfigs/TransitionPresets';
import { forNoAnimation as forNoAnimationHeader } from '../../TransitionConfigs/HeaderStyleInterpolators';
import { forNoAnimation as forNoAnimationCard } from '../../TransitionConfigs/CardStyleInterpolators';
import getDistanceForDirection from '../../utils/getDistanceForDirection';
import {
  Layout,
  StackHeaderMode,
  StackCardMode,
  Scene,
  StackDescriptorMap,
  StackNavigationOptions,
  StackDescriptor,
} from '../../types';

type GestureValues = {
  [key: string]: Animated.Value;
};

type Props = {
  mode: StackCardMode;
  insets: EdgeInsets;
  state: StackNavigationState;
  descriptors: StackDescriptorMap;
  routes: Route<string>[];
  openingRouteKeys: string[];
  closingRouteKeys: string[];
  onOpenRoute: (props: { route: Route<string> }) => void;
  onCloseRoute: (props: { route: Route<string> }) => void;
  getPreviousRoute: (props: {
    route: Route<string>;
  }) => Route<string> | undefined;
  getGesturesEnabled: (props: { route: Route<string> }) => boolean;
  renderHeader: (props: HeaderContainerProps) => React.ReactNode;
  renderScene: (props: { route: Route<string> }) => React.ReactNode;
  headerMode: StackHeaderMode;
  onTransitionStart: (
    props: { route: Route<string> },
    closing: boolean
  ) => void;
  onTransitionEnd: (props: { route: Route<string> }, closing: boolean) => void;
  onPageChangeStart?: () => void;
  onPageChangeConfirm?: () => void;
  onPageChangeCancel?: () => void;
};

type State = {
  routes: Route<string>[];
  descriptors: StackDescriptorMap;
  scenes: Scene<Route<string>>[];
  gestures: GestureValues;
  layout: Layout;
  floatingHeaderHeights: Record<string, number>;
};

const EPSILON = 1e-5;

const dimensions = Dimensions.get('window');
const layout = { width: dimensions.width, height: dimensions.height };

const MaybeScreenContainer = ({
  enabled,
  ...rest
}: ViewProps & {
  enabled: boolean;
  children: React.ReactNode;
}) => {
  if (Platform.OS !== 'ios' && enabled && screensEnabled()) {
    return <ScreenContainer {...rest} />;
  }

  return <View {...rest} />;
};

const MaybeScreen = ({
  enabled,
  active,
  ...rest
}: ViewProps & {
  enabled: boolean;
  active: number | Animated.AnimatedInterpolation;
  children: React.ReactNode;
}) => {
  if (Platform.OS !== 'ios' && enabled && screensEnabled()) {
    // @ts-ignore
    return <Screen active={active} {...rest} />;
  }

  return <View {...rest} />;
};

const FALLBACK_DESCRIPTOR = Object.freeze({ options: {} });

const getFloatingHeaderHeights = (
  routes: Route<string>[],
  insets: EdgeInsets,
  descriptors: StackDescriptorMap,
  layout: Layout,
  previous: Record<string, number>
) => {
  return routes.reduce<Record<string, number>>((acc, curr) => {
    const { options = {} } = descriptors[curr.key] || {};
    const { height = previous[curr.key] } = StyleSheet.flatten(
      options.headerStyle || {}
    );

    const safeAreaInsets = {
      ...insets,
      ...options.safeAreaInsets,
    };

    const { headerStatusBarHeight = safeAreaInsets.top } = options;

    acc[curr.key] =
      typeof height === 'number'
        ? height
        : getDefaultHeaderHeight(layout, headerStatusBarHeight);

    return acc;
  }, {});
};

const getDistanceFromOptions = (
  mode: StackCardMode,
  layout: Layout,
  descriptor?: StackDescriptor
) => {
  const {
    gestureDirection = mode === 'modal'
      ? ModalTransition.gestureDirection
      : DefaultTransition.gestureDirection,
  } = descriptor?.options || {};

  return getDistanceForDirection(layout, gestureDirection);
};

const getProgressFromGesture = (
  mode: StackCardMode,
  gesture: Animated.Value,
  layout: Layout,
  descriptor?: StackDescriptor
) => {
  const distance = getDistanceFromOptions(mode, layout, descriptor);

  if (distance > 0) {
    return gesture.interpolate({
      inputRange: [0, distance],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });
  }

  return gesture.interpolate({
    inputRange: [distance, 0],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
};

export default class CardStack extends React.Component<Props, State> {
  static getDerivedStateFromProps(props: Props, state: State) {
    if (
      props.routes === state.routes &&
      props.descriptors === state.descriptors
    ) {
      return null;
    }

    const gestures = props.routes.reduce<GestureValues>((acc, curr) => {
      const descriptor = props.descriptors[curr.key];
      const { animationEnabled } = descriptor?.options || {};

      acc[curr.key] =
        state.gestures[curr.key] ||
        new Animated.Value(
          props.openingRouteKeys.includes(curr.key) &&
          animationEnabled !== false
            ? getDistanceFromOptions(props.mode, state.layout, descriptor)
            : 0
        );

      return acc;
    }, {});

    return {
      routes: props.routes,
      scenes: props.routes.map((route, index, self) => {
        const previousRoute = self[index - 1];
        const nextRoute = self[index + 1];

        const oldScene = state.scenes[index];

        const currentGesture = gestures[route.key];
        const previousGesture = previousRoute
          ? gestures[previousRoute.key]
          : undefined;
        const nextGesture = nextRoute ? gestures[nextRoute.key] : undefined;

        const descriptor =
          props.descriptors[route.key] ||
          state.descriptors[route.key] ||
          (oldScene ? oldScene.descriptor : FALLBACK_DESCRIPTOR);

        const nextDescriptor =
          props.descriptors[nextRoute?.key] ||
          state.descriptors[nextRoute?.key];

        const previousDescriptor =
          props.descriptors[previousRoute?.key] ||
          state.descriptors[previousRoute?.key];

        const scene = {
          route,
          descriptor,
          progress: {
            current: getProgressFromGesture(
              props.mode,
              currentGesture,
              state.layout,
              descriptor
            ),
            next: nextGesture
              ? getProgressFromGesture(
                  props.mode,
                  nextGesture,
                  state.layout,
                  nextDescriptor
                )
              : undefined,
            previous: previousGesture
              ? getProgressFromGesture(
                  props.mode,
                  previousGesture,
                  state.layout,
                  previousDescriptor
                )
              : undefined,
          },
          __memo: [
            route,
            state.layout,
            descriptor,
            nextDescriptor,
            previousDescriptor,
            currentGesture,
            nextGesture,
            previousGesture,
          ],
        };

        if (
          oldScene &&
          scene.__memo.every((it, i) => {
            // @ts-ignore
            return oldScene.__memo[i] === it;
          })
        ) {
          return oldScene;
        }

        return scene;
      }),
      gestures,
      descriptors: props.descriptors,
      floatingHeaderHeights: getFloatingHeaderHeights(
        props.routes,
        props.insets,
        state.descriptors,
        state.layout,
        state.floatingHeaderHeights
      ),
    };
  }

  state: State = {
    routes: [],
    scenes: [],
    gestures: {},
    layout,
    descriptors: this.props.descriptors,
    // Used when card's header is null and mode is float to make transition
    // between screens with headers and those without headers smooth.
    // This is not a great heuristic here. We don't know synchronously
    // on mount what the header height is so we have just used the most
    // common cases here.
    floatingHeaderHeights: {},
  };

  private handleLayout = (e: LayoutChangeEvent) => {
    const { height, width } = e.nativeEvent.layout;

    const layout = { width, height };

    this.setState((state, props) => {
      if (height === state.layout.height && width === state.layout.width) {
        return null;
      }

      return {
        layout,
        floatingHeaderHeights: getFloatingHeaderHeights(
          props.routes,
          props.insets,
          state.descriptors,
          layout,
          {}
        ),
      };
    });
  };

  private handleFloatingHeaderLayout = ({
    route,
    height,
  }: {
    route: Route<string>;
    height: number;
  }) => {
    this.setState(({ floatingHeaderHeights }) => {
      const previousHeight = floatingHeaderHeights[route.key];

      if (previousHeight === height) {
        return null;
      }

      return {
        floatingHeaderHeights: {
          ...floatingHeaderHeights,
          [route.key]: height,
        },
      };
    });
  };

  render() {
    const {
      mode,
      insets,
      descriptors,
      state,
      routes,
      closingRouteKeys,
      onOpenRoute,
      onCloseRoute,
      getPreviousRoute,
      getGesturesEnabled,
      renderHeader,
      renderScene,
      headerMode,
      onTransitionStart,
      onTransitionEnd,
      onPageChangeStart,
      onPageChangeConfirm,
      onPageChangeCancel,
    } = this.props;

    const { scenes, layout, gestures, floatingHeaderHeights } = this.state;

    const focusedRoute = state.routes[state.index];
    const focusedDescriptor = descriptors[focusedRoute.key];
    const focusedOptions = focusedDescriptor ? focusedDescriptor.options : {};

    let defaultTransitionPreset =
      mode === 'modal' ? ModalTransition : DefaultTransition;

    if (headerMode === 'screen') {
      defaultTransitionPreset = {
        ...defaultTransitionPreset,
        headerStyleInterpolator: forNoAnimationHeader,
      };
    }

    const {
      top = insets.top,
      right = insets.right,
      bottom = insets.bottom,
      left = insets.left,
    } = focusedOptions.safeAreaInsets || {};

    return (
      <React.Fragment>
        <MaybeScreenContainer
          enabled={mode !== 'modal'}
          style={styles.container}
          onLayout={this.handleLayout}
        >
          {routes.map((route, index, self) => {
            const focused = focusedRoute.key === route.key;
            const gesture = gestures[route.key];
            const scene = scenes[index];

            // Display current screen and a screen beneath.
            // On Android screen beneath is hidden on animation finished bs of RNS's issue.
            const isScreenActive =
              index === self.length - 1
                ? 1
                : Platform.OS === 'android'
                ? scene.progress.next
                  ? scene.progress.next.interpolate({
                      inputRange: [0, 1 - EPSILON, 1],
                      outputRange: [1, 1, 0],
                      extrapolate: 'clamp',
                    })
                  : 1
                : index === self.length - 2
                ? 1
                : 0;

            const {
              safeAreaInsets,
              headerShown,
              headerTransparent,
              cardShadowEnabled,
              cardOverlayEnabled,
              cardStyle,
              animationEnabled,
              gestureResponseDistance,
              gestureVelocityImpact,
              gestureDirection = defaultTransitionPreset.gestureDirection,
              transitionSpec = defaultTransitionPreset.transitionSpec,
              cardStyleInterpolator = animationEnabled === false
                ? forNoAnimationCard
                : defaultTransitionPreset.cardStyleInterpolator,
              headerStyleInterpolator = defaultTransitionPreset.headerStyleInterpolator,
            } = scene.descriptor
              ? scene.descriptor.options
              : ({} as StackNavigationOptions);

            let transitionConfig = {
              gestureDirection,
              transitionSpec,
              cardStyleInterpolator,
              headerStyleInterpolator,
            };

            // When a screen is not the last, it should use next screen's transition config
            // Many transitions also animate the previous screen, so using 2 different transitions doesn't look right
            // For example combining a slide and a modal transition would look wrong otherwise
            // With this approach, combining different transition styles in the same navigator mostly looks right
            // This will still be broken when 2 transitions have different idle state (e.g. modal presentation),
            // but majority of the transitions look alright
            if (index !== self.length - 1) {
              const nextScene = scenes[index + 1];

              if (nextScene) {
                const {
                  animationEnabled,
                  gestureDirection = defaultTransitionPreset.gestureDirection,
                  transitionSpec = defaultTransitionPreset.transitionSpec,
                  cardStyleInterpolator = animationEnabled === false
                    ? forNoAnimationCard
                    : defaultTransitionPreset.cardStyleInterpolator,
                  headerStyleInterpolator = defaultTransitionPreset.headerStyleInterpolator,
                } = nextScene.descriptor
                  ? nextScene.descriptor.options
                  : ({} as StackNavigationOptions);

                transitionConfig = {
                  gestureDirection,
                  transitionSpec,
                  cardStyleInterpolator,
                  headerStyleInterpolator,
                };
              }
            }

            const {
              top: safeAreaInsetTop = insets.top,
              right: safeAreaInsetRight = insets.right,
              bottom: safeAreaInsetBottom = insets.bottom,
              left: safeAreaInsetLeft = insets.left,
            } = safeAreaInsets || {};

            return (
              <MaybeScreen
                key={route.key}
                style={StyleSheet.absoluteFill}
                enabled={mode !== 'modal'}
                active={isScreenActive}
                pointerEvents="box-none"
              >
                <CardContainer
                  index={index}
                  active={index === self.length - 1}
                  focused={focused}
                  closing={closingRouteKeys.includes(route.key)}
                  layout={layout}
                  gesture={gesture}
                  scene={scene}
                  previousScene={scenes[index - 1]}
                  state={state}
                  safeAreaInsetTop={safeAreaInsetTop}
                  safeAreaInsetRight={safeAreaInsetRight}
                  safeAreaInsetBottom={safeAreaInsetBottom}
                  safeAreaInsetLeft={safeAreaInsetLeft}
                  cardOverlayEnabled={cardOverlayEnabled}
                  cardShadowEnabled={cardShadowEnabled}
                  cardStyle={cardStyle}
                  onPageChangeStart={onPageChangeStart}
                  onPageChangeConfirm={onPageChangeConfirm}
                  onPageChangeCancel={onPageChangeCancel}
                  gestureResponseDistance={gestureResponseDistance}
                  floatingHeaderHeight={floatingHeaderHeights[route.key]}
                  getPreviousRoute={getPreviousRoute}
                  headerMode={headerMode}
                  headerShown={headerShown}
                  headerTransparent={headerTransparent}
                  renderHeader={renderHeader}
                  renderScene={renderScene}
                  onOpenRoute={onOpenRoute}
                  onCloseRoute={onCloseRoute}
                  onTransitionStart={onTransitionStart}
                  onTransitionEnd={onTransitionEnd}
                  gestureEnabled={index !== 0 && getGesturesEnabled({ route })}
                  gestureVelocityImpact={gestureVelocityImpact}
                  {...transitionConfig}
                />
              </MaybeScreen>
            );
          })}
        </MaybeScreenContainer>
        {headerMode === 'float'
          ? renderHeader({
              mode: 'float',
              layout,
              insets: { top, right, bottom, left },
              scenes,
              state,
              getPreviousRoute,
              onContentHeightChange: this.handleFloatingHeaderLayout,
              styleInterpolator:
                focusedOptions.headerStyleInterpolator !== undefined
                  ? focusedOptions.headerStyleInterpolator
                  : defaultTransitionPreset.headerStyleInterpolator,
              style: styles.floating,
            })
          : null}
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  floating: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
});

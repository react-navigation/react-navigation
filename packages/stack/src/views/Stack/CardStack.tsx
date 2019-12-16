import * as React from 'react';
import {
  View,
  StyleSheet,
  LayoutChangeEvent,
  Dimensions,
  Platform,
  ViewProps,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { EdgeInsets } from 'react-native-safe-area-context';
// eslint-disable-next-line import/no-unresolved
import * as Screens from 'react-native-screens'; // Import with * as to prevent getters being called
import { Route } from '@react-navigation/native';
import { StackNavigationState } from '@react-navigation/routers';

import { getDefaultHeaderHeight } from '../Header/HeaderSegment';
import { Props as HeaderContainerProps } from '../Header/HeaderContainer';
import CardContainer from './CardContainer';
import {
  DefaultTransition,
  ModalTransition,
} from '../../TransitionConfigs/TransitionPresets';
import { forNoAnimation } from '../../TransitionConfigs/HeaderStyleInterpolators';
import {
  Layout,
  StackHeaderMode,
  Scene,
  StackDescriptorMap,
  StackNavigationOptions,
} from '../../types';

type ProgressValues = {
  [key: string]: Animated.Value<number>;
};

type Props = {
  mode: 'card' | 'modal';
  insets: EdgeInsets;
  state: StackNavigationState;
  descriptors: StackDescriptorMap;
  routes: Route<string>[];
  openingRouteKeys: string[];
  closingRouteKeys: string[];
  onGoBack: (props: { route: Route<string> }) => void;
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
  progress: ProgressValues;
  layout: Layout;
  floatingHeaderHeights: Record<string, number>;
};

const dimensions = Dimensions.get('window');
const layout = { width: dimensions.width, height: dimensions.height };

let AnimatedScreen: React.ComponentType<ViewProps & {
  active: number | Animated.Node<number>;
}>;

const MaybeScreenContainer = ({
  enabled,
  ...rest
}: ViewProps & {
  enabled: boolean;
  children: React.ReactNode;
}) => {
  if (Platform.OS !== 'ios' && enabled && Screens.screensEnabled()) {
    return <Screens.ScreenContainer {...rest} />;
  }

  return <View {...rest} />;
};

const MaybeScreen = ({
  enabled,
  active,
  ...rest
}: ViewProps & {
  enabled: boolean;
  active: number | Animated.Node<number>;
  children: React.ReactNode;
}) => {
  if (Platform.OS !== 'ios' && enabled && Screens.screensEnabled()) {
    AnimatedScreen =
      AnimatedScreen || Animated.createAnimatedComponent(Screens.NativeScreen);

    return <AnimatedScreen active={active} {...rest} />;
  }

  return <View {...rest} />;
};

const { cond, eq } = Animated;

const ANIMATED_ONE = new Animated.Value(1);

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

    acc[curr.key] =
      typeof height === 'number'
        ? height
        : getDefaultHeaderHeight(layout, {
            ...insets,
            ...options.safeAreaInsets,
          });

    return acc;
  }, {});
};

export default class CardStack extends React.Component<Props, State> {
  static getDerivedStateFromProps(props: Props, state: State) {
    if (
      props.routes === state.routes &&
      props.descriptors === state.descriptors
    ) {
      return null;
    }

    const progress = props.routes.reduce<ProgressValues>((acc, curr) => {
      const descriptor = props.descriptors[curr.key];

      acc[curr.key] =
        state.progress[curr.key] ||
        new Animated.Value(
          props.openingRouteKeys.includes(curr.key) &&
          descriptor &&
          descriptor.options.animationEnabled !== false
            ? 0
            : 1
        );

      return acc;
    }, {});

    return {
      routes: props.routes,
      scenes: props.routes.map((route, index, self) => {
        const previousRoute = self[index - 1];
        const nextRoute = self[index + 1];

        const current = progress[route.key];
        const previous = previousRoute
          ? progress[previousRoute.key]
          : undefined;
        const next = nextRoute ? progress[nextRoute.key] : undefined;

        const oldScene = state.scenes[index];
        const scene = {
          route,
          previous: previousRoute,
          descriptor:
            props.descriptors[route.key] ||
            state.descriptors[route.key] ||
            (oldScene ? oldScene.descriptor : FALLBACK_DESCRIPTOR),
          progress: {
            current,
            next,
            previous,
          },
        };

        if (
          oldScene &&
          scene.route === oldScene.route &&
          scene.progress.current === oldScene.progress.current &&
          scene.progress.next === oldScene.progress.next &&
          scene.progress.previous === oldScene.progress.previous &&
          scene.descriptor === oldScene.descriptor
        ) {
          return oldScene;
        }

        return scene;
      }),
      progress,
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
    progress: {},
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
      const previousHeight = this.state.floatingHeaderHeights[route.key];

      if (previousHeight && previousHeight === height) {
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
      onGoBack,
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

    const { scenes, layout, progress, floatingHeaderHeights } = this.state;

    const focusedRoute = state.routes[state.index];
    const focusedDescriptor = descriptors[focusedRoute.key];
    const focusedOptions = focusedDescriptor ? focusedDescriptor.options : {};

    let defaultTransitionPreset =
      mode === 'modal' ? ModalTransition : DefaultTransition;

    if (headerMode === 'screen') {
      defaultTransitionPreset = {
        ...defaultTransitionPreset,
        headerStyleInterpolator: forNoAnimation,
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
            const current = progress[route.key];
            const scene = scenes[index];
            const next = self[index + 1]
              ? progress[self[index + 1].key]
              : ANIMATED_ONE;

            // Display current screen and a screen beneath. On Android screen beneath is hidden on animation finished bs of RNS's issue.
            const isScreenActive =
              index === self.length - 1
                ? 1
                : Platform.OS === 'android'
                ? cond(eq(next, 1), 0, 1)
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
              gestureResponseDistance,
              gestureVelocityImpact,
              gestureDirection = defaultTransitionPreset.gestureDirection,
              transitionSpec = defaultTransitionPreset.transitionSpec,
              cardStyleInterpolator = defaultTransitionPreset.cardStyleInterpolator,
              headerStyleInterpolator = defaultTransitionPreset.headerStyleInterpolator,
            } = scene.descriptor
              ? scene.descriptor.options
              : ({} as StackNavigationOptions);

            let transitionConfig = {
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
                  transitionSpec = defaultTransitionPreset.transitionSpec,
                  cardStyleInterpolator = defaultTransitionPreset.cardStyleInterpolator,
                  headerStyleInterpolator = defaultTransitionPreset.headerStyleInterpolator,
                } = nextScene.descriptor
                  ? nextScene.descriptor.options
                  : ({} as StackNavigationOptions);

                transitionConfig = {
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
                  current={current}
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
                  onGoBack={onGoBack}
                  gestureEnabled={index !== 0 && getGesturesEnabled({ route })}
                  gestureVelocityImpact={gestureVelocityImpact}
                  gestureDirection={gestureDirection}
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

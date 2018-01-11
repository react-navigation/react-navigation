/* @flow */

import * as React from 'react';

import clamp from 'clamp';
import {
  Animated,
  StyleSheet,
  PanResponder,
  Platform,
  View,
  I18nManager,
  Easing,
} from 'react-native';

import Card from './Card';
import Header from '../Header/Header';
import NavigationActions from '../../NavigationActions';
import addNavigationHelpers from '../../addNavigationHelpers';
import SceneView from '../SceneView';

import type {
  NavigationLayout,
  NavigationScreenProp,
  NavigationScene,
  NavigationRouter,
  NavigationState,
  NavigationScreenDetails,
  NavigationStackScreenOptions,
  HeaderMode,
  ViewStyleProp,
  TransitionConfig,
  NavigationRoute,
  NavigationComponent,
} from '../../TypeDefinition';

import TransitionConfigs from './TransitionConfigs';

const emptyFunction = () => {};

type Props = {
  screenProps?: {},
  headerMode: HeaderMode,
  headerComponent?: React.ComponentType<*>,
  mode: 'card' | 'modal',
  router: NavigationRouter<NavigationState, NavigationStackScreenOptions>,
  cardStyle?: ViewStyleProp,
  onTransitionStart?: () => void,
  onTransitionEnd?: () => void,
  /**
   * Optional custom animation when transitioning between screens.
   */
  transitionConfig?: () => TransitionConfig,

  // NavigationTransitionProps:
  layout: NavigationLayout,
  navigation: NavigationScreenProp<NavigationState>,
  position: Animated.Value,
  progress: Animated.Value,
  scenes: Array<NavigationScene>,
  scene: NavigationScene,
  index: number,
};

/**
 * The max duration of the card animation in milliseconds after released gesture.
 * The actual duration should be always less then that because the rest distance 
 * is always less then the full distance of the layout.
 */
const ANIMATION_DURATION = 500;

/**
 * The gesture distance threshold to trigger the back behavior. For instance,
 * `1/2` means that moving greater than 1/2 of the width of the screen will
 * trigger a back action
 */
const POSITION_THRESHOLD = 1 / 2;

/**
 * The threshold (in pixels) to start the gesture action.
 */
const RESPOND_THRESHOLD = 20;

/**
 * The distance of touch start from the edge of the screen where the gesture will be recognized
 */
const GESTURE_RESPONSE_DISTANCE_HORIZONTAL = 25;
const GESTURE_RESPONSE_DISTANCE_VERTICAL = 135;

const animatedSubscribeValue = (animatedValue: Animated.Value) => {
  if (!animatedValue.__isNative) {
    return;
  }
  if (Object.keys(animatedValue._listeners).length === 0) {
    animatedValue.addListener(emptyFunction);
  }
};

class CardStack extends React.Component<Props> {
  /**
   * Used to identify the starting point of the position when the gesture starts, such that it can
   * be updated according to its relative position. This means that a card can effectively be
   * "caught"- If a gesture starts while a card is animating, the card does not jump into a
   * corresponding location for the touch.
   */
  _gestureStartValue: number = 0;

  // tracks if a touch is currently happening
  _isResponding: boolean = false;

  /**
   * immediateIndex is used to represent the expected index that we will be on after a
   * transition. To achieve a smooth animation when swiping back, the action to go back
   * doesn't actually fire until the transition completes. The immediateIndex is used during
   * the transition so that gestures can be handled correctly. This is a work-around for
   * cases when the user quickly swipes back several times.
   */
  _immediateIndex: ?number = null;

  _screenDetails: {
    [key: string]: ?NavigationScreenDetails<NavigationStackScreenOptions>,
  } = {};

  componentWillReceiveProps(props: Props) {
    if (props.screenProps !== this.props.screenProps) {
      this._screenDetails = {};
    }
    props.scenes.forEach((newScene: *) => {
      if (
        this._screenDetails[newScene.key] &&
        this._screenDetails[newScene.key].state !== newScene.route
      ) {
        this._screenDetails[newScene.key] = null;
      }
    });
  }

  _getScreenDetails = (scene: NavigationScene): NavigationScreenDetails<*> => {
    const { screenProps, navigation, router } = this.props;
    let screenDetails = this._screenDetails[scene.key];
    if (!screenDetails || screenDetails.state !== scene.route) {
      const screenNavigation: NavigationScreenProp<
        NavigationRoute
      > = addNavigationHelpers({
        dispatch: navigation.dispatch,
        state: scene.route,
      });
      screenDetails = {
        state: scene.route,
        navigation: screenNavigation,
        options: router.getScreenOptions(screenNavigation, screenProps),
      };
      this._screenDetails[scene.key] = screenDetails;
    }
    return screenDetails;
  };

  _renderHeader(scene: NavigationScene, headerMode: HeaderMode): ?React.Node {
    const { header } = this._getScreenDetails(scene).options;

    if (typeof header !== 'undefined' && typeof header !== 'function') {
      return header;
    }

    const renderHeader = header || ((props: *) => <Header {...props} />);
    const {
      headerLeftInterpolator,
      headerTitleInterpolator,
      headerRightInterpolator,
    } = this._getTransitionConfig();

    // We need to explicitly exclude `mode` since Flow doesn't see
    // mode: headerMode override below and reports prop mismatch
    const { mode, ...passProps } = this.props;

    return renderHeader({
      ...passProps,
      scene,
      mode: headerMode,
      getScreenDetails: this._getScreenDetails,
      leftInterpolator: headerLeftInterpolator,
      titleInterpolator: headerTitleInterpolator,
      rightInterpolator: headerRightInterpolator,
    });
  }

  // eslint-disable-next-line class-methods-use-this
  _animatedSubscribe(props: Props) {
    // Hack to make this work with native driven animations. We add a single listener
    // so the JS value of the following animated values gets updated. We rely on
    // some Animated private APIs and not doing so would require using a bunch of
    // value listeners but we'd have to remove them to not leak and I'm not sure
    // when we'd do that with the current structure we have. `stopAnimation` callback
    // is also broken with native animated values that have no listeners so if we
    // want to remove this we have to fix this too.
    animatedSubscribeValue(props.layout.width);
    animatedSubscribeValue(props.layout.height);
    animatedSubscribeValue(props.position);
  }

  _reset(resetToIndex: number, duration: number): void {
    Animated.timing(this.props.position, {
      toValue: resetToIndex,
      duration,
      easing: Easing.linear(),
      useNativeDriver: this.props.position.__isNative,
    }).start();
  }

  _goBack(backFromIndex: number, duration: number) {
    const { navigation, position, scenes } = this.props;
    const toValue = Math.max(backFromIndex - 1, 0);

    // set temporary index for gesture handler to respect until the action is
    // dispatched at the end of the transition.
    this._immediateIndex = toValue;

    Animated.timing(position, {
      toValue,
      duration,
      easing: Easing.linear(),
      useNativeDriver: position.__isNative,
    }).start(() => {
      this._immediateIndex = null;
      const backFromScene = scenes.find((s: *) => s.index === toValue + 1);
      if (!this._isResponding && backFromScene) {
        navigation.dispatch(
          NavigationActions.back({ key: backFromScene.route.key })
        );
      }
    });
  }

  render(): React.Node {
    let floatingHeader = null;
    const headerMode = this._getHeaderMode();
    if (headerMode === 'float') {
      floatingHeader = this._renderHeader(this.props.scene, headerMode);
    }
    const { navigation, position, layout, scene, scenes, mode } = this.props;
    const { index } = navigation.state;
    const isVertical = mode === 'modal';
    const { options } = this._getScreenDetails(scene);
    const gestureDirectionInverted = options.gestureDirection === 'inverted';

    const responder = PanResponder.create({
      onPanResponderTerminate: () => {
        this._isResponding = false;
        this._reset(index, 0);
      },
      onPanResponderGrant: () => {
        position.stopAnimation((value: number) => {
          this._isResponding = true;
          this._gestureStartValue = value;
        });
      },
      onMoveShouldSetPanResponder: (
        event: { nativeEvent: { pageY: number, pageX: number } },
        gesture: any
      ) => {
        if (index !== scene.index) {
          return false;
        }
        const immediateIndex =
          this._immediateIndex == null ? index : this._immediateIndex;
        const currentDragDistance = gesture[isVertical ? 'dy' : 'dx'];
        const currentDragPosition =
          event.nativeEvent[isVertical ? 'pageY' : 'pageX'];
        const axisLength = isVertical
          ? layout.height.__getValue()
          : layout.width.__getValue();
        const axisHasBeenMeasured = !!axisLength;

        // Measure the distance from the touch to the edge of the screen
        const screenEdgeDistance = gestureDirectionInverted
          ? axisLength - (currentDragPosition - currentDragDistance)
          : currentDragPosition - currentDragDistance;
        // Compare to the gesture distance relavant to card or modal
        const {
          gestureResponseDistance: userGestureResponseDistance = {},
        } = this._getScreenDetails(scene).options;
        const gestureResponseDistance = isVertical
          ? userGestureResponseDistance.vertical ||
            GESTURE_RESPONSE_DISTANCE_VERTICAL
          : userGestureResponseDistance.horizontal ||
            GESTURE_RESPONSE_DISTANCE_HORIZONTAL;
        // GESTURE_RESPONSE_DISTANCE is about 25 or 30. Or 135 for modals
        if (screenEdgeDistance > gestureResponseDistance) {
          // Reject touches that started in the middle of the screen
          return false;
        }

        const hasDraggedEnough =
          Math.abs(currentDragDistance) > RESPOND_THRESHOLD;

        const isOnFirstCard = immediateIndex === 0;
        const shouldSetResponder =
          hasDraggedEnough && axisHasBeenMeasured && !isOnFirstCard;
        return shouldSetResponder;
      },
      onPanResponderMove: (event: any, gesture: any) => {
        // Handle the moving touches for our granted responder
        const startValue = this._gestureStartValue;
        const axis = isVertical ? 'dy' : 'dx';
        const axisDistance = isVertical
          ? layout.height.__getValue()
          : layout.width.__getValue();
        const currentValue =
          (I18nManager.isRTL && axis === 'dx') !== gestureDirectionInverted
            ? startValue + gesture[axis] / axisDistance
            : startValue - gesture[axis] / axisDistance;
        const value = clamp(index - 1, currentValue, index);
        position.setValue(value);
      },
      onPanResponderTerminationRequest: () =>
        // Returning false will prevent other views from becoming responder while
        // the navigation view is the responder (mid-gesture)
        false,
      onPanResponderRelease: (event: any, gesture: any) => {
        if (!this._isResponding) {
          return;
        }
        this._isResponding = false;

        const immediateIndex =
          this._immediateIndex == null ? index : this._immediateIndex;

        // Calculate animate duration according to gesture speed and moved distance
        const axisDistance = isVertical
          ? layout.height.__getValue()
          : layout.width.__getValue();
        const movementDirection = gestureDirectionInverted ? -1 : 1;
        const movedDistance =
          movementDirection * gesture[isVertical ? 'dy' : 'dx'];
        const gestureVelocity =
          movementDirection * gesture[isVertical ? 'vy' : 'vx'];
        const defaultVelocity = axisDistance / ANIMATION_DURATION;
        const velocity = Math.max(Math.abs(gestureVelocity), defaultVelocity);
        const resetDuration = gestureDirectionInverted
          ? (axisDistance - movedDistance) / velocity
          : movedDistance / velocity;
        const goBackDuration = gestureDirectionInverted
          ? movedDistance / velocity
          : (axisDistance - movedDistance) / velocity;

        // To asyncronously get the current animated value, we need to run stopAnimation:
        position.stopAnimation((value: number) => {
          // If the speed of the gesture release is significant, use that as the indication
          // of intent
          if (gestureVelocity < -0.5) {
            this._reset(immediateIndex, resetDuration);
            return;
          }
          if (gestureVelocity > 0.5) {
            this._goBack(immediateIndex, goBackDuration);
            return;
          }

          // Then filter based on the distance the screen was moved. Over a third of the way swiped,
          // and the back will happen.
          if (value <= index - POSITION_THRESHOLD) {
            this._goBack(immediateIndex, goBackDuration);
          } else {
            this._reset(immediateIndex, resetDuration);
          }
        });
      },
    });

    const gesturesEnabled =
      typeof options.gesturesEnabled === 'boolean'
        ? options.gesturesEnabled
        : Platform.OS === 'ios';

    const handlers = gesturesEnabled ? responder.panHandlers : {};
    const containerStyle = [
      styles.container,
      this._getTransitionConfig().containerStyle,
    ];

    return (
      <View {...handlers} style={containerStyle}>
        <View style={styles.scenes}>
          {scenes.map((s: *) => this._renderCard(s))}
        </View>
        {floatingHeader}
      </View>
    );
  }

  _getHeaderMode(): HeaderMode {
    if (this.props.headerMode) {
      return this.props.headerMode;
    }
    if (Platform.OS === 'android' || this.props.mode === 'modal') {
      return 'screen';
    }
    return 'float';
  }

  _renderInnerScene(
    SceneComponent: NavigationComponent,
    scene: NavigationScene
  ): React.Node {
    const { navigation } = this._getScreenDetails(scene);
    const { screenProps } = this.props;
    const headerMode = this._getHeaderMode();
    if (headerMode === 'screen') {
      return (
        <View style={styles.container}>
          <View style={{ flex: 1 }}>
            <SceneView
              screenProps={screenProps}
              navigation={navigation}
              component={SceneComponent}
            />
          </View>
          {this._renderHeader(scene, headerMode)}
        </View>
      );
    }
    return (
      <SceneView
        screenProps={this.props.screenProps}
        navigation={navigation}
        component={SceneComponent}
      />
    );
  }

  _getTransitionConfig = () => {
    const isModal = this.props.mode === 'modal';

    return TransitionConfigs.getTransitionConfig(
      this.props.transitionConfig,
      /* $FlowFixMe */
      {},
      /* $FlowFixMe */
      {},
      isModal
    );
  };

  _renderCard = (scene: NavigationScene): React.Node => {
    const { screenInterpolator } = this._getTransitionConfig();
    const style =
      screenInterpolator && screenInterpolator({ ...this.props, scene });

    const SceneComponent = this.props.router.getComponentForRouteName(
      scene.route.routeName
    );

    return (
      <Card
        {...this.props}
        key={`card_${scene.key}`}
        style={[style, this.props.cardStyle]}
        scene={scene}
      >
        {this._renderInnerScene(SceneComponent, scene)}
      </Card>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Header is physically rendered after scenes so that Header won't be
    // covered by the shadows of the scenes.
    // That said, we'd have use `flexDirection: 'column-reverse'` to move
    // Header above the scenes.
    flexDirection: 'column-reverse',
  },
  scenes: {
    flex: 1,
  },
});

export default CardStack;

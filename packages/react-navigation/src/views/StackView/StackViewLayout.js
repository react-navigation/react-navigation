import React from 'react';

import clamp from 'clamp';
import {
  Animated,
  StyleSheet,
  PanResponder,
  Platform,
  View,
  I18nManager,
  Easing,
  Dimensions,
} from 'react-native';

import Card from './StackViewCard';
import Header from '../Header/Header';
import NavigationActions from '../../NavigationActions';
import StackActions from '../../routers/StackActions';
import SceneView from '../SceneView';
import withOrientation from '../withOrientation';
import { NavigationProvider } from '../NavigationContext';

import TransitionConfigs from './StackViewTransitionConfigs';
import { supportsImprovedSpringAnimation } from '../../utils/ReactNativeFeatures';

const emptyFunction = () => {};

const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = Dimensions.get('window');
const IS_IPHONE_X =
  Platform.OS === 'ios' &&
  !Platform.isPad &&
  !Platform.isTVOS &&
  (WINDOW_HEIGHT === 812 || WINDOW_WIDTH === 812);

const EaseInOut = Easing.inOut(Easing.ease);

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

const animatedSubscribeValue = animatedValue => {
  if (!animatedValue.__isNative) {
    return;
  }
  if (Object.keys(animatedValue._listeners).length === 0) {
    animatedValue.addListener(emptyFunction);
  }
};

const getDefaultHeaderHeight = isLandscape => {
  if (Platform.OS === 'ios') {
    if (isLandscape && !Platform.isPad) {
      return 32;
    } else if (IS_IPHONE_X) {
      return 88;
    } else {
      return 64;
    }
  } else {
    return 56;
  }
};

class StackViewLayout extends React.Component {
  /**
   * Used to identify the starting point of the position when the gesture starts, such that it can
   * be updated according to its relative position. This means that a card can effectively be
   * "caught"- If a gesture starts while a card is animating, the card does not jump into a
   * corresponding location for the touch.
   */
  _gestureStartValue = 0;

  // tracks if a touch is currently happening
  _isResponding = false;

  /**
   * immediateIndex is used to represent the expected index that we will be on after a
   * transition. To achieve a smooth animation when swiping back, the action to go back
   * doesn't actually fire until the transition completes. The immediateIndex is used during
   * the transition so that gestures can be handled correctly. This is a work-around for
   * cases when the user quickly swipes back several times.
   */
  _immediateIndex = null;

  constructor(props) {
    super(props);

    this.state = {
      // Used when card's header is null and mode is float to make transition
      // between screens with headers and those without headers smooth.
      // This is not a great heuristic here. We don't know synchronously
      // on mount what the header height is so we have just used the most
      // common cases here.
      floatingHeaderHeight: getDefaultHeaderHeight(props.isLandscape),
    };
  }

  _renderHeader(scene, headerMode) {
    const { options } = scene.descriptor;
    const { header } = options;

    if (__DEV__ && typeof header === 'string') {
      throw new Error(
        `Invalid header value: "${header}". The header option must be a valid React component or null, not a string.`
      );
    }

    if (header === null && headerMode === 'screen') {
      return null;
    }

    // check if it's a react element
    if (React.isValidElement(header)) {
      return header;
    }

    // Handle the case where the header option is a function, and provide the default
    const renderHeader = header || (props => <Header {...props} />);

    const {
      headerLeftInterpolator,
      headerTitleInterpolator,
      headerRightInterpolator,
    } = this._getTransitionConfig();

    const {
      mode,
      transitionProps,
      lastTransitionProps,
      ...passProps
    } = this.props;

    return (
      <NavigationProvider value={scene.descriptor.navigation}>
        {renderHeader({
          ...passProps,
          ...transitionProps,
          scene,
          mode: headerMode,
          transitionPreset: this._getHeaderTransitionPreset(),
          leftInterpolator: headerLeftInterpolator,
          titleInterpolator: headerTitleInterpolator,
          rightInterpolator: headerRightInterpolator,
        })}
      </NavigationProvider>
    );
  }

  // eslint-disable-next-line class-methods-use-this
  _animatedSubscribe(props) {
    // Hack to make this work with native driven animations. We add a single listener
    // so the JS value of the following animated values gets updated. We rely on
    // some Animated private APIs and not doing so would require using a bunch of
    // value listeners but we'd have to remove them to not leak and I'm not sure
    // when we'd do that with the current structure we have. `stopAnimation` callback
    // is also broken with native animated values that have no listeners so if we
    // want to remove this we have to fix this too.
    animatedSubscribeValue(props.transitionProps.layout.width);
    animatedSubscribeValue(props.transitionProps.layout.height);
    animatedSubscribeValue(props.transitionProps.position);
  }

  _reset(resetToIndex, duration) {
    if (Platform.OS === 'ios' && supportsImprovedSpringAnimation()) {
      Animated.spring(this.props.transitionProps.position, {
        toValue: resetToIndex,
        stiffness: 5000,
        damping: 600,
        mass: 3,
        useNativeDriver: this.props.transitionProps.position.__isNative,
      }).start();
    } else {
      Animated.timing(this.props.transitionProps.position, {
        toValue: resetToIndex,
        duration,
        easing: EaseInOut,
        useNativeDriver: this.props.transitionProps.position.__isNative,
      }).start();
    }
  }

  _goBack(backFromIndex, duration) {
    const { navigation, position, scenes } = this.props.transitionProps;
    const toValue = Math.max(backFromIndex - 1, 0);

    // set temporary index for gesture handler to respect until the action is
    // dispatched at the end of the transition.
    this._immediateIndex = toValue;

    const onCompleteAnimation = () => {
      this._immediateIndex = null;
      const backFromScene = scenes.find(s => s.index === toValue + 1);
      if (!this._isResponding && backFromScene) {
        navigation.dispatch(
          NavigationActions.back({
            key: backFromScene.route.key,
            immediate: true,
          })
        );
        navigation.dispatch(StackActions.completeTransition());
      }
    };

    if (Platform.OS === 'ios' && supportsImprovedSpringAnimation()) {
      Animated.spring(position, {
        toValue,
        stiffness: 5000,
        damping: 600,
        mass: 3,
        useNativeDriver: position.__isNative,
      }).start(onCompleteAnimation);
    } else {
      Animated.timing(position, {
        toValue,
        duration,
        easing: EaseInOut,
        useNativeDriver: position.__isNative,
      }).start(onCompleteAnimation);
    }
  }

  _panResponder = PanResponder.create({
    onPanResponderTerminate: () => {
      const { navigation } = this.props.transitionProps;
      const { index } = navigation.state;
      this._isResponding = false;
      this._reset(index, 0);
      this.props.onGestureCanceled && this.props.onGestureCanceled();
    },
    onPanResponderGrant: () => {
      const {
        transitionProps: { navigation, position, scene },
      } = this.props;
      const { index } = navigation.state;

      if (index !== scene.index) {
        return false;
      }

      position.stopAnimation(value => {
        this._isResponding = true;
        this._gestureStartValue = value;
      });
      this.props.onGestureBegin && this.props.onGestureBegin();
    },
    onMoveShouldSetPanResponder: (event, gesture) => {
      const {
        transitionProps: { navigation, layout, scene },
        mode,
      } = this.props;
      const { index } = navigation.state;
      const isVertical = mode === 'modal';
      const { options } = scene.descriptor;
      const gestureDirection = options.gestureDirection;

      const gestureDirectionInverted =
        typeof gestureDirection === 'string'
          ? gestureDirection === 'inverted'
          : I18nManager.isRTL;

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
      } = options;
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
    onPanResponderMove: (event, gesture) => {
      const {
        transitionProps: { navigation, position, layout, scene },
        mode,
      } = this.props;
      const { index } = navigation.state;
      const isVertical = mode === 'modal';
      const { options } = scene.descriptor;
      const gestureDirection = options.gestureDirection;

      const gestureDirectionInverted =
        typeof gestureDirection === 'string'
          ? gestureDirection === 'inverted'
          : I18nManager.isRTL;

      // Handle the moving touches for our granted responder
      const startValue = this._gestureStartValue;
      const axis = isVertical ? 'dy' : 'dx';
      const axisDistance = isVertical
        ? layout.height.__getValue()
        : layout.width.__getValue();
      const currentValue =
        axis === 'dx' && gestureDirectionInverted
          ? startValue + gesture[axis] / axisDistance
          : startValue - gesture[axis] / axisDistance;
      const value = clamp(index - 1, currentValue, index);
      position.setValue(value);
    },
    onPanResponderTerminationRequest: () =>
      // Returning false will prevent other views from becoming responder while
      // the navigation view is the responder (mid-gesture)
      false,
    onPanResponderRelease: (event, gesture) => {
      const {
        transitionProps: { navigation, position, layout, scene },
        mode,
      } = this.props;
      const { index } = navigation.state;
      const isVertical = mode === 'modal';
      const { options } = scene.descriptor;
      const gestureDirection = options.gestureDirection;

      const gestureDirectionInverted =
        typeof gestureDirection === 'string'
          ? gestureDirection === 'inverted'
          : I18nManager.isRTL;

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
      position.stopAnimation(value => {
        // If the speed of the gesture release is significant, use that as the indication
        // of intent
        if (gestureVelocity < -0.5) {
          this.props.onGestureCanceled && this.props.onGestureCanceled();
          this._reset(immediateIndex, resetDuration);
          return;
        }
        if (gestureVelocity > 0.5) {
          this.props.onGestureFinish && this.props.onGestureFinish();
          this._goBack(immediateIndex, goBackDuration);
          return;
        }

        // Then filter based on the distance the screen was moved. Over a third of the way swiped,
        // and the back will happen.
        if (value <= index - POSITION_THRESHOLD) {
          this.props.onGestureFinish && this.props.onGestureFinish();
          this._goBack(immediateIndex, goBackDuration);
        } else {
          this.props.onGestureCanceled && this.props.onGestureCanceled();
          this._reset(immediateIndex, resetDuration);
        }
      });
    },
  });

  _onFloatingHeaderLayout = e => {
    this.setState({ floatingHeaderHeight: e.nativeEvent.layout.height });
  };

  render() {
    let floatingHeader = null;
    const headerMode = this._getHeaderMode();

    if (headerMode === 'float') {
      const { scene } = this.props.transitionProps;
      floatingHeader = (
        <View pointerEvents="box-none" onLayout={this._onFloatingHeaderLayout}>
          {this._renderHeader(scene, headerMode)}
        </View>
      );
    }
    const {
      transitionProps: { scene, scenes },
      mode,
    } = this.props;
    const { options } = scene.descriptor;

    const gesturesEnabled =
      typeof options.gesturesEnabled === 'boolean'
        ? options.gesturesEnabled
        : Platform.OS === 'ios';

    const responder = !gesturesEnabled ? null : this._panResponder;

    const handlers = gesturesEnabled ? responder.panHandlers : {};
    const containerStyle = [
      styles.container,
      this._getTransitionConfig().containerStyle,
    ];

    return (
      <View {...handlers} style={containerStyle}>
        <View style={styles.scenes}>
          {scenes.map(s => this._renderCard(s))}
        </View>
        {floatingHeader}
      </View>
    );
  }

  _getHeaderMode() {
    if (this.props.headerMode) {
      return this.props.headerMode;
    }
    if (Platform.OS === 'android' || this.props.mode === 'modal') {
      return 'screen';
    }
    return 'float';
  }

  _getHeaderTransitionPreset() {
    // On Android or with header mode screen, we always just use in-place,
    // we ignore the option entirely (at least until we have other presets)
    if (Platform.OS === 'android' || this._getHeaderMode() === 'screen') {
      return 'fade-in-place';
    }

    // TODO: validations: 'fade-in-place' or 'uikit' are valid
    if (this.props.headerTransitionPreset) {
      return this.props.headerTransitionPreset;
    } else {
      return 'fade-in-place';
    }
  }

  _renderInnerScene(scene) {
    const { options, navigation, getComponent } = scene.descriptor;
    const SceneComponent = getComponent();

    const { screenProps } = this.props;
    const headerMode = this._getHeaderMode();
    if (headerMode === 'screen') {
      return (
        <View style={styles.container}>
          <View style={styles.scenes}>
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
        screenProps={screenProps}
        navigation={navigation}
        component={SceneComponent}
      />
    );
  }

  _getTransitionConfig = () => {
    const isModal = this.props.mode === 'modal';

    return TransitionConfigs.getTransitionConfig(
      this.props.transitionConfig,
      this.props.transitionProps,
      this.props.lastTransitionProps,
      isModal
    );
  };

  _renderCard = scene => {
    const { screenInterpolator } = this._getTransitionConfig();

    const style =
      screenInterpolator &&
      screenInterpolator({ ...this.props.transitionProps, scene });

    // If this screen has "header" set to `null` in it's navigation options, but
    // it exists in a stack with headerMode float, add a negative margin to
    // compensate for the hidden header
    const { options } = scene.descriptor;
    const hasHeader = options.header !== null;
    const headerMode = this._getHeaderMode();
    let marginTop = 0;
    if (!hasHeader && headerMode === 'float') {
      marginTop = -this.state.floatingHeaderHeight;
    }

    return (
      <Card
        {...this.props.transitionProps}
        key={`card_${scene.key}`}
        style={[style, { marginTop }, this.props.cardStyle]}
        scene={scene}
      >
        {this._renderInnerScene(scene)}
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

export default withOrientation(StackViewLayout);

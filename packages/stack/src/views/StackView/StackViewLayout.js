import React from 'react';
import {
  Animated,
  StyleSheet,
  Platform,
  View,
  I18nManager,
  Easing,
  Dimensions,
} from 'react-native';
import {
  SceneView,
  StackActions,
  NavigationActions,
  NavigationProvider,
} from '@react-navigation/core';
import { withOrientation } from '@react-navigation/native';
import { ScreenContainer } from 'react-native-screens';
import { PanGestureHandler, State } from 'react-native-gesture-handler';

import Card from './StackViewCard';
import Header from '../Header/Header';
import TransitionConfigs from './StackViewTransitionConfigs';
import HeaderStyleInterpolator from '../Header/HeaderStyleInterpolator';
import StackGestureContext from '../../utils/StackGestureContext';
import clamp from '../../utils/clamp';
import { supportsImprovedSpringAnimation } from '../../utils/ReactNativeFeatures';

const IPHONE_XS_HEIGHT = 812; // iPhone X and XS
const IPHONE_XR_HEIGHT = 896; // iPhone XR and XS Max
const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = Dimensions.get('window');
const IS_IPHONE_X =
  Platform.OS === 'ios' &&
  !Platform.isPad &&
  !Platform.isTVOS &&
  (WINDOW_HEIGHT === IPHONE_XS_HEIGHT ||
    WINDOW_WIDTH === IPHONE_XS_HEIGHT ||
    WINDOW_HEIGHT === IPHONE_XR_HEIGHT ||
    WINDOW_WIDTH === IPHONE_XR_HEIGHT);

const EaseInOut = Easing.inOut(Easing.ease);

/**
 * Enumerate possible values for validation
 */
const HEADER_LAYOUT_PRESET = ['center', 'left'];
const HEADER_TRANSITION_PRESET = ['fade-in-place', 'uikit'];
const HEADER_BACKGROUND_TRANSITION_PRESET = ['toggle', 'fade', 'translate'];

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
 * The distance of touch start from the edge of the screen where the gesture will be recognized
 */
const GESTURE_RESPONSE_DISTANCE_HORIZONTAL = 50;
const GESTURE_RESPONSE_DISTANCE_VERTICAL = 135;

const USE_NATIVE_DRIVER = true;

const getDefaultHeaderHeight = isLandscape => {
  if (Platform.OS === 'ios') {
    if (isLandscape && !Platform.isPad) {
      return 32;
    } else if (IS_IPHONE_X) {
      return 88;
    } else {
      return 64;
    }
  } else if (Platform.OS === 'android') {
    return 56;
  } else {
    return 64;
  }
};

class StackViewLayout extends React.Component {
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
    this.panGestureRef = React.createRef();
    this.gestureX = new Animated.Value(0);
    this.gestureY = new Animated.Value(0);
    this.positionSwitch = new Animated.Value(1);
    if (Animated.subtract) {
      this.gestureSwitch = Animated.subtract(1, this.positionSwitch);
    } else {
      this.gestureSwitch = Animated.add(
        1,
        Animated.multiply(-1, this.positionSwitch)
      );
    }
    this.gestureEvent = Animated.event(
      [
        {
          nativeEvent: {
            translationX: this.gestureX,
            translationY: this.gestureY,
          },
        },
      ],
      {
        useNativeDriver: USE_NATIVE_DRIVER,
      }
    );

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

    let {
      headerLeftInterpolator,
      headerTitleInterpolator,
      headerRightInterpolator,
      headerBackgroundInterpolator,
    } = this._transitionConfig;

    const backgroundTransitionPresetInterpolator = this._getHeaderBackgroundTransitionPreset();
    if (backgroundTransitionPresetInterpolator) {
      headerBackgroundInterpolator = backgroundTransitionPresetInterpolator;
    }

    const { transitionProps, ...passProps } = this.props;

    return (
      <NavigationProvider value={scene.descriptor.navigation}>
        {renderHeader({
          ...passProps,
          ...transitionProps,
          position: this.position,
          scene,
          mode: headerMode,
          transitionPreset: this._getHeaderTransitionPreset(),
          layoutPreset: this._getHeaderLayoutPreset(),
          backTitleVisible: this._getHeaderBackTitleVisible(),
          leftInterpolator: headerLeftInterpolator,
          titleInterpolator: headerTitleInterpolator,
          rightInterpolator: headerRightInterpolator,
          backgroundInterpolator: headerBackgroundInterpolator,
        })}
      </NavigationProvider>
    );
  }

  _reset(resetToIndex, duration) {
    if (Platform.OS === 'ios' && supportsImprovedSpringAnimation()) {
      Animated.spring(this.props.transitionProps.position, {
        toValue: resetToIndex,
        stiffness: 6000,
        damping: 100,
        mass: 3,
        overshootClamping: true,
        restDisplacementThreshold: 0.01,
        restSpeedThreshold: 0.01,
        useNativeDriver: USE_NATIVE_DRIVER,
      }).start();
    } else {
      Animated.timing(this.props.transitionProps.position, {
        toValue: resetToIndex,
        duration,
        easing: EaseInOut,
        useNativeDriver: USE_NATIVE_DRIVER,
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
      if (backFromScene) {
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
        stiffness: 7000,
        damping: 300,
        mass: 3,
        overshootClamping: true,
        restDisplacementThreshold: 0.01,
        restSpeedThreshold: 0.01,
        useNativeDriver: USE_NATIVE_DRIVER,
      }).start(onCompleteAnimation);
    } else {
      Animated.timing(position, {
        toValue,
        duration,
        easing: EaseInOut,
        useNativeDriver: USE_NATIVE_DRIVER,
      }).start(onCompleteAnimation);
    }
  }

  _onFloatingHeaderLayout = e => {
    const { height } = e.nativeEvent.layout;
    if (height !== this.state.floatingHeaderHeight) {
      this.setState({ floatingHeaderHeight: height });
    }
  };

  _prepareAnimated() {
    if (this.props === this._prevProps) {
      return;
    }
    this._prevProps = this.props;

    this._prepareGesture();
    this._preparePosition();
    this._prepareTransitionConfig();
  }

  render() {
    this._prepareAnimated();

    const { transitionProps } = this.props;
    const {
      navigation: {
        state: { index },
      },
      scenes,
    } = transitionProps;

    const headerMode = this._getHeaderMode();
    let floatingHeader = null;
    if (headerMode === 'float') {
      const { scene } = transitionProps;
      floatingHeader = (
        <View
          style={styles.floatingHeader}
          pointerEvents="box-none"
          onLayout={this._onFloatingHeaderLayout}
        >
          {this._renderHeader(scene, headerMode)}
        </View>
      );
    }

    return (
      <PanGestureHandler
        {...this._gestureActivationCriteria()}
        ref={this.panGestureRef}
        onGestureEvent={this.gestureEvent}
        onHandlerStateChange={this._handlePanGestureStateChange}
        enabled={index > 0 && this._isGestureEnabled()}
      >
        <Animated.View
          style={[styles.container, this._transitionConfig.containerStyle]}
        >
          <StackGestureContext.Provider value={this.panGestureRef}>
            <ScreenContainer style={styles.scenes}>
              {scenes.map(this._renderCard)}
            </ScreenContainer>
            {floatingHeader}
          </StackGestureContext.Provider>
        </Animated.View>
      </PanGestureHandler>
    );
  }

  componentDidUpdate(prevProps) {
    const { state: prevState } = prevProps.transitionProps.navigation;
    const { state } = this.props.transitionProps.navigation;
    if (prevState.index !== state.index) {
      this._maybeCancelGesture();
    }
  }

  _getGestureResponseDistance() {
    const { scene } = this.props.transitionProps;
    const { options } = scene.descriptor;
    const {
      gestureResponseDistance: userGestureResponseDistance = {},
    } = options;

    // Doesn't make sense for a response distance of 0, so this works fine
    return this._isModal()
      ? userGestureResponseDistance.vertical ||
          GESTURE_RESPONSE_DISTANCE_VERTICAL
      : userGestureResponseDistance.horizontal ||
          GESTURE_RESPONSE_DISTANCE_HORIZONTAL;
  }

  _gestureActivationCriteria() {
    const { layout } = this.props.transitionProps;
    const gestureResponseDistance = this._getGestureResponseDistance();
    const isMotionInverted = this._isMotionInverted();

    if (this._isMotionVertical()) {
      const height = layout.height.__getValue();

      return {
        maxDeltaX: 15,
        minOffsetY: isMotionInverted ? -5 : 5,
        hitSlop: isMotionInverted
          ? { top: -height + gestureResponseDistance }
          : { bottom: -height + gestureResponseDistance },
      };
    } else {
      const width = layout.width.__getValue();
      const hitSlop = -width + gestureResponseDistance;

      return {
        minOffsetX: isMotionInverted ? -5 : 5,
        maxDeltaY: 20,
        hitSlop: isMotionInverted ? { left: hitSlop } : { right: hitSlop },
      };
    }
  }

  _isGestureEnabled() {
    const gesturesEnabled = this.props.transitionProps.scene.descriptor.options
      .gesturesEnabled;
    return typeof gesturesEnabled === 'boolean'
      ? gesturesEnabled
      : Platform.OS === 'ios';
  }

  _isMotionVertical() {
    return this._isModal();
  }

  _isModal() {
    return this.props.mode === 'modal';
  }

  // This only currently applies to the horizontal gesture!
  _isMotionInverted() {
    const {
      transitionProps: { scene },
    } = this.props;
    const { options } = scene.descriptor;
    const { gestureDirection } = options;

    if (this._isModal()) {
      return gestureDirection === 'inverted';
    } else {
      return typeof gestureDirection === 'string'
        ? gestureDirection === 'inverted'
        : I18nManager.isRTL;
    }
  }

  _computeHorizontalGestureValue({ translationX }) {
    const {
      transitionProps: { navigation, layout },
    } = this.props;

    const { index } = navigation.state;

    // TODO: remove this __getValue!
    const distance = layout.width.__getValue();

    const x = this._isMotionInverted() ? -1 * translationX : translationX;

    const value = index - x / distance;
    return clamp(index - 1, value, index);
  }

  _computeVerticalGestureValue({ translationY }) {
    const {
      transitionProps: { navigation, layout },
    } = this.props;

    const { index } = navigation.state;

    // TODO: remove this __getValue!
    const distance = layout.height.__getValue();

    const y = this._isMotionInverted() ? -1 * translationY : translationY;
    const value = index - y / distance;
    return clamp(index - 1, value, index);
  }

  _handlePanGestureStateChange = ({ nativeEvent }) => {
    if (nativeEvent.oldState === State.ACTIVE) {
      // Gesture was cancelled! For example, some navigation state update
      // arrived while the gesture was active that cancelled it out
      if (this.positionSwitch.__getValue() === 1) {
        return;
      }

      if (this._isMotionVertical()) {
        this._handleReleaseVertical(nativeEvent);
      } else {
        this._handleReleaseHorizontal(nativeEvent);
      }
    } else if (nativeEvent.state === State.ACTIVE) {
      this.props.onGestureBegin && this.props.onGestureBegin();

      // Switch to using gesture position
      this.positionSwitch.setValue(0);

      // By enabling the gesture switch and ignoring the position here we
      // end up with a quick jump to the initial value and then back to the
      // gesture. While this isn't ideal, it's preferred over preventing new
      // gestures during the animation (all gestures should be interruptible)
      // and we will properly fix it (interruptible and from the correct position)
      // when we integrate reanimated. If you prefer to prevent gestures during
      // transitions, then fork this library, comment the positionSwitch value set above,
      // and uncomment the following two lines.
      // if (!this.props.transitionProps.position._animation) {
      //   this.positionSwitch.setValue(0);
      // }
    }
  };

  // note: this will not animated so nicely because the position is unaware
  // of the gesturePosition, so if we are in the middle of swiping the screen away
  // and back is programatically fired then we will reset to the initial position
  // and animate from there
  _maybeCancelGesture() {
    this.positionSwitch.setValue(1);
  }

  _prepareGesture() {
    if (!this._isGestureEnabled()) {
      if (this.positionSwitch.__getValue() !== 1) {
        this.positionSwitch.setValue(1);
      }
      this.gesturePosition = undefined;
      return;
    }

    // We can't run the gesture if width or height layout is unavailable
    if (
      this.props.transitionProps.layout.width.__getValue() === 0 ||
      this.props.transitionProps.layout.height.__getValue() === 0
    ) {
      return;
    }

    if (this._isMotionVertical()) {
      this._prepareGestureVertical();
    } else {
      this._prepareGestureHorizontal();
    }
  }

  _prepareGestureHorizontal() {
    const { index } = this.props.transitionProps.navigation.state;

    if (this._isMotionInverted()) {
      this.gesturePosition = Animated.add(
        index,
        Animated.divide(this.gestureX, this.props.transitionProps.layout.width)
      ).interpolate({
        inputRange: [index - 1, index],
        outputRange: [index - 1, index],
        extrapolate: 'clamp',
      });
    } else {
      this.gesturePosition = Animated.add(
        index,
        Animated.multiply(
          -1,
          Animated.divide(
            this.gestureX,
            this.props.transitionProps.layout.width
          )
        )
      ).interpolate({
        inputRange: [index - 1, index],
        outputRange: [index - 1, index],
        extrapolate: 'clamp',
      });
    }
  }

  _prepareGestureVertical() {
    const { index } = this.props.transitionProps.navigation.state;

    if (this._isMotionInverted()) {
      this.gesturePosition = Animated.add(
        index,
        Animated.divide(this.gestureY, this.props.transitionProps.layout.height)
      ).interpolate({
        inputRange: [index - 1, index],
        outputRange: [index - 1, index],
        extrapolate: 'clamp',
      });
    } else {
      this.gesturePosition = Animated.add(
        index,
        Animated.multiply(
          -1,
          Animated.divide(
            this.gestureY,
            this.props.transitionProps.layout.height
          )
        )
      ).interpolate({
        inputRange: [index - 1, index],
        outputRange: [index - 1, index],
        extrapolate: 'clamp',
      });
    }
  }

  _handleReleaseHorizontal(nativeEvent) {
    const {
      transitionProps: { navigation, position, layout },
    } = this.props;
    const { index } = navigation.state;
    const immediateIndex =
      this._immediateIndex == null ? index : this._immediateIndex;

    // Calculate animate duration according to gesture speed and moved distance
    const distance = layout.width.__getValue();
    const movementDirection = this._isMotionInverted() ? -1 : 1;
    const movedDistance = movementDirection * nativeEvent.translationX;
    const gestureVelocity = movementDirection * nativeEvent.velocityX;
    const defaultVelocity = distance / ANIMATION_DURATION;
    const velocity = Math.max(Math.abs(gestureVelocity), defaultVelocity);
    const resetDuration = this._isMotionInverted()
      ? (distance - movedDistance) / velocity
      : movedDistance / velocity;
    const goBackDuration = this._isMotionInverted()
      ? movedDistance / velocity
      : (distance - movedDistance) / velocity;

    // Get the current position value and reset to using the statically driven
    // (rather than gesture driven) position.
    const value = this._computeHorizontalGestureValue(nativeEvent);
    position.setValue(value);
    this.positionSwitch.setValue(1);

    // If the speed of the gesture release is significant, use that as the indication
    // of intent
    if (gestureVelocity < -50) {
      this.props.onGestureCanceled && this.props.onGestureCanceled();
      this._reset(immediateIndex, resetDuration);
      return;
    }
    if (gestureVelocity > 50) {
      this.props.onGestureEnd && this.props.onGestureEnd();
      this._goBack(immediateIndex, goBackDuration);
      return;
    }

    // Then filter based on the distance the screen was moved. Over a third of the way swiped,
    // and the back will happen.
    if (value <= index - POSITION_THRESHOLD) {
      this.props.onGestureEnd && this.props.onGestureEnd();
      this._goBack(immediateIndex, goBackDuration);
    } else {
      this.props.onGestureCanceled && this.props.onGestureCanceled();
      this._reset(immediateIndex, resetDuration);
    }
  }

  _handleReleaseVertical(nativeEvent) {
    const {
      transitionProps: { navigation, position, layout },
    } = this.props;
    const { index } = navigation.state;
    const immediateIndex =
      this._immediateIndex == null ? index : this._immediateIndex;

    // Calculate animate duration according to gesture speed and moved distance
    const distance = layout.height.__getValue();
    const isMotionInverted = this._isMotionInverted();
    const movementDirection = isMotionInverted ? -1 : 1;
    const movedDistance = movementDirection * nativeEvent.translationY;
    const gestureVelocity = movementDirection * nativeEvent.velocityY;
    const defaultVelocity = distance / ANIMATION_DURATION;
    const velocity = Math.max(Math.abs(gestureVelocity), defaultVelocity);
    const resetDuration = isMotionInverted
      ? (distance - movedDistance) / velocity
      : movedDistance / velocity;
    const goBackDuration = isMotionInverted
      ? movedDistance / velocity
      : (distance - movedDistance) / velocity;

    const value = this._computeVerticalGestureValue(nativeEvent);
    position.setValue(value);
    this.positionSwitch.setValue(1);

    // If the speed of the gesture release is significant, use that as the indication
    // of intent
    if (gestureVelocity < -50) {
      this.props.onGestureCanceled && this.props.onGestureCanceled();
      this._reset(immediateIndex, resetDuration);
      return;
    }
    if (gestureVelocity > 50) {
      this.props.onGestureEnd && this.props.onGestureEnd();
      this._goBack(immediateIndex, goBackDuration);
      return;
    }

    // Then filter based on the distance the screen was moved. Over a third of the way swiped,
    // and the back will happen.
    if (value <= index - POSITION_THRESHOLD) {
      this.props.onGestureEnd && this.props.onGestureEnd();
      this._goBack(immediateIndex, goBackDuration);
    } else {
      this.props.onGestureCanceled && this.props.onGestureCanceled();
      this._reset(immediateIndex, resetDuration);
    }
  }

  _getHeaderMode() {
    if (this.props.headerMode) {
      return this.props.headerMode;
    }
    if (Platform.OS !== 'ios' || this.props.mode === 'modal') {
      return 'screen';
    }
    return 'float';
  }

  _getHeaderBackgroundTransitionPreset() {
    const { headerBackgroundTransitionPreset } = this.props;
    if (headerBackgroundTransitionPreset) {
      if (
        HEADER_BACKGROUND_TRANSITION_PRESET.includes(
          headerBackgroundTransitionPreset
        )
      ) {
        if (headerBackgroundTransitionPreset === 'fade') {
          return HeaderStyleInterpolator.forBackgroundWithFade;
        } else if (headerBackgroundTransitionPreset === 'translate') {
          return HeaderStyleInterpolator.forBackgroundWithTranslation;
        } else if (headerBackgroundTransitionPreset === 'toggle') {
          return HeaderStyleInterpolator.forBackgroundWithInactiveHidden;
        }
      } else if (__DEV__) {
        console.error(
          `Invalid configuration applied for headerBackgroundTransitionPreset - expected one of ${HEADER_BACKGROUND_TRANSITION_PRESET.join(
            ', '
          )} but received ${JSON.stringify(headerBackgroundTransitionPreset)}`
        );
      }
    }

    return null;
  }

  _getHeaderLayoutPreset() {
    const { headerLayoutPreset } = this.props;
    if (headerLayoutPreset) {
      if (__DEV__) {
        if (
          this._getHeaderTransitionPreset() === 'uikit' &&
          headerLayoutPreset === 'left' &&
          Platform.OS === 'ios'
        ) {
          console.warn(
            `headerTransitionPreset with the value 'uikit' is incompatible with headerLayoutPreset 'left'`
          );
        }
      }
      if (HEADER_LAYOUT_PRESET.includes(headerLayoutPreset)) {
        return headerLayoutPreset;
      }

      if (__DEV__) {
        console.error(
          `Invalid configuration applied for headerLayoutPreset - expected one of ${HEADER_LAYOUT_PRESET.join(
            ', '
          )} but received ${JSON.stringify(headerLayoutPreset)}`
        );
      }
    }

    if (Platform.OS !== 'ios') {
      return 'left';
    } else {
      return 'center';
    }
  }

  _getHeaderTransitionPreset() {
    // On Android or with header mode screen, we always just use in-place,
    // we ignore the option entirely (at least until we have other presets)
    if (Platform.OS !== 'ios' || this._getHeaderMode() === 'screen') {
      return 'fade-in-place';
    }

    const { headerTransitionPreset } = this.props;
    if (headerTransitionPreset) {
      if (HEADER_TRANSITION_PRESET.includes(headerTransitionPreset)) {
        return headerTransitionPreset;
      }

      if (__DEV__) {
        console.error(
          `Invalid configuration applied for headerTransitionPreset - expected one of ${HEADER_TRANSITION_PRESET.join(
            ', '
          )} but received ${JSON.stringify(headerTransitionPreset)}`
        );
      }
    }

    return 'fade-in-place';
  }

  _getHeaderBackTitleVisible() {
    const { headerBackTitleVisible } = this.props;
    const layoutPreset = this._getHeaderLayoutPreset();

    // Even when we align to center on Android, people should need to opt-in to
    // showing the back title
    const enabledByDefault = !(
      layoutPreset === 'left' || Platform.OS !== 'ios'
    );

    return typeof headerBackTitleVisible === 'boolean'
      ? headerBackTitleVisible
      : enabledByDefault;
  }

  _renderInnerScene(scene) {
    const { navigation, getComponent } = scene.descriptor;
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

  _prepareTransitionConfig() {
    this._transitionConfig = TransitionConfigs.getTransitionConfig(
      this.props.transitionConfig,
      {
        ...this.props.transitionProps,
        position: this.position,
      },
      this.props.lastTransitionProps,
      this._isModal()
    );
  }

  _preparePosition() {
    if (this.gesturePosition) {
      this.position = Animated.add(
        Animated.multiply(
          this.props.transitionProps.position,
          this.positionSwitch
        ),
        Animated.multiply(this.gesturePosition, this.gestureSwitch)
      );
    } else {
      this.position = this.props.transitionProps.position;
    }
  }

  _renderCard = scene => {
    const {
      transitionProps,
      shadowEnabled,
      cardOverlayEnabled,
      transparentCard,
      cardStyle,
    } = this.props;

    const { screenInterpolator } = this._transitionConfig;
    const style =
      screenInterpolator &&
      screenInterpolator({
        ...transitionProps,
        shadowEnabled,
        cardOverlayEnabled,
        position: this.position,
        scene,
      });

    // When using a floating header, we need to add some top
    // padding on the scene.
    const { options } = scene.descriptor;
    const hasHeader = options.header !== null;
    const headerMode = this._getHeaderMode();
    let paddingTopStyle;
    if (hasHeader && headerMode === 'float' && !options.headerTransparent) {
      paddingTopStyle = { paddingTop: this.state.floatingHeaderHeight };
    }

    return (
      <Card
        {...transitionProps}
        key={`card_${scene.key}`}
        position={this.position}
        realPosition={transitionProps.position}
        animatedStyle={style}
        transparent={transparentCard}
        style={[paddingTopStyle, cardStyle]}
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
    overflow: 'hidden',
  },
  scenes: {
    flex: 1,
  },
  floatingHeader: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
  },
});

export default withOrientation(StackViewLayout);

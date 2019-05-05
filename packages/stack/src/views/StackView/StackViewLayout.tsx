import * as React from 'react';
import {
  Animated,
  StyleSheet,
  Platform,
  View,
  I18nManager,
  Easing,
  Dimensions,
  StyleProp,
  ViewStyle,
  LayoutChangeEvent,
} from 'react-native';
import {
  SceneView,
  StackActions,
  NavigationActions,
  NavigationProvider,
} from '@react-navigation/core';
import { withOrientation } from '@react-navigation/native';
import { ScreenContainer } from 'react-native-screens';
import {
  PanGestureHandler,
  State as GestureState,
  PanGestureHandlerGestureEvent,
  GestureHandlerGestureEventNativeEvent,
  PanGestureHandlerEventExtra,
} from 'react-native-gesture-handler';

import Card from './StackViewCard';
import Header from '../Header/Header';
import TransitionConfigs from './StackViewTransitionConfigs';
import HeaderStyleInterpolator from '../Header/HeaderStyleInterpolator';
import StackGestureContext from '../../utils/StackGestureContext';
import clamp from '../../utils/clamp';
import { supportsImprovedSpringAnimation } from '../../utils/ReactNativeFeatures';
import {
  Scene,
  HeaderMode,
  TransitionProps,
  TransitionConfig,
  HeaderTransitionConfig,
  HeaderProps,
} from '../../types';

type Props = {
  mode: 'modal' | 'card';
  headerMode: 'screen' | 'float';
  headerLayoutPreset: 'left' | 'center';
  headerTransitionPreset: 'fade-in-place' | 'uikit';
  headerBackgroundTransitionPreset: 'fade' | 'translate' | 'toggle';
  headerBackTitleVisible?: boolean;
  isLandscape: boolean;
  shadowEnabled?: boolean;
  cardOverlayEnabled?: boolean;
  transparentCard?: boolean;
  cardStyle?: StyleProp<ViewStyle>;
  transitionProps: TransitionProps;
  lastTransitionProps?: TransitionProps;
  transitionConfig: (
    transitionProps: TransitionProps,
    prevTransitionProps?: TransitionProps,
    isModal?: boolean
  ) => HeaderTransitionConfig;
  onGestureBegin?: () => void;
  onGestureEnd?: () => void;
  onGestureCanceled?: () => void;
  screenProps?: unknown;
};

type State = {
  floatingHeaderHeight: number;
};

const IPHONE_XS_HEIGHT = 812; // iPhone X and XS
const IPHONE_XR_HEIGHT = 896; // iPhone XR and XS Max
const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = Dimensions.get('window');
const IS_IPHONE_X =
  Platform.OS === 'ios' &&
  // @ts-ignore
  !Platform.isPad &&
  // @ts-ignore
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

const getDefaultHeaderHeight = (isLandscape: boolean) => {
  if (Platform.OS === 'ios') {
    // @ts-ignore
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

class StackViewLayout extends React.Component<Props, State> {
  private panGestureRef: React.RefObject<PanGestureHandler>;
  private gestureX: Animated.Value;
  private gestureY: Animated.Value;
  private positionSwitch: Animated.Value;
  private gestureSwitch: Animated.AnimatedInterpolation;
  private gestureEvent: (...args: any[]) => void;
  private gesturePosition: Animated.AnimatedInterpolation | undefined;

  // @ts-ignore
  private position: Animated.Value;

  /**
   * immediateIndex is used to represent the expected index that we will be on after a
   * transition. To achieve a smooth animation when swiping back, the action to go back
   * doesn't actually fire until the transition completes. The immediateIndex is used during
   * the transition so that gestures can be handled correctly. This is a work-around for
   * cases when the user quickly swipes back several times.
   */
  private immediateIndex: number | null = null;
  private transitionConfig:
    | HeaderTransitionConfig & TransitionConfig
    | undefined;
  private prevProps: Props | undefined;

  constructor(props: Props) {
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

  private renderHeader(scene: Scene, headerMode: HeaderMode) {
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
    const renderHeader =
      // @ts-ignore TS warns about missing props, but they are in default props
      header || ((props: HeaderProps) => <Header {...props} />);

    let {
      headerLeftInterpolator,
      headerTitleInterpolator,
      headerRightInterpolator,
      headerBackgroundInterpolator,
    } = this.transitionConfig as HeaderTransitionConfig;

    const backgroundTransitionPresetInterpolator = this.getHeaderBackgroundTransitionPreset();
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
          transitionPreset: this.getHeaderTransitionPreset(),
          layoutPreset: this.getHeaderLayoutPreset(),
          backTitleVisible: this.getHeaderBackTitleVisible(),
          leftInterpolator: headerLeftInterpolator,
          titleInterpolator: headerTitleInterpolator,
          rightInterpolator: headerRightInterpolator,
          backgroundInterpolator: headerBackgroundInterpolator,
        })}
      </NavigationProvider>
    );
  }

  private reset(resetToIndex: number, duration: number) {
    if (Platform.OS === 'ios' && supportsImprovedSpringAnimation()) {
      // @ts-ignore
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
      // @ts-ignore
      Animated.timing(this.props.transitionProps.position, {
        toValue: resetToIndex,
        duration,
        easing: EaseInOut,
        useNativeDriver: USE_NATIVE_DRIVER,
      }).start();
    }
  }

  private goBack(backFromIndex: number, duration: number) {
    const { navigation, position, scenes } = this.props.transitionProps;
    const toValue = Math.max(backFromIndex - 1, 0);

    // set temporary index for gesture handler to respect until the action is
    // dispatched at the end of the transition.
    this.immediateIndex = toValue;

    const onCompleteAnimation = () => {
      this.immediateIndex = null;
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
      // @ts-ignore
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
      // @ts-ignore
      Animated.timing(position, {
        toValue,
        duration,
        easing: EaseInOut,
        useNativeDriver: USE_NATIVE_DRIVER,
      }).start(onCompleteAnimation);
    }
  }

  private handleFloatingHeaderLayout = (e: LayoutChangeEvent) => {
    const { height } = e.nativeEvent.layout;
    if (height !== this.state.floatingHeaderHeight) {
      this.setState({ floatingHeaderHeight: height });
    }
  };

  private prepareAnimated() {
    if (this.props === this.prevProps) {
      return;
    }
    this.prevProps = this.props;

    this.prepareGesture();
    this.preparePosition();
    this.prepareTransitionConfig();
  }

  render() {
    this.prepareAnimated();

    const { transitionProps } = this.props;
    const {
      navigation: {
        state: { index },
      },
      scenes,
    } = transitionProps;

    const headerMode = this.getHeaderMode();
    let floatingHeader = null;
    if (headerMode === 'float') {
      const { scene } = transitionProps;
      floatingHeader = (
        <View
          style={styles.floatingHeader}
          pointerEvents="box-none"
          onLayout={this.handleFloatingHeaderLayout}
        >
          {this.renderHeader(scene, headerMode)}
        </View>
      );
    }

    return (
      <PanGestureHandler
        {...this.gestureActivationCriteria()}
        ref={this.panGestureRef}
        onGestureEvent={this.gestureEvent}
        onHandlerStateChange={this.handlePanGestureStateChange}
        enabled={index > 0 && this.isGestureEnabled()}
      >
        <Animated.View
          style={[styles.container, this.transitionConfig!.containerStyle]}
        >
          <StackGestureContext.Provider value={this.panGestureRef}>
            <ScreenContainer style={styles.scenes}>
              {scenes.map(this.renderCard)}
            </ScreenContainer>
            {floatingHeader}
          </StackGestureContext.Provider>
        </Animated.View>
      </PanGestureHandler>
    );
  }

  componentDidUpdate(prevProps: Props) {
    const { state: prevState } = prevProps.transitionProps.navigation;
    const { state } = this.props.transitionProps.navigation;
    if (prevState.index !== state.index) {
      this.maybeCancelGesture();
    }
  }

  private getGestureResponseDistance() {
    const { scene } = this.props.transitionProps;
    const { options } = scene.descriptor;
    const {
      gestureResponseDistance: userGestureResponseDistance = {} as {
        vertical?: number;
        horizontal?: number;
      },
    } = options;

    // Doesn't make sense for a response distance of 0, so this works fine
    return this.isModal()
      ? userGestureResponseDistance.vertical ||
          GESTURE_RESPONSE_DISTANCE_VERTICAL
      : userGestureResponseDistance.horizontal ||
          GESTURE_RESPONSE_DISTANCE_HORIZONTAL;
  }

  private gestureActivationCriteria() {
    const { layout } = this.props.transitionProps;
    const gestureResponseDistance = this.getGestureResponseDistance();
    const isMotionInverted = this.isMotionInverted();

    if (this.isMotionVertical()) {
      // @ts-ignore
      const height: number = layout.height.__getValue();

      return {
        maxDeltaX: 15,
        minOffsetY: isMotionInverted ? -5 : 5,
        hitSlop: isMotionInverted
          ? { top: -height + gestureResponseDistance }
          : { bottom: -height + gestureResponseDistance },
      };
    } else {
      // @ts-ignore
      const width: number = layout.width.__getValue();
      const hitSlop = -width + gestureResponseDistance;

      return {
        minOffsetX: isMotionInverted ? -5 : 5,
        maxDeltaY: 20,
        hitSlop: isMotionInverted ? { left: hitSlop } : { right: hitSlop },
      };
    }
  }

  private isGestureEnabled() {
    const gesturesEnabled = this.props.transitionProps.scene.descriptor.options
      .gesturesEnabled;
    return typeof gesturesEnabled === 'boolean'
      ? gesturesEnabled
      : Platform.OS === 'ios';
  }

  private isMotionVertical() {
    return this.isModal();
  }

  private isModal() {
    return this.props.mode === 'modal';
  }

  // This only currently applies to the horizontal gesture!
  private isMotionInverted() {
    const {
      transitionProps: { scene },
    } = this.props;
    const { options } = scene.descriptor;
    const { gestureDirection } = options;

    if (this.isModal()) {
      return gestureDirection === 'inverted';
    } else {
      return typeof gestureDirection === 'string'
        ? gestureDirection === 'inverted'
        : I18nManager.isRTL;
    }
  }

  private computeHorizontalGestureValue({
    translationX,
  }: {
    translationX: number;
  }) {
    const {
      transitionProps: { navigation, layout },
    } = this.props;

    const { index } = navigation.state;

    // TODO: remove this __getValue!
    // @ts-ignore
    const distance: number = layout.width.__getValue();

    const x = this.isMotionInverted() ? -1 * translationX : translationX;

    const value = index - x / distance;
    return clamp(index - 1, value, index);
  }

  private computeVerticalGestureValue({
    translationY,
  }: {
    translationY: number;
  }) {
    const {
      transitionProps: { navigation, layout },
    } = this.props;

    const { index } = navigation.state;

    // TODO: remove this __getValue!
    // @ts-ignore
    const distance: number = layout.height.__getValue();

    const y = this.isMotionInverted() ? -1 * translationY : translationY;
    const value = index - y / distance;
    return clamp(index - 1, value, index);
  }

  private handlePanGestureStateChange = ({
    nativeEvent,
  }: PanGestureHandlerGestureEvent) => {
    // @ts-ignore
    if (nativeEvent.oldState === GestureState.ACTIVE) {
      // Gesture was cancelled! For example, some navigation state update
      // arrived while the gesture was active that cancelled it out
      // @ts-ignore
      if (this.positionSwitch.__getValue() === 1) {
        return;
      }

      if (this.isMotionVertical()) {
        this.handleReleaseVertical(nativeEvent);
      } else {
        this.handleReleaseHorizontal(nativeEvent);
      }
    } else if (nativeEvent.state === GestureState.ACTIVE) {
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
  private maybeCancelGesture() {
    this.positionSwitch.setValue(1);
  }

  private prepareGesture() {
    if (!this.isGestureEnabled()) {
      // @ts-ignore
      if (this.positionSwitch.__getValue() !== 1) {
        this.positionSwitch.setValue(1);
      }
      this.gesturePosition = undefined;
      return;
    }

    // We can't run the gesture if width or height layout is unavailable
    if (
      // @ts-ignore
      this.props.transitionProps.layout.width.__getValue() === 0 ||
      // @ts-ignore
      this.props.transitionProps.layout.height.__getValue() === 0
    ) {
      return;
    }

    if (this.isMotionVertical()) {
      this.prepareGestureVertical();
    } else {
      this.prepareGestureHorizontal();
    }
  }

  private prepareGestureHorizontal() {
    const { index } = this.props.transitionProps.navigation.state;

    if (this.isMotionInverted()) {
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

  private prepareGestureVertical() {
    const { index } = this.props.transitionProps.navigation.state;

    if (this.isMotionInverted()) {
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

  private handleReleaseHorizontal(
    nativeEvent: GestureHandlerGestureEventNativeEvent &
      PanGestureHandlerEventExtra
  ) {
    const {
      transitionProps: { navigation, position, layout },
    } = this.props;
    const { index } = navigation.state;
    const immediateIndex =
      this.immediateIndex == null ? index : this.immediateIndex;

    // Calculate animate duration according to gesture speed and moved distance
    // @ts-ignore
    const distance = layout.width.__getValue();
    const movementDirection = this.isMotionInverted() ? -1 : 1;
    const movedDistance = movementDirection * nativeEvent.translationX;
    const gestureVelocity = movementDirection * nativeEvent.velocityX;
    const defaultVelocity = distance / ANIMATION_DURATION;
    const velocity = Math.max(Math.abs(gestureVelocity), defaultVelocity);
    const resetDuration = this.isMotionInverted()
      ? (distance - movedDistance) / velocity
      : movedDistance / velocity;
    const goBackDuration = this.isMotionInverted()
      ? movedDistance / velocity
      : (distance - movedDistance) / velocity;

    // Get the current position value and reset to using the statically driven
    // (rather than gesture driven) position.
    const value = this.computeHorizontalGestureValue(nativeEvent);
    position.setValue(value);
    this.positionSwitch.setValue(1);

    // If the speed of the gesture release is significant, use that as the indication
    // of intent
    if (gestureVelocity < -50) {
      this.props.onGestureCanceled && this.props.onGestureCanceled();
      this.reset(immediateIndex, resetDuration);
      return;
    }
    if (gestureVelocity > 50) {
      this.props.onGestureEnd && this.props.onGestureEnd();
      this.goBack(immediateIndex, goBackDuration);
      return;
    }

    // Then filter based on the distance the screen was moved. Over a third of the way swiped,
    // and the back will happen.
    if (value <= index - POSITION_THRESHOLD) {
      this.props.onGestureEnd && this.props.onGestureEnd();
      this.goBack(immediateIndex, goBackDuration);
    } else {
      this.props.onGestureCanceled && this.props.onGestureCanceled();
      this.reset(immediateIndex, resetDuration);
    }
  }

  private handleReleaseVertical(
    nativeEvent: GestureHandlerGestureEventNativeEvent &
      PanGestureHandlerEventExtra
  ) {
    const {
      transitionProps: { navigation, position, layout },
    } = this.props;
    const { index } = navigation.state;
    const immediateIndex =
      this.immediateIndex == null ? index : this.immediateIndex;

    // Calculate animate duration according to gesture speed and moved distance
    // @ts-ignore
    const distance = layout.height.__getValue();
    const isMotionInverted = this.isMotionInverted();
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

    const value = this.computeVerticalGestureValue(nativeEvent);
    position.setValue(value);
    this.positionSwitch.setValue(1);

    // If the speed of the gesture release is significant, use that as the indication
    // of intent
    if (gestureVelocity < -50) {
      this.props.onGestureCanceled && this.props.onGestureCanceled();
      this.reset(immediateIndex, resetDuration);
      return;
    }
    if (gestureVelocity > 50) {
      this.props.onGestureEnd && this.props.onGestureEnd();
      this.goBack(immediateIndex, goBackDuration);
      return;
    }

    // Then filter based on the distance the screen was moved. Over a third of the way swiped,
    // and the back will happen.
    if (value <= index - POSITION_THRESHOLD) {
      this.props.onGestureEnd && this.props.onGestureEnd();
      this.goBack(immediateIndex, goBackDuration);
    } else {
      this.props.onGestureCanceled && this.props.onGestureCanceled();
      this.reset(immediateIndex, resetDuration);
    }
  }

  private getHeaderMode() {
    if (this.props.headerMode) {
      return this.props.headerMode;
    }
    if (Platform.OS === 'android' || this.props.mode === 'modal') {
      return 'screen';
    }
    // On web, the float header mode will enable body scrolling and stick the header
    // to the top of the URL bar when it shrinks and expands.
    return 'float';
  }

  private getHeaderBackgroundTransitionPreset() {
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

  private getHeaderLayoutPreset() {
    const { headerLayoutPreset } = this.props;
    if (headerLayoutPreset) {
      if (__DEV__) {
        if (
          this.getHeaderTransitionPreset() === 'uikit' &&
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

  private getHeaderTransitionPreset() {
    // On Android or with header mode screen, we always just use in-place,
    // we ignore the option entirely (at least until we have other presets)
    if (Platform.OS !== 'ios' || this.getHeaderMode() === 'screen') {
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

  private getHeaderBackTitleVisible() {
    const { headerBackTitleVisible } = this.props;
    const layoutPreset = this.getHeaderLayoutPreset();

    // Even when we align to center on Android, people should need to opt-in to
    // showing the back title
    const enabledByDefault = !(
      layoutPreset === 'left' || Platform.OS !== 'ios'
    );

    return typeof headerBackTitleVisible === 'boolean'
      ? headerBackTitleVisible
      : enabledByDefault;
  }

  private renderInnerScene(scene: Scene) {
    const { navigation, getComponent } = scene.descriptor;
    const SceneComponent = getComponent();

    const { screenProps } = this.props;
    const headerMode = this.getHeaderMode();
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
          {this.renderHeader(scene, headerMode)}
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

  private prepareTransitionConfig() {
    this.transitionConfig = TransitionConfigs.getTransitionConfig(
      this.props.transitionConfig,
      {
        ...this.props.transitionProps,
        position: this.position,
      },
      this.props.lastTransitionProps,
      this.isModal()
    );
  }

  private preparePosition() {
    if (this.gesturePosition) {
      // FIXME: this doesn't seem right, there is setValue called in some places
      // @ts-ignore
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

  private renderCard = (scene: Scene) => {
    const {
      transitionProps,
      shadowEnabled,
      cardOverlayEnabled,
      transparentCard,
      cardStyle,
    } = this.props;

    const { screenInterpolator } = this.transitionConfig as TransitionConfig;
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
    const headerMode = this.getHeaderMode();

    let floatingContainerStyle: ViewStyle = StyleSheet.absoluteFill as ViewStyle;

    if (hasHeader && headerMode === 'float' && !options.headerTransparent) {
      floatingContainerStyle = {
        ...Platform.select({ web: {}, default: StyleSheet.absoluteFillObject }),
        paddingTop: this.state.floatingHeaderHeight,
      };
    }

    return (
      <Card
        {...transitionProps}
        key={`card_${scene.key}`}
        position={this.position}
        realPosition={transitionProps.position}
        animatedStyle={style}
        transparent={transparentCard}
        style={[floatingContainerStyle, cardStyle]}
        scene={scene}
      >
        {this.renderInnerScene(scene)}
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
    // @ts-ignore
    position: Platform.select({ default: 'absolute', web: 'fixed' }),
    left: 0,
    top: 0,
    right: 0,
  },
});

export default withOrientation(StackViewLayout);

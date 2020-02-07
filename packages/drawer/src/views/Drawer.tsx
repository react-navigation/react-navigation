import * as React from 'react';
import {
  StyleSheet,
  ViewStyle,
  LayoutChangeEvent,
  I18nManager,
  Platform,
  Keyboard,
  StatusBar,
} from 'react-native';
import {
  PanGestureHandler,
  TapGestureHandler,
  State,
} from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import DrawerProgressContext from '../utils/DrawerProgressContext';

const {
  Clock,
  Value,
  onChange,
  clockRunning,
  startClock,
  stopClock,
  interpolate,
  spring,
  abs,
  add,
  and,
  block,
  call,
  cond,
  divide,
  eq,
  event,
  greaterThan,
  lessThan,
  max,
  min,
  multiply,
  neq,
  or,
  set,
  sub,
} = Animated;

const TRUE = 1;
const FALSE = 0;
const NOOP = 0;
const UNSET = -1;

const PROGRESS_EPSILON = 0.05;

const DIRECTION_LEFT = 1;
const DIRECTION_RIGHT = -1;

const SWIPE_DISTANCE_THRESHOLD_DEFAULT = 60;

const SWIPE_DISTANCE_MINIMUM = 5;

const SPRING_CONFIG = {
  stiffness: 1000,
  damping: 500,
  mass: 3,
  overshootClamping: true,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 0.01,
};

type Binary = 0 | 1;

type Renderer = (props: { progress: Animated.Node<number> }) => React.ReactNode;

type Props = {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  onGestureRef?: (ref: PanGestureHandler | null) => void;
  gestureEnabled: boolean;
  drawerPosition: 'left' | 'right';
  drawerType: 'front' | 'back' | 'slide';
  keyboardDismissMode: 'none' | 'on-drag';
  swipeEdgeWidth: number;
  swipeDistanceThreshold?: number;
  swipeVelocityThreshold: number;
  hideStatusBar: boolean;
  statusBarAnimation: 'slide' | 'none' | 'fade';
  overlayStyle?: ViewStyle;
  drawerStyle?: ViewStyle;
  sceneContainerStyle?: ViewStyle;
  renderDrawerContent: Renderer;
  renderSceneContent: Renderer;
  gestureHandlerProps?: React.ComponentProps<typeof PanGestureHandler>;
};

export default class Drawer extends React.PureComponent<Props> {
  static defaultProps = {
    gestureEnabled: true,
    drawerPostion: I18nManager.isRTL ? 'left' : 'right',
    drawerType: 'front',
    swipeEdgeWidth: 32,
    swipeVelocityThreshold: 500,
    keyboardDismissMode: 'on-drag',
    hideStatusBar: false,
    statusBarAnimation: 'slide',
  };

  componentDidUpdate(prevProps: Props) {
    const {
      open,
      drawerPosition,
      drawerType,
      swipeDistanceThreshold,
      swipeVelocityThreshold,
      hideStatusBar,
    } = this.props;

    if (
      // If we're not in the middle of a transition, sync the drawer's open state
      typeof this.pendingOpenValue !== 'boolean' ||
      open !== this.pendingOpenValue
    ) {
      this.toggleDrawer(open);
    }

    this.pendingOpenValue = undefined;

    if (open !== prevProps.open && hideStatusBar) {
      this.toggleStatusBar(open);
    }

    if (prevProps.drawerPosition !== drawerPosition) {
      this.drawerPosition.setValue(
        drawerPosition === 'right' ? DIRECTION_RIGHT : DIRECTION_LEFT
      );
    }

    if (prevProps.drawerType !== drawerType) {
      this.isDrawerTypeFront.setValue(drawerType === 'front' ? TRUE : FALSE);
    }

    if (prevProps.swipeDistanceThreshold !== swipeDistanceThreshold) {
      this.swipeDistanceThreshold.setValue(
        swipeDistanceThreshold !== undefined
          ? swipeDistanceThreshold
          : SWIPE_DISTANCE_THRESHOLD_DEFAULT
      );
    }

    if (prevProps.swipeVelocityThreshold !== swipeVelocityThreshold) {
      this.swipeVelocityThreshold.setValue(swipeVelocityThreshold);
    }
  }

  componentWillUnmount() {
    this.toggleStatusBar(false);
  }

  private clock = new Clock();

  private isDrawerTypeFront = new Value<Binary>(
    this.props.drawerType === 'front' ? TRUE : FALSE
  );

  private isOpen = new Value<Binary>(this.props.open ? TRUE : FALSE);
  private nextIsOpen = new Value<Binary | -1>(UNSET);
  private isSwiping = new Value<Binary>(FALSE);

  private gestureState = new Value<number>(State.UNDETERMINED);
  private touchX = new Value<number>(0);
  private velocityX = new Value<number>(0);
  private gestureX = new Value<number>(0);
  private offsetX = new Value<number>(0);
  private position = new Value<number>(0);

  private containerWidth = new Value<number>(0);
  private drawerWidth = new Value<number>(0);
  private drawerOpacity = new Value<number>(0);
  private drawerPosition = new Value<number>(
    this.props.drawerPosition === 'right' ? DIRECTION_RIGHT : DIRECTION_LEFT
  );

  // Comment stolen from react-native-gesture-handler/DrawerLayout
  //
  // While closing the drawer when user starts gesture outside of its area (in greyed
  // out part of the window), we want the drawer to follow only once finger reaches the
  // edge of the drawer.
  // E.g. on the diagram below drawer is illustrate by X signs and the greyed out area by
  // dots. The touch gesture starts at '*' and moves left, touch path is indicated by
  // an arrow pointing left
  // 1) +---------------+ 2) +---------------+ 3) +---------------+ 4) +---------------+
  //    |XXXXXXXX|......|    |XXXXXXXX|......|    |XXXXXXXX|......|    |XXXXX|.........|
  //    |XXXXXXXX|......|    |XXXXXXXX|......|    |XXXXXXXX|......|    |XXXXX|.........|
  //    |XXXXXXXX|......|    |XXXXXXXX|......|    |XXXXXXXX|......|    |XXXXX|.........|
  //    |XXXXXXXX|......|    |XXXXXXXX|.<-*..|    |XXXXXXXX|<--*..|    |XXXXX|<-----*..|
  //    |XXXXXXXX|......|    |XXXXXXXX|......|    |XXXXXXXX|......|    |XXXXX|.........|
  //    |XXXXXXXX|......|    |XXXXXXXX|......|    |XXXXXXXX|......|    |XXXXX|.........|
  //    |XXXXXXXX|......|    |XXXXXXXX|......|    |XXXXXXXX|......|    |XXXXX|.........|
  //    +---------------+    +---------------+    +---------------+    +---------------+
  //
  // For the above to work properly we define animated value that will keep start position
  // of the gesture. Then we use that value to calculate how much we need to subtract from
  // the dragX. If the gesture started on the greyed out area we take the distance from the
  // edge of the drawer to the start position. Otherwise we don't subtract at all and the
  // drawer be pulled back as soon as you start the pan.
  //
  // This is used only when drawerType is "front"
  private touchDistanceFromDrawer = cond(
    this.isDrawerTypeFront,
    cond(
      eq(this.drawerPosition, DIRECTION_LEFT),
      max(
        // Distance of touch start from left screen edge - Drawer width
        sub(sub(this.touchX, this.gestureX), this.drawerWidth),
        0
      ),
      min(
        multiply(
          // Distance of drawer from left screen edge - Touch start point
          sub(
            sub(this.containerWidth, this.drawerWidth),
            sub(this.touchX, this.gestureX)
          ),
          DIRECTION_RIGHT
        ),
        0
      )
    ),
    0
  );

  private swipeDistanceThreshold = new Value<number>(
    this.props.swipeDistanceThreshold !== undefined
      ? this.props.swipeDistanceThreshold
      : SWIPE_DISTANCE_THRESHOLD_DEFAULT
  );
  private swipeVelocityThreshold = new Value<number>(
    this.props.swipeVelocityThreshold
  );

  private currentOpenValue: boolean = this.props.open;
  private pendingOpenValue: boolean | undefined;

  private isStatusBarHidden: boolean = false;

  private manuallyTriggerSpring = new Value<Binary>(FALSE);

  private transitionTo = (isOpen: number | Animated.Node<number>) => {
    const toValue = new Value(0);
    const frameTime = new Value(0);

    const state = {
      position: this.position,
      time: new Value(0),
      finished: new Value(FALSE),
      velocity: new Value(0),
    };

    return block([
      cond(clockRunning(this.clock), NOOP, [
        // Animation wasn't running before
        // Set the initial values and start the clock
        set(toValue, multiply(isOpen, this.drawerWidth, this.drawerPosition)),
        set(frameTime, 0),
        set(state.time, 0),
        set(state.finished, FALSE),
        set(state.velocity, this.velocityX),
        set(this.isOpen, isOpen),
        startClock(this.clock),
        set(this.manuallyTriggerSpring, FALSE),
      ]),
      spring(this.clock, state, { ...SPRING_CONFIG, toValue }),
      cond(state.finished, [
        // Reset gesture and velocity from previous gesture
        set(this.touchX, 0),
        set(this.gestureX, 0),
        set(this.velocityX, 0),
        set(this.offsetX, 0),
        // When the animation finishes, stop the clock
        stopClock(this.clock),
        call([this.isOpen], ([value]: readonly Binary[]) => {
          const open = Boolean(value);

          if (open !== this.props.open) {
            // Sync drawer's state after animation finished
            // This shouldn't be necessary, but there seems to be an issue on iOS
            this.toggleDrawer(this.props.open);
          }
        }),
      ]),
    ]);
  };

  private dragX = block([
    onChange(
      this.isOpen,
      call([this.isOpen], ([value]: readonly Binary[]) => {
        const open = Boolean(value);

        this.currentOpenValue = open;

        // Without this check, the drawer can go to an infinite update <-> animate loop for sync updates
        if (open !== this.props.open) {
          // If the mode changed, update state
          if (open) {
            this.props.onOpen();
          } else {
            this.props.onClose();
          }

          this.pendingOpenValue = open;

          // Force componentDidUpdate to fire, whether user does a setState or not
          // This allows us to detect when the user drops the update and revert back
          // It's necessary to make sure that the state stays in sync
          this.forceUpdate();
        }
      })
    ),
    onChange(
      this.nextIsOpen,
      cond(neq(this.nextIsOpen, UNSET), [
        // Stop any running animations
        cond(clockRunning(this.clock), stopClock(this.clock)),
        // Update the open value to trigger the transition
        set(this.isOpen, this.nextIsOpen),
        set(this.gestureX, 0),
        set(this.nextIsOpen, UNSET),
      ])
    ),
    // This block must be after the this.isOpen listener since we check for current value
    onChange(
      this.isSwiping,
      // Listen to updates for this value only when it changes
      // Without `onChange`, this will fire even if the value didn't change
      // We don't want to call the listeners if the value didn't change
      call([this.isSwiping], ([value]: readonly Binary[]) => {
        const { keyboardDismissMode } = this.props;

        if (value === TRUE) {
          if (keyboardDismissMode === 'on-drag') {
            Keyboard.dismiss();
          }

          this.toggleStatusBar(true);
        } else {
          this.toggleStatusBar(this.currentOpenValue);
        }
      })
    ),
    cond(
      eq(this.gestureState, State.ACTIVE),
      [
        cond(this.isSwiping, NOOP, [
          // We weren't dragging before, set it to true
          set(this.isSwiping, TRUE),
          // Also update the drag offset to the last position
          set(this.offsetX, this.position),
        ]),
        // Update position with previous offset + gesture distance
        set(
          this.position,
          add(this.offsetX, this.gestureX, this.touchDistanceFromDrawer)
        ),
        // Stop animations while we're dragging
        stopClock(this.clock),
      ],
      [
        set(this.isSwiping, FALSE),
        set(this.touchX, 0),
        this.transitionTo(
          cond(
            this.manuallyTriggerSpring,
            this.isOpen,
            cond(
              or(
                and(
                  greaterThan(abs(this.gestureX), SWIPE_DISTANCE_MINIMUM),
                  greaterThan(abs(this.velocityX), this.swipeVelocityThreshold)
                ),
                greaterThan(abs(this.gestureX), this.swipeDistanceThreshold)
              ),
              cond(
                eq(this.drawerPosition, DIRECTION_LEFT),
                // If swiped to right, open the drawer, otherwise close it
                greaterThan(
                  cond(eq(this.velocityX, 0), this.gestureX, this.velocityX),
                  0
                ),
                // If swiped to left, open the drawer, otherwise close it
                lessThan(
                  cond(eq(this.velocityX, 0), this.gestureX, this.velocityX),
                  0
                )
              ),
              this.isOpen
            )
          )
        ),
      ]
    ),
    this.position,
  ]);

  private translateX = cond(
    eq(this.drawerPosition, DIRECTION_RIGHT),
    min(max(multiply(this.drawerWidth, -1), this.dragX), 0),
    max(min(this.drawerWidth, this.dragX), 0)
  );

  private progress = cond(
    // Check if the drawer width is available to avoid division by zero
    eq(this.drawerWidth, 0),
    0,
    abs(divide(this.translateX, this.drawerWidth))
  );

  private handleGestureEvent = event([
    {
      nativeEvent: {
        x: this.touchX,
        translationX: this.gestureX,
        velocityX: this.velocityX,
      },
    },
  ]);

  private handleGestureStateChange = event([
    {
      nativeEvent: {
        state: (s: Animated.Value<number>) => set(this.gestureState, s),
      },
    },
  ]);

  private handleTapStateChange = event([
    {
      nativeEvent: {
        oldState: (s: Animated.Value<number>) =>
          cond(eq(s, State.ACTIVE), set(this.manuallyTriggerSpring, TRUE)),
      },
    },
  ]);

  private handleContainerLayout = (e: LayoutChangeEvent) =>
    this.containerWidth.setValue(e.nativeEvent.layout.width);

  private handleDrawerLayout = (e: LayoutChangeEvent) => {
    this.drawerWidth.setValue(e.nativeEvent.layout.width);
    this.toggleDrawer(this.props.open);

    // Until layout is available, drawer is hidden with opacity: 0 by default
    // Show it in the next frame when layout is available
    // If we don't delay it until the next frame, there's a visible flicker
    requestAnimationFrame(() =>
      requestAnimationFrame(() => this.drawerOpacity.setValue(1))
    );
  };

  private toggleDrawer = (open: boolean) => {
    if (this.currentOpenValue !== open) {
      this.nextIsOpen.setValue(open ? TRUE : FALSE);

      // This value will also be set shortly after as changing this.nextIsOpen changes this.isOpen
      // However, there's a race condition on Android, so we need to set a bit earlier
      this.currentOpenValue = open;
    }
  };

  private toggleStatusBar = (hidden: boolean) => {
    const { hideStatusBar, statusBarAnimation } = this.props;

    if (hideStatusBar && this.isStatusBarHidden !== hidden) {
      this.isStatusBarHidden = hidden;
      StatusBar.setHidden(hidden, statusBarAnimation);
    }
  };

  render() {
    const {
      open,
      gestureEnabled,
      drawerPosition,
      drawerType,
      swipeEdgeWidth,
      sceneContainerStyle,
      drawerStyle,
      overlayStyle,
      onGestureRef,
      renderDrawerContent,
      renderSceneContent,
      gestureHandlerProps,
    } = this.props;

    const right = drawerPosition === 'right';

    const contentTranslateX = drawerType === 'front' ? 0 : this.translateX;
    const drawerTranslateX =
      drawerType === 'back'
        ? I18nManager.isRTL
          ? multiply(this.drawerWidth, DIRECTION_RIGHT)
          : this.drawerWidth
        : this.translateX;

    const offset = I18nManager.isRTL ? '100%' : multiply(this.drawerWidth, -1);

    // FIXME: Currently hitSlop is broken when on Android when drawer is on right
    // https://github.com/kmagiera/react-native-gesture-handler/issues/569
    const hitSlop = right
      ? // Extend hitSlop to the side of the screen when drawer is closed
        // This lets the user drag the drawer from the side of the screen
        { right: 0, width: open ? undefined : swipeEdgeWidth }
      : { left: 0, width: open ? undefined : swipeEdgeWidth };

    return (
      <DrawerProgressContext.Provider value={this.progress}>
        <PanGestureHandler
          ref={onGestureRef}
          activeOffsetX={[-SWIPE_DISTANCE_MINIMUM, SWIPE_DISTANCE_MINIMUM]}
          failOffsetY={[-SWIPE_DISTANCE_MINIMUM, SWIPE_DISTANCE_MINIMUM]}
          onGestureEvent={this.handleGestureEvent}
          onHandlerStateChange={this.handleGestureStateChange}
          hitSlop={hitSlop}
          enabled={gestureEnabled}
          {...gestureHandlerProps}
        >
          <Animated.View
            onLayout={this.handleContainerLayout}
            style={styles.main}
          >
            <Animated.View
              style={[
                styles.content,
                {
                  transform: [{ translateX: contentTranslateX }],
                },
                sceneContainerStyle as any,
              ]}
              importantForAccessibility={open ? 'no-hide-descendants' : 'yes'}
            >
              {renderSceneContent({ progress: this.progress })}
              <TapGestureHandler
                enabled={gestureEnabled}
                onHandlerStateChange={this.handleTapStateChange}
              >
                <Animated.View
                  style={[
                    styles.overlay,
                    {
                      opacity: interpolate(this.progress, {
                        inputRange: [PROGRESS_EPSILON, 1],
                        outputRange: [0, 1],
                      }),
                      // We don't want the user to be able to press through the overlay when drawer is open
                      // One approach is to adjust the pointerEvents based on the progress
                      // But we can also send the overlay behind the screen, which works, and is much less code
                      zIndex: cond(
                        greaterThan(this.progress, PROGRESS_EPSILON),
                        0,
                        -1
                      ),
                    },
                    overlayStyle,
                  ]}
                />
              </TapGestureHandler>
            </Animated.View>
            <Animated.Code
              exec={block([
                onChange(this.manuallyTriggerSpring, [
                  cond(eq(this.manuallyTriggerSpring, TRUE), [
                    set(this.nextIsOpen, FALSE),
                    call([], () => (this.currentOpenValue = false)),
                  ]),
                ]),
              ])}
            />
            <Animated.View
              accessibilityViewIsModal={open}
              removeClippedSubviews={Platform.OS !== 'ios'}
              onLayout={this.handleDrawerLayout}
              style={[
                styles.container,
                right ? { right: offset } : { left: offset },
                {
                  transform: [{ translateX: drawerTranslateX }],
                  opacity: this.drawerOpacity,
                  zIndex: drawerType === 'back' ? -1 : 0,
                },
                drawerStyle as any,
              ]}
            >
              {renderDrawerContent({ progress: this.progress })}
            </Animated.View>
          </Animated.View>
        </PanGestureHandler>
      </DrawerProgressContext.Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '80%',
    maxWidth: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  content: {
    flex: 1,
  },
  main: {
    flex: 1,
    overflow: 'hidden',
  },
});

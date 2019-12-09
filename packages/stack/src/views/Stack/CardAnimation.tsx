import Animated from 'react-native-reanimated';
import { State as GestureState } from 'react-native-gesture-handler';

export type Binary = 0 | 1;

const TRUE_NODE = new Animated.Value(1);
const FALSE_NODE = new Animated.Value(0);
const UNSET_NODE = new Animated.Value(-1);

const NOOP_NODE = FALSE_NODE;

const {
  abs,
  add,
  and,
  block,
  cond,
  divide,
  eq,
  greaterThan,
  lessThan,
  max,
  min,
  multiply,
  neq,
  onChange,
  set,
  sub,
  proc,
} = Animated;

const proc2 = proc(
  (
    clockIsRunning: Animated.Node<number>,
    clockStart: Animated.Node<number>,
    clockStop: Animated.Node<number>,
    distance: Animated.Node<number>,
    gesture: Animated.Value<number>,
    gestureState: Animated.Node<number>,
    gestureVelocityImpact: Animated.Node<number>,
    isGestureEnabled: Animated.Node<number>,
    isSwipeCancelled: Animated.Value<number>,
    isSwipeGesture: Animated.Value<number>,
    isSwiping: Animated.Value<number>,
    isVisible: Animated.Value<number>,
    listenerOnCancel: Animated.Node<number>,
    listenerOnEnd: Animated.Node<number>,
    listenerOnStart: Animated.Node<number>,
    listenerOnSwipe: Animated.Node<number>,
    offset: Animated.Value<number>,
    position: Animated.Value<number>,
    runAnimation: Animated.Node<number>,
    transitionFinished: Animated.Value<number>,
    transitionFrameTime: Animated.Value<number>,
    transitionTime: Animated.Value<number>,
    transitionVelocity: Animated.Value<number>,
    velocity: Animated.Value<number>
  ) => {
    const runTransition = (transitionTo: Binary | Animated.Node<number>) => {
      return cond(eq(position, transitionTo), NOOP_NODE, [
        cond(clockIsRunning, NOOP_NODE, [
          // The velocity value is ideal for translating the whole screen
          // But since we have 0-1 scale, we need to adjust the velocity
          set(
            transitionVelocity,
            multiply(cond(distance, divide(velocity, distance), 0), -1)
          ),
          // Animation wasn't running before
          // Set the initial values and start the clock
          set(transitionFrameTime, 0),
          set(transitionTime, 0),
          set(transitionFinished, FALSE_NODE),
          set(isVisible, transitionTo),
          clockStart,
          listenerOnStart,
        ]),
        runAnimation,
        cond(transitionFinished, [
          // Reset values
          set(isSwipeGesture, FALSE_NODE),
          set(gesture, FALSE_NODE),
          set(velocity, FALSE_NODE),
          // When the animation finishes, stop the clock
          clockStop,
          listenerOnEnd,
        ]),
      ]);
    };
    return block([
      cond(
        isGestureEnabled,
        [
          onChange(isSwiping, listenerOnSwipe),
          cond(
            eq(gestureState, GestureState.ACTIVE),
            [
              cond(isSwiping, NOOP_NODE, [
                // We weren't dragging before, set it to true
                set(isSwipeCancelled, FALSE_NODE),
                set(isSwiping, TRUE_NODE),
                set(isSwipeGesture, TRUE_NODE),
                // Also update the drag offset to the last position
                set(offset, position),
              ]),
              // Update position with next offset + gesture distance
              set(
                position,
                min(
                  max(
                    sub(
                      offset,
                      cond(distance, divide(gesture, distance), TRUE_NODE)
                    ),
                    FALSE_NODE
                  ),
                  TRUE_NODE
                )
              ),
              // Stop animations while we're dragging
              cond(clockIsRunning, listenerOnCancel),
              clockStop,
            ],
            [
              set(isSwipeCancelled, eq(gestureState, GestureState.CANCELLED)),
              set(isSwiping, FALSE_NODE),
              runTransition(
                cond(
                  greaterThan(
                    abs(
                      add(gesture, multiply(velocity, gestureVelocityImpact))
                    ),
                    divide(distance, 2)
                  ),
                  cond(
                    lessThan(cond(eq(velocity, 0), gesture, velocity), 0),
                    TRUE_NODE,
                    FALSE_NODE
                  ),
                  isVisible
                )
              ),
            ]
          ),
        ],
        runTransition(isVisible)
      ),
    ]);
  }
);

const proc1 = proc(
  (
    nextIsVisible: Animated.Value<number>,
    isVisible: Animated.Value<number>,
    clockIsRunning: Animated.Node<number>,
    listenerOnTransitionEnd: Animated.Node<number>,
    clockStop: Animated.Node<number>,
    gesture: Animated.Value<number>
  ) => {
    return cond(
      and(neq(nextIsVisible, UNSET_NODE), neq(nextIsVisible, isVisible)),
      [
        // Stop any running animations
        cond(clockIsRunning, [listenerOnTransitionEnd, clockStop]),
        set(gesture, FALSE_NODE),
        // Update the index to trigger the transition
        set(isVisible, nextIsVisible),
        set(nextIsVisible, UNSET_NODE),
      ]
    );
  }
);

// For a reason which I'm currently not understanding
// Animated nodes behave incorrectly in procs in some cases, so
// by bisecting I figured out that some lines need to be outside procs.
// I split the rest of lines into 3 procs in order to make it work correctly.
// Probably it's an error in native reanimated code,
// but I have no proof for that.

export default (
  clockIsRunning: Animated.Node<number>,
  clockStart: Animated.Node<number>,
  clockStop: Animated.Node<number>,
  distance: Animated.Node<number>,
  gesture: Animated.Value<number>,
  gestureState: Animated.Node<number>,
  gestureVelocityImpact: Animated.Node<number>,
  isClosing: Animated.Node<number>,
  isGestureEnabled: Animated.Node<number>,
  isSwipeCancelled: Animated.Value<number>,
  isSwipeGesture: Animated.Value<number>,
  isSwiping: Animated.Value<number>,
  isVisible: Animated.Value<number>,
  listenerOnCancel: Animated.Node<number>,
  listenerOnEnd: Animated.Node<number>,
  listenerOnStart: Animated.Node<number>,
  listenerOnSwipe: Animated.Node<number>,
  listenerOnTransitionEnd: Animated.Node<number>,
  nextIsVisible: Animated.Value<number>,
  offset: Animated.Value<number>,
  position: Animated.Value<number>,
  runAnimation: Animated.Node<number>,
  transitionFinished: Animated.Value<number>,
  transitionFrameTime: Animated.Value<number>,
  transitionTime: Animated.Value<number>,
  transitionVelocity: Animated.Value<number>,
  velocity: Animated.Value<number>
) => {
  return block([
    onChange(isClosing, cond(isClosing, set(nextIsVisible, FALSE_NODE))),
    onChange(
      nextIsVisible,
      proc1(
        nextIsVisible,
        isVisible,
        clockIsRunning,
        listenerOnTransitionEnd,
        clockStop,
        gesture
      )
    ),
    proc2(
      clockIsRunning,
      clockStart,
      clockStop,
      distance,
      gesture,
      gestureState,
      gestureVelocityImpact,
      isGestureEnabled,
      isSwipeCancelled,
      isSwipeGesture,
      isSwiping,
      isVisible,
      listenerOnCancel,
      listenerOnEnd,
      listenerOnStart,
      listenerOnSwipe,
      offset,
      position,
      runAnimation,
      transitionFinished,
      transitionFrameTime,
      transitionTime,
      transitionVelocity,
      velocity
    ),
  ]);
};

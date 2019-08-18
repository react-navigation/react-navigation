import * as React from 'react';
import { ViewProps } from 'react-native';
import Animated from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';
import StackGestureContext from '../../utils/StackGestureContext';
import { Layout } from '../../types';

type Props = ViewProps & {
  gesture: Animated.Value<number>;
  velocity: Animated.Value<number>;
  gestureState: Animated.Value<number>;
  layout: Layout;
  direction: 'horizontal' | 'vertical';
  gesturesEnabled: boolean;
  gestureResponseDistance?: {
    vertical?: number;
    horizontal?: number;
  };
  children: React.ReactNode;
};

/**
 * The distance of touch start from the edge of the screen where the gesture will be recognized
 */
const GESTURE_RESPONSE_DISTANCE_HORIZONTAL = 50;
const GESTURE_RESPONSE_DISTANCE_VERTICAL = 135;

export default class Swipeable extends React.Component<Props> {
  private handleGestureEventHorizontal = Animated.event([
    {
      nativeEvent: {
        translationX: this.props.gesture,
        velocityX: this.props.velocity,
        state: this.props.gestureState,
      },
    },
  ]);

  private handleGestureEventVertical = Animated.event([
    {
      nativeEvent: {
        translationY: this.props.gesture,
        velocityY: this.props.velocity,
        state: this.props.gestureState,
      },
    },
  ]);

  private gestureActivationCriteria() {
    const { layout, direction, gestureResponseDistance } = this.props;

    // Doesn't make sense for a response distance of 0, so this works fine
    const distance =
      direction === 'vertical'
        ? (gestureResponseDistance && gestureResponseDistance.vertical) ||
          GESTURE_RESPONSE_DISTANCE_VERTICAL
        : (gestureResponseDistance && gestureResponseDistance.horizontal) ||
          GESTURE_RESPONSE_DISTANCE_HORIZONTAL;

    if (direction === 'vertical') {
      return {
        maxDeltaX: 15,
        minOffsetY: 5,
        hitSlop: { bottom: -layout.height + distance },
      };
    } else {
      return {
        minOffsetX: 5,
        maxDeltaY: 20,
        hitSlop: { right: -layout.width + distance },
      };
    }
  }

  private gestureRef: React.Ref<PanGestureHandler> = React.createRef();

  render() {
    const {
      layout,
      direction,
      gesturesEnabled,
      children,
      ...rest
    } = this.props;

    const handleGestureEvent =
      direction === 'vertical'
        ? this.handleGestureEventVertical
        : this.handleGestureEventHorizontal;

    return (
      <StackGestureContext.Provider value={this.gestureRef}>
        <PanGestureHandler
          ref={this.gestureRef}
          enabled={layout.width !== 0 && gesturesEnabled}
          onGestureEvent={handleGestureEvent}
          onHandlerStateChange={handleGestureEvent}
          {...this.gestureActivationCriteria()}
        >
          <Animated.View {...rest}>{children}</Animated.View>
        </PanGestureHandler>
      </StackGestureContext.Provider>
    );
  }
}

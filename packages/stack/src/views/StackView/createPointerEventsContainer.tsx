import * as React from 'react';
import { Animated, View } from 'react-native';
import { NavigationProp, Scene } from '../../types';

const MIN_POSITION_OFFSET = 0.01;

export type PointerEvents = 'box-only' | 'none' | 'auto';

export type InputProps = {
  scene: Scene;
  navigation: NavigationProp;
  realPosition: Animated.Value;
};

export type InjectedProps = {
  pointerEvents: PointerEvents;
  onComponentRef: (ref: View | null) => void;
};

/**
 * Create a higher-order component that automatically computes the
 * `pointerEvents` property for a component whenever navigation position
 * changes.
 */
export default function createPointerEventsContainer<
  Props extends InjectedProps & InputProps
>(
  Component: React.ComponentType<Props>
): React.ComponentType<Pick<Props, Exclude<keyof Props, keyof InjectedProps>>> {
  class Container extends React.Component<Props> {
    private pointerEvents = this.computePointerEvents();
    private component: View | null = null;
    private positionListener: AnimatedValueSubscription | undefined;

    componentWillUnmount() {
      this.positionListener && this.positionListener.remove();
    }

    private handleComponentRef = (component: View | null) => {
      this.component = component;

      if (component && typeof component.setNativeProps !== 'function') {
        throw new Error('Component must implement method `setNativeProps`');
      }
    };

    private bindPosition() {
      this.positionListener && this.positionListener.remove();
      this.positionListener = new AnimatedValueSubscription(
        this.props.realPosition,
        this.handlePositionChange
      );
    }

    private handlePositionChange = (/* { value } */) => {
      // This should log each frame when releasing the gesture or when pressing
      // the back button! If not, something has gone wrong with the animated
      // value subscription
      // console.log(value);

      if (this.component) {
        const pointerEvents = this.computePointerEvents();
        if (this.pointerEvents !== pointerEvents) {
          this.pointerEvents = pointerEvents;
          this.component.setNativeProps({ pointerEvents });
        }
      }
    };

    private computePointerEvents() {
      const { navigation, realPosition, scene } = this.props;

      if (scene.isStale || navigation.state.index !== scene.index) {
        // The scene isn't focused.
        return scene.index > navigation.state.index ? 'box-only' : 'none';
      }

      // @ts-ignore
      const offset = realPosition.__getAnimatedValue() - navigation.state.index;
      if (Math.abs(offset) > MIN_POSITION_OFFSET) {
        // The positon is still away from scene's index.
        // Scene's children should not receive touches until the position
        // is close enough to scene's index.
        return 'box-only';
      }

      return 'auto';
    }

    render() {
      this.bindPosition();
      this.pointerEvents = this.computePointerEvents();

      return (
        <Component
          {...this.props}
          pointerEvents={this.pointerEvents}
          onComponentRef={this.handleComponentRef}
        />
      );
    }
  }

  return Container as any;
}

class AnimatedValueSubscription {
  private value: Animated.Value;
  private token: string;

  constructor(value: Animated.Value, callback: Animated.ValueListenerCallback) {
    this.value = value;
    this.token = value.addListener(callback);
  }

  remove() {
    this.value.removeListener(this.token);
  }
}

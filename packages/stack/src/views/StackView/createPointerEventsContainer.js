import React from 'react';
import invariant from '../../utils/invariant';

const MIN_POSITION_OFFSET = 0.01;

/**
 * Create a higher-order component that automatically computes the
 * `pointerEvents` property for a component whenever navigation position
 * changes.
 */
export default function createPointerEventsContainer(Component) {
  class Container extends React.Component {
    constructor(props, context) {
      super(props, context);
      this._pointerEvents = this._computePointerEvents();
    }

    componentWillUnmount() {
      this._positionListener && this._positionListener.remove();
    }

    render() {
      this._bindPosition();
      this._pointerEvents = this._computePointerEvents();

      return (
        <Component
          {...this.props}
          pointerEvents={this._pointerEvents}
          onComponentRef={this._onComponentRef}
        />
      );
    }

    _onComponentRef = component => {
      this._component = component;
      if (component) {
        invariant(
          typeof component.setNativeProps === 'function',
          'component must implement method `setNativeProps`'
        );
      }
    };

    _bindPosition() {
      this._positionListener && this._positionListener.remove();
      this._positionListener = new AnimatedValueSubscription(
        this.props.realPosition,
        this._onPositionChange
      );
    }

    _onPositionChange = (/* { value } */) => {
      // This should log each frame when releasing the gesture or when pressing
      // the back button! If not, something has gone wrong with the animated
      // value subscription
      // console.log(value);

      if (this._component) {
        const pointerEvents = this._computePointerEvents();
        if (this._pointerEvents !== pointerEvents) {
          this._pointerEvents = pointerEvents;
          this._component.setNativeProps({ pointerEvents });
        }
      }
    };

    _computePointerEvents() {
      const { navigation, realPosition, scene } = this.props;

      if (scene.isStale || navigation.state.index !== scene.index) {
        // The scene isn't focused.
        return scene.index > navigation.state.index ? 'box-only' : 'none';
      }

      const offset = realPosition.__getAnimatedValue() - navigation.state.index;
      if (Math.abs(offset) > MIN_POSITION_OFFSET) {
        // The positon is still away from scene's index.
        // Scene's children should not receive touches until the position
        // is close enough to scene's index.
        return 'box-only';
      }

      return 'auto';
    }
  }
  return Container;
}

class AnimatedValueSubscription {
  constructor(value, callback) {
    this._value = value;
    this._token = value.addListener(callback);
  }

  remove() {
    this._value.removeListener(this._token);
  }
}

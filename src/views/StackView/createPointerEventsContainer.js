import React from 'react';
import invariant from '../../utils/invariant';
import AnimatedValueSubscription from '../AnimatedValueSubscription';

const MIN_POSITION_OFFSET = 0.01;

/**
 * Create a higher-order component that automatically computes the
 * `pointerEvents` property for a component whenever navigation position
 * changes.
 */
export default function createPointerEventsContainer(Component) {
  class Container extends React.Component {
    render() {
      return (
        <Component {...this.props} pointerEvents={this._getPointerEvents()} />
      );
    }

    _getPointerEvents() {
      const { navigation, descriptor, transition } = this.props;
      const { state } = navigation;
      const descriptorIndex = navigation.state.routes.findIndex(
        r => r.key === descriptor.key
      );
      if (descriptorIndex !== state.index) {
        // The scene isn't focused.
        return descriptorIndex > state.index ? 'box-only' : 'none';
      }

      if (transition) {
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

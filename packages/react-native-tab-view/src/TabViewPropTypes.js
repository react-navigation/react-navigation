/* @flow */

import PropTypes from 'prop-types';
import { Animated } from 'react-native';

export const NavigationRoutePropType = PropTypes.shape({
  title: PropTypes.string,
  key: PropTypes.string.isRequired,
});

export const NavigationStatePropType = PropTypes.shape({
  routes: PropTypes.arrayOf(NavigationRoutePropType).isRequired,
  index: PropTypes.number.isRequired,
});

export const SceneRendererPropType = {
  panX: PropTypes.object.isRequired,
  offsetX: PropTypes.object.isRequired,
  layout: PropTypes.shape({
    measured: PropTypes.bool.isRequired,
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
  }).isRequired,
  navigationState: NavigationStatePropType.isRequired,
  position: PropTypes.object.isRequired,
  jumpTo: PropTypes.func.isRequired,
  jumpToIndex: PropTypes.func.isRequired, // Deprecated, use `jumpTo` instead
  useNativeDriver: PropTypes.bool,
};

export const PagerRendererPropType = {
  layout: PropTypes.shape({
    measured: PropTypes.bool.isRequired,
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
  }).isRequired,
  navigationState: NavigationStatePropType.isRequired,
  panX: PropTypes.instanceOf(Animated.Value).isRequired,
  offsetX: PropTypes.instanceOf(Animated.Value).isRequired,
  canJumpToTab: PropTypes.func.isRequired,
  jumpTo: PropTypes.func.isRequired,
  animationEnabled: PropTypes.bool,
  swipeEnabled: PropTypes.bool,
  useNativeDriver: PropTypes.bool,
  onSwipeStart: PropTypes.func,
  onSwipeEnd: PropTypes.func,
  onAnimationEnd: PropTypes.func,
  children: PropTypes.node.isRequired,
};

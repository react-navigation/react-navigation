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
  layout: PropTypes.shape({
    measured: PropTypes.bool.isRequired,
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
  }).isRequired,
  navigationState: NavigationStatePropType.isRequired,
  position: PropTypes.object.isRequired,
  jumpToIndex: PropTypes.func.isRequired,
  getLastPosition: PropTypes.func.isRequired,
  subscribe: PropTypes.func.isRequired,
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
  jumpToIndex: PropTypes.func.isRequired,
  getLastPosition: PropTypes.func.isRequired,
  subscribe: PropTypes.func.isRequired,
  animationEnabled: PropTypes.bool,
  swipeEnabled: PropTypes.bool,
  useNativeDriver: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

/* @flow */

import { PropTypes } from 'react';
import { Animated } from 'react-native';

export const NavigationRoutePropType = PropTypes.shape({
  label: PropTypes.string,
  key: PropTypes.string.isRequired,
});

export const NavigationStatePropType = PropTypes.shape({
  routes: PropTypes.arrayOf(NavigationRoutePropType).isRequired,
  index: PropTypes.number.isRequired,
});

export const SceneRendererPropType = {
  width: PropTypes.number.isRequired,
  navigationState: NavigationStatePropType.isRequired,
  position: PropTypes.instanceOf(Animated.Value).isRequired,
  updateIndex: PropTypes.func.isRequired,
};

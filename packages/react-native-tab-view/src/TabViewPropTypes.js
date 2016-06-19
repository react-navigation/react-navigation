/* @flow */

import { PropTypes } from 'react';
import { Animated } from 'react-native';

export const NavigationScenePropType = PropTypes.shape({
  label: PropTypes.string.isRequired,
  key: PropTypes.string.isRequired,
});

export const NavigationStatePropType = PropTypes.shape({
  scenes: PropTypes.arrayOf(NavigationScenePropType).isRequired,
  index: PropTypes.number.isRequired,
});

export const SceneRendererPropType = {
  width: PropTypes.number.isRequired,
  navigationState: NavigationStatePropType.isRequired,
  position: PropTypes.instanceOf(Animated.Value).isRequired,
  updateIndex: PropTypes.func.isRequired,
};

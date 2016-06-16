/* @flow */

import { PropTypes } from 'react';

export const NavigationScenePropType = PropTypes.shape({
  label: PropTypes.string.isRequired,
  key: PropTypes.string.isRequired,
});

export const NavigationStatePropType = PropTypes.shape({
  scenes: PropTypes.arrayOf(NavigationScenePropType).isRequired,
  index: PropTypes.number.isRequired,
});

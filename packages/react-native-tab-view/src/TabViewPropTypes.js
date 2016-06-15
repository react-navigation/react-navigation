/* @flow */

import { PropTypes } from 'react';

export const NavigationStatePropType = PropTypes.shape({
  scenes: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
  })).isRequired,
  index: PropTypes.number.isRequired,
});

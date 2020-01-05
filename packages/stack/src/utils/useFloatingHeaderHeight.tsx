import * as React from 'react';
import FloatingHeaderHeightContext from './FloatingHeaderHeightContext';

export default function useFloatingHeaderHeight() {
  const height = React.useContext(FloatingHeaderHeightContext);

  if (height === undefined) {
    throw new Error(
      "Couldn't find the floating header height. Are you inside a screen in Stack?"
    );
  }

  return height;
}

/* @flow */

import type { Route, SceneRendererProps } from './TabViewTypeDefinitions';

type Props = SceneRendererProps & {
  route: Route
}

function forStatic(props: Props) {
  const { width, route, navigationState } = props;
  const { routes, index } = navigationState;
  const currentIndex = routes.indexOf(route);

  const translateX = width * (currentIndex - index);

  return {
    width,
    transform: [ { translateX } ]
  };
}

function forSwipe(props: Props) {
  const { width, position, route, navigationState } = props;
  const { routes } = navigationState;
  const currentIndex = routes.indexOf(route);
  const inputRange = Array.from(new Array(routes.length)).map((x, i) => i);
  const outputRange = inputRange.map(i => {
    return width * (currentIndex - i);
  });

  const translateX = position.interpolate({
    inputRange,
    outputRange,
  });

  return {
    width,
    transform: [ { translateX } ]
  };
}

export default {
  forStatic,
  forSwipe,
};

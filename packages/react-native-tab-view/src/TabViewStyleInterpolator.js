/* @flow */

import type { Route, SceneRendererProps } from './TabViewTypeDefinitions';

type Props = SceneRendererProps & {
  route: Route
}

function forStatic(props: Props) {
  const { layout, route, navigationState } = props;
  const { width } = layout;
  const { routes, index } = navigationState;
  const currentIndex = routes.indexOf(route);

  const translateX = width * (currentIndex - index);

  return {
    width,
    transform: [ { translateX } ]
  };
}

function forSwipe(props: Props) {
  const { layout, position, route, navigationState } = props;
  const { width } = layout;
  const { routes } = navigationState;
  const currentIndex = routes.indexOf(route);
  const inputRange = routes.map((x, i) => i);
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

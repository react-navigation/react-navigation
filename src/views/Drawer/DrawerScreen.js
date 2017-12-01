/* @flow */

import * as React from 'react';

import SceneView from '../SceneView';
import withCachedChildNavigation from '../../withCachedChildNavigation';

import type {
  NavigationScreenProp,
  NavigationState,
  NavigationRoute,
  NavigationRouter,
  NavigationDrawerScreenOptions,
} from '../../TypeDefinition';

type Props = {
  screenProps?: {},
  router: NavigationRouter<NavigationState, NavigationDrawerScreenOptions>,
  navigation: NavigationScreenProp<NavigationState>,
  childNavigationProps: {
    [key: string]: NavigationScreenProp<NavigationRoute>,
  },
};

/**
 * Component that renders the child screen of the drawer.
 */
class DrawerScreen extends React.PureComponent<Props> {
  render() {
    const {
      router,
      navigation,
      childNavigationProps,
      screenProps,
    } = this.props;
    const { routes, index } = navigation.state;
    const childNavigation = childNavigationProps[routes[index].key];
    const Content = router.getComponentForRouteName(routes[index].routeName);
    return (
      <SceneView
        screenProps={screenProps}
        component={Content}
        navigation={childNavigation}
      />
    );
  }
}

export default withCachedChildNavigation(DrawerScreen);

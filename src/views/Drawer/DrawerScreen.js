/* @flow */

import React, { PureComponent } from 'react';

import SceneView from '../SceneView';
import withCachedChildNavigation from '../../withCachedChildNavigation';

import type {
  NavigationScreenProp,
  NavigationState,
  NavigationRoute,
  NavigationAction,
  NavigationRouter,
} from '../../TypeDefinition';

type Props = {
  screenProps?: {};
  router: NavigationRouter,
  navigation: NavigationScreenProp<NavigationState, NavigationAction>,
  childNavigationProps: {
    [key: string]: NavigationScreenProp<NavigationRoute, NavigationAction>;
  },
};

/**
 * Component that renders child screen of the drawer.
 */
class DrawerScreen extends PureComponent<void, Props, void> {
  props: Props;

  render() {
    const { router, navigation, childNavigationProps } = this.props;
    const { routes, index } = navigation.state;
    const childNavigation = childNavigationProps[routes[index].key];
    const Content = router.getComponentForRouteName(routes[index].routeName);
    return (
      <SceneView
        screenProps={this.props.screenProps}
        component={Content}
        navigation={childNavigation}
      />
    );
  }
}

export default withCachedChildNavigation(DrawerScreen);

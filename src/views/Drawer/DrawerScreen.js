import React from 'react';

import SceneView from '../SceneView';
import withCachedChildNavigation from '../../withCachedChildNavigation';

/**
 * Component that renders the child screen of the drawer.
 */
class DrawerScreen extends React.PureComponent {
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

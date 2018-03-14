import React from 'react';

import SceneView from '../SceneView';

/**
 * Component that renders the child screen of the drawer.
 */
class DrawerScreen extends React.PureComponent {
  render() {
    const { descriptors, navigation, screenProps } = this.props;
    const { routes, index } = navigation.state;
    const descriptor = descriptors[routes[index].key];
    const Content = descriptor.getComponent();
    return (
      <SceneView
        screenProps={screenProps}
        component={Content}
        navigation={descriptor.navigation}
      />
    );
  }
}

export default DrawerScreen;

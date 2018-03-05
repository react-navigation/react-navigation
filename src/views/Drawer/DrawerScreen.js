import React from 'react';

import SceneView from '../SceneView';
import { NavigationProvider } from '../NavigationContext';

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
      <NavigationProvider navigation={descriptor.navigation}>
        <SceneView screenProps={screenProps} component={Content} />
      </NavigationProvider>
    );
  }
}

export default DrawerScreen;

import React from 'react';
import { NavigationProvider } from './NavigationContext';

export default class SceneView extends React.PureComponent {
  render() {
    const { screenProps, component: Component, navigation } = this.props;
    return (
      <NavigationProvider value={navigation}>
        <Component screenProps={screenProps} navigation={navigation} />
      </NavigationProvider>
    );
  }
}

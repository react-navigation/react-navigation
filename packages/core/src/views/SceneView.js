import React from 'react';
import NavigationContext from './NavigationContext.ts';

export default class SceneView extends React.PureComponent {
  render() {
    const { screenProps, component: Component, navigation } = this.props;
    return (
      <NavigationContext.Provider value={navigation}>
        <Component screenProps={screenProps} navigation={navigation} />
      </NavigationContext.Provider>
    );
  }
}

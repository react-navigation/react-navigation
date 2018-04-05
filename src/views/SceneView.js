import React from 'react';
import propTypes from 'prop-types';
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

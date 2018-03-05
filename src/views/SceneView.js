import React from 'react';
import propTypes from 'prop-types';
import { NavigationConsumer } from './NavigationContext';

export default class SceneView extends React.PureComponent {
  render() {
    const { screenProps, component: Component } = this.props;
    return (
      <NavigationConsumer>
        {navigation => (
          <Component screenProps={screenProps} navigation={navigation} />
        )}
      </NavigationConsumer>
    );
  }
}

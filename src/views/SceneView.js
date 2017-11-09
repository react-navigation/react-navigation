/* @flow */

import * as React from 'react';
import propTypes from 'prop-types';

import type {
  NavigationScreenProp,
  NavigationComponent,
  NavigationRoute,
} from '../TypeDefinition';

type Props = {
  screenProps?: {},
  navigation: NavigationScreenProp<*>,
  component: NavigationComponent,
};

export default class SceneView extends React.PureComponent<Props> {
  static childContextTypes = {
    navigation: propTypes.object.isRequired,
  };

  getChildContext() {
    return {
      navigation: this.props.navigation,
    };
  }

  render() {
    const { screenProps, navigation, component: Component } = this.props;

    return <Component screenProps={screenProps} navigation={navigation} />;
  }
}

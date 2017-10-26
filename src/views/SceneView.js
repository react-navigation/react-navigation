/* @flow */

import * as React from 'react';
import propTypes from 'prop-types';

import type {
  NavigationScreenProp,
  NavigationRoute,
  NavigationNavigatorProps,
} from '../TypeDefinition';

type Props<O> = {
  screenProps?: {},
  navigation: NavigationScreenProp<NavigationRoute>,
  component: React.ComponentType<NavigationNavigatorProps<O, NavigationRoute>>,
};

export default class SceneView<O: {}> extends React.PureComponent<Props<O>> {
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

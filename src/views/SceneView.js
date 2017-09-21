/* @flow */

import React, { PureComponent } from 'react';
import propTypes from 'prop-types';

import type {
  NavigationScreenProp,
  NavigationRoute,
  NavigationAction,
  NavigationNavigatorProps,
} from '../TypeDefinition';

type Props<O> = {
  screenProps?: {},
  navigation: NavigationScreenProp<NavigationRoute, NavigationAction>,
  component: ReactClass<NavigationNavigatorProps<O, NavigationRoute>>,
};

export default class SceneView<O> extends PureComponent<void, Props<O>, void> {
  static childContextTypes = {
    navigation: propTypes.object.isRequired,
  };

  props: Props<O>;

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

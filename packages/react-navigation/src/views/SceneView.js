/* @flow */

import React, { PureComponent } from 'react';

import type {
  NavigationScreenProp,
  NavigationState,
  NavigationAction,
  ContextWithNavigation,
} from '../TypeDefinition';

type Props = {
  screenProps?: {};
  navigation: NavigationScreenProp<NavigationState, NavigationAction>;
  component: ReactClass<*>;
};

export default class SceneView extends PureComponent<void, Props, void> {

  static childContextTypes = {
    navigation: React.PropTypes.object.isRequired,
  };

  props: Props;

  getChildContext(): ContextWithNavigation {
    return {
      navigation: this.props.navigation,
    };
  }

  render() {
    const { screenProps, navigation, component: Component } = this.props;
    return <Component {...screenProps} navigation={navigation} />;
  }
}

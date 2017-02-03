/* @flow */

import React, { PureComponent } from 'react';

import type {
  NavigationScreenProp,
  NavigationState,
  NavigationAction,
} from '../TypeDefinition';

type Props = {
  screenProps?: {};
  navigation: NavigationScreenProp<NavigationState, NavigationAction>;
  component: ReactClass<*>;
};

export default class SceneView extends PureComponent<void, Props, void> {
  props: Props;

  render() {
    const { screenProps, navigation, component: Component } = this.props;
    // pass through screenProps as well for nested navigators
    return <Component {...screenProps} screenProps={screenProps} navigation={navigation} />;
  }
}

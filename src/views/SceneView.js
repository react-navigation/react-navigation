/* @flow */

import React, { PureComponent } from 'react';

import type {
  NavigationScreenProp,
  NavigationState,
  NavigationRoute,
  NavigationAction,
} from '../TypeDefinition';

type Props = {
  screenProps?: {};
  navigation: NavigationScreenProp<NavigationRoute, NavigationAction>;
  component: ReactClass<*>;
};

let screenPropsWarningShown = false;

export default class SceneView extends PureComponent<void, Props, void> {
  static childContextTypes = {
    navigation: React.PropTypes.object.isRequired,
  };

  props: Props;

  getChildContext() {
    return {
      navigation: this.props.navigation,
    };
  }

  componentWillMount() {
    if (this.props.screenProps !== undefined && !screenPropsWarningShown) {
      console.warn(
        'Behaviour of screenProps has changed from initial beta. ' +
        'Components will now receive it as `this.props.screenProps` instead.\n' +
        'This warning will be removed in future.'
      );
      screenPropsWarningShown = true;
    }
  }

  render() {
    const {
      screenProps,
      navigation,
      component: Component,
    } = this.props;

    return (
      <Component
        screenProps={screenProps}
        navigation={navigation}
      />
    );
  }
}

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
  hideScreenPropsWarning?: boolean;
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

  componentWillMount() {
    if (this.props.screenProps !== undefined && !this.props.hideScreenPropsWarning) {
      console.warn(
        'Behaviour of screenProps has changed from initial beta. ' +
        'Components will now receive it as `this.props.screenProps` instead.\n' +
        'Pass `hideScreenPropsWarning` to hide this warning.'
      );
    }
  }

  render() {
    const {
      hideScreenPropsWarning,
      screenProps,
      navigation,
      component: Component,
    } = this.props;

    return (
      <Component
        hideScreenPropsWarning={hideScreenPropsWarning}
        screenProps={screenProps}
        navigation={navigation}
      />
    );
  }
}

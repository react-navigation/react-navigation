/* @flow */

import * as React from 'react';
import propTypes from 'prop-types';

import type {
  NavigationScreenProp,
  NavigationComponent,
  NavigationRoute,
  NavigationScene,
} from '../TypeDefinition';

type Props = {
  screenProps?: {},
  navigation: NavigationScreenProp<*>,
  component: NavigationComponent,
  scene?: NavigationScene,
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
    const { screenProps, navigation, component: Component, scene } = this.props;

    const comp: any = (
      <Component screenProps={screenProps} navigation={navigation} />
    );
    const originalMethod = comp.type.prototype.shouldComponentUpdate;
    if (originalMethod && scene) {
      comp.type.prototype.shouldComponentUpdate = function(...args: [*]) {
        return scene.isActive && originalMethod.apply(this, args);
      };
    }
    return comp;
  }
}

/* @flow */

import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  Text,
} from 'react-native';
import shallowCompare from 'react-addons-shallow-compare';
import TabBar from './TabBar';
import { SceneRendererPropType } from './TabViewPropTypes';
import type { Scene, SceneRendererProps } from './TabViewTypeDefinitions';

const styles = StyleSheet.create({
  tablabel: {
    color: 'white',
    fontSize: 14,
    margin: 4,
  },
});

type DefaultProps = {
  renderLabel: (scene: Scene) => ?React.Element<any>;
}

type Props = SceneRendererProps & {
  renderLabel: (scene: Scene) => React.Element<any>;
}

export default class TabBarTop extends Component<DefaultProps, Props, void> {
  static propTypes = {
    ...SceneRendererPropType,
    renderLabel: PropTypes.func.isRequired,
  };

  static defaultProps = {
    renderLabel: ({ route }) => route.title ? <Text style={styles.tablabel}>{route.title}</Text> : null,
  };

  shouldComponentUpdate(nextProps: Props, nextState: void) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    return <TabBar {...this.props} />;
  }
}

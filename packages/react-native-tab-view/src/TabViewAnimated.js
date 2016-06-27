/* @flow */

import React, { Component, PropTypes } from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import shallowCompare from 'react-addons-shallow-compare';
import TabViewTransitioner from './TabViewTransitioner';
import { NavigationStatePropType } from './TabViewPropTypes';
import type { NavigationState, SceneRendererProps } from './TabViewTypeDefinitions';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

type Props = {
  navigationState: NavigationState;
  renderScene: (props: SceneRendererProps) => ?React.Element<any>;
  renderHeader?: () => ?React.Element<any>;
  renderFooter?: () => ?React.Element<any>;
  style?: any;
}

export default class TabViewAnimated extends Component<void, Props, void> {
  static propTypes = {
    navigationState: NavigationStatePropType.isRequired,
    renderScene: PropTypes.func.isRequired,
    renderHeader: PropTypes.func,
    renderFooter: PropTypes.func,
    style: View.propTypes.style,
  };

  shouldComponentUpdate(nextProps: Props, nextState: void) {
    return shallowCompare(this, nextProps, nextState);
  }

  _renderItems = (props: SceneRendererProps) => {
    const { renderHeader, renderFooter, renderScene } = this.props;

    return (
      <View style={styles.container}>
        {renderHeader && renderHeader(props)}
        <View style={styles.container}>
          {this.props.navigationState.routes.map(route => {
            return renderScene({ ...props, route, key: route.key });
          })}
        </View>
        {renderFooter && renderFooter(props)}
      </View>
    );
  };

  render() {
    return (
      <TabViewTransitioner
        {...this.props}
        render={this._renderItems}
      />
    );
  }
}

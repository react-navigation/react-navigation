/* @flow */

import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  View,
  PanResponder,
} from 'react-native';
import shallowCompare from 'react-addons-shallow-compare';
import TabViewScene from './TabViewScene';
import { NavigationStatePropType } from './TabViewPropTypes';
import type { Scene, NavigationState } from './TabViewTypes';
import type { GestureEvent, GestureState } from './PanResponderTypes';

const styles = StyleSheet.create({
  inner: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
});

type Props = {
  navigationState: NavigationState;
  renderScene: (props: { scene: Scene; focused: boolean; }) => ?React.Element;
  renderHeader?: () => ?React.Element;
  renderFooter?: () => ?React.Element;
  onRequestChangeTab: Function;
  style?: any;
}

type State = {
  width: number;
  height: number;
}

export default class TabView extends Component<void, Props, State> {
  static propTypes = {
    navigationState: NavigationStatePropType.isRequired,
    renderScene: PropTypes.func.isRequired,
    renderHeader: PropTypes.func,
    renderFooter: PropTypes.func,
    onRequestChangeTab: PropTypes.func.isRequired,
    style: View.propTypes.style,
  };

  state: State = {
    width: 0,
    height: 0,
  };

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    return shallowCompare(this, nextProps, nextState);
  }

  _handleLayout = (e: any) => {
    const { height, width } = e.nativeEvent.layout;

    this.setState({
      height,
      width,
    });
  };

  render() {
    const { scenes, index } = this.props.navigationState;
    const { width } = this.state;

    return (
      <View {...this.props} onLayout={this._handleLayout}>
        {this.props.renderHeader && this.props.renderHeader()}
        <View style={[ styles.inner, { width: width * scenes.length, transform: [ { translateX: width * index * -1 } ] } ]}>
          {scenes.map((scene, i) => {
            return (
              <TabViewScene
                key={scene.key}
                scene={scene}
                focused={index === i}
                left={i * width}
                width={width}
                renderScene={this.props.renderScene}
              />
            );
          })}
        </View>
        {this.props.renderFooter && this.props.renderFooter()}
      </View>
    );
  }
}

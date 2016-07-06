/* @flow */

import React, { Component, PropTypes } from 'react';
import {
  Animated,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import shallowCompare from 'react-addons-shallow-compare';
import TouchableItem from './TouchableItem';
import { SceneRendererPropType } from './TabViewPropTypes';
import type { Scene, SceneRendererProps } from './TabViewTypeDefinitions';

const styles = StyleSheet.create({
  tabbar: {
    backgroundColor: 'black',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    elevation: 4,
  },
  tablabel: {
    color: 'white',
    margin: 8,
  },
  tab: {
    flex: 1,
  },
  tabitem: {
    flex: 1,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

type DefaultProps = {
  renderLabel: (scene: Scene) => ?React.Element<any>;
}

type Props = SceneRendererProps & {
  pressColor?: string;
  renderLabel?: (scene: Scene) => ?React.Element<any>;
  renderIcon?: (scene: Scene) => ?React.Element<any>;
  renderIndicator?: (props: SceneRendererProps) => ?React.Element<any>;
  tabStyle?: any;
  style?: any;
}

export default class TabBar extends Component<DefaultProps, Props, void> {
  static propTypes = {
    ...SceneRendererPropType,
    pressColor: TouchableItem.propTypes.pressColor,
    renderIcon: PropTypes.func,
    renderLabel: PropTypes.func,
    renderIndicator: PropTypes.func,
    tabStyle: View.propTypes.style,
    style: View.propTypes.style,
  };

  static defaultProps = {
    renderLabel: ({ route }) => route.title ? <Text style={styles.tablabel}>{route.title}</Text> : null,
  };

  shouldComponentUpdate(nextProps: Props, nextState: void) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    const { position } = this.props;
    const { routes, index } = this.props.navigationState;

    const inputRange = routes.map((x, i) => i);

    return (
      <View style={[ styles.tabbar, this.props.style ]}>
        {routes.map((route, i) => {
          const focused = index === i;
          const outputRange = inputRange.map(inputIndex => inputIndex === i ? 1 : 0.7);
          const opacity = position.interpolate({
            inputRange,
            outputRange,
          });
          const scene = {
            route,
            focused,
            index: i,
          };
          const icon = this.props.renderIcon ? this.props.renderIcon(scene) : null;
          const label = this.props.renderLabel ? this.props.renderLabel(scene) : null;

          let tabStyle;

          if (icon) {
            if (label) {
              tabStyle = { marginTop: 8 };
            } else {
              tabStyle = { margin: 8 };
            }
          }

          return (
            <TouchableItem
              key={route.key}
              style={styles.tab}
              pressColor={this.props.pressColor}
              onPress={() => this.props.jumpToIndex(i)}
            >
              <Animated.View style={[ styles.tabitem, { opacity }, tabStyle, this.props.tabStyle ]}>
                {this.props.renderIcon ? this.props.renderIcon(scene) : null}
                {this.props.renderLabel ? this.props.renderLabel(scene) : null}
              </Animated.View>
            </TouchableItem>
          );
        })}
        {this.props.renderIndicator ? this.props.renderIndicator(this.props) : null}
      </View>
    );
  }
}

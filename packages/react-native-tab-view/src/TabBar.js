/* @flow */

import React, { Component, PropTypes } from 'react';
import {
  Animated,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import TouchableItem from './TouchableItem';
import { SceneRendererPropType } from './TabViewPropTypes';
import type { Scene, SceneRendererProps } from './TabViewTypeDefinitions';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabbar: {
    backgroundColor: 'black',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    elevation: 4,
  },
  tablabel: {
    color: 'white',
    fontSize: 12,
    margin: 4,
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
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
});

type DefaultProps = {
  renderLabel: (scene: Scene) => ?React.Element<any>;
}

type Props = SceneRendererProps & {
  pressColor?: string;
  renderLabel?: (scene: Scene) => ?React.Element<any>;
  renderIcon?: (scene: Scene) => ?React.Element<any>;
  renderBadge?: (scene: Scene) => ?React.Element<any>;
  renderIndicator?: (props: SceneRendererProps) => ?React.Element<any>;
  onTabPress?: Function;
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
    onTabPress: PropTypes.func,
    tabStyle: View.propTypes.style,
    style: View.propTypes.style,
  };

  static defaultProps = {
    renderLabel: ({ route }) => route.title ? <Text style={styles.tablabel}>{route.title}</Text> : null,
  };

  render() {
    const { position } = this.props;
    const { routes, index } = this.props.navigationState;

    // Prepend '-1', so there are always at least 2 items in inputRange
    const inputRange = [ -1, ...routes.map((x, i) => i) ];

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
          const badge = this.props.renderBadge ? this.props.renderBadge(scene) : null;

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
              onPress={() => {
                const { onTabPress, jumpToIndex } = this.props;
                if (onTabPress) {
                  onTabPress(routes[i]);
                }
                jumpToIndex(i);
              }}
            >
              <View style={styles.container}>
                <Animated.View style={[ styles.tabitem, { opacity }, tabStyle, this.props.tabStyle ]}>
                  {icon}
                  {label}
                </Animated.View>
                {badge ?
                  <View style={styles.badge}>
                    {badge}
                  </View> : null
                }
              </View>
            </TouchableItem>
          );
        })}
        {this.props.renderIndicator ? this.props.renderIndicator(this.props) : null}
      </View>
    );
  }
}

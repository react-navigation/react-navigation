import React from 'react';
import { Animated, View, StyleSheet } from 'react-native';

export default class TabBarIcon extends React.PureComponent {
  render() {
    const {
      position,
      scene,
      navigation,
      activeTintColor,
      inactiveTintColor,
      style,
    } = this.props;
    const { route, index } = scene;
    const { routes } = navigation.state;
    // Prepend '-1', so there are always at least 2 items in inputRange
    const inputRange = [-1, ...routes.map((x, i) => i)];
    const activeOpacity = position.interpolate({
      inputRange,
      outputRange: inputRange.map(i => (i === index ? 1 : 0)),
    });
    const inactiveOpacity = position.interpolate({
      inputRange,
      outputRange: inputRange.map(i => (i === index ? 0 : 1)),
    });

    // We render the icon twice at the same position on top of each other:
    // active and inactive one, so we can fade between them.
    return (
      <View style={style}>
        <Animated.View style={[styles.icon, { opacity: activeOpacity }]}>
          {this.props.renderIcon({
            route,
            index,
            focused: true,
            tintColor: activeTintColor,
          })}
        </Animated.View>
        <Animated.View style={[styles.icon, { opacity: inactiveOpacity }]}>
          {this.props.renderIcon({
            route,
            index,
            focused: false,
            tintColor: inactiveTintColor,
          })}
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  icon: {
    // We render the icon twice at the same position on top of each other:
    // active and inactive one, so we can fade between them:
    // Cover the whole iconContainer:
    position: 'absolute',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
    minWidth: 30,
  },
});

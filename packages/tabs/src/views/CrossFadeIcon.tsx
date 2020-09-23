import * as React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import { NavigationRoute } from 'react-navigation';

type Props = {
  route: NavigationRoute;
  horizontal?: boolean;
  activeOpacity: number;
  inactiveOpacity: number;
  activeTintColor?: string;
  inactiveTintColor?: string;
  renderIcon: (props: {
    route: NavigationRoute;
    focused: boolean;
    tintColor?: string;
    horizontal?: boolean;
  }) => React.ReactNode;
  style: StyleProp<ViewStyle>;
};

export default class TabBarIcon extends React.Component<Props> {
  render() {
    const {
      route,
      activeOpacity,
      inactiveOpacity,
      activeTintColor,
      inactiveTintColor,
      renderIcon,
      horizontal,
      style,
    } = this.props;

    // We render the icon twice at the same position on top of each other:
    // active and inactive one, so we can fade between them.
    return (
      <View style={style}>
        <Animated.View style={[styles.icon, { opacity: activeOpacity }]}>
          {renderIcon({
            route,
            focused: true,
            horizontal,
            tintColor: activeTintColor,
          })}
        </Animated.View>
        <Animated.View style={[styles.icon, { opacity: inactiveOpacity }]}>
          {renderIcon({
            route,
            focused: false,
            horizontal,
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
    // Workaround for react-native >= 0.54 layout bug
    minWidth: 25,
  },
});

/* @flow */

import * as React from 'react';
import {
  Animated,
  TouchableWithoutFeedback,
  StyleSheet,
  View,
  Platform,
  Keyboard,
  Dimensions,
} from 'react-native';
import TabBarIcon from './TabBarIcon';
import SafeAreaView from '../SafeAreaView';
import withOrientation from '../withOrientation';

import type {
  NavigationRoute,
  NavigationState,
  NavigationScreenProp,
  ViewStyleProp,
  TextStyleProp,
} from '../../TypeDefinition';

import type { TabScene } from './TabView';

type Props = {
  activeTintColor: string,
  activeBackgroundColor: string,
  inactiveTintColor: string,
  inactiveBackgroundColor: string,
  showLabel: boolean,
  showIcon: boolean,
  allowFontScaling: boolean,
  position: Animated.Value,
  navigation: NavigationScreenProp<NavigationState>,
  jumpToIndex: (index: number) => void,
  getLabel: (scene: TabScene) => ?(React.Node | string),
  getOnPress: (
    previousScene: NavigationRoute,
    scene: TabScene
  ) => ({
    previousScene: NavigationRoute,
    scene: TabScene,
    jumpToIndex: (index: number) => void,
  }) => void,
  getTestIDProps: (scene: TabScene) => (scene: TabScene) => any,
  renderIcon: (scene: TabScene) => React.Node,
  style?: ViewStyleProp,
  animateStyle?: ViewStyleProp,
  labelStyle?: TextStyleProp,
  tabStyle?: ViewStyleProp,
  showIcon?: boolean,
  isLandscape: boolean,
};

type State = {
  viewWidth: number,
  maxTabItemWidth: number,
};

const majorVersion = parseInt(Platform.Version, 10);
const isIos = Platform.OS === 'ios';
const canUseHorizontalTabs = majorVersion >= 11 && isIos;
const isPad =
  Dimensions.get('window').height / Dimensions.get('window').width < 1.6;

class TabBarBottom extends React.PureComponent<Props, State> {
  state = {
    viewWidth: 0,
    maxTabItemWidth: 0,
  };

  // See https://developer.apple.com/library/content/documentation/UserExperience/Conceptual/UIKitUICatalog/UITabBar.html
  static defaultProps = {
    activeTintColor: '#3478f6', // Default active tint color in iOS 10
    activeBackgroundColor: 'transparent',
    inactiveTintColor: '#929292', // Default inactive tint color in iOS 10
    inactiveBackgroundColor: 'transparent',
    showLabel: true,
    showIcon: true,
    allowFontScaling: true,
  };

  _renderLabel = (scene: TabScene) => {
    const {
      position,
      navigation,
      activeTintColor,
      inactiveTintColor,
      labelStyle,
      showLabel,
      showIcon,
      isLandscape,
      allowFontScaling,
    } = this.props;
    if (showLabel === false) {
      return null;
    }
    const { index } = scene;
    const { routes } = navigation.state;
    // Prepend '-1', so there are always at least 2 items in inputRange
    const inputRange = [-1, ...routes.map((x: *, i: number) => i)];
    const outputRange = inputRange.map(
      (inputIndex: number) =>
        inputIndex === index ? activeTintColor : inactiveTintColor
    );
    const color = position.interpolate({
      inputRange,
      outputRange: (outputRange: Array<string>),
    });

    const tintColor = scene.focused ? activeTintColor : inactiveTintColor;
    const label = this.props.getLabel({ ...scene, tintColor });

    if (typeof label === 'string') {
      return (
        <Animated.Text
          style={[
            styles.label,
            { color },
            showIcon && this.shouldUseHorizontalTabs()
              ? styles.labelBeside
              : styles.labelBeneath,
            labelStyle,
          ]}
          allowFontScaling={allowFontScaling}
        >
          {label}
        </Animated.Text>
      );
    }

    if (typeof label === 'function') {
      return label({ ...scene, tintColor });
    }

    return label;
  };

  _renderIcon = (scene: TabScene) => {
    const {
      position,
      navigation,
      activeTintColor,
      inactiveTintColor,
      renderIcon,
      showIcon,
      showLabel,
    } = this.props;
    if (showIcon === false) {
      return null;
    }
    return (
      <TabBarIcon
        position={position}
        navigation={navigation}
        activeTintColor={activeTintColor}
        inactiveTintColor={inactiveTintColor}
        renderIcon={renderIcon}
        scene={scene}
        style={showLabel && this.shouldUseHorizontalTabs() ? {} : styles.icon}
      />
    );
  };

  _renderTestIDProps = (scene: TabScene) => {
    const testIDProps =
      this.props.getTestIDProps && this.props.getTestIDProps(scene);
    return testIDProps;
  };
  shouldUseHorizontalTabs() {
    const { routes } = this.props.navigation.state;
    const { maxTabItemWidth, viewWidth } = this.state;
    const { isLandscape } = this.props;
    if (isPad) {
      if (viewWidth === 0 || maxTabItemWidth === 0) return true;
      return (
        canUseHorizontalTabs &&
        // maxTabItemWidth + 10 ensures that there is a 5pt margin on each side of the widest item
        routes.length * (maxTabItemWidth + 10) < viewWidth
      );
    } else {
      return canUseHorizontalTabs && isLandscape;
    }
  }

  render() {
    const {
      position,
      navigation,
      jumpToIndex,
      getOnPress,
      getTestIDProps,
      activeBackgroundColor,
      inactiveBackgroundColor,
      style,
      animateStyle,
      tabStyle,
      isLandscape,
    } = this.props;
    const { routes } = navigation.state;
    const previousScene = routes[navigation.state.index];
    // Prepend '-1', so there are always at least 2 items in inputRange
    const inputRange = [-1, ...routes.map((x: *, i: number) => i)];

    const tabBarStyle = [
      styles.tabBar,
      this.shouldUseHorizontalTabs() && !isPad
        ? styles.tabBarCompact
        : styles.tabBarRegular,
      style,
    ];

    return (
      <Animated.View
        style={animateStyle}
        onLayout={evt => {
          this.setState({ viewWidth: evt.nativeEvent.layout.width });
        }}
      >
        <SafeAreaView
          style={tabBarStyle}
          forceInset={{ bottom: 'always', top: 'never' }}
        >
          {routes.map((route: NavigationRoute, index: number) => {
            const focused = index === navigation.state.index;
            const scene = { route, index, focused };
            const onPress = getOnPress(previousScene, scene);
            const outputRange = inputRange.map(
              (inputIndex: number) =>
                inputIndex === index
                  ? activeBackgroundColor
                  : inactiveBackgroundColor
            );
            const backgroundColor = position.interpolate({
              inputRange,
              outputRange: (outputRange: Array<string>),
            });

            const justifyContent = this.props.showIcon ? 'flex-end' : 'center';
            const extraProps = this._renderTestIDProps(scene) || {};
            const { testID, accessibilityLabel } = extraProps;

            return (
              <TouchableWithoutFeedback
                key={route.key}
                testID={testID}
                accessibilityLabel={accessibilityLabel}
                onPress={() =>
                  onPress
                    ? onPress({ previousScene, scene, jumpToIndex })
                    : jumpToIndex(index)}
              >
                <Animated.View style={[styles.tab, { backgroundColor }]}>
                  <View
                    onLayout={evt => {
                      const { maxTabItemWidth } = this.state;
                      let itemWidth = evt.nativeEvent.layout.width;
                      if (itemWidth > maxTabItemWidth)
                        this.setState({ maxTabItemWidth: itemWidth });
                    }}
                    style={[
                      styles.tab,
                      this.shouldUseHorizontalTabs()
                        ? styles.tabLandscape
                        : styles.tabPortrait,
                      tabStyle,
                    ]}
                  >
                    {this._renderIcon(scene)}
                    {this._renderLabel(scene)}
                  </View>
                </Animated.View>
              </TouchableWithoutFeedback>
            );
          })}
        </SafeAreaView>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#F7F7F7', // Default background color in iOS 10
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0, 0, 0, .3)',
    flexDirection: 'row',
  },
  tabBarCompact: {
    height: 29,
  },
  tabBarRegular: {
    height: 49,
  },
  tab: {
    flex: 1,
    alignItems: isIos ? 'center' : 'stretch',
  },
  tabPortrait: {
    justifyContent: 'flex-end',
    flexDirection: 'column',
  },
  tabLandscape: {
    justifyContent: 'center',
    flexDirection: 'row',
  },
  icon: {
    flexGrow: 1,
  },
  label: {
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
  labelBeneath: {
    fontSize: 10,
    marginBottom: 1.5,
  },
  labelBeside: {
    fontSize: 13,
    marginLeft: 20,
  },
});

export default withOrientation(TabBarBottom);

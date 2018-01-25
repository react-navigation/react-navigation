import React from 'react';
import {
  Animated,
  TouchableWithoutFeedback,
  StyleSheet,
  View,
  Platform,
  Keyboard,
} from 'react-native';
import TabBarIcon from './TabBarIcon';
import SafeAreaView from '../SafeAreaView';
import withOrientation from '../withOrientation';

const majorVersion = parseInt(Platform.Version, 10);
const isIos = Platform.OS === 'ios';
const useHorizontalTabs = majorVersion >= 11 && isIos;

class TabBarBottom extends React.PureComponent {
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

  _renderLabel = scene => {
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
    const inputRange = [-1, ...routes.map((x, i) => i)];
    const outputRange = inputRange.map(
      inputIndex => (inputIndex === index ? activeTintColor : inactiveTintColor)
    );
    const color = position.interpolate({
      inputRange,
      outputRange: outputRange,
    });

    const tintColor = scene.focused ? activeTintColor : inactiveTintColor;
    const label = this.props.getLabel({ ...scene, tintColor });
    let marginLeft = 0;
    if (isLandscape && showIcon && useHorizontalTabs) {
      marginLeft = LABEL_LEFT_MARGIN;
    }
    let marginTop = 0;
    if (!isLandscape && showIcon && useHorizontalTabs) {
      marginTop = LABEL_TOP_MARGIN;
    }

    if (typeof label === 'string') {
      return (
        <Animated.Text
          style={[styles.label, { color, marginLeft, marginTop }, labelStyle]}
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

  _renderIcon = scene => {
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
        style={showLabel && useHorizontalTabs ? {} : styles.icon}
      />
    );
  };

  _renderTestIDProps = scene => {
    const testIDProps =
      this.props.getTestIDProps && this.props.getTestIDProps(scene);
    return testIDProps;
  };

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
    const inputRange = [-1, ...routes.map((x, i) => i)];

    const tabBarStyle = [
      styles.tabBar,
      isLandscape && useHorizontalTabs
        ? styles.tabBarLandscape
        : styles.tabBarPortrait,
      style,
    ];

    return (
      <Animated.View style={animateStyle}>
        <SafeAreaView
          style={tabBarStyle}
          forceInset={{ bottom: 'always', top: 'never' }}
        >
          {routes.map((route, index) => {
            const focused = index === navigation.state.index;
            const scene = { route, index, focused };
            const onPress = getOnPress(previousScene, scene);
            const outputRange = inputRange.map(
              inputIndex =>
                inputIndex === index
                  ? activeBackgroundColor
                  : inactiveBackgroundColor
            );
            const backgroundColor = position.interpolate({
              inputRange,
              outputRange: outputRange,
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
                    : jumpToIndex(index)
                }
              >
                <Animated.View
                  style={[
                    styles.tab,
                    isLandscape && useHorizontalTabs && styles.tabLandscape,
                    !isLandscape && useHorizontalTabs && styles.tabPortrait,
                    { backgroundColor },
                    tabStyle,
                  ]}
                >
                  {this._renderIcon(scene)}
                  {this._renderLabel(scene)}
                </Animated.View>
              </TouchableWithoutFeedback>
            );
          })}
        </SafeAreaView>
      </Animated.View>
    );
  }
}

const LABEL_LEFT_MARGIN = 20;
const LABEL_TOP_MARGIN = 15;
const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#F7F7F7', // Default background color in iOS 10
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0, 0, 0, .3)',
    flexDirection: 'row',
  },
  tabBarLandscape: {
    height: 29,
  },
  tabBarPortrait: {
    height: 49,
  },
  tab: {
    flex: 1,
    alignItems: isIos ? 'center' : 'stretch',
    justifyContent: 'flex-end',
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
    fontSize: 10,
    marginBottom: 1.5,
    backgroundColor: 'transparent',
  },
});

export default withOrientation(TabBarBottom);

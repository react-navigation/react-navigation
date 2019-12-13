import React from 'react';
import {
  View,
  Animated,
  StyleSheet,
  Keyboard,
  Platform,
  LayoutChangeEvent,
  ScaledSize,
  Dimensions,
} from 'react-native';
import { NavigationContext, CommonActions } from '@react-navigation/native';
import { SafeAreaConsumer } from 'react-native-safe-area-context';

import BottomTabItem from './BottomTabItem';
import { BottomTabBarProps } from '../types';

type Props = BottomTabBarProps & {
  activeTintColor?: string;
  inactiveTintColor?: string;
};

const DEFAULT_TABBAR_HEIGHT = 50;
const DEFAULT_MAX_TAB_ITEM_WIDTH = 125;

export default function BottomTabBar({
  state,
  navigation,
  descriptors,
  activeBackgroundColor,
  activeTintColor,
  adaptive = true,
  allowFontScaling,
  inactiveBackgroundColor,
  inactiveTintColor,
  keyboardHidesTabBar = false,
  labelPosition,
  labelStyle,
  showIcon,
  showLabel,
  style,
  tabStyle,
}: Props) {
  const [dimensions, setDimensions] = React.useState(Dimensions.get('window'));
  const [layout, setLayout] = React.useState({ height: 0, width: 0 });
  const [keyboardShown, setKeyboardShown] = React.useState(false);

  const [visible] = React.useState(() => new Animated.Value(0));

  const { routes } = state;

  React.useEffect(() => {
    if (keyboardShown) {
      Animated.timing(visible, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [keyboardShown, visible]);

  React.useEffect(() => {
    const handleOrientationChange = ({ window }: { window: ScaledSize }) => {
      setDimensions(window);
    };

    const handleKeyboardShow = () => setKeyboardShown(true);

    const handleKeyboardHide = () =>
      Animated.timing(visible, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          setKeyboardShown(false);
        }
      });

    Dimensions.addEventListener('change', handleOrientationChange);

    if (Platform.OS === 'ios') {
      Keyboard.addListener('keyboardWillShow', handleKeyboardShow);
      Keyboard.addListener('keyboardWillHide', handleKeyboardHide);
    } else {
      Keyboard.addListener('keyboardDidShow', handleKeyboardShow);
      Keyboard.addListener('keyboardDidHide', handleKeyboardHide);
    }

    return () => {
      Dimensions.removeEventListener('change', handleOrientationChange);

      if (Platform.OS === 'ios') {
        Keyboard.removeListener('keyboardWillShow', handleKeyboardShow);
        Keyboard.removeListener('keyboardWillHide', handleKeyboardHide);
      } else {
        Keyboard.removeListener('keyboardDidShow', handleKeyboardShow);
        Keyboard.removeListener('keyboardDidHide', handleKeyboardHide);
      }
    };
  }, [visible]);

  const handleLayout = (e: LayoutChangeEvent) => {
    const { height, width } = e.nativeEvent.layout;

    setLayout(layout => {
      if (height === layout.height && width === layout.width) {
        return layout;
      } else {
        return {
          height,
          width,
        };
      }
    });
  };

  const shouldUseHorizontalLabels = () => {
    const isLandscape = dimensions.width > dimensions.height;

    if (labelPosition) {
      let position;

      if (typeof labelPosition === 'string') {
        position = labelPosition;
      } else {
        position = labelPosition({ dimensions });
      }

      if (position) {
        return position === 'beside-icon';
      }
    }

    if (!adaptive) {
      return false;
    }

    if (dimensions.width >= 768) {
      // Screen size matches a tablet
      let maxTabItemWidth = DEFAULT_MAX_TAB_ITEM_WIDTH;

      const flattenedStyle = StyleSheet.flatten(tabStyle);

      if (flattenedStyle) {
        if (typeof flattenedStyle.width === 'number') {
          maxTabItemWidth = flattenedStyle.width;
        } else if (typeof flattenedStyle.maxWidth === 'number') {
          maxTabItemWidth = flattenedStyle.maxWidth;
        }
      }

      return routes.length * maxTabItemWidth <= dimensions.width;
    } else {
      return isLandscape;
    }
  };

  return (
    <SafeAreaConsumer>
      {insets => (
        <Animated.View
          style={[
            styles.tabBar,
            keyboardHidesTabBar
              ? {
                  // When the keyboard is shown, slide down the tab bar
                  transform: [
                    {
                      translateY: visible.interpolate({
                        inputRange: [0, 1],
                        outputRange: [layout.height, 0],
                      }),
                    },
                  ],
                  // Absolutely position the tab bar so that the content is below it
                  // This is needed to avoid gap at bottom when the tab bar is hidden
                  position: keyboardShown ? 'absolute' : null,
                }
              : null,
            {
              height: DEFAULT_TABBAR_HEIGHT + (insets ? insets.bottom : 0),
              paddingBottom: insets ? insets.bottom : 0,
            },
            style,
          ]}
          pointerEvents={keyboardHidesTabBar && keyboardShown ? 'none' : 'auto'}
        >
          <View style={styles.content} onLayout={handleLayout}>
            {routes.map((route, index) => {
              const focused = index === state.index;
              const { options } = descriptors[route.key];

              const onPress = () => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                });

                if (!focused && !event.defaultPrevented) {
                  navigation.dispatch({
                    ...CommonActions.navigate(route.name),
                    target: state.key,
                  });
                }
              };

              const onLongPress = () => {
                navigation.emit({
                  type: 'tabLongPress',
                  target: route.key,
                });
              };

              const label =
                options.tabBarLabel !== undefined
                  ? options.tabBarLabel
                  : options.title !== undefined
                  ? options.title
                  : route.name;

              const accessibilityLabel =
                options.tabBarAccessibilityLabel !== undefined
                  ? options.tabBarAccessibilityLabel
                  : typeof label === 'string'
                  ? `${label}, tab, ${index + 1} of ${routes.length}`
                  : undefined;

              return (
                <NavigationContext.Provider
                  key={route.key}
                  value={descriptors[route.key].navigation}
                >
                  <BottomTabItem
                    route={route}
                    focused={focused}
                    horizontal={shouldUseHorizontalLabels()}
                    onPress={onPress}
                    onLongPress={onLongPress}
                    accessibilityLabel={accessibilityLabel}
                    testID={options.tabBarTestID}
                    allowFontScaling={allowFontScaling}
                    activeTintColor={activeTintColor}
                    inactiveTintColor={inactiveTintColor}
                    activeBackgroundColor={activeBackgroundColor}
                    inactiveBackgroundColor={inactiveBackgroundColor}
                    button={options.tabBarButton}
                    icon={options.tabBarIcon}
                    label={label}
                    showIcon={showIcon}
                    showLabel={showLabel}
                    labelStyle={labelStyle}
                    style={tabStyle}
                  />
                </NavigationContext.Provider>
              );
            })}
          </View>
        </Animated.View>
      )}
    </SafeAreaConsumer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0, 0, 0, .3)',
    elevation: 8,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
});

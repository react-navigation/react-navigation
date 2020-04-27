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
import {
  NavigationContext,
  NavigationRouteContext,
  CommonActions,
  useTheme,
  useLinkBuilder,
} from '@react-navigation/native';
import { useSafeArea } from 'react-native-safe-area-context';

import BottomTabItem from './BottomTabItem';
import { BottomTabBarProps } from '../types';

type Props = BottomTabBarProps & {
  activeTintColor?: string;
  inactiveTintColor?: string;
};

const DEFAULT_TABBAR_HEIGHT = 50;
const DEFAULT_MAX_TAB_ITEM_WIDTH = 125;

const useNativeDriver = Platform.OS !== 'web';

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
  safeAreaInsets,
  showIcon,
  showLabel,
  style,
  tabStyle,
}: Props) {
  const { colors } = useTheme();
  const buildLink = useLinkBuilder();

  const [dimensions, setDimensions] = React.useState(() => {
    const { height = 0, width = 0 } = Dimensions.get('window');

    return { height, width };
  });

  const [layout, setLayout] = React.useState({
    height: 0,
    width: dimensions.width,
  });
  const [keyboardShown, setKeyboardShown] = React.useState(false);

  const [visible] = React.useState(() => new Animated.Value(1));

  const { routes } = state;

  React.useEffect(() => {
    if (keyboardShown) {
      Animated.timing(visible, {
        toValue: 0,
        duration: 200,
        useNativeDriver,
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
        useNativeDriver,
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

    setLayout((layout) => {
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
    if (labelPosition) {
      return labelPosition === 'beside-icon';
    }

    if (!adaptive) {
      return false;
    }

    if (layout.width >= 768) {
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

      return routes.length * maxTabItemWidth <= layout.width;
    } else {
      const isLandscape = dimensions.width > dimensions.height;

      return isLandscape;
    }
  };

  const defaultInsets = useSafeArea();

  const insets = {
    top: safeAreaInsets?.top ?? defaultInsets.top,
    right: safeAreaInsets?.right ?? defaultInsets.right,
    bottom: safeAreaInsets?.bottom ?? defaultInsets.bottom,
    left: safeAreaInsets?.left ?? defaultInsets.left,
  };

  return (
    <Animated.View
      style={[
        styles.tabBar,
        {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
        },
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
          height: DEFAULT_TABBAR_HEIGHT + insets.bottom,
          paddingBottom: insets.bottom,
          paddingHorizontal: Math.max(insets.left, insets.right),
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
              canPreventDefault: true,
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
              <NavigationRouteContext.Provider value={route}>
                <BottomTabItem
                  route={route}
                  focused={focused}
                  horizontal={shouldUseHorizontalLabels()}
                  onPress={onPress}
                  onLongPress={onLongPress}
                  accessibilityLabel={accessibilityLabel}
                  to={buildLink(route.name, route.params)}
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
              </NavigationRouteContext.Provider>
            </NavigationContext.Provider>
          );
        })}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: StyleSheet.hairlineWidth,
    elevation: 8,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
});

import React from 'react';
import {
  View,
  Animated,
  StyleSheet,
  Platform,
  LayoutChangeEvent,
  StyleProp,
  ViewStyle,
} from 'react-native';
import {
  NavigationContext,
  NavigationRouteContext,
  TabNavigationState,
  ParamListBase,
  CommonActions,
  useTheme,
  useLinkBuilder,
} from '@react-navigation/native';
import { useSafeArea, EdgeInsets } from 'react-native-safe-area-context';

import BottomTabItem from './BottomTabItem';
import BottomTabBarHeightCallbackContext from '../utils/BottomTabBarHeightCallbackContext';
import useWindowDimensions from '../utils/useWindowDimensions';
import useIsKeyboardShown from '../utils/useIsKeyboardShown';
import type { BottomTabBarProps, LabelPosition } from '../types';

type Props = BottomTabBarProps & {
  activeTintColor?: string;
  inactiveTintColor?: string;
};

const DEFAULT_TABBAR_HEIGHT = 49;
const COMPACT_TABBAR_HEIGHT = 32;
const DEFAULT_MAX_TAB_ITEM_WIDTH = 125;

const useNativeDriver = Platform.OS !== 'web';

type Options = {
  state: TabNavigationState<ParamListBase>;
  layout: { height: number; width: number };
  dimensions: { height: number; width: number };
  tabStyle: StyleProp<ViewStyle>;
  labelPosition: LabelPosition | undefined;
  adaptive: boolean | undefined;
};

const shouldUseHorizontalLabels = ({
  state,
  layout,
  dimensions,
  adaptive = true,
  labelPosition,
  tabStyle,
}: Options) => {
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

    return state.routes.length * maxTabItemWidth <= layout.width;
  } else {
    return dimensions.width > dimensions.height;
  }
};

const getPaddingBottom = (insets: EdgeInsets) =>
  Math.max(insets.bottom - Platform.select({ ios: 4, default: 0 }), 0);

export const getTabBarHeight = ({
  dimensions,
  insets,
  style,
  ...rest
}: Options & {
  insets: EdgeInsets;
  style: Animated.WithAnimatedValue<StyleProp<ViewStyle>>;
}) => {
  // @ts-ignore
  const customHeight = StyleSheet.flatten(style)?.height;

  if (typeof customHeight === 'number') {
    return customHeight;
  }

  const isLandscape = dimensions.width > dimensions.height;
  const horizontalLabels = shouldUseHorizontalLabels({ dimensions, ...rest });
  const paddingBottom = getPaddingBottom(insets);

  if (
    Platform.OS === 'ios' &&
    !Platform.isPad &&
    isLandscape &&
    horizontalLabels
  ) {
    return COMPACT_TABBAR_HEIGHT + paddingBottom;
  }

  return DEFAULT_TABBAR_HEIGHT + paddingBottom;
};

export default function BottomTabBar({
  state,
  navigation,
  descriptors,
  activeBackgroundColor,
  activeTintColor,
  adaptive,
  allowFontScaling,
  inactiveBackgroundColor,
  inactiveTintColor,
  keyboardHidesTabBar = false,
  labelPosition,
  labelStyle,
  iconStyle,
  safeAreaInsets,
  showLabel,
  style,
  tabStyle,
}: Props) {
  const { colors } = useTheme();
  const buildLink = useLinkBuilder();

  const focusedRoute = state.routes[state.index];
  const focusedDescriptor = descriptors[focusedRoute.key];
  const focusedOptions = focusedDescriptor.options;

  const dimensions = useWindowDimensions();
  const isKeyboardShown = useIsKeyboardShown();

  const onHeightChange = React.useContext(BottomTabBarHeightCallbackContext);

  const shouldShowTabBar =
    focusedOptions.tabBarVisible !== false &&
    !(keyboardHidesTabBar && isKeyboardShown);

  const visibilityAnimationConfigRef = React.useRef(
    focusedOptions.tabBarVisibilityAnimationConfig
  );

  React.useEffect(() => {
    visibilityAnimationConfigRef.current =
      focusedOptions.tabBarVisibilityAnimationConfig;
  });

  const [isTabBarHidden, setIsTabBarHidden] = React.useState(!shouldShowTabBar);

  const [visible] = React.useState(
    () => new Animated.Value(shouldShowTabBar ? 1 : 0)
  );

  React.useEffect(() => {
    const visibilityAnimationConfig = visibilityAnimationConfigRef.current;

    if (shouldShowTabBar) {
      const animation =
        visibilityAnimationConfig?.show?.animation === 'spring'
          ? Animated.spring
          : Animated.timing;

      animation(visible, {
        toValue: 1,
        useNativeDriver,
        duration: 250,
        ...visibilityAnimationConfig?.show?.config,
      }).start(({ finished }) => {
        if (finished) {
          setIsTabBarHidden(false);
        }
      });
    } else {
      setIsTabBarHidden(true);

      const animation =
        visibilityAnimationConfig?.hide?.animation === 'spring'
          ? Animated.spring
          : Animated.timing;

      animation(visible, {
        toValue: 0,
        useNativeDriver,
        duration: 200,
        ...visibilityAnimationConfig?.hide?.config,
      }).start();
    }
  }, [visible, shouldShowTabBar]);

  const [layout, setLayout] = React.useState({
    height: 0,
    width: dimensions.width,
  });

  const handleLayout = (e: LayoutChangeEvent) => {
    const { height, width } = e.nativeEvent.layout;

    onHeightChange?.(height);

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

  const { routes } = state;

  const defaultInsets = useSafeArea();

  const insets = {
    top: safeAreaInsets?.top ?? defaultInsets.top,
    right: safeAreaInsets?.right ?? defaultInsets.right,
    bottom: safeAreaInsets?.bottom ?? defaultInsets.bottom,
    left: safeAreaInsets?.left ?? defaultInsets.left,
  };

  const paddingBottom = getPaddingBottom(insets);
  const tabBarHeight = getTabBarHeight({
    state,
    insets,
    dimensions,
    layout,
    adaptive,
    labelPosition,
    tabStyle,
    style,
  });

  const hasHorizontalLabels = shouldUseHorizontalLabels({
    state,
    dimensions,
    layout,
    adaptive,
    labelPosition,
    tabStyle,
  });

  return (
    <Animated.View
      style={[
        styles.tabBar,
        {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
        },
        {
          transform: [
            {
              translateY: visible.interpolate({
                inputRange: [0, 1],
                outputRange: [
                  layout.height + paddingBottom + StyleSheet.hairlineWidth,
                  0,
                ],
              }),
            },
          ],
          // Absolutely position the tab bar so that the content is below it
          // This is needed to avoid gap at bottom when the tab bar is hidden
          position: isTabBarHidden ? 'absolute' : (null as any),
        },
        {
          height: tabBarHeight,
          paddingBottom,
          paddingHorizontal: Math.max(insets.left, insets.right),
        },
        style,
      ]}
      pointerEvents={isTabBarHidden ? 'none' : 'auto'}
      onLayout={handleLayout}
    >
      <View style={styles.content}>
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
                  horizontal={hasHorizontalLabels}
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
                  badge={options.tabBarBadge}
                  badgeStyle={options.tabBarBadgeStyle}
                  label={label}
                  showLabel={showLabel}
                  labelStyle={labelStyle}
                  iconStyle={iconStyle}
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

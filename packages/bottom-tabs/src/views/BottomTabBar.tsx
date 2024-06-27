import {
  getDefaultSidebarWidth,
  getLabel,
  MissingIcon,
} from '@react-navigation/elements';
import {
  CommonActions,
  NavigationContext,
  NavigationRouteContext,
  type ParamListBase,
  type TabNavigationState,
  useLinkBuilder,
  useLocale,
  useTheme,
} from '@react-navigation/native';
import Color from 'color';
import React from 'react';
import {
  Animated,
  type LayoutChangeEvent,
  Platform,
  type StyleProp,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native';
import {
  type EdgeInsets,
  useSafeAreaFrame,
} from 'react-native-safe-area-context';

import type { BottomTabBarProps, BottomTabDescriptorMap } from '../types';
import { BottomTabBarHeightCallbackContext } from '../utils/BottomTabBarHeightCallbackContext';
import { useIsKeyboardShown } from '../utils/useIsKeyboardShown';
import { BottomTabItem } from './BottomTabItem';

type Props = BottomTabBarProps & {
  style?: Animated.WithAnimatedValue<StyleProp<ViewStyle>>;
};

const DEFAULT_TABBAR_HEIGHT = 49;
const COMPACT_TABBAR_HEIGHT = 32;
const DEFAULT_MAX_TAB_ITEM_WIDTH = 125;
const SPACING = 5;

const useNativeDriver = Platform.OS !== 'web';

type Options = {
  state: TabNavigationState<ParamListBase>;
  descriptors: BottomTabDescriptorMap;
  dimensions: { height: number; width: number };
};

const shouldUseHorizontalLabels = ({
  state,
  descriptors,
  dimensions,
}: Options) => {
  const { tabBarLabelPosition } =
    descriptors[state.routes[state.index].key].options;

  if (tabBarLabelPosition) {
    switch (tabBarLabelPosition) {
      case 'beside-icon':
        return true;
      case 'below-icon':
        return false;
    }
  }

  if (dimensions.width >= 768) {
    // Screen size matches a tablet
    const maxTabWidth = state.routes.reduce((acc, route) => {
      const { tabBarItemStyle } = descriptors[route.key].options;
      const flattenedStyle = StyleSheet.flatten(tabBarItemStyle);

      if (flattenedStyle) {
        if (typeof flattenedStyle.width === 'number') {
          return acc + flattenedStyle.width;
        } else if (typeof flattenedStyle.maxWidth === 'number') {
          return acc + flattenedStyle.maxWidth;
        }
      }

      return acc + DEFAULT_MAX_TAB_ITEM_WIDTH;
    }, 0);

    return maxTabWidth <= dimensions.width;
  } else {
    return dimensions.width > dimensions.height;
  }
};

const getPaddingBottom = (insets: EdgeInsets) =>
  Math.max(insets.bottom - Platform.select({ ios: 4, default: 0 }), 0);

export const getTabBarHeight = ({
  state,
  descriptors,
  dimensions,
  insets,
  style,
  ...rest
}: Options & {
  insets: EdgeInsets;
  style: Animated.WithAnimatedValue<StyleProp<ViewStyle>> | undefined;
}) => {
  const flattenedStyle = StyleSheet.flatten(style);
  const customHeight =
    flattenedStyle && 'height' in flattenedStyle
      ? flattenedStyle.height
      : undefined;

  if (typeof customHeight === 'number') {
    return customHeight;
  }

  const isLandscape = dimensions.width > dimensions.height;
  const horizontalLabels = shouldUseHorizontalLabels({
    state,
    descriptors,
    dimensions,
    ...rest,
  });
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

export function BottomTabBar({
  state,
  navigation,
  descriptors,
  insets,
  style,
}: Props) {
  const { colors } = useTheme();
  const { direction } = useLocale();
  const { buildHref } = useLinkBuilder();

  const focusedRoute = state.routes[state.index];
  const focusedDescriptor = descriptors[focusedRoute.key];
  const focusedOptions = focusedDescriptor.options;

  const {
    tabBarPosition = 'bottom',
    tabBarShowLabel,
    tabBarHideOnKeyboard = false,
    tabBarVisibilityAnimationConfig,
    tabBarStyle,
    tabBarBackground,
    tabBarActiveTintColor,
    tabBarInactiveTintColor,
    tabBarActiveBackgroundColor = tabBarPosition !== 'bottom' &&
    tabBarPosition !== 'top'
      ? Color(tabBarActiveTintColor ?? colors.primary)
          .alpha(0.12)
          .rgb()
          .string()
      : undefined,
    tabBarInactiveBackgroundColor,
  } = focusedOptions;

  const dimensions = useSafeAreaFrame();
  const isKeyboardShown = useIsKeyboardShown();

  const onHeightChange = React.useContext(BottomTabBarHeightCallbackContext);

  const shouldShowTabBar = !(tabBarHideOnKeyboard && isKeyboardShown);

  const visibilityAnimationConfigRef = React.useRef(
    tabBarVisibilityAnimationConfig
  );

  React.useEffect(() => {
    visibilityAnimationConfigRef.current = tabBarVisibilityAnimationConfig;
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

    return () => visible.stopAnimation();
  }, [visible, shouldShowTabBar]);

  const [layout, setLayout] = React.useState({
    height: 0,
  });

  const handleLayout = (e: LayoutChangeEvent) => {
    const { height } = e.nativeEvent.layout;

    onHeightChange?.(height);

    setLayout((layout) => {
      if (height === layout.height) {
        return layout;
      } else {
        return { height };
      }
    });
  };

  const { routes } = state;

  const paddingBottom = getPaddingBottom(insets);
  const tabBarHeight = getTabBarHeight({
    state,
    descriptors,
    insets,
    dimensions,
    style: [tabBarStyle, style],
  });

  const hasHorizontalLabels = shouldUseHorizontalLabels({
    state,
    descriptors,
    dimensions,
  });

  const isSidebar = tabBarPosition === 'left' || tabBarPosition === 'right';

  const tabBarBackgroundElement = tabBarBackground?.();

  return (
    <Animated.View
      style={[
        tabBarPosition === 'left'
          ? styles.start
          : tabBarPosition === 'right'
            ? styles.end
            : styles.bottom,
        (
          Platform.OS === 'web'
            ? tabBarPosition === 'right'
            : (direction === 'rtl' && tabBarPosition === 'left') ||
              (direction !== 'rtl' && tabBarPosition === 'right')
        )
          ? { borderLeftWidth: StyleSheet.hairlineWidth }
          : (
                Platform.OS === 'web'
                  ? tabBarPosition === 'left'
                  : (direction === 'rtl' && tabBarPosition === 'right') ||
                    (direction !== 'rtl' && tabBarPosition === 'left')
              )
            ? { borderRightWidth: StyleSheet.hairlineWidth }
            : tabBarPosition === 'top'
              ? { borderBottomWidth: StyleSheet.hairlineWidth }
              : { borderTopWidth: StyleSheet.hairlineWidth },
        {
          backgroundColor:
            tabBarBackgroundElement != null ? 'transparent' : colors.card,
          borderColor: colors.border,
        },
        isSidebar
          ? {
              paddingTop: insets.top,
              paddingBottom: insets.bottom,
              paddingStart: tabBarPosition === 'left' ? insets.left : 0,
              paddingEnd: tabBarPosition === 'right' ? insets.right : 0,
              minWidth: hasHorizontalLabels
                ? getDefaultSidebarWidth(dimensions)
                : 0,
            }
          : [
              {
                transform: [
                  {
                    translateY: visible.interpolate({
                      inputRange: [0, 1],
                      outputRange: [
                        layout.height +
                          paddingBottom +
                          StyleSheet.hairlineWidth,
                        0,
                      ],
                    }),
                  },
                ],
                // Absolutely position the tab bar so that the content is below it
                // This is needed to avoid gap at bottom when the tab bar is hidden
                position: isTabBarHidden ? 'absolute' : undefined,
              },
              {
                height: tabBarHeight,
                paddingBottom,
                paddingHorizontal: Math.max(insets.left, insets.right),
              },
            ],
        tabBarStyle,
      ]}
      pointerEvents={isTabBarHidden ? 'none' : 'auto'}
      onLayout={isSidebar ? undefined : handleLayout}
    >
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        {tabBarBackgroundElement}
      </View>
      <View
        accessibilityRole="tablist"
        style={isSidebar ? styles.sideContent : styles.bottomContent}
      >
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
                ...CommonActions.navigate(route),
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
            typeof options.tabBarLabel === 'function'
              ? options.tabBarLabel
              : getLabel(
                  { label: options.tabBarLabel, title: options.title },
                  route.name
                );

          const accessibilityLabel =
            options.tabBarAccessibilityLabel !== undefined
              ? options.tabBarAccessibilityLabel
              : typeof label === 'string' && Platform.OS === 'ios'
                ? `${label}, tab, ${index + 1} of ${routes.length}`
                : undefined;

          return (
            <NavigationContext.Provider
              key={route.key}
              value={descriptors[route.key].navigation}
            >
              <NavigationRouteContext.Provider value={route}>
                <BottomTabItem
                  href={buildHref(route.name, route.params)}
                  route={route}
                  descriptor={descriptors[route.key]}
                  focused={focused}
                  horizontal={hasHorizontalLabels}
                  variant={isSidebar ? 'material' : 'uikit'}
                  onPress={onPress}
                  onLongPress={onLongPress}
                  accessibilityLabel={accessibilityLabel}
                  testID={options.tabBarButtonTestID}
                  allowFontScaling={options.tabBarAllowFontScaling}
                  activeTintColor={tabBarActiveTintColor}
                  inactiveTintColor={tabBarInactiveTintColor}
                  activeBackgroundColor={tabBarActiveBackgroundColor}
                  inactiveBackgroundColor={tabBarInactiveBackgroundColor}
                  button={options.tabBarButton}
                  icon={
                    options.tabBarIcon ??
                    (({ color, size }) => (
                      <MissingIcon color={color} size={size} />
                    ))
                  }
                  badge={options.tabBarBadge}
                  badgeStyle={options.tabBarBadgeStyle}
                  label={label}
                  showLabel={tabBarShowLabel}
                  labelStyle={options.tabBarLabelStyle}
                  iconStyle={options.tabBarIconStyle}
                  style={[
                    isSidebar
                      ? [
                          styles.sideItem,
                          hasHorizontalLabels
                            ? styles.sideItemHorizontal
                            : styles.sideItemVertical,
                        ]
                      : styles.bottomItem,
                    options.tabBarItemStyle,
                  ]}
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
  start: {
    top: 0,
    bottom: 0,
    start: 0,
  },
  end: {
    top: 0,
    bottom: 0,
    end: 0,
  },
  bottom: {
    start: 0,
    end: 0,
    bottom: 0,
    elevation: 8,
  },
  bottomContent: {
    flex: 1,
    flexDirection: 'row',
  },
  sideContent: {
    flex: 1,
    flexDirection: 'column',
    padding: SPACING,
  },
  bottomItem: {
    flex: 1,
  },
  sideItem: {
    margin: SPACING,
    padding: SPACING * 2,
  },
  sideItemHorizontal: {
    borderRadius: 56,
    justifyContent: 'flex-start',
  },
  sideItemVertical: {
    borderRadius: 16,
  },
});

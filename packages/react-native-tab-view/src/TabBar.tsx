import * as React from 'react';
import {
  Animated,
  FlatList,
  I18nManager,
  LayoutChangeEvent,
  ListRenderItemInfo,
  Platform,
  PressableAndroidRippleConfig,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
  ViewToken,
} from 'react-native';
import useLatestCallback from 'use-latest-callback';

import { Props as IndicatorProps, TabBarIndicator } from './TabBarIndicator';
import { Props as TabBarItemProps, TabBarItem } from './TabBarItem';
import type {
  Event,
  Layout,
  NavigationState,
  Route,
  Scene,
  SceneRendererProps,
} from './types';
import { useAnimatedValue } from './useAnimatedValue';

export type Props<T extends Route> = SceneRendererProps & {
  navigationState: NavigationState<T>;
  scrollEnabled?: boolean;
  bounces?: boolean;
  activeColor?: string;
  inactiveColor?: string;
  pressColor?: string;
  pressOpacity?: number;
  getLabelText?: (scene: Scene<T>) => string | undefined;
  getAccessible?: (scene: Scene<T>) => boolean | undefined;
  getAccessibilityLabel?: (scene: Scene<T>) => string | undefined;
  getTestID?: (scene: Scene<T>) => string | undefined;
  renderLabel?: (
    scene: Scene<T> & {
      focused: boolean;
      color: string;
    }
  ) => React.ReactNode;
  renderIcon?: (
    scene: Scene<T> & {
      focused: boolean;
      color: string;
    }
  ) => React.ReactNode;
  renderBadge?: (scene: Scene<T>) => React.ReactNode;
  renderIndicator?: (props: IndicatorProps<T>) => React.ReactNode;
  renderTabBarItem?: (
    props: TabBarItemProps<T> & { key: string }
  ) => React.ReactElement;
  onTabPress?: (scene: Scene<T> & Event) => void;
  onTabLongPress?: (scene: Scene<T>) => void;
  tabStyle?: StyleProp<ViewStyle>;
  indicatorStyle?: StyleProp<ViewStyle>;
  indicatorContainerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  gap?: number;
  testID?: string;
  android_ripple?: PressableAndroidRippleConfig;
};

type FlattenedTabWidth = string | number | undefined;

const Separator = ({ width }: { width: number }) => {
  return <View style={{ width }} />;
};

const getFlattenedTabWidth = (style: StyleProp<ViewStyle>) => {
  const tabStyle = StyleSheet.flatten(style);

  return tabStyle?.width;
};

const getComputedTabWidth = (
  index: number,
  layout: Layout,
  routes: Route[],
  scrollEnabled: boolean | undefined,
  tabWidths: { [key: string]: number },
  flattenedWidth: FlattenedTabWidth
) => {
  if (flattenedWidth === 'auto') {
    return tabWidths[routes[index].key] || 0;
  }

  switch (typeof flattenedWidth) {
    case 'number':
      return flattenedWidth;
    case 'string':
      if (flattenedWidth.endsWith('%')) {
        const width = parseFloat(flattenedWidth);
        if (Number.isFinite(width)) {
          return layout.width * (width / 100);
        }
      }
  }

  if (scrollEnabled) {
    return (layout.width / 5) * 2;
  }
  return layout.width / routes.length;
};

const getMaxScrollDistance = (tabBarWidth: number, layoutWidth: number) =>
  tabBarWidth - layoutWidth;

const getTranslateX = (
  scrollAmount: Animated.Value,
  maxScrollDistance: number
) =>
  Animated.multiply(
    Platform.OS === 'android' && I18nManager.isRTL
      ? Animated.add(maxScrollDistance, Animated.multiply(scrollAmount, -1))
      : scrollAmount,
    I18nManager.isRTL ? 1 : -1
  );

const getTabBarWidth = <T extends Route>({
  navigationState,
  layout,
  gap,
  scrollEnabled,
  flattenedTabWidth,
  tabWidths,
}: Pick<Props<T>, 'navigationState' | 'gap' | 'layout' | 'scrollEnabled'> & {
  tabWidths: Record<string, number>;
  flattenedTabWidth: FlattenedTabWidth;
}) => {
  const { routes } = navigationState;

  return routes.reduce<number>(
    (acc, _, i) =>
      acc +
      (i > 0 ? gap ?? 0 : 0) +
      getComputedTabWidth(
        i,
        layout,
        routes,
        scrollEnabled,
        tabWidths,
        flattenedTabWidth
      ),
    0
  );
};

const normalizeScrollValue = <T extends Route>({
  layout,
  navigationState,
  gap,
  scrollEnabled,
  tabWidths,
  value,
  flattenedTabWidth,
}: Pick<Props<T>, 'layout' | 'navigationState' | 'gap' | 'scrollEnabled'> & {
  tabWidths: Record<string, number>;
  value: number;
  flattenedTabWidth: FlattenedTabWidth;
}) => {
  const tabBarWidth = getTabBarWidth({
    layout,
    navigationState,
    tabWidths,
    gap,
    scrollEnabled,
    flattenedTabWidth,
  });
  const maxDistance = getMaxScrollDistance(tabBarWidth, layout.width);
  const scrollValue = Math.max(Math.min(value, maxDistance), 0);

  if (Platform.OS === 'android' && I18nManager.isRTL) {
    // On Android, scroll value is not applied in reverse in RTL
    // so we need to manually adjust it to apply correct value
    return maxDistance - scrollValue;
  }

  return scrollValue;
};

const getScrollAmount = <T extends Route>({
  layout,
  navigationState,
  gap,
  scrollEnabled,
  flattenedTabWidth,
  tabWidths,
}: Pick<Props<T>, 'layout' | 'navigationState' | 'scrollEnabled' | 'gap'> & {
  tabWidths: Record<string, number>;
  flattenedTabWidth: FlattenedTabWidth;
}) => {
  const centerDistance = Array.from({
    length: navigationState.index + 1,
  }).reduce<number>((total, _, i) => {
    const tabWidth = getComputedTabWidth(
      i,
      layout,
      navigationState.routes,
      scrollEnabled,
      tabWidths,
      flattenedTabWidth
    );

    // To get the current index centered we adjust scroll amount by width of indexes
    // 0 through (i - 1) and add half the width of current index i
    return (
      total +
      (navigationState.index === i
        ? (tabWidth + (gap ?? 0)) / 2
        : tabWidth + (gap ?? 0))
    );
  }, 0);

  const scrollAmount = centerDistance - layout.width / 2;

  return normalizeScrollValue({
    layout,
    navigationState,
    tabWidths,
    value: scrollAmount,
    gap,
    scrollEnabled,
    flattenedTabWidth,
  });
};

const getLabelTextDefault = ({ route }: Scene<Route>) => route.title;

const getAccessibleDefault = ({ route }: Scene<Route>) =>
  typeof route.accessible !== 'undefined' ? route.accessible : true;

const getAccessibilityLabelDefault = ({ route }: Scene<Route>) =>
  typeof route.accessibilityLabel === 'string'
    ? route.accessibilityLabel
    : typeof route.title === 'string'
    ? route.title
    : undefined;

const renderIndicatorDefault = (props: IndicatorProps<Route>) => (
  <TabBarIndicator {...props} />
);

const getTestIdDefault = ({ route }: Scene<Route>) => route.testID;

// How many items measurements should we update per batch.
// Defaults to 10, since that's whats FlatList is using in initialNumToRender.
const MEASURE_PER_BATCH = 10;

export function TabBar<T extends Route>({
  getLabelText = getLabelTextDefault,
  getAccessible = getAccessibleDefault,
  getAccessibilityLabel = getAccessibilityLabelDefault,
  getTestID = getTestIdDefault,
  renderIndicator = renderIndicatorDefault,
  gap = 0,
  scrollEnabled,
  jumpTo,
  navigationState,
  position,
  activeColor,
  bounces,
  contentContainerStyle,
  inactiveColor,
  indicatorContainerStyle,
  indicatorStyle,
  labelStyle,
  onTabLongPress,
  onTabPress,
  pressColor,
  pressOpacity,
  renderBadge,
  renderIcon,
  renderLabel,
  renderTabBarItem,
  style,
  tabStyle,
  testID,
  android_ripple,
}: Props<T>) {
  const [layout, setLayout] = React.useState<Layout>({ width: 0, height: 0 });
  const [tabWidths, setTabWidths] = React.useState<Record<string, number>>({});
  const flatListRef = React.useRef<FlatList | null>(null);
  const isFirst = React.useRef(true);
  const scrollAmount = useAnimatedValue(0);
  const measuredTabWidths = React.useRef<Record<string, number>>({});

  const { routes } = navigationState;
  const flattenedTabWidth = getFlattenedTabWidth(tabStyle);
  const isWidthDynamic = flattenedTabWidth === 'auto';
  const scrollOffset = getScrollAmount({
    layout,
    navigationState,
    tabWidths,
    gap,
    scrollEnabled,
    flattenedTabWidth,
  });

  const hasMeasuredTabWidths =
    Boolean(layout.width) &&
    routes
      .slice(0, navigationState.index)
      .every((r) => typeof tabWidths[r.key] === 'number');

  React.useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }

    if (isWidthDynamic && !hasMeasuredTabWidths) {
      return;
    }

    if (scrollEnabled) {
      flatListRef.current?.scrollToOffset({
        offset: scrollOffset,
        animated: true,
      });
    }
  }, [hasMeasuredTabWidths, isWidthDynamic, scrollEnabled, scrollOffset]);

  const handleLayout = (e: LayoutChangeEvent) => {
    const { height, width } = e.nativeEvent.layout;

    setLayout((layout) =>
      layout.width === width && layout.height === height
        ? layout
        : { width, height }
    );
  };

  const tabBarWidth = getTabBarWidth({
    layout,
    navigationState,
    tabWidths,
    gap,
    scrollEnabled,
    flattenedTabWidth,
  });

  const separatorsWidth = Math.max(0, routes.length - 1) * gap;
  const separatorPercent = (separatorsWidth / tabBarWidth) * 100;
  const tabBarWidthPercent = `${routes.length * 40}%`;

  const translateX = React.useMemo(
    () =>
      getTranslateX(
        scrollAmount,
        getMaxScrollDistance(tabBarWidth, layout.width)
      ),
    [layout.width, scrollAmount, tabBarWidth]
  );

  const renderItem = React.useCallback(
    ({ item: route, index }: ListRenderItemInfo<T>) => {
      const props: TabBarItemProps<T> & { key: string } = {
        key: route.key,
        position: position,
        route: route,
        navigationState: navigationState,
        getAccessibilityLabel: getAccessibilityLabel,
        getAccessible: getAccessible,
        getLabelText: getLabelText,
        getTestID: getTestID,
        renderBadge: renderBadge,
        renderIcon: renderIcon,
        renderLabel: renderLabel,
        activeColor: activeColor,
        inactiveColor: inactiveColor,
        pressColor: pressColor,
        pressOpacity: pressOpacity,
        onLayout: isWidthDynamic
          ? (e: LayoutChangeEvent) => {
              measuredTabWidths.current[route.key] = e.nativeEvent.layout.width;

              // When we have measured widths for all of the tabs, we should updates the state
              // We avoid doing separate setState for each layout since it triggers multiple renders and slows down app
              // If we have more than 10 routes divide updating tabWidths into multiple batches. Here we update only first batch of 10 items.
              if (
                routes.length > MEASURE_PER_BATCH &&
                index === MEASURE_PER_BATCH &&
                routes
                  .slice(0, MEASURE_PER_BATCH)
                  .every(
                    (r) => typeof measuredTabWidths.current[r.key] === 'number'
                  )
              ) {
                setTabWidths({ ...measuredTabWidths.current });
              } else if (
                routes.every(
                  (r) => typeof measuredTabWidths.current[r.key] === 'number'
                )
              ) {
                // When we have measured widths for all of the tabs, we should updates the state
                // We avoid doing separate setState for each layout since it triggers multiple renders and slows down app
                setTabWidths({ ...measuredTabWidths.current });
              }
            }
          : undefined,
        onPress: () => {
          const event: Scene<T> & Event = {
            route,
            defaultPrevented: false,
            preventDefault: () => {
              event.defaultPrevented = true;
            },
          };

          onTabPress?.(event);

          if (event.defaultPrevented) {
            return;
          }

          jumpTo(route.key);
        },
        onLongPress: () => onTabLongPress?.({ route }),
        labelStyle: labelStyle,
        style: tabStyle,
        // Calculate the deafult width for tab for FlatList to work
        defaultTabWidth: !isWidthDynamic
          ? getComputedTabWidth(
              index,
              layout,
              routes,
              scrollEnabled,
              tabWidths,
              getFlattenedTabWidth(tabStyle)
            )
          : undefined,
        android_ripple,
      };

      return (
        <>
          {gap > 0 && index > 0 ? <Separator width={gap} /> : null}
          {renderTabBarItem ? (
            renderTabBarItem(props)
          ) : (
            <TabBarItem {...props} />
          )}
        </>
      );
    },
    [
      activeColor,
      android_ripple,
      gap,
      getAccessibilityLabel,
      getAccessible,
      getLabelText,
      getTestID,
      inactiveColor,
      isWidthDynamic,
      jumpTo,
      labelStyle,
      layout,
      navigationState,
      onTabLongPress,
      onTabPress,
      position,
      pressColor,
      pressOpacity,
      renderBadge,
      renderIcon,
      renderLabel,
      renderTabBarItem,
      routes,
      scrollEnabled,
      tabStyle,
      tabWidths,
    ]
  );

  const keyExtractor = React.useCallback((item: T) => item.key, []);

  const contentContainerStyleMemoized = React.useMemo(
    () => [
      styles.tabContent,
      scrollEnabled
        ? {
            width:
              tabBarWidth > separatorsWidth ? tabBarWidth : tabBarWidthPercent,
          }
        : styles.container,
      contentContainerStyle,
    ],
    [
      contentContainerStyle,
      scrollEnabled,
      separatorsWidth,
      tabBarWidth,
      tabBarWidthPercent,
    ]
  );

  const handleScroll = React.useMemo(
    () =>
      Animated.event(
        [
          {
            nativeEvent: {
              contentOffset: { x: scrollAmount },
            },
          },
        ],
        { useNativeDriver: true }
      ),
    [scrollAmount]
  );

  const handleViewableItemsChanged = useLatestCallback(
    ({ changed }: { changed: ViewToken[] }) => {
      if (routes.length <= MEASURE_PER_BATCH) {
        return;
      }
      // Get next vievable item
      const item = changed[changed.length - 1];
      const index = item?.index || 0;
      if (
        item.isViewable &&
        (index % 10 === 0 ||
          index === navigationState.index ||
          index === routes.length - 1)
      ) {
        setTabWidths({ ...measuredTabWidths.current });
      }
    }
  );

  return (
    <Animated.View onLayout={handleLayout} style={[styles.tabBar, style]}>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.indicatorContainer,
          scrollEnabled ? { transform: [{ translateX }] as any } : null,
          tabBarWidth > separatorsWidth
            ? { width: tabBarWidth - separatorsWidth }
            : scrollEnabled
            ? { width: tabBarWidthPercent }
            : null,
          indicatorContainerStyle,
        ]}
      >
        {renderIndicator({
          position,
          layout,
          navigationState,
          jumpTo,
          width: isWidthDynamic
            ? 'auto'
            : `${(100 - separatorPercent) / routes.length}%`,
          style: indicatorStyle,
          getTabWidth: (i: number) =>
            getComputedTabWidth(
              i,
              layout,
              routes,
              scrollEnabled,
              tabWidths,
              flattenedTabWidth
            ),
          gap,
        })}
      </Animated.View>
      <View style={styles.scroll}>
        <Animated.FlatList
          data={routes as Animated.WithAnimatedValue<T>[]}
          keyExtractor={keyExtractor}
          horizontal
          accessibilityRole="tablist"
          keyboardShouldPersistTaps="handled"
          scrollEnabled={scrollEnabled}
          bounces={bounces}
          initialNumToRender={MEASURE_PER_BATCH}
          onViewableItemsChanged={handleViewableItemsChanged}
          alwaysBounceHorizontal={false}
          scrollsToTop={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          automaticallyAdjustContentInsets={false}
          overScrollMode="never"
          contentContainerStyle={contentContainerStyleMemoized}
          scrollEventThrottle={16}
          renderItem={renderItem}
          onScroll={handleScroll}
          ref={flatListRef}
          testID={testID}
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    overflow: Platform.select({ default: 'scroll', web: undefined }),
  },
  tabBar: {
    backgroundColor: '#2196f3',
    elevation: 4,
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowRadius: StyleSheet.hairlineWidth,
    shadowOffset: {
      height: StyleSheet.hairlineWidth,
      width: 0,
    },
    zIndex: 1,
  },
  tabContent: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  indicatorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
